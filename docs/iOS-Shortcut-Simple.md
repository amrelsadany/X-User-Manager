# iOS Shortcut: Save X Profile (Updated for /api/users)

## Quick Setup

### Step 1: Create the Shortcut

1. Open **Shortcuts** app on iPhone
2. Tap **"+"** (top right)
3. Add these actions:

**Action 1: Receive URLs from Share Sheet**

**Action 2: Get Component from URL** → Path

**Action 3: Replace Text**
- Find: `/`
- Replace with: (empty)

**Action 4: Set Variable**  
- Name: `Username`

**Action 5: Get Contents of URL**
- URL: `https://your-backend.vercel.app/api/add-user` (or `http://localhost:3001/api/users` for local)
- Method: **POST**
- Headers:
  - `Content-Type`: `application/json`
- Body (JSON):
```json
{
  "url": "Shortcut Input",
  "username": "Username",
  "title": "@Username"
}
```

**Action 6: Show Notification**
- Message: `Saved @Username! ✅`

### Step 2: Configure

1. Tap shortcut name → Rename to **"Save X Profile"**
2. Tap info (i) → Enable **"Show in Share Sheet"**
3. Select **"URLs"** as input type

## API Endpoints

### Express (Local):
```
POST http://localhost:3001/api/users
```

### Serverless (Vercel):
```
POST https://your-app.vercel.app/api/add-user
```

## Usage

1. Open X profile (e.g., `https://x.com/elonmusk`)
2. Tap Share
3. Tap "Save X Profile"
4. Done! ✅

## What Gets Saved

```json
{
  "url": "https://x.com/elonmusk",
  "username": "elonmusk",
  "title": "@elonmusk",
  "isRead": false,
  "createdAt": "2026-03-07..."
}
```
