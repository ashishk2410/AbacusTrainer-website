# Deployment Guide - Abacus Trainer Website

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Firebase Project**: Ensure your Firebase project is set up and accessible

## Step 1: Prepare Environment Variables

Before deploying, you need to set up environment variables in Netlify:

### Required Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myabacustrainer-51e6a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myabacustrainer-51e6a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myabacustrainer-51e6a.firebasestorage.app
```

**Important**: These must start with `NEXT_PUBLIC_` to be accessible in the browser.

## Step 2: Deploy to Netlify

### Option A: Deploy via Git (Recommended)

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (Netlify plugin handles this automatically)
   - **Node version**: 18 (or higher)

3. **Deploy**:
   - Netlify will automatically detect the `netlify.toml` configuration
   - The `@netlify/plugin-nextjs` plugin will handle Next.js deployment
   - Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Step 3: Configure Custom Domain

1. **Add Domain in Netlify**:
   - Go to **Site settings** → **Domain management**
   - Click "Add custom domain"
   - Enter your domain name (e.g., `abacustrainer.com`)

2. **Configure DNS**:
   - Netlify will provide DNS records
   - Add these records to your domain registrar:
     - **A Record**: Point to Netlify's IP (provided by Netlify)
     - **CNAME Record**: Point `www` subdomain to your Netlify site
   - Or use Netlify DNS (recommended)

3. **SSL Certificate**:
   - Netlify automatically provisions SSL certificates via Let's Encrypt
   - HTTPS will be enabled automatically once DNS propagates

## Step 4: Update Firebase Configuration (if needed)

If your domain changes, you may need to:

1. **Add Domain to Firebase**:
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add your new custom domain

2. **Update OAuth Redirects** (if using OAuth):
   - Add your new domain to authorized redirect URIs

## Step 5: Verify Deployment

1. **Check Build Logs**:
   - Go to **Deploys** tab in Netlify
   - Verify build completed successfully

2. **Test Functionality**:
   - Visit your domain
   - Test login functionality
   - Verify Firebase connection
   - Check all pages load correctly

## Troubleshooting

### Build Fails

- **Check Node version**: Ensure NODE_VERSION is set to 18 or higher
- **Check environment variables**: Ensure all required variables are set
- **Check build logs**: Look for specific error messages

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Firebase Connection Issues

- Verify environment variables are correct
- Check Firebase project settings
- Ensure domain is added to Firebase authorized domains

### 404 Errors on Routes

- Next.js App Router should handle routing automatically
- Check `netlify.toml` configuration
- Ensure `@netlify/plugin-nextjs` is installed

## Current Configuration

- **Framework**: Next.js 14.2.0
- **Node Version**: 18
- **Build Command**: `npm run build`
- **Publish Directory**: `.next` (handled by Netlify plugin)
- **Plugin**: `@netlify/plugin-nextjs`

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Build successful
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Firebase domain authorized
- [ ] All pages accessible
- [ ] Login functionality working
- [ ] Dashboard pages loading correctly
- [ ] FAQ, Terms, Privacy Policy pages working

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Verify Firebase configuration
4. Ensure all environment variables are set correctly

