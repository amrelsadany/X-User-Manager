# Link Manager - Serverless Backend Deployment Guide

## 📁 Project Structure

```
serverless-backend/
├── api/
│   ├── links.js          # GET /api/links - Fetch all links
│   ├── add-link.js       # POST /api/add-link - Add new link
│   ├── delete-link.js    # DELETE /api/delete-link?id=xxx - Delete link
│   └── mark-read.js      # PATCH /api/mark-read?id=xxx - Mark as read/unread
├── lib/
│   └── db.js             # MongoDB connection utility
├── models/
│   └── Link.js           # Link schema
├── package.json
├── vercel.json           # Vercel configuration
├── .env.example
└── .gitignore
```

## 🚀 Step-by-Step Deployment to Vercel

### Step 1: Set Up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/linkmanager
   ```
6. Keep this handy - you'll need it for Vercel

### Step 2: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   cd serverless-backend
   git init
   git add .
   git commit -m "Initial serverless backend"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Follow their instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/linkmanager-serverless.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Sign up for Vercel**: https://vercel.com/signup (use GitHub login)

2. **Import your project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel auto-detects the configuration

3. **Add Environment Variable**:
   - Before deploying, click "Environment Variables"
   - Add:
     - Name: `MONGODB_URI`
     - Value: `mongodb+srv://username:password@cluster.mongodb.net/linkmanager`
   - Click "Add"

4. **Deploy**:
   - Click "Deploy"
   - Wait 30-60 seconds
   - You'll get a URL like: `https://your-project.vercel.app`

### Step 4: Test Your API

Your API endpoints will be:
- `https://your-project.vercel.app/api/links` (GET)
- `https://your-project.vercel.app/api/add-link` (POST)
- `https://your-project.vercel.app/api/delete-link?id=xxx` (DELETE)
- `https://your-project.vercel.app/api/mark-read?id=xxx` (PATCH)

Test with curl:
```bash
# Get all links
curl https://your-project.vercel.app/api/links

# Add a link
curl -X POST https://your-project.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "title": "Test Link"}'
```

## 🔧 Update Your Frontend

Update your React app to use the new API URL:

```javascript
// Change this:
const API_URL = 'http://localhost:3001';

// To this:
const API_URL = 'https://your-project.vercel.app';

// Then update your fetch calls:
fetch(`${API_URL}/api/links`)          // Instead of /api/links
fetch(`${API_URL}/api/add-link`, ...)  // Instead of /api/links
fetch(`${API_URL}/api/delete-link?id=${id}`, ...)
fetch(`${API_URL}/api/mark-read?id=${id}`, ...)
```

## 🔧 Update Your Chrome Extension

Update `background.js` or wherever you make API calls:

```javascript
const API_URL = 'https://your-project.vercel.app';

// Save link function
async function saveLink(url, title) {
  const response = await fetch(`${API_URL}/api/add-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, title })
  });
  return response.json();
}
```

## 📊 API Endpoint Reference

### GET /api/links
Fetch all links, sorted by newest first.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "url": "https://example.com",
    "title": "Example",
    "isRead": false,
    "createdAt": "2026-03-06T12:00:00.000Z"
  }
]
```

### POST /api/add-link
Add a new link.

**Request Body:**
```json
{
  "url": "https://example.com",
  "title": "Example Title"
}
```

**Response (Success):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://example.com",
  "title": "Example Title",
  "isRead": false,
  "createdAt": "2026-03-06T12:00:00.000Z"
}
```

**Response (Duplicate - 409):**
```json
{
  "error": "Link already exists",
  "existing": { ... }
}
```

### DELETE /api/delete-link?id=xxx
Delete a link by ID.

**Query Parameters:**
- `id`: MongoDB ObjectId of the link

**Response:**
```json
{
  "message": "Link deleted successfully"
}
```

### PATCH /api/mark-read?id=xxx
Mark a link as read or unread.

**Query Parameters:**
- `id`: MongoDB ObjectId of the link

**Request Body:**
```json
{
  "isRead": true
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://example.com",
  "title": "Example",
  "isRead": true,
  "createdAt": "2026-03-06T12:00:00.000Z"
}
```

## ✅ Benefits of This Serverless Setup

1. **Always Available** - No sleep/wake delays
2. **Free Forever** - Vercel's free tier is generous
3. **Auto-scaling** - Handles traffic spikes automatically
4. **Zero Maintenance** - No server to manage
5. **Global CDN** - Fast worldwide
6. **Auto HTTPS** - SSL certificate included
7. **Git Integration** - Push to deploy

## 🔍 Monitoring & Logs

- View logs in Vercel dashboard: https://vercel.com/dashboard
- Monitor function invocations, errors, and performance
- Free tier includes: 100GB bandwidth, 100 serverless function invocations per day

## 🆘 Troubleshooting

**Error: "Cannot find module 'mongoose'"**
- Make sure `package.json` is in the root directory
- Vercel auto-installs dependencies from `package.json`

**Error: "MongooseServerSelectionError"**
- Check your MONGODB_URI in Vercel environment variables
- Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- In MongoDB Atlas: Network Access → Add IP Address → Allow Access from Anywhere

**Cold Start Delays**
- First request after inactivity may take 200-500ms
- This is normal for serverless (still faster than sleeping servers!)
- Subsequent requests are instant

**CORS Errors**
- All endpoints have CORS enabled (`Access-Control-Allow-Origin: *`)
- If issues persist, check browser console for specific errors

## 🎯 Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Get your Vercel URL
3. ✅ Update frontend to use new API URL
4. ✅ Update Chrome extension to use new API URL
5. ✅ Test all functionality
6. 🎉 Enjoy your serverless, always-on link manager!

## 📝 Notes

- Free tier limits: 100GB bandwidth/month, serverless function execution limit
- For most personal projects, you'll never hit these limits
- Automatic deployments on every git push
- Preview deployments for every branch/PR
