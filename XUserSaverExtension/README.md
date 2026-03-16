# Chrome Extension - User Manager (API Key Version)

## 🎯 What This Does

Save X/Twitter profiles to your User Manager with **one click** using **API Key authentication** (no login required!).

---

## ✨ Features

✅ **One-Click Save** - Add X profiles directly from browser
✅ **API Key Auth** - No JWT login needed
✅ **Auto-Detection** - Automatically detects profile data
✅ **Visual Indicator** - Shows when extension is active
✅ **Settings Panel** - Easy configuration
✅ **Duplicate Detection** - Prevents adding same user twice
✅ **Beautiful UI** - Modern gradient design

---

## 📦 Installation

### **Step 1: Download Extension**

Download and extract the `chrome-extension-api-key.zip` file.

### **Step 2: Load in Chrome**

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the extracted `chrome-extension-api-key` folder
5. Extension installed! ✅

### **Step 3: Configure Settings**

1. Click the extension icon in Chrome toolbar
2. Enter your **API URL** and **API Key**:
   - **API URL:** `https://your-api.vercel.app/api`
   - **API Key:** Your personal API key
3. Click **"Save Settings"**
4. Done! ✅

---

## 🔐 Getting Your API Key

### **Generate API Key:**

**Mac/Linux:**
```bash
openssl rand -hex 32
```

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### **Add to Vercel:**

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `PERSONAL_API_KEY`
   - Value: `your-generated-key`
4. **Redeploy** your project

---

## 🚀 Usage

### **Method 1: From Extension Popup**

1. Navigate to any X profile (e.g., `https://x.com/username`)
2. Click the **User Manager** extension icon
3. Profile data will appear automatically
4. Click **"Add to User Manager"**
5. Done! ✅

### **Method 2: Visual Indicator**

When on an X profile page:
1. A small badge appears in bottom-right: **"📋 User Manager Active"**
2. Click the badge to open the extension
3. Click **"Add to User Manager"**

---

## 🎨 Extension UI

### **Settings View:**
```
┌─────────────────────────────┐
│    User Manager             │
│    Save X profiles          │
├─────────────────────────────┤
│ ⚙️ Settings                 │
│                             │
│ API URL:                    │
│ [https://api.vercel.app/api]│
│                             │
│ API Key:                    │
│ [••••••••••••••••••••••••] │
│                             │
│ [Save Settings]             │
└─────────────────────────────┘
```

### **Profile View:**
```
┌─────────────────────────────┐
│    User Manager             │
│    Save X profiles          │
├─────────────────────────────┤
│ Username: elonmusk          │
│ User ID:  44196397          │
│ URL:      /elonmusk         │
│ Status:   🟢 Connected      │
│                             │
│ [➕ Add to User Manager]    │
└─────────────────────────────┘
```

---

## 📡 How It Works

### **Flow:**

```
1. User visits X profile
   ↓
2. Extension detects profile page
   ↓
3. Extracts username & user ID from page
   ↓
4. User clicks "Add to User Manager"
   ↓
5. Sends POST request:
   POST /api/shortcut/add-user
   Headers: X-API-Key: your-key
   Body: {url, username, userId}
   ↓
6. Backend validates API key & saves user
   ↓
7. Success! ✅
```

---

## 🔒 Security

### **API Key Storage:**

- ✅ Stored in Chrome's **sync storage** (encrypted)
- ✅ Syncs across your Chrome devices
- ✅ Never exposed to websites
- ✅ Only used for API requests

### **Permissions:**

- ✅ `activeTab` - Access current tab URL
- ✅ `storage` - Save settings
- ✅ `host_permissions` - Only x.com and twitter.com

---

## 🧪 Testing

### **Test the Extension:**

1. **Configure settings:**
   - API URL: `https://your-api.vercel.app/api`
   - API Key: `your-key`
   - Click "Save Settings"

2. **Visit X profile:**
   - Go to: `https://x.com/elonmusk`

3. **Open extension:**
   - Click extension icon
   - Should see profile data

4. **Add user:**
   - Click "Add to User Manager"
   - Should see: "✅ Added to User Manager!"

5. **Check database:**
   - Verify user appears in your app

---

## 📁 File Structure

