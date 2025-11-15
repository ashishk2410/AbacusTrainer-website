# Quick Deployment Guide - Netlify

## 🚀 Quick Steps to Deploy

### Step 1: Push Code to Git (if not already done)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Set Up Netlify Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. If you don't have a site yet:
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect your Git repository (GitHub/GitLab/Bitbucket)
3. Go to **Site settings** → **Environment variables**
4. Add these 4 variables (click "Add variable" for each):

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = myabacustrainer-51e6a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = myabacustrainer-51e6a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = myabacustrainer-51e6a.firebasestorage.app
```

**Important**: 
- Set scope to **"All scopes"** (Builds, Functions, Runtime)
- Variable names are case-sensitive
- No spaces around the `=` sign

5. Add one more variable for secrets scanning:
```
SECRETS_SCAN_OMIT_KEYS = NEXT_PUBLIC_FIREBASE_API_KEY
```

### Step 3: Configure Build Settings

Netlify should auto-detect from `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `.next` (handled by plugin)
- **Node version**: 18

### Step 4: Deploy

**Option A: Automatic (Recommended)**
- If connected to Git, Netlify will auto-deploy on every push
- Go to **Deploys** tab → Click **"Trigger deploy"** → **"Deploy site"**

**Option B: Manual via CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Step 5: Verify Deployment

1. Check **Deploys** tab - build should complete successfully ✅
2. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
3. Test:
   - ✅ Homepage loads
   - ✅ Login works
   - ✅ FAQ page works
   - ✅ Dashboard loads after login

### Step 6: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `abacustrainer.com`)
4. Follow DNS setup instructions
5. SSL certificate will be auto-provisioned

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to Git
- [ ] All 4 Firebase environment variables set in Netlify
- [ ] `SECRETS_SCAN_OMIT_KEYS` variable set
- [ ] Build settings configured
- [ ] Ready to deploy!

## 🐛 Common Issues

**Build fails?**
- Check environment variables are set correctly
- Verify Node version is 18
- Check build logs for specific errors

**Firebase errors after deployment?**
- Verify all `NEXT_PUBLIC_*` variables are set
- Redeploy after adding variables
- Check browser console for errors

**404 errors?**
- Next.js routing should work automatically
- Check `netlify.toml` is present
- Verify `@netlify/plugin-nextjs` is in `package.json`

## 📝 Current Configuration

- **Framework**: Next.js 14.2.0
- **Build**: `npm run build`
- **Plugin**: `@netlify/plugin-nextjs` (auto-installed)
- **Node**: 18

---

**That's it! Your site should be live in a few minutes.** 🎉

