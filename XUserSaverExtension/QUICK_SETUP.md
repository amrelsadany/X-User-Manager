# Chrome Extension - Quick Setup Guide

## 🚀 5-Minute Setup

### **Step 1: Create Icons** (2 minutes)

You need 3 icon files. **Easiest method:**

1. Go to: https://favicon.io/favicon-converter/
2. Upload any image (your logo or any picture)
3. Click "Download"
4. Extract ZIP
5. Rename and copy to `icons/` folder:
   - `favicon-16x16.png` → `icon16.png`
   - `favicon-32x32.png` → `icon48.png`  
   - `android-chrome-192x192.png` → `icon128.png`

**Or use placeholders:** Just create 3 colored PNG squares (any color, any size) and name them correctly.

---

### **Step 2: Load Extension** (1 minute)

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **"Developer mode"** (top-right toggle)
4. Click **"Load unpacked"**
5. Select the `chrome-extension-api-key` folder
6. Done! ✅

---

### **Step 3: Configure** (2 minutes)

1. Click the extension icon in Chrome toolbar
2. Enter:
   - **API URL:** `https://your-api.vercel.app/api`
   - **API Key:** Your personal API key (from Vercel)
3. Click **"Save Settings"**
4. Done! ✅

---

## 🧪 Test It

1. Go to: `https://x.com/elonmusk`
2. Click extension icon
3. Should see profile data
4. Click "Add to User Manager"
5. Should see: "✅ Added to User Manager!"

---

## 🔑 Get API Key

If you don't have an API key yet:

```bash
# Generate key
openssl rand -hex 32

# Add to Vercel
# Go to: Vercel Dashboard → Settings → Environment Variables
# Add: PERSONAL_API_KEY = your-generated-key
# Redeploy project
```

---

## 📁 Folder Structure

After setup, you should have:

```
chrome-extension-api-key/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── icons/
│   ├── icon16.png   ✅ Add this
│   ├── icon48.png   ✅ Add this
│   └── icon128.png  ✅ Add this
└── README.md
```

---

## ✅ Checklist

- [ ] Created 3 icon files
- [ ] Loaded extension in Chrome
- [ ] Extension appears in toolbar
- [ ] Configured API URL
- [ ] Configured API Key
- [ ] Tested on X profile page
- [ ] Successfully added user

---

**That's it! You're ready to use the extension!** 🎉

For detailed instructions, see **README.md**
