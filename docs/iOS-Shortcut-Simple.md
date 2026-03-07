# iOS Shortcut: Save X Profile (Simple Version)

## What This Does

When you share an X profile (e.g., `https://x.com/elonmusk`), this shortcut will:
1. Extract the **username** (e.g., `elonmusk`)
2. Save it to your Link Manager database
3. Takes **less than 1 second** ⚡

## Quick Setup (5 Minutes)

### Step 1: Create the Shortcut

1. Open **Shortcuts** app on iPhone
2. Tap **"+"** (top right)
3. Tap **"Add Action"**
4. Follow these 6 actions in order:

---

## Shortcut Actions

### **Action 1: Receive URLs**
- Search for: **"Receive"**
- Add: **"Receive URLs from Share Sheet"**
- This gets the profile URL from X

### **Action 2: Get Component**
- Search for: **"Get Component"**
- Add: **"Get Component from URL"**
- Change dropdown to: **"Path"**
- Input: **Shortcut Input**
- This extracts `/username` from the URL

### **Action 3: Replace Text**
- Search for: **"Replace"**
- Add: **"Replace Text"**
- Find: `/` (forward slash)
- Replace with: (leave blank/empty)
- Regular Expression: **OFF** (leave toggle off)
- This removes the `/` to get just `username`

### **Action 4: Set Variable**
- Search for: **"Set Variable"**
- Add: **"Set Variable"**
- Variable name: `Username`
- Value: **Replaced Text**
- This stores the username for later use

### **Action 5: Get Contents of URL**
- Search for: **"Get Contents"**
- Add: **"Get Contents of URL"**
- Configure it:
  
  **URL:** `https://your-project.vercel.app/api/add-link`
  
  **Method:** **POST**
  
  **Headers:** (tap "Add new field")
  - Key: `Content-Type`
  - Value: `application/json`
  
  **Request Body:** **JSON**
  - Tap in the body field
  - Type:
    ```json
    {
      "url": "",
      "username": "",
      "title": ""
    }
    ```
  - Now replace the empty values:
    - After `"url":` → tap variable button → select **Shortcut Input**
    - After `"username":` → tap variable button → select **Username**
    - After `"title":` → type `@` then tap variable button → select **Username**
  
  Final result should look like:
  ```json
  {
    "url": Shortcut Input,
    "username": Username,
    "title": @Username
  }
  ```

### **Action 6: Show Notification**
- Search for: **"Show Notification"**
- Add: **"Show Notification"**
- Message: Type `Saved @` then tap variable button → select **Username** → type ` to reading list! ✅`

---

## Step 2: Configure Settings

1. Tap the shortcut name at the top
2. Rename to: **"Save X Profile"**
3. Tap the **"i"** info button
4. Enable these settings:
   - ✅ **Show in Share Sheet**
   - ✅ **URLs** (under "Share Sheet Types")
5. (Optional) Choose an icon - I suggest the bookmark or person icon
6. Tap **Done**

---

## Step 3: Update Your Backend URL

In **Action 5**, replace:
- `https://your-project.vercel.app/api/add-link`

With your actual backend URL:
- **Local (development):** `http://localhost:3001/api/links`
- **Cloud (production):** `https://your-actual-app.vercel.app/api/add-link`

---

## How to Use It

### From X App:

1. Open any X profile:
   - `https://x.com/elonmusk`
   - `https://x.com/jack`
   - `https://x.com/anyone`

2. Tap the **Share** button (usually three dots → Share)

3. Scroll down and tap **"Save X Profile"**

4. See notification: **"Saved @username to reading list! ✅"**

5. Done! The profile is saved to your database.

---

## What Gets Saved

When you save `https://x.com/elonmusk`:

```json
{
  "url": "https://x.com/elonmusk",
  "username": "elonmusk",
  "title": "@elonmusk",
  "createdAt": "2026-03-07T12:00:00.000Z",
  "isRead": false
}
```

---

## Testing

### Test with these profiles:

1. **@jack** → `https://x.com/jack`
2. **@elonmusk** → `https://x.com/elonmusk`
3. **Your own profile** → Share it and test!

### Expected behavior:

- Shortcut runs in **less than 1 second**
- Notification appears immediately
- Check your Link Manager to see the saved profile

---

## Backend Update (Optional)

Your existing backend already supports this! No changes needed.

### For Express (server.js):
The `POST /api/links` endpoint accepts `username` field - already works! ✅

### For Serverless (add-link.js):
Already updated to accept `username` field - ready to go! ✅

---

## Troubleshooting

### **"Shortcut doesn't appear in Share Sheet"**
- Go to Shortcuts app → Your shortcut → Info (i button)
- Make sure "Show in Share Sheet" is **ON**
- Make sure "URLs" is checked under "Share Sheet Types"

### **"Nothing happens when I tap the shortcut"**
- Check the backend URL in Action 5
- Make sure your backend is running (if using local Express)
- Try testing the API directly in Safari

### **"Error saving link"**
- Your backend might be sleeping (if using Render free tier)
- Wait 30 seconds and try again
- Check that you're connected to internet

### **"Username is wrong or empty"**
- Make sure you're sharing a profile URL, not a tweet
- Profile URLs look like: `https://x.com/username`
- Tweet URLs look like: `https://x.com/username/status/123...`

---

## Pro Tips

### 1. **Add to Home Screen**
- Long-press the shortcut in Shortcuts app
- Tap "Add to Home Screen"
- Now you can run it without opening Shortcuts app!

### 2. **Siri Integration**
- Say: **"Hey Siri, Save X Profile"**
- Siri will ask you to share the URL
- Just paste the profile link!

### 3. **Batch Save Multiple Profiles**
- Save 10 profiles in a row
- Review them all later in your Link Manager
- Perfect for conference attendees, interesting people, etc.

### 4. **Create Categories**
Later you can enhance to add tags:
- "Tech Leaders"
- "Researchers"
- "Competitors"
- "Potential Collaborators"

---

## Different URLs This Works With

The shortcut works with all these formats:

✅ `https://x.com/username`  
✅ `https://twitter.com/username`  
✅ `https://x.com/username/` (with trailing slash)  
✅ `http://x.com/username` (without https)  

It extracts the username from all of them correctly!

---

## View Saved Profiles

In your **Link Manager**:

1. All saved profiles appear in your links list
2. Filter by `username` field (if you add filters)
3. Each profile shows:
   - Username: `@elonmusk`
   - URL: Clickable link to profile
   - Saved date
   - Read/unread status

---

## Example Workflow

**Use Case: Conference Networking**

1. At a conference, someone mentions their X handle
2. Open X app → Search for their profile
3. Tap Share → "Save X Profile"
4. Done in 2 seconds!
5. Later, review all saved profiles and decide who to follow

**Use Case: Research**

1. Reading article that quotes someone
2. Look them up on X
3. Save their profile to review later
4. Build a list of experts in your field

---

## Summary

✅ **Setup time:** 5 minutes (one time)  
✅ **Save time:** 1 second per profile  
✅ **Works:** X app + Safari  
✅ **Stores:** URL, username, title  
✅ **Speed:** Instant - no waiting  
✅ **Backend:** No changes needed  

You can now save X profiles from your iPhone as fast as you can tap! 🚀

---

## Next Steps

After you've saved some profiles, you can enhance your Link Manager to:

1. **Show avatars** - Fetch profile pictures
2. **Add follower count** - Track who's growing
3. **Categorize** - Add tags like "Tech", "News", etc.
4. **Export list** - Download CSV of all saved profiles
5. **Bulk follow** - Follow multiple profiles at once

But for now, start simple - just save the profiles! 📱✨
