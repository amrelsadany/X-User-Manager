# Link Manager - Dual Environment Setup Guide

## 🎯 Overview

You now have **TWO backends** that work seamlessly:

1. **Express Server (Local)** - For local development and testing
2. **Serverless Functions (Cloud)** - For production deployment on Vercel

Your frontend **automatically detects** which environment it's in and uses the correct backend!

---

## 📁 Project Structure

```
link-manager/
├── server.js                    # Express backend (LOCAL)
├── LinkManager-NoTailwind.jsx   # React frontend (AUTO-DETECTS ENVIRONMENT)
├── chrome-extension/            # Chrome extension
└── serverless-backend/          # Serverless backend (CLOUD)
    ├── api/
    │   ├── links.js
    │   ├── add-link.js
    │   ├── delete-link.js
    │   └── mark-read.js
    ├── lib/db.js
    └── models/Link.js
```

---

## 🔧 Local Development Setup

### 1. Run Express Server Locally

```bash
# Start MongoDB locally (if using local MongoDB)
mongod

# In another terminal, start Express server
node server.js
```

Server runs at: `http://localhost:3001`

### 2. Run React Frontend Locally

```bash
# Your frontend will automatically use localhost:3001
# Open LinkManager-NoTailwind.jsx in your browser
```

When running on `localhost`, the app **automatically uses** the local Express server!

### 3. Test Chrome Extension Locally

The extension should point to your local server:

```javascript
// In your extension's background.js or popup.js
const API_URL = 'http://localhost:3001/api';
```

---

## ☁️ Cloud Deployment Setup

### 1. Deploy Serverless Backend to Vercel

Follow the deployment guide in `serverless-backend/README.md`:

1. Push `serverless-backend/` to GitHub
2. Connect to Vercel
3. Add MongoDB Atlas connection string
4. Deploy!

You'll get a URL like: `https://your-project.vercel.app`

### 2. Update Your Frontend

Open `LinkManager-NoTailwind.jsx` and update line 15:

```javascript
// Change this:
return 'https://your-project.vercel.app/api';

// To your actual Vercel URL:
return 'https://linkmanager-abc123.vercel.app/api';
```

### 3. Deploy Frontend

Deploy your React app to:
- **Vercel** (recommended - free)
- **Netlify** (free)
- **GitHub Pages** (free)

When deployed, it will **automatically use** the serverless backend!

### 4. Update Chrome Extension for Production

Update the extension to use the cloud backend:

```javascript
// In background.js or popup.js
const API_URL = 'https://your-project.vercel.app/api';
```

---

## 🔀 How Environment Detection Works

The frontend automatically detects where it's running:

```javascript
const getApiBaseUrl = () => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    // Running locally → Use Express
    return 'http://localhost:3001/api';
  } else {
    // Deployed on cloud → Use Vercel
    return 'https://your-project.vercel.app/api';
  }
};
```

**What this means:**
- Open `file:///path/to/LinkManager.html` → Uses `localhost:3001`
- Open `http://localhost:8000` → Uses `localhost:3001`
- Open `https://your-app.vercel.app` → Uses Vercel serverless

---

## 🗄️ Database Options

### Option A: Shared Cloud Database (Recommended)

**Use MongoDB Atlas for both local AND cloud:**

1. Create MongoDB Atlas account (free)
2. Get connection string
3. Update both:
   - Local: Create `.env` file with `MONGODB_URI=mongodb+srv://...`
   - Cloud: Add environment variable in Vercel dashboard

**Benefits:**
- Same data everywhere
- Easy switching between local/cloud
- No local MongoDB installation needed

### Option B: Separate Databases

**Local MongoDB + Cloud MongoDB Atlas:**

- Local: `mongodb://localhost:27017`
- Cloud: `mongodb+srv://...atlas.mongodb.net`

**Benefits:**
- Test data stays local
- Production data stays in cloud

**Drawbacks:**
- Data not synced between environments
- Need to run local MongoDB

---

## 🚀 API Endpoint Mapping

Both backends support the same endpoints (with slight differences):

