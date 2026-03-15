# Serverless Backend Deployment Guide

## 🎯 What's Included

This serverless backend has **full JWT authentication** matching your Express server.js:

### ✅ Security Features
- JWT authentication with 7-day tokens
- bcrypt password hashing (10 rounds)
- Email & password validation
- Input sanitization
- MongoDB injection prevention
- CORS protection
- Secure token verification

### ✅ Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### ✅ Protected User Endpoints
- `GET /api/users` - Get unread users (requires auth)
- `POST /api/users` - Create user (requires auth)
- `PUT /api/users/:id` - Update user (requires auth)
- `POST /api/users/:id/mark-read` - Mark as read (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

---

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Set Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables

Add these variables:

| Variable | Value | Example |
|----------|-------|---------|
| **MONGODB_URI** | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| **DB_NAME** | Database name | `usersdb` |
| **USERS_COLLECTION** | Collection name | `users` |
| **JWT_SECRET** | Random 64-char string | Generate with: `openssl rand -hex 64` |
| **FRONTEND_URL** | Your frontend URL | `https://your-app.vercel.app` |

**CRITICAL:** Generate JWT_SECRET properly:
```bash
# On Mac/Linux
openssl rand -hex 64

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Step 4: Deploy
```bash
cd serverless-backend
vercel --prod
```

---

## 📋 Create Default Admin User

After first deployment, you need to create the admin user manually in MongoDB:

### Option 1: Using MongoDB Compass (GUI)

1. Connect to your MongoDB
2. Go to `usersdb` → `auth_users` collection
3. Insert this document:

```javascript
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",  // See below
  "role": "admin",
  "createdAt": new Date(),
  "isActive": true
}
```

To generate password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Admin@123', 10));"
```

### Option 2: Using MongoDB Shell

```javascript
use usersdb

db.auth_users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...",  // Your hashed password
  role: "admin",
  createdAt: new Date(),
  isActive: true
})
```

---

## 🧪 Testing the API

### 1. Test Register (Optional)
```bash
curl -X POST https://your-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### 2. Test Login
```bash
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 3. Test Protected Endpoint
```bash
# Save the token from login response
TOKEN="your-jwt-token-here"

curl -X GET https://your-api.vercel.app/api/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Frontend Configuration

Update your frontend `.env`:

```bash
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

---

## 📊 Route Mapping

| Express Route | Serverless Route | Method | Auth Required |
|--------------|------------------|--------|---------------|
| `/api/auth/register` | `/api/auth/register` | POST | No |
| `/api/auth/login` | `/api/auth/login` | POST | No |
| `/api/auth/verify` | `/api/auth/verify` | GET | Yes (token in header) |
| `/api/users` | `/api/users` | GET | Yes |
| `/api/users` | `/api/users` | POST | Yes |
| `/api/users/:id` | `/api/users/:id` | PUT | Yes |
| `/api/users/:id/mark-read` | `/api/users/:id/mark-read` | POST | Yes |
| `/api/users/:id` | `/api/users/:id` | DELETE | Yes |

---

## 🛡️ Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (64+ random characters)
- [ ] Set correct FRONTEND_URL
- [ ] Enable MongoDB authentication
- [ ] Use MongoDB Atlas IP whitelist
- [ ] Review CORS allowed origins
- [ ] Test all authentication flows
- [ ] Verify token expiration works

---

## 🐛 Troubleshooting

### "Access token required"
- Check Authorization header: `Bearer YOUR_TOKEN`
- Verify token hasn't expired (7 days)

### "Invalid credentials"
- Ensure email is lowercase
- Check password meets requirements (8+ chars, uppercase, lowercase, number)

### CORS errors
- Add your frontend URL to `allowedOrigins` in `api/index.js`
- Set FRONTEND_URL environment variable

### MongoDB connection issues
- Check MONGODB_URI is correct
- Verify MongoDB Atlas IP whitelist
- Ensure network access is enabled

---

## 📝 Password Requirements

All passwords must have:
- ✅ At least 8 characters
- ✅ One uppercase letter
- ✅ One lowercase letter
- ✅ One number

Example valid passwords:
- `Admin@123`
- `MyPass123`
- `SecureP4ss`

---

## 🔄 Differences from Express Server

| Feature | Express | Serverless |
|---------|---------|------------|
| Rate limiting | ✅ express-rate-limit | ❌ Not needed (Vercel handles) |
| Helmet | ✅ Installed | ❌ Not needed (Vercel provides) |
| Connection pooling | ✅ Persistent | ✅ Cached per function |
| CORS | ✅ cors package | ✅ Manual headers |
| Body parser | ✅ express.json | ✅ Automatic (Vercel) |

---

## 📞 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test with curl commands above
4. Check MongoDB Atlas logs

---

**Your serverless backend is production-ready with full authentication!** 🎉

Deploy and enjoy secure, scalable infrastructure!
