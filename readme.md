# Link Manager 🔗

A full-stack link management application for saving and organizing links, especially X (Twitter) profiles, across desktop and mobile devices. Features dual backend support for both local development and cloud deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/linkmanager)

## ✨ Features

- 💾 **Save Links** - Store URLs with automatic username extraction
- 🐦 **Track X Profiles** - Save Twitter/X profiles with one tap (iOS Shortcut included)
- ✅ **Read/Unread Status** - Mark links as read or unread
- 🗑️ **Link Management** - Edit and delete links
- 🔄 **Duplicate Detection** - Automatically prevents duplicate links
- 📱 **Mobile Support** - iOS Shortcut for saving profiles on the go
- 🌐 **Cross-Platform** - Works on desktop and mobile
- 🔄 **Auto-Sync** - All devices stay in sync via cloud database


## 📁 Project Structure

```
x-link-manager/
├── frontend/              # React application
│   ├── index.html
│   ├── LinkManager.jsx
│   └── README.md
│
├── backend/               # Serverless API (Vercel Functions)
│   ├── api/              # API endpoints
│   ├── lib/              # Database utilities
│   ├── models/           # Data models
│   └── package.json
│
└── express-backend/       # Express server (local development)
    ├── server.js
    ├── package.json
    └── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Lucide React** - Icon library
- **Vanilla JavaScript** - No build process needed
- **Auto Environment Detection** - Switches between local/cloud backends

### Backend (Dual Options)

#### Option 1: Serverless (Production - Recommended)
- **Vercel Serverless Functions** - Scalable, always-on
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **Free hosting** - No sleep, no cold starts

#### Option 2: Express (Local Development)
- **Express.js** - Fast, minimal web framework
- **MongoDB** - Database (local or Atlas)
- **Native MongoDB Driver** - Direct database access
- **Great for development** - Fast iteration, easy debugging

## 🚀 Quick Start

### Option A: Local Development (Express Backend)

```bash
# 1. Clone the repository
git clone https://github.com/amrelsadany/x-link-manager.git
cd x-link-manager

# 2. Set up Express backend
cd express-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm start

# 3. Open frontend
cd ../frontend
# Just open index.html in your browser
open index.html
```

**Express backend runs at:** `http://localhost:3001`

### Option B: Cloud Deployment (Serverless Backend)

See [Deployment Guide](#-deployment) below.

## 💻 Local Development

### Backend (Express)

```bash
cd express-backend
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB connection string to .env
# MONGODB_URI=mongodb://localhost:27017
# or
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkmanager

# Start server
npm start

# For auto-restart on changes
npm run dev
```

**API runs at:** `http://localhost:3001`

### Frontend

```bash
cd frontend

# Option 1: Open directly
open index.html

# Option 2: Use local server
python3 -m http.server 8000
# Then open: http://localhost:8000
```

**Frontend automatically detects:**
- Running locally (`localhost`) → Uses Express backend
- Deployed to cloud → Uses Serverless backend

## 📱 iOS Integration

Save X profiles from your iPhone with one tap!

### Setup iOS Shortcut

1. Open Shortcuts app on iPhone
2. Create new shortcut with these actions:
   - Receive URLs from Share Sheet
   - Extract username from URL
   - POST to API endpoint
   - Show notification

3. Configure API URL:
   ```
   https://your-backend-url.vercel.app/api/add-link
   ```

4. Enable "Show in Share Sheet"

### Use the Shortcut

1. Open any X profile (e.g., `https://x.com/elonmusk`)
2. Tap Share button
3. Tap "Save X Profile" shortcut
4. Done! Profile saved to database ✅

**Full guide:** See [iOS-Shortcut-Guide.md](./docs/iOS-Shortcut-Simple.md)

## 🗄️ Database

### Schema

```javascript
{
  url: String,          // "https://x.com/username"
  username: String,     // "username"
  title: String,        // "@username"
  userId: String,       // Optional: X user ID
  createdAt: Date,      // Auto-generated
  isRead: Boolean       // Default: false
}
```

### MongoDB Atlas Setup (Free)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/linkmanager
   ```
4. Add to environment variables

## 🔧 API Endpoints

### Express Backend (Local - Port 3001)

```
GET    /api/links                   # Get all unread links
POST   /api/links                   # Add new link
POST   /api/links/:id/mark-opened  # Mark link as opened
PUT    /api/links/:id              # Update link
DELETE /api/links/:id              # Delete link
GET    /api/opened-links           # Get all opened links
```

### Serverless Backend (Cloud - Vercel)

```
GET    /api/links                   # Get all links
POST   /api/add-link               # Add new link
PATCH  /api/mark-read?id=xxx       # Mark as read/unread
DELETE /api/delete-link?id=xxx     # Delete link
GET    /api/get-user-id?username=x # Get X user ID (optional)
```

## 📚 API Documentation

### Add Link

**Express:**
```bash
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://x.com/jack",
    "username": "jack"
  }'
```

**Serverless:**
```bash
curl -X POST https://your-api.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://x.com/jack",
    "username": "jack"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://x.com/jack",
  "username": "jack",
  "title": "@jack",
  "createdAt": "2026-03-07T12:00:00.000Z",
  "isRead": false
}
```

### Get All Links

```bash
# Express
curl http://localhost:3001/api/links

# Serverless
curl https://your-api.vercel.app/api/links
```

### Delete Link

```bash
# Express
curl -X DELETE http://localhost:3001/api/links/LINK_ID

# Serverless
curl -X DELETE "https://your-api.vercel.app/api/delete-link?id=LINK_ID"
```

## 🚀 Deployment

### Deploy to Vercel (Free)

This project uses **two separate Vercel deployments** from one repository:

#### 1. Deploy Backend

```bash
# Push to GitHub first
git push origin main
```

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. **Set Root Directory:** `backend`
4. Add environment variable:
   - `MONGODB_URI` = your MongoDB Atlas connection string
5. Click "Deploy"
6. Copy your backend URL (e.g., `https://linkmanager-api.vercel.app`)

