# Retto — Vercel Deployment Guide

## Prerequisites

- Node.js 20+ installed
- Git repo (GitHub/GitLab/Bitbucket)
- Firebase project set up (see `firebase_setup_guide.md`)
- Vercel account at [vercel.com](https://vercel.com)

---

## Step 1 — Push to GitHub

```bash
cd retto
git init
git add .
git commit -m "Initial commit: Retto opportunity platform"
git remote add origin https://github.com/YOUR_USERNAME/retto.git
git push -u origin main
```

---

## Step 2 — Import to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `retto` repo
4. Framework preset will auto-detect as **Next.js** ✓
5. Click **"Environment Variables"** and add **all** keys from `.env.local`:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | from Firebase |
| `NEXT_PUBLIC_ADMIN_EMAILS` | your Gmail address |

6. Click **"Deploy"**

---

## Step 3 — Add Vercel Domain to Firebase

After deployment, your URL will be something like `retto-xyz.vercel.app`.

1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Authentication → Settings → Authorized domains**
3. Click **"Add domain"**
4. Enter: `retto-xyz.vercel.app` (your actual Vercel URL)
5. Also add any custom domain if you have one

> ⚠️ **This step is critical.** Without it, Google Sign-In will fail in production with an `auth/unauthorized-domain` error.

---

## Step 4 — Deploy Firestore Security Rules

```bash
# In your local retto/ folder
npm install -g firebase-tools
firebase login
firebase init firestore   # Select your existing project, use existing rules file
firebase deploy --only firestore:rules
```

---

## Step 5 — Custom Domain (Optional)

1. In Vercel dashboard → **Domains** → Add your domain
2. Follow DNS configuration instructions
3. Add the custom domain to Firebase Authorized Domains too

---

## Continuous Deployment

Every `git push` to `main` will automatically trigger a new Vercel deployment.

---

## Local Development

```bash
cd retto
npm install
npm run dev     # → http://localhost:3000
```

---

## Build Check

Before pushing, always verify the build succeeds:

```bash
npm run build
npm run type-check
```
