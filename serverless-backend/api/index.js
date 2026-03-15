// api/index.js - Serverless backend for Vercel with JWT Authentication
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'usersdb';
const USERS_COLLECTION = process.env.USERS_COLLECTION || 'users';
const AUTH_USERS_COLLECTION = 'auth_users';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
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
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JWT Authentication Middleware
function authenticateToken(token) {
  if (!token) {
    throw new Error('Access token required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
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
  if (typeof str !== 'string') return '';
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
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection(USERS_COLLECTION);
    const authUsersCollection = db.collection(AUTH_USERS_COLLECTION);

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = pathname.split('/').filter(Boolean);

    // Remove 'api' prefix if present
    if (pathParts[0] === 'api') {
      pathParts.shift();
    }

    const route = pathParts.join('/');

    // ============================================
    // AUTH ROUTES
    // ============================================

    // POST /auth/register
    if (route === 'auth/register' && req.method === 'POST') {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
        });
      }

      const existingUser = await authUsersCollection.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({ 
          error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username: sanitizeInput(username),
        email: sanitizeInput(email.toLowerCase()),
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        isActive: true
      };

      const result = await authUsersCollection.insertOne(newUser);

      const token = jwt.sign(
        { 
          id: result.insertedId.toString(),
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: result.insertedId,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    }

    // POST /auth/login
    if (route === 'auth/login' && req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await authUsersCollection.findOne({ 
        email: email.toLowerCase() 
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'Account is disabled' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    }

    // GET /auth/verify
    if (route === 'auth/verify' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      try {
        const decoded = authenticateToken(token);
        const user = await authUsersCollection.findOne({ 
          _id: new ObjectId(decoded.id) 
        });

        if (!user || !user.isActive) {
          return res.status(403).json({ error: 'User not found or inactive' });
        }

        return res.status(200).json({
          valid: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        return res.status(403).json({ error: error.message });
      }
    }

    // ============================================
    // PROTECTED USER ROUTES (require authentication)
    // ============================================

    // Extract and verify token for protected routes
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    let authUser;
    try {
      authUser = authenticateToken(token);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }

    // GET /users - Get all unread users
    if (route === 'users' && req.method === 'GET') {
      const users = await usersCollection
        .find({ isRead: { $ne: true } })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(users);
    }

    // POST /users - Create new user
    if (route === 'users' && req.method === 'POST') {
      const { url, username, title, userId } = req.body;

      if (!url || !validateUrl(url)) {
        return res.status(400).json({ error: 'Valid URL is required' });
      }

      const existingUser = await usersCollection.findOne({ url });

      if (existingUser) {
        return res.status(409).json({
          error: 'URL already exists',
          existingUser: {
            _id: existingUser._id,
            url: existingUser.url,
            username: existingUser.username || existingUser.title,
          }
        });
      }

      const newUser = {
        url: sanitizeInput(url),
        username: username ? sanitizeInput(username) : null,
        title: title ? sanitizeInput(title) : null,
        userId: userId ? sanitizeInput(userId) : null,
        createdAt: new Date(),
        isRead: false
      };

      const result = await usersCollection.insertOne(newUser);
      const insertedUser = await usersCollection.findOne({ _id: result.insertedId });

      return res.status(201).json({
        message: 'User created successfully',
        user: insertedUser
      });
    }

    // PUT /users/:id - Update user
    if (route.startsWith('users/') && req.method === 'PUT') {
      const userId = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const { url, username, title, userId: userIdField } = req.body;

      if (!url || !validateUrl(url)) {
        return res.status(400).json({ error: 'Valid URL is required' });
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
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        message: 'User updated successfully',
        user: result.value
      });
    }

    // POST /users/:id/mark-read - Mark user as read
    if (route.includes('/mark-read') && req.method === 'POST') {
      const userId = pathParts[pathParts.length - 2];

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { isRead: true, readAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        message: 'User marked as read',
        user: result.value
      });
    }

    // DELETE /users/:id - Delete user
    if (route.startsWith('users/') && req.method === 'DELETE') {
      const userId = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const result = await usersCollection.deleteOne({ 
        _id: new ObjectId(userId) 
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ 
        message: 'User deleted successfully' 
      });
    }

    // Route not found
    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
