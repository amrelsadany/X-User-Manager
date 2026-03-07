# Link Manager - Complete Application

A full-stack link management application for saving and organizing links (especially X/Twitter profiles) across desktop and mobile.

## 📁 Project Structure

```
LinkManager-Complete/
├── express-backend/          # Local development backend
│   ├── server.js            # Express server
│   ├── package.json         # Dependencies
│   ├── .env.example         # Environment template
│   └── README.md            # Backend docs
│
├── serverless-backend/       # Production cloud backend
│   ├── api/                 # Serverless functions
│   │   ├── links.js        # GET all links
│   │   ├── add-link.js     # POST new link
│   │   ├── delete-link.js  # DELETE link
│   │   └── mark-read.js    # PATCH mark as read
│   ├── lib/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── Link.js         # Link schema
│   ├── package.json
│   ├── vercel.json         # Vercel config
│   └── README.md           # Deployment guide
│
├── frontend/                 # React frontend
│   ├── index.html           # HTML wrapper
│   ├── LinkManager-NoTailwind.jsx  # React app
│   └── README.md            # Frontend docs
│
└── guides/                   # Documentation
    ├── DUAL_ENVIRONMENT_GUIDE.md  # Complete setup guide
    ├── QUICK_REFERENCE.md         # Quick commands
    └── iOS-Shortcut-Simple.md     # iPhone integration
```

## 🚀 Quick Start

### Local Development (5 minutes)

1. **Start Backend:**
```bash
cd express-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection
npm start
```

2. **Open Frontend:**
```bash
cd frontend
# Just double-click index.html
# Or use: python3 -m http.server 8000
```

3. **Done!** Visit `http://localhost:8000` or open the HTML file directly.

### Cloud Deployment (10 minutes)

See `guides/DUAL_ENVIRONMENT_GUIDE.md` for complete instructions.

**Quick version:**
1. Deploy serverless backend to Vercel
2. Deploy frontend to Vercel/Netlify
3. Update frontend with backend URL
4. Done!

## ✨ Features

### Desktop (Chrome Extension or Web App)
- ✅ Save links from any website
- ✅ Track X (Twitter) profiles with username
- ✅ Mark links as read/unread
- ✅ Delete links
- ✅ Duplicate detection
- ✅ Search and filter (coming soon)

### iPhone (iOS Shortcuts)
- ✅ Save X profiles with one tap
- ✅ Auto-extract username from URL
- ✅ Works in X app and Safari
- ✅ Syncs to cloud database

## 🗄️ Database

Uses MongoDB (local or MongoDB Atlas):

**Link Schema:**
```json
{
  "url": "https://x.com/elonmusk",
  "username": "elonmusk",
  "title": "@elonmusk",
  "userId": "",
  "createdAt": "2026-03-07T...",
  "isRead": false
}
```

## 🔧 Two Backend Options

### Express (Local Development)
- **Use for:** Daily development, testing
- **Pros:** Fast, easy debugging, no deployment
- **Runs on:** `http://localhost:3001`
- **Location:** `express-backend/`

### Serverless (Production)
- **Use for:** Production, sharing with others
- **Pros:** Free, always-on, no maintenance
- **Runs on:** Vercel (e.g., `https://your-app.vercel.app`)
- **Location:** `serverless-backend/`

## 🌐 Frontend Auto-Detection

The frontend automatically uses the correct backend:

| Running From | Backend Used |
|-------------|-------------|
| `file:///...` (local file) | Express (`localhost:3001`) |
| `http://localhost:8000` | Express (`localhost:3001`) |
| `https://your-app.vercel.app` | Serverless (cloud) |

**No manual switching needed!** 🎉

## 📱 iOS Integration

Save X profiles from your iPhone:

1. Create iOS Shortcut (see `guides/iOS-Shortcut-Simple.md`)
2. Share any X profile
3. Tap "Save X Profile" shortcut
4. Done! Saved to your database.

**Works with:**
- X (Twitter) app
- Safari
- Any app with Share Sheet

## 📚 Documentation

### Essential Guides
- **DUAL_ENVIRONMENT_GUIDE.md** - Complete setup for local + cloud
- **QUICK_REFERENCE.md** - Commands cheat sheet
- **iOS-Shortcut-Simple.md** - iPhone integration

