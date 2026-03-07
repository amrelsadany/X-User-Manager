# Quick Reference - Local vs Cloud

## 🏠 RUNNING LOCALLY

### Start Express Server:
```bash
node server.js
```
Server: http://localhost:3001

### Open Frontend:
```bash
# Just open the HTML file in browser
# It will automatically use localhost:3001
```

### Chrome Extension:
```javascript
// Use local server
const API_URL = 'http://localhost:3001/api';
```

---

## ☁️ RUNNING IN CLOUD

### Deploy Backend:
```bash
cd serverless-backend
git push  # Auto-deploys to Vercel
```
Server: https://your-project.vercel.app

### Deploy Frontend:
```bash
# Push to GitHub + connect to Vercel/Netlify
# It will automatically use cloud backend
```

### Chrome Extension:
```javascript
// Use cloud server
const API_URL = 'https://your-project.vercel.app/api';
```

---

## 🔄 SWITCHING MODES

**Frontend** - Already automatic! No changes needed.

**Extension** - Edit one line:
```javascript
// Local:  const API_URL = 'http://localhost:3001/api';
// Cloud:  const API_URL = 'https://your-project.vercel.app/api';
```

---

## 📋 COMMANDS

### Local Development:
```bash
npm start              # Start Express
curl localhost:3001/api/links    # Test
```

### Cloud Deployment:
```bash
git push               # Deploy serverless
vercel logs            # Check logs
```

---

## 💡 TIPS

1. Use **MongoDB Atlas** for both environments (same data everywhere)
2. Develop locally, deploy when ready
3. Extension can auto-detect environment (see guide)
4. Frontend auto-switches - just deploy and it works!