#### 2. Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same** repository
3. **Set Root Directory:** `frontend`
4. Click "Deploy"
5. Your frontend is live! (e.g., `https://linkmanager.vercel.app`)

#### 3. Connect Frontend to Backend

Edit `frontend/LinkManager.jsx` (around line 15):

```javascript
// Update this line with your actual backend URL
return 'https://linkmanager-api.vercel.app/api';
```

Push changes:
```bash
git add frontend/LinkManager.jsx
git commit -m "Update backend URL"
git push
```

Vercel will auto-redeploy frontend with the new changes!

### Environment Variables

#### Express Backend (.env)
```bash
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkmanager
DB_NAME=linksdb
LINKS_COLLECTION=users
OPENED_LINKS_COLLECTION=opened_links
```

#### Serverless Backend (Vercel Dashboard)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkmanager
```

## 🧪 Testing

### Test Express Backend
```bash
# Start server
cd express-backend
npm start

# Test in another terminal
curl http://localhost:3001/api/links

# Add a link
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/jack","username":"jack"}'
```

### Test Serverless Backend
```bash
# Test deployed backend
curl https://your-api.vercel.app/api/links

# Add a link
curl -X POST https://your-api.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/jack","username":"jack"}'
```

## 🔄 Auto-Deployment

**When you push to GitHub:**
- Changes in `frontend/` → Frontend redeploys automatically
- Changes in `backend/` → Backend redeploys automatically
- Changes in `express-backend/` → No auto-deploy (local only)

**Deployment time:** ~30-60 seconds

## 🎨 Features Deep Dive

### Automatic Username Extraction

When saving X profile URLs, the app automatically extracts the username:
- `https://x.com/elonmusk` → Username: `elonmusk`
- `https://twitter.com/jack` → Username: `jack`

### Environment Auto-Detection

The frontend automatically detects where it's running:

```javascript
// Running locally (file:// or localhost)
→ Uses Express backend at localhost:3001

// Deployed to cloud (https://your-app.vercel.app)
→ Uses Serverless backend at your-api.vercel.app
```

No manual configuration needed!

### Duplicate Detection

The backend automatically prevents duplicate URLs:
- Checks if URL already exists before saving
- Returns `409 Conflict` status with existing link data
- Frontend shows confirmation dialog for duplicates

## 📖 Documentation

- **[Backend API Documentation](./backend/README.md)** - Serverless API details
- **[Express Backend Documentation](./express-backend/README.md)** - Local API details
- **[Frontend Documentation](./frontend/README.md)** - React app details
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Step-by-step Vercel deployment
- **[iOS Shortcut Guide](./docs/iOS-Shortcut-Simple.md)** - Mobile integration

## 🛣️ Roadmap

### Current Features
- ✅ Save links with URL and username
- ✅ Mark as read/unread
- ✅ Delete links
- ✅ Duplicate detection
- ✅ iOS Shortcut integration
- ✅ Dual backend support (Express + Serverless)
- ✅ Auto environment detection

### Planned Features
- [ ] Tags and categories
- [ ] Full-text search
- [ ] Bulk operations (mark all as read, delete selected)
- [ ] Export to CSV/JSON
- [ ] Chrome extension
- [ ] Android support
- [ ] Profile avatars (fetch from X API)
- [ ] Follower count tracking
- [ ] Analytics dashboard
- [ ] Sharing lists with others
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes
4. Test locally with Express backend
5. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
7. Open a Pull Request

### Coding Standards

- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Test changes with both Express and Serverless backends

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Problem:** Frontend shows connection errors

**Solution:**
1. Check backend is running (Express: `npm start`)
2. Verify API URL in `LinkManager.jsx`
3. Check browser console for CORS errors
4. Ensure backend is deployed (if using Vercel)

### MongoDB Connection Error

**Problem:** Backend can't connect to database

**Solution:**
1. Verify `MONGODB_URI` in `.env` or Vercel dashboard
2. Check MongoDB Atlas IP allowlist includes `0.0.0.0/0`
3. Verify database user credentials
4. Test connection string locally first

### Duplicate Links Not Detected

**Problem:** Same URL can be saved multiple times

**Solution:**
1. Check backend logs for errors
2. Verify database indexes are created
3. Test duplicate detection with curl/Postman
4. Clear browser cache and retry

### iOS Shortcut Not Working

**Problem:** Shortcut fails to save links

**Solution:**
1. Verify API URL in shortcut matches deployed backend
2. Check backend is accessible from mobile network
3. Test API endpoint directly in Safari first
4. Ensure backend CORS allows all origins

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

Copyright (c) 2026 Amr Elsadany

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## 🙏 Acknowledgments

- **[Vercel](https://vercel.com)** - Serverless hosting platform
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - Cloud database
- **[React](https://react.dev)** - Frontend framework
- **[Express](https://expressjs.com)** - Web framework
- **[Lucide](https://lucide.dev)** - Beautiful icon library

## 📞 Support

- 📧 Email: elsadany_94@hotmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/amrelsadany/x-link-manager/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/amrelsadany/x-link-manager/discussions)

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/amrelsadany/x-link-manager?style=social)
![GitHub forks](https://img.shields.io/github/forks/amrelsadany/x-link-manager?style=social)
![GitHub issues](https://img.shields.io/github/issues/amrelsadany/x-link-manager)
![GitHub license](https://img.shields.io/github/license/amrelsadany/x-link-manager)

---

**Made with ❤️ for managing links across all devices**

⭐ Star this repo if you find it helpful!
