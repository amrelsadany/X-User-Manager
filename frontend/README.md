# Link Manager - Frontend

## Quick Start

### Option 1: Open Directly (Simplest)
1. Just double-click `index.html`
2. Opens in your browser
3. Automatically uses `localhost:3001` when running locally

### Option 2: Local Web Server (Recommended for Development)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open:
# http://localhost:8000
```

## How It Works

The frontend **automatically detects** its environment:

- **Running locally** (localhost or file://) → Uses Express backend at `localhost:3001`
- **Deployed to cloud** → Uses Vercel serverless backend

## Deployment

### Deploy to Vercel (Free)

1. Push to GitHub
2. Connect to Vercel
3. Deploy
4. Update line 15 in `LinkManager-NoTailwind.jsx` with your Vercel URL

### Deploy to Netlify (Free)

1. Drag and drop the `frontend/` folder to Netlify
2. Update line 15 in `LinkManager-NoTailwind.jsx` with your backend URL

## Configuration

Edit `LinkManager-NoTailwind.jsx` line 15:

```javascript
// Change this to your deployed backend URL
return 'https://your-project.vercel.app/api';
```

## Features

✅ Add links with URL and username  
✅ View all saved links  
✅ Mark links as read/unread  
✅ Delete links  
✅ Duplicate detection  
✅ Auto-detects local vs cloud backend  

## Files

- `index.html` - HTML wrapper that loads React
- `LinkManager-NoTailwind.jsx` - Main React component
- `README.md` - This file

## Browser Compatibility

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Development

The React component uses:
- React 18
- Lucide React icons (loaded from CDN)
- Inline styles (no CSS files needed)
- Environment auto-detection
