// api/index.js - Serverless backend with Chrome Extension CORS support
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const AUTH_USERS_COLLECTION = "auth_users";

// JWT Secret & API Key
const JWT_SECRET = process.env.JWT_SECRET;
const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY;
const JWT_EXPIRES_IN = "1d";

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

let cachedClient = null;
let cachedDb = null;

// Database connection with caching
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// CORS headers helper
function setCorsHeaders(res, origin) {
  // Allow Chrome extension origins
  if (origin && origin.startsWith('chrome-extension://')) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback: allow all origins for API key endpoints
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
}

// JWT Authentication Middleware
function authenticateToken(token) {
  if (!token) {
    throw new Error("Access token required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// API Key Authentication (for iOS Shortcut & Chrome Extension)
function authenticateApiKey(apiKey) {
  if (!apiKey) {
    throw new Error("API key required");
  }

  if (apiKey !== PERSONAL_API_KEY) {
    throw new Error("Invalid API key");
  }

  return {
    id: "api-key-user",
    source: "api-key",
    authenticated: true
  };
}

// Input validation
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str.trim().substring(0, 500);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

// Main serverless handler
module.exports = async (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection(USERS_COLLECTION);
    const authUsersCollection = db.collection(AUTH_USERS_COLLECTION);

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = pathname.split("/").filter(Boolean);

    // Remove 'api' prefix if present
    if (pathParts[0] === "api") {
      pathParts.shift();
    }

    const route = pathParts.join("/");

    // ============================================
    // iOS SHORTCUT / CHROME EXTENSION ROUTE (API Key Authentication)
    // ============================================

    // POST /shortcut/add-user - iOS Shortcut & Chrome Extension endpoint
    if (route === "shortcut/add-user" && req.method === "POST") {
      const apiKey = req.headers["x-api-key"];

      try {
        // Authenticate API Key
        const apiUser = authenticateApiKey(apiKey);

        const { url, username, title, userId } = req.body;
        console.info(req.body);

        if (!url || !validateUrl(url)) {
          return res.status(400).json({ error: "Valid URL is required" });
        }

        // Check for duplicates
        const existingUser = await usersCollection.findOne({ url });

        if (existingUser) {
          return res.status(409).json({
            error: "URL already exists",
            existingUser: {
              _id: existingUser._id,
              url: existingUser.url,
              username: existingUser.username || existingUser.title,
            },
          });
        }

        // Create new user
        const newUser = {
          url: sanitizeInput(url),
          username: username ? sanitizeInput(username) : null,
          title: title ? sanitizeInput(title) : null,
          userId: userId ? sanitizeInput(userId) : null,
          createdAt: new Date(),
          isRead: false
        };

        const result = await usersCollection.insertOne(newUser);
        const insertedUser = await usersCollection.findOne({
          _id: result.insertedId,
        });

        return res.status(201).json({
          success: true,
          message: "User created successfully",
          user: insertedUser,
        });

      } catch (error) {
        if (error.message === "API key required" || error.message === "Invalid API key") {
          return res.status(403).json({ error: error.message });
        }
        throw error;
      }
    }

    // ============================================
    // MARK-READ ENDPOINT (supports both JWT and API Key)
    // ============================================

    // POST /users/:id/mark-read - Mark user as read
    if (route.includes("/mark-read") && req.method === "POST") {
      const userId = pathParts[pathParts.length - 2];

      console.info(userId);

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Try API Key first
      const apiKey = req.headers["x-api-key"];
      if (apiKey) {
        try {
          authenticateApiKey(apiKey);
          
          const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { isRead: true, readAt: new Date() } },
            { returnDocument: "after" },
          );

          // Handle both old and new MongoDB driver versions
          const updatedUser = result.value || result;

          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }

          return res.status(200).json({
            message: "User marked as read",
            user: updatedUser,
            success: true
          });
        } catch (error) {
          // API key auth failed, continue to JWT check
          console.error('API key auth error:', error);
        }
      }

      // Try JWT authentication
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      try {
        authenticateToken(token);
        
        const result = await usersCollection.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $set: { isRead: true, readAt: new Date() } },
          { returnDocument: "after" },
        );

        // Handle both old and new MongoDB driver versions
        const updatedUser = result.value || result;

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
          message: "User marked as read",
          user: updatedUser,
        });
      } catch (error) {
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    // ============================================
    // AUTH ROUTES
    // ============================================

    // POST /auth/register
    if (route === "auth/register" && req.method === "POST") {
      const CAN_REGISTER_USER = process.env.CAN_REGISTER_USER || "false";

      if (CAN_REGISTER_USER == "true") {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (!validateEmail(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }

        if (!validatePassword(password)) {
          return res.status(400).json({
            error:
              "Password must be at least 8 characters with uppercase, lowercase, and number",
          });
        }

        const existingUser = await authUsersCollection.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          return res.status(409).json({
            error:
              existingUser.email === email
                ? "Email already registered"
                : "Username already taken",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          username: sanitizeInput(username),
          email: sanitizeInput(email.toLowerCase()),
          password: hashedPassword,
          role: "user",
          createdAt: new Date(),
          isActive: true,
        };

        const result = await authUsersCollection.insertOne(newUser);

        const token = jwt.sign(
          {
            id: result.insertedId.toString(),
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN },
        );

        return res.status(201).json({
          message: "User registered successfully",
          token,
          user: {
            id: result.insertedId,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        });
      }
      else{
        res.status(403).json({ error: "Can not register new user" });
      }
    }

    // POST /auth/login
    if (route === "auth/login" && req.method === "POST") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await authUsersCollection.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: "Account is disabled" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    // GET /auth/verify
    if (route === "auth/verify" && req.method === "GET") {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      try {
        const decoded = authenticateToken(token);
        const user = await authUsersCollection.findOne({
          _id: new ObjectId(decoded.id),
        });

        if (!user || !user.isActive) {
          return res.status(403).json({ error: "User not found or inactive" });
        }

        return res.status(200).json({
          valid: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        return res.status(403).json({ error: error.message });
      }
    }

    // ============================================
    // PROTECTED USER ROUTES (require authentication)
    // ============================================

    // Extract and verify token for protected routes
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    let authUser;
    try {
      authUser = authenticateToken(token);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }

    // GET /users - Get all unread users
    if (route === "users" && req.method === "GET") {
      const users = await usersCollection
        .find({ isRead: { $ne: true } })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(users);
    }

    // POST /users - Create new user
    if (route === "users" && req.method === "POST") {
      const { url, username, title, userId } = req.body;

      if (!url || !validateUrl(url)) {
        return res.status(400).json({ error: "Valid URL is required" });
      }

      const existingUser = await usersCollection.findOne({ url });

      if (existingUser) {
        return res.status(409).json({
          error: "URL already exists",
          existingUser: {
            _id: existingUser._id,
            url: existingUser.url,
            username: existingUser.username || existingUser.title,
          },
        });
      }

      const newUser = {
        url: sanitizeInput(url),
        username: username ? sanitizeInput(username) : null,
        title: title ? sanitizeInput(title) : null,
        userId: userId ? sanitizeInput(userId) : null,
        createdAt: new Date(),
        isRead: false,
      };

      const result = await usersCollection.insertOne(newUser);
      const insertedUser = await usersCollection.findOne({
        _id: result.insertedId,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: insertedUser,
      });
    }

    // PUT /users/:id - Update user
    if (route.startsWith("users/") && req.method === "PUT") {
      const userId = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const { url, username, title, userId: userIdField } = req.body;

      if (!url || !validateUrl(url)) {
        return res.status(400).json({ error: "Valid URL is required" });
      }

      const updateData = {
        url: sanitizeInput(url),
        username: username ? sanitizeInput(username) : null,
        title: title ? sanitizeInput(title) : null,
        userId: userIdField ? sanitizeInput(userIdField) : null,
      };

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: "after" },
      );

      // Handle both old and new MongoDB driver versions
      const updatedUser = result.value || result;

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    }

    // DELETE /users/:id - Delete user
    if (route.startsWith("users/") && req.method === "DELETE") {
      const userId = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const result = await usersCollection.deleteOne({
        _id: new ObjectId(userId),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User deleted successfully",
      });
    }

    // Route not found
    return res.status(404).json({ error: "Route not found" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