### Express (Local) - Existing Structure
```
GET    /api/links                   → Get all unread links
POST   /api/links                   → Add new link
POST   /api/links/:id/mark-opened   → Mark as opened
PUT    /api/links/:id               → Update link
DELETE /api/links/:id               → Delete link
```

### Serverless (Cloud) - New Structure
```
GET    /api/links                   → Get all links
POST   /api/add-link                → Add new link
PATCH  /api/mark-read?id=xxx        → Mark as read
DELETE /api/delete-link?id=xxx      → Delete link
```

### 🔧 Making Frontend Compatible with Both

If you want the frontend to work with both backends without changes, you have two options:

**Option 1: Update Express to match Serverless** (recommended)
- Rename endpoints in `server.js` to match serverless structure

**Option 2: Create adapter layer in frontend**
- Add logic to transform requests based on environment

---

## 📋 Development Workflow

### Daily Development (Local)

```bash
# 1. Start Express server
node server.js

# 2. Open frontend in browser
open LinkManager-NoTailwind.html

# 3. Make changes, test locally
# Frontend automatically uses localhost:3001
```

### Deploying to Production (Cloud)

```bash
# 1. Make sure serverless backend is deployed
cd serverless-backend
git add .
git commit -m "Update backend"
git push  # Auto-deploys to Vercel

# 2. Deploy frontend
# Push to GitHub, connect to Vercel/Netlify
# Frontend automatically uses cloud backend
```

---

## 🛠️ Chrome Extension - Environment Switching

### Option 1: Manual Switch

Create two versions of your extension:

```javascript
// For local testing
const API_URL = 'http://localhost:3001/api';

// For production (published extension)
const API_URL = 'https://your-project.vercel.app/api';
```

### Option 2: Auto-detect (Advanced)

```javascript
// Check if local server is available
async function getApiUrl() {
  try {
    await fetch('http://localhost:3001/api/links');
    return 'http://localhost:3001/api';  // Local available
  } catch {
    return 'https://your-project.vercel.app/api';  // Use cloud
  }
}
```

---

## ✅ Testing Both Environments

### Test Local Express:

```bash
# Get all links
curl http://localhost:3001/api/links

# Add a link
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "username": "test"}'
```

### Test Cloud Serverless:

```bash
# Get all links
curl https://your-project.vercel.app/api/links

# Add a link
curl -X POST https://your-project.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "title": "Test"}'
```

---

## 🎯 Recommended Setup

For the best experience:

1. ✅ **Local Development**: Express + MongoDB Atlas
   - Run `server.js` locally
   - Connect to cloud database
   - Fast iteration, no deployment needed

2. ✅ **Production**: Serverless + MongoDB Atlas
   - Deploy to Vercel (free, always-on)
   - Same database as local
   - Zero maintenance

3. ✅ **Frontend**: Auto-detection enabled
   - Works locally without changes
   - Works in production without changes

---

## 📊 Feature Comparison

| Feature | Express (Local) | Serverless (Cloud) |
|---------|----------------|-------------------|
| **Always Running** | ✅ Yes | ✅ Yes (no sleep!) |
| **Cost** | Free (runs locally) | Free (Vercel tier) |
| **Speed** | Very fast | Fast (200ms cold start) |
| **Setup** | Simple | Requires deployment |
| **Good For** | Development | Production |
| **Database** | Local or Atlas | MongoDB Atlas |

---

## 🆘 Troubleshooting

**Frontend can't connect locally:**
- Make sure Express is running: `node server.js`
- Check `http://localhost:3001/api/links` in browser
- Verify frontend is using correct URL

**Frontend can't connect in production:**
- Check Vercel URL in browser
- Verify environment variable is set
- Check Vercel dashboard logs

**Extension not working:**
- Check API_URL matches your backend
- Verify CORS is enabled
- Check browser console for errors

---

## 🎉 Summary

You now have the **best of both worlds**:

- **Local Express** - Fast development, easy debugging
- **Cloud Serverless** - Always-on production, zero maintenance
- **Smart Frontend** - Automatically uses the right backend

Keep coding locally, deploy to cloud when ready! 🚀
