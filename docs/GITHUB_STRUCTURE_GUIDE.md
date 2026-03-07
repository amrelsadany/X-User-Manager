# GitHub Structure for Vercel Deployment

## ✅ Recommended Structure (Monorepo)

```
linkmanager/  (GitHub repository)
│
├── README.md              # Main documentation
├── DEPLOYMENT.md          # Deployment guide
├── .gitignore            # Git ignore rules
│
├── frontend/             # React app
│   ├── index.html
│   ├── LinkManager-NoTailwind.jsx
│   └── README.md
│
└── backend/              # Serverless API
    ├── api/
    │   ├── links.js
    │   ├── add-link.js
    │   ├── delete-link.js
    │   ├── mark-read.js
    │   └── get-user-id.js
    ├── lib/
    │   └── db.js
    ├── models/
    │   └── Link.js
    ├── package.json
    ├── vercel.json
    └── README.md
```

---

## 🚀 How Deployment Works

### One Repo → Two Vercel Projects

```
GitHub Repo: linkmanager
        ↓
    ┌───┴───┐
    ↓       ↓
Backend    Frontend
Deploy     Deploy
    ↓       ↓
Root:      Root:
backend/   frontend/
    ↓       ↓
URL:       URL:
api.com    app.com
```

### Vercel Dashboard View

```
Your Vercel Projects:
┌─────────────────────────────────┐
│ linkmanager                     │
│ Root: frontend/                 │
│ URL: linkmanager.vercel.app     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ linkmanager-api                 │
│ Root: backend/                  │
│ URL: linkmanager-api.vercel.app │
└─────────────────────────────────┘
```

---

## 📝 Step-by-Step Visual Guide

### Step 1: Push to GitHub

```bash
linkmanager/
├── frontend/
└── backend/
      ↓
   git push
      ↓
GitHub: github.com/you/linkmanager
```

### Step 2: Deploy Backend

```
Vercel Dashboard
      ↓
Import Project
      ↓
Select: linkmanager repo
      ↓
Set Root Directory: backend  ← IMPORTANT!
      ↓
Add Env Var: MONGODB_URI
      ↓
Deploy
      ↓
✅ https://linkmanager-api.vercel.app
```

### Step 3: Deploy Frontend

```
Vercel Dashboard
      ↓
Import Project (again)
      ↓
Select: linkmanager repo (same repo!)
      ↓
Set Root Directory: frontend  ← IMPORTANT!
      ↓
Deploy
      ↓
✅ https://linkmanager.vercel.app
```

### Step 4: Connect Them

```
Edit: frontend/LinkManager-NoTailwind.jsx
      ↓
Update line 15 with backend URL
      ↓
git push
      ↓
Frontend auto-redeploys
      ↓
✅ Connected!
```

---

## 🔄 Auto-Deployment Flow

### When you push changes:

```
git push to main
        ↓
    GitHub receives
        ↓
   ┌────┴────┐
   ↓         ↓
Changed     Changed
frontend?   backend?
   ↓         ↓
  Yes       Yes
   ↓         ↓
Redeploy   Redeploy
Frontend   Backend
   ↓         ↓
  30s       30s
   ↓         ↓
  Live!     Live!
```

---

## 📊 Vercel Project Settings

### Backend Project Settings

```
Project Name: linkmanager-api
Root Directory: backend/
Build Command: (auto-detected)
Output Directory: (not needed - serverless)

Environment Variables:
  MONGODB_URI = mongodb+srv://...
```

### Frontend Project Settings

```
Project Name: linkmanager
Root Directory: frontend/
Build Command: (none - static files)
Output Directory: .

Environment Variables:
  (none needed)
```

---

## 🌐 URL Structure

### Production URLs

```
Frontend:  https://linkmanager.vercel.app
           │
           └─ Calls API at ─→ https://linkmanager-api.vercel.app/api/links
                                                                    │
                                                                    └─ /api/add-link
                                                                    └─ /api/delete-link
```

### With Custom Domains

```
Frontend:  https://yourdomain.com
           │
           └─ Calls API at ─→ https://api.yourdomain.com/api/links
```

---

## 📁 Alternative Structures

### Alternative 1: Separate Repos (Not Recommended)

```
linkmanager-frontend/  (Repo 1)
└── All frontend files

linkmanager-backend/   (Repo 2)
└── All backend files
```

**Pros:** Complete separation
**Cons:** Harder to manage, sync changes

### Alternative 2: All in Root (Not Recommended)

```
linkmanager/
├── api/
├── lib/
├── models/
├── index.html
├── LinkManager.jsx
└── vercel.json
```

**Pros:** Single deployment
**Cons:** Messy structure, harder to maintain

---

## ✅ Best Practices

### 1. Use Monorepo Structure (Recommended)
```
✅ Clean organization
✅ Easy to manage
✅ Independent deployments
✅ Shared repo for related code
```

### 2. Separate Deployments
```
✅ Backend deploys independently
✅ Frontend deploys independently
✅ Can rollback separately
✅ Different update frequencies
```

### 3. Environment Variables
```
✅ Backend: Set in Vercel Dashboard
✅ Frontend: Hardcoded API URL
✅ Never commit .env files
✅ Use different values for dev/prod
```

---

## 🎯 Summary

**Structure:**
```
One GitHub Repo
  ├── frontend/
  └── backend/
```

**Deployment:**
```
Two Vercel Projects
  ├── Project 1: Root = frontend/
  └── Project 2: Root = backend/
```

**URLs:**
```
Frontend: linkmanager.vercel.app
Backend:  linkmanager-api.vercel.app
```

**That's it!** Simple, clean, and works perfectly. 🚀