```
chrome-extension-api-key/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic & API calls
├── content.js          # Profile data extraction
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

---

## 🎨 Customization

### **Change Extension Name:**

Edit `manifest.json`:
```json
{
  "name": "Your Custom Name",
  "description": "Your description"
}
```

### **Change Colors:**

Edit `popup.html` CSS:
```css
/* Change gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### **Change Icons:**

Replace files in `icons/` folder:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

---

## 🆘 Troubleshooting

### **Extension doesn't show profile data**

✅ Check you're on a profile page (e.g., `x.com/username`)
✅ Not on: home, explore, notifications, messages
✅ Reload the page

### **"Invalid API Key" error**

✅ Check API key is correct
✅ Verify `PERSONAL_API_KEY` is set in Vercel
✅ Redeploy Vercel after adding variable

### **"Connection error" message**

✅ Check API URL is correct
✅ Should end with `/api` (no trailing slash)
✅ Verify Vercel deployment is live

### **User already exists**

✅ This is expected - user is already in database
✅ Check your User Manager web app

### **Extension not extracting User ID**

✅ User ID extraction depends on X's page structure
✅ Username and URL will still work
✅ User ID is optional

---

## 🔄 Updating the Extension

After making changes:

1. Go to `chrome://extensions/`
2. Find **User Manager** extension
3. Click **"Reload"** (circular arrow icon)
4. Changes applied! ✅

---

## 📊 Comparison: Extension vs iOS Shortcut

| Feature | Chrome Extension | iOS Shortcut |
|---------|-----------------|--------------|
| **Platform** | Desktop (Chrome) | Mobile (iOS) |
| **Setup** | Load extension | Create shortcut |
| **Usage** | Click icon | Share sheet |
| **Data Extraction** | Automatic | Manual input |
| **Convenience** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Speed** | Instant | 2-3 seconds |

---

## 🎯 Pro Tips

1. **Pin Extension:** Right-click icon → "Pin" for easy access
2. **Keyboard Shortcut:** Chrome Settings → Extensions → Keyboard shortcuts
3. **Auto-Open:** Extension auto-detects when on profile page
4. **Visual Indicator:** Look for badge in bottom-right corner

---

## 📱 Mobile Alternative

For mobile/iOS, use the **iOS Shortcut** instead:
- See: `IOS_SHORTCUT_GUIDE.md`
- Works from Share Sheet
- Same API endpoint

---

## 🔐 Privacy

**Data Collection:**
- ❌ No tracking
- ❌ No analytics
- ❌ No data sent to third parties
- ✅ Only communicates with YOUR API

**Permissions:**
- ✅ Only accesses x.com and twitter.com
- ✅ Settings stored locally (encrypted)
- ✅ No background processes

---

## ✅ Installation Checklist

Before using:

- [ ] Extract ZIP file
- [ ] Load extension in Chrome
- [ ] Generate API key
- [ ] Add `PERSONAL_API_KEY` to Vercel
- [ ] Redeploy Vercel
- [ ] Configure extension settings
- [ ] Test on X profile page
- [ ] Verify user added to database

---

## 🎨 Icon Assets

Need custom icons? Use these dimensions:

- **icon16.png** - 16x16 pixels (toolbar)
- **icon48.png** - 48x48 pixels (extensions page)
- **icon128.png** - 128x128 pixels (Chrome Web Store)

Tools:
- [Figma](https://figma.com) - Design icons
- [Favicon.io](https://favicon.io) - Generate icons
- [Canva](https://canva.com) - Quick designs

---

## 🚀 Publishing (Optional)

Want to publish to Chrome Web Store?

1. Create [Chrome Web Store Developer Account](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
2. Zip extension folder
3. Upload to Chrome Web Store
4. Fill in description, screenshots
5. Submit for review

**Note:** Not required for personal use!

---

## 📊 API Endpoint Used

```
POST https://your-api.vercel.app/api/shortcut/add-user

Headers:
  X-API-Key: your-personal-api-key
  Content-Type: application/json

Body:
{
  "url": "https://x.com/username",
  "username": "username",
  "title": "@username",
  "userId": "1234567890"
}

Response (Success):
{
  "success": true,
  "message": "User created successfully via iOS Shortcut",
  "user": { ... }
}
```

---

## 🎉 You're All Set!

Your Chrome extension is ready to use! 

**Next Steps:**
1. Configure settings
2. Visit an X profile
3. Click "Add to User Manager"
4. Enjoy! 🚀

**Need help?** Check the troubleshooting section above!