### API Documentation
- **express-backend/README.md** - Express API endpoints
- **serverless-backend/README.md** - Serverless deployment

### Frontend
- **frontend/README.md** - Frontend setup and deployment

## 🛠️ Tech Stack

**Backend:**
- Express.js (local)
- Vercel Serverless Functions (cloud)
- MongoDB / MongoDB Atlas

**Frontend:**
- React 18
- Lucide React (icons)
- Vanilla CSS (inline styles)

**Mobile:**
- iOS Shortcuts

## 🔐 Environment Variables

### Express Backend (.env)
```bash
PORT=3001
MONGODB_URI=mongodb+srv://...
DB_NAME=linksdb
LINKS_COLLECTION=users
OPENED_LINKS_COLLECTION=opened_links
```

### Serverless Backend (Vercel Dashboard)
```bash
MONGODB_URI=mongodb+srv://...
```

## 🧪 Testing

### Test Local Backend
```bash
curl http://localhost:3001/api/links

curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/jack","username":"jack"}'
```

### Test Cloud Backend
```bash
curl https://your-app.vercel.app/api/links

curl -X POST https://your-app.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/jack","username":"jack"}'
```

## 📦 Installation

### Backend Dependencies
```bash
cd express-backend
npm install
# Installs: express, mongodb, cors, dotenv
```

```bash
cd serverless-backend
npm install
# Installs: mongoose
```

### Frontend
No installation needed! Uses CDN for React and icons.

## 🚀 Deployment Options

### Free Hosting Platforms

**Backend:**
- ✅ Vercel (recommended - serverless)
- ✅ Render (Express apps)
- ✅ Railway (Express apps)

**Frontend:**
- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages

**Database:**
- ✅ MongoDB Atlas (free 512MB)

## 🔄 Development Workflow

1. **Develop Locally:**
   - Run Express backend
   - Open frontend HTML file
   - Make changes, test immediately

2. **Deploy When Ready:**
   - Push serverless backend to Vercel
   - Deploy frontend to Vercel/Netlify
   - Everything auto-switches to cloud

3. **iOS Integration:**
   - Update shortcut with production URL
   - Save profiles on the go

## 🎯 Use Cases

### Personal Knowledge Management
- Save interesting profiles to read later
- Build a curated list of experts
- Track competitors or collaborators

### Research
- Collect sources during research
- Organize by topic (future feature)
- Export for citations

### Networking
- Save profiles from conferences
- Follow up with connections later
- Build industry contact lists

## 🐛 Troubleshooting

**Frontend can't connect:**
- Check backend is running (`npm start`)
- Verify URL in browser console
- Check CORS settings

**Duplicate links:**
- Already handled! Returns 409 error
- Frontend shows confirmation dialog

**Slow cold starts:**
- Normal for serverless (first request)
- Subsequent requests are fast

## 📈 Future Enhancements

- [ ] Tags and categories
- [ ] Full-text search
- [ ] Export to CSV/JSON
- [ ] Browser extension for Chrome/Firefox
- [ ] Bulk operations
- [ ] Profile avatars from X API
- [ ] Analytics dashboard
- [ ] Sharing lists with others

## 🤝 Contributing

This is a personal project, but feel free to:
- Fork and customize
- Add new features
- Share improvements

## 📄 License

MIT - Use freely for personal or commercial projects

## 💡 Tips

1. **Use MongoDB Atlas** for both local and cloud (same data everywhere)
2. **Deploy early** - test the full stack end-to-end
3. **Start with iOS Shortcut** - fastest way to collect links
4. **Add Chrome extension** later for desktop automation

## 🆘 Support

Check the guides in `guides/` folder:
- Setup issues → DUAL_ENVIRONMENT_GUIDE.md
- Quick commands → QUICK_REFERENCE.md
- iPhone setup → iOS-Shortcut-Simple.md

## ⚡ TL;DR

**Local:** `npm start` in express-backend + open index.html  
**Cloud:** Deploy serverless-backend to Vercel + deploy frontend  
**iPhone:** Create iOS Shortcut from guide  
**Done!** 🎉

---

Built with ❤️ for managing links and X profiles across all devices.
