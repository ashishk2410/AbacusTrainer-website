# Netlify Environment Variables Setup Guide

## Quick Setup Steps

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site: `abacustrainer` (or your site name)

2. **Navigate to Environment Variables**
   - Click on **Site settings** (gear icon)
   - Scroll down to **Environment variables** section
   - Click **Add variable**

3. **Add Each Variable One by One**

   Click "Add variable" for each of these:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM`
   - Scope: All scopes (or Production)

   **Variable 2:**
   - Key: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - Value: `myabacustrainer-51e6a.firebaseapp.com`
   - Scope: All scopes (or Production)

   **Variable 3:**
   - Key: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - Value: `myabacustrainer-51e6a`
   - Scope: All scopes (or Production)

   **Variable 4:**
   - Key: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - Value: `myabacustrainer-51e6a.firebasestorage.app`
   - Scope: All scopes (or Production)

4. **Trigger New Deployment**
   - After adding all variables, go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - OR wait for the next automatic deployment

## Verification

After deployment, check:
- Login page should work (not show configuration error)
- Dashboard pages should load
- No console errors about missing Firebase variables

## Troubleshooting

**If variables are set but still not working:**
1. Make sure variable names are EXACT (case-sensitive):
   - `NEXT_PUBLIC_FIREBASE_API_KEY` (not `NEXT_PUBLIC_FIREBASE_APIKEY`)
   - All must start with `NEXT_PUBLIC_`
2. Check variable values don't have extra spaces
3. Redeploy after adding variables
4. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Visual Guide

```
Netlify Dashboard
  └─ Your Site
      └─ Site settings (⚙️)
          └─ Build & deploy
              └─ Environment variables
                  └─ Add variable (for each of the 4 variables)
```

## Important Notes

- **Variable names must start with `NEXT_PUBLIC_`** for Next.js to include them in the client bundle
- Variables are case-sensitive
- After adding variables, you MUST trigger a new deployment
- Variables are available during build time and runtime

