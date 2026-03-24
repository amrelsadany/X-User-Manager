require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

// Security: Helmet
app.use(helmet());

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: {
    error: "Too many login attempts, please try again later.",
  },
});

// Security: Sanitize data
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json({ limit: "10mb" }));

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const AUTH_USERS_COLLECTION = "auth_users"; // New collection for authenticated users

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d"; // Token expires in 7 days

let db;
let usersCollection;
let authUsersCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(DB_NAME);
    usersCollection = db.collection(USERS_COLLECTION);
    authUsersCollection = db.collection(AUTH_USERS_COLLECTION);

    // Create indexes
    await usersCollection.createIndex({ url: 1 }, { unique: true });
    await usersCollection.createIndex({ createdAt: -1 });
    await authUsersCollection.createIndex({ email: 1 }, { unique: true });
    await authUsersCollection.createIndex({ username: 1 }, { unique: true });

    // Create default admin user if none exists
    await createDefaultAdmin();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Create default admin user
async function createDefaultAdmin() {
  var allowedToCreateDefaultAdmin = process.env.CREATE_DEFAULT_ADMIN || 'false';

  if (allowedToCreateDefaultAdmin=='true') {
    try {
      const adminExists = await authUsersCollection.findOne({ role: "admin" });

      if (!adminExists) {
        const defaultPassword = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await authUsersCollection.insertOne({
          username: process.env.ADMIN_EMAIL.split("@")[0],
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: "admin",
          createdAt: new Date(),
          isActive: true,
        });

        console.log("✅ Default admin user created");
        console.log("   Email:", process.env.ADMIN_EMAIL);
        console.log("   Password:", defaultPassword);
      }
    } catch (error) {
      console.error("Error creating default admin:", error);
    }
  }
}

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

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
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

// ============================================
// AUTH ROUTES
// ============================================

// Register new user (can be disabled in production)
app.post("/api/auth/register", authLimiter, async (req, res) => {

  var canRegister = process.env.CAN_REGISTER_USER || 'false';

  if (canRegister=='true') {
    try {
      const { username, email, password } = req.body;

      // Validate inputs
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

      // Check if user already exists
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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = {
        username: sanitizeInput(username),
        email: sanitizeInput(email.toLowerCase()),
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        isActive: true,
      };

      const result = await authUsersCollection.insertOne(newUser);

      // Generate JWT token
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

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: result.insertedId,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
  else{
    res.status(403).json({ error: "Can not register new user" });
  }
});

// Login
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await authUsersCollection.findOne({
      email: sanitizeInput(email.toLowerCase()),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is disabled" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
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

    // Update last login
    await authUsersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Verify token (for checking if user is still logged in)
app.get("/api/auth/verify", authenticateToken, async (req, res) => {
  try {
    const user = await authUsersCollection.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } },
    );

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Failed to verify token" });
  }
});

// Change password
app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error:
          "New password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Get user
    const user = await authUsersCollection.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await authUsersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// ============================================
// USERS ROUTES (Protected)
// ============================================

// Apply authentication to all /api/users routes
app.use("/api/users", authenticateToken);

// Get all unread users
app.get("/api/users", async (req, res) => {
  try {
    const unreadUsers = await usersCollection
      .find({
        isRead: false,
      })
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray();

    res.json(unreadUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get all read users
app.get("/api/users/read", async (req, res) => {
  try {
    const readUsers = await usersCollection
      .find({
        isRead: true,
      })
      .sort({ readAt: -1 })
      .limit(1000)
      .toArray();

    res.json(readUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get all users
app.get("/api/users/all", async (req, res) => {
  try {
    const allUsers = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray();

    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create new user
app.post("/api/users", async (req, res) => {
  try {
    const { username, url, userId, title } = req.body;

    if (!url || !validateUrl(url)) {
      return res.status(400).json({ error: "Valid URL is required" });
    }

    const sanitizedData = {
      url: sanitizeInput(url),
      title: sanitizeInput(title || (username ? `@${username}` : "")),
      username: sanitizeInput(username || ""),
      userId: sanitizeInput(userId || ""),
      createdAt: new Date(),
      createdBy: req.user.id, // Track who created it
      isRead: false,
    };

    const existingUser = await usersCollection.findOne({
      url: sanitizedData.url,
    });
    if (existingUser) {
      return res.status(409).json({
        error: "This URL already exists",
        existingUser: existingUser,
      });
    }

    const result = await usersCollection.insertOne(sanitizedData);
    const insertedUser = await usersCollection.findOne({
      _id: result.insertedId,
    });

    res.status(201).json({
      message: "User created successfully",
      user: insertedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Mark user as read
app.post("/api/users/:id/mark-read", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
          readBy: req.user.id, // Track who marked it
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    res.json({
      message: "User marked as read",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error marking user as read:", error);
    res.status(500).json({ error: "Failed to mark user as read" });
  }
});

// Update user
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, url, userId: userIdField, title, isRead } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (url && !validateUrl(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const updateData = {};

    if (url !== undefined) updateData.url = sanitizeInput(url);
    if (username !== undefined) {
      updateData.username = sanitizeInput(username);
      if (!title && username) {
        updateData.title = `@${sanitizeInput(username)}`;
      }
    }
    if (userIdField !== undefined)
      updateData.userId = sanitizeInput(userIdField);
    if (title !== undefined) updateData.title = sanitizeInput(title);
    if (isRead !== undefined) updateData.isRead = Boolean(isRead);

    updateData.updatedAt = new Date();
    updateData.updatedBy = req.user.id;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedId: userId,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Health check (public)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "User Manager API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔒 JWT Authentication: Enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});
