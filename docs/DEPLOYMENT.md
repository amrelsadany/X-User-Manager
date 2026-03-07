# Vercel Deployment Guide - Monorepo

## Overview

This monorepo contains **frontend** and **backend** in separate folders. You'll deploy them as **two separate Vercel projects** from the same GitHub repo.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/linkmanager.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `linkmanager`
4. **IMPORTANT:** Click "Configure Project"
5. Set **Root Directory** to: `backend`
6. Add Environment Variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/linkmanager`
7. Click "Deploy"
8. Wait for deployment (30-60 seconds)
9. **Copy your backend URL:** `https://linkmanager-api-xyz.vercel.app`

### Step 3: Deploy Frontend

1. Go to https://vercel.com/new again
2. Click "Import Project"
3. Select the **same** GitHub repository: `linkmanager`
4. **IMPORTANT:** Click "Configure Project"
5. Set **Root Directory** to: `frontend`
6. No environment variables needed for frontend
7. Click "Deploy"
8. Wait for deployment (30-60 seconds)
9. **Your frontend is live:** `https://linkmanager-xyz.vercel.app`

### Step 4: Connect Frontend to Backend

1. Edit `frontend/LinkManager-NoTailwind.jsx`
2. Find line ~15 (the getApiBaseUrl function)
3. Update the production URL:

```javascript
} else {
  // Change this:
  return 'https://your-project.vercel.app/api';
  
  // To your actual backend URL:
  return 'https://linkmanager-api-xyz.vercel.app/api';
}
```

4. Commit and push:
```bash
git add frontend/LinkManager-NoTailwind.jsx
git commit -m "Update backend URL"
git push
```

5. Vercel will **auto-deploy** frontend with new changes
6. Done! ✅

## 🔄 How Auto-Deployment Works

**When you push to GitHub:**

- Changes in `frontend/` → Triggers frontend deployment
- Changes in `backend/` → Triggers backend deployment
- Changes in both → Both deploy independently

**Deployment time:** ~30 seconds each

## 📊 Vercel Dashboard

You'll see **two projects** in your Vercel dashboard:

1. **linkmanager** (frontend)
   - Root: `frontend/`
   - URL: `https://linkmanager-xyz.vercel.app`

2. **linkmanager-api** (or similar name)
   - Root: `backend/`
   - URL: `https://linkmanager-api-xyz.vercel.app`

You can rename these in Vercel settings if you want.

## 🗄️ MongoDB Atlas Setup

### Create Free Cluster

1. Go to https://cloud.mongodb.com
2. Create free account
3. Create cluster (M0 Free tier)
4. Click "Connect"
5. Add connection IP: `0.0.0.0/0` (allow from anywhere)
6. Create database user
7. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/linkmanager
   ```

### Add to Vercel

1. Go to backend project in Vercel
2. Settings → Environment Variables
3. Add:
   - Name: `MONGODB_URI`
   - Value: your connection string
   - Environments: Production, Preview, Development
4. Save
5. Redeploy if needed

## ✅ Verification

### Test Backend
```bash
curl https://YOUR-BACKEND-URL.vercel.app/api/links
```

Should return: `[]` (empty array)

### Test Adding Link
```bash
curl -X POST https://YOUR-BACKEND-URL.vercel.app/api/add-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://x.com/jack","username":"jack"}'
```

Should return: The created link object

### Test Frontend

1. Open: `https://YOUR-FRONTEND-URL.vercel.app`
2. Add a link
3. Check it appears in the list
4. Test marking as read
5. Test deleting

## 🐛 Troubleshooting

### Backend deployment fails
- Check `backend/package.json` exists
- Verify `backend/vercel.json` is configured
- Check build logs in Vercel dashboard

### Frontend can't connect to backend
- Verify backend URL in `LinkManager-NoTailwind.jsx`
- Check CORS is enabled in backend
- Check backend is deployed successfully

### MongoDB connection error
- Verify connection string in environment variables
- Check IP allowlist includes `0.0.0.0/0`
- Test connection string locally first

### Changes not deploying
- Check GitHub push was successful
- Check Vercel dashboard for deployment status
- Try manual redeploy in Vercel

## 🔧 Custom Domains (Optional)

### Backend
1. Go to backend project → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS records as shown
4. Update frontend to use new domain

### Frontend
1. Go to frontend project → Settings → Domains
2. Add custom domain: `yourdomain.com`
3. Update DNS records as shown

## 📈 Monitoring

**View Logs:**
1. Vercel Dashboard → Your Project
2. Click on deployment
3. View "Functions" tab for API logs
4. View "Logs" for real-time monitoring

**Check Performance:**
- Vercel Analytics (free tier)
- Monitor response times
- Track errors

## 💡 Tips

1. **Use separate branches:**
   - `main` → Production
   - `dev` → Preview deployments

2. **Preview deployments:**
   - Every PR gets a preview URL
   - Test before merging to main

3. **Environment variables:**
   - Set different values for Production/Preview
   - Use Vercel secrets for sensitive data

4. **Rollback:**
   - Can rollback to any previous deployment
   - Instant rollback in Vercel dashboard

## 🎉 You're Live!

Your app is now deployed with:

✅ Backend on Vercel Serverless  
✅ Frontend on Vercel  
✅ MongoDB Atlas database  
✅ Auto-deployment on git push  
✅ HTTPS by default  
✅ Global CDN  

Time to share your URL! 🚀
