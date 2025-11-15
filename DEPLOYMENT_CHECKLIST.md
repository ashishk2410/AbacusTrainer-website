# Quick Deployment Checklist

## Before Deploying

### 1. Environment Variables Setup
Add these in Netlify Dashboard → Site settings → Environment variables:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

### 2. Git Repository
- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] All changes are committed

### 3. Local Build Test
Run locally to ensure everything works:
```bash
npm install
npm run build
```

## Deployment Steps

### Option 1: Netlify Dashboard (Easiest)

1. [ ] Go to [app.netlify.com](https://app.netlify.com)
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Connect your Git repository
4. [ ] Netlify will auto-detect Next.js and `netlify.toml`
5. [ ] Add environment variables (see above)
6. [ ] Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## After Deployment

### 1. Verify Build
- [ ] Check build logs - no errors
- [ ] Site is live on Netlify subdomain

### 2. Test Functionality
- [ ] Homepage loads
- [ ] Navigation links work (#features, #how-it-works, #pricing)
- [ ] FAQ page works (/faq)
- [ ] Terms page works (/terms)
- [ ] Privacy Policy works (/privacy-policy)
- [ ] Login page works
- [ ] Firebase connection works (check browser console)

### 3. Custom Domain Setup
- [ ] Add domain in Netlify Dashboard
- [ ] Configure DNS records at your domain registrar
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] SSL certificate auto-provisioned by Netlify

### 4. Firebase Configuration
- [ ] Add custom domain to Firebase Authorized Domains
  - Firebase Console → Authentication → Settings → Authorized domains
- [ ] Update any OAuth redirect URIs if needed

## Current Status

- **Framework**: Next.js 14.2.0 ✅
- **Netlify Config**: `netlify.toml` ✅
- **Build Command**: `npm run build` ✅
- **Node Version**: 18 ✅
- **Plugin**: `@netlify/plugin-nextjs` ✅

## Quick Commands

```bash
# Install dependencies
npm install

# Test build locally
npm run build

# Run development server
npm run dev

# Deploy to Netlify (if using CLI)
netlify deploy --prod
```

## Troubleshooting

**Build fails?**
- Check Node version (should be 18+)
- Verify all environment variables are set
- Check build logs for specific errors

**Environment variables not working?**
- Must start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

**404 errors?**
- Next.js App Router handles routing automatically
- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` configuration

