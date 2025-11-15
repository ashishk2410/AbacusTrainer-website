# Troubleshooting: "Firebase is not configured" Error

## Issue
You're seeing the error "Firebase is not configured. Please contact support to set up the environment variables" even though you've set the environment variables in Netlify.

## Common Causes & Solutions

### 1. **Site Needs to be Redeployed** ⚠️ MOST COMMON

**Problem**: Environment variables are only embedded into the Next.js bundle at **build time**. If you set the variables after the last build, they won't be available until you trigger a new deployment.

**Solution**:
1. Go to Netlify Dashboard → **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete
4. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### 2. **Environment Variables Not Set for All Scopes**

**Problem**: Your `NEXT_PUBLIC_FIREBASE_API_KEY` shows "Scoped to Builds, Functions, Runtime · 1 value in 1 deploy context" which might limit availability.

**Solution**:
1. Go to **Site settings** → **Environment variables**
2. Click on `NEXT_PUBLIC_FIREBASE_API_KEY`
3. Click **Edit**
4. Under **Scopes**, make sure **All scopes** is selected (or at least **Builds** and **Runtime**)
5. Save and redeploy

### 3. **Variable Names or Values Incorrect**

**Problem**: Typos in variable names or missing/incorrect values.

**Solution**: Verify all 4 variables are set exactly as:
- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `myabacustrainer-51e6a.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `myabacustrainer-51e6a`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `myabacustrainer-51e6a.firebasestorage.app`

**Important**: 
- Variable names are **case-sensitive**
- Must start with `NEXT_PUBLIC_`
- No extra spaces before or after the values

### 4. **Browser Cache**

**Problem**: Your browser might be serving a cached version of the site.

**Solution**:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely
- Or use Incognito/Private browsing mode

### 5. **Check Build Logs**

**How to verify variables are being read**:
1. Go to Netlify Dashboard → **Deploys** tab
2. Click on the latest deploy
3. Check the build logs for any errors
4. Look for messages about environment variables

## Quick Checklist

- [ ] All 4 Firebase environment variables are set in Netlify
- [ ] All variables are scoped to "All scopes" or at least "Builds" and "Runtime"
- [ ] Variable names are exactly correct (case-sensitive, with `NEXT_PUBLIC_` prefix)
- [ ] Values are correct (no extra spaces)
- [ ] Site has been redeployed AFTER setting the variables
- [ ] Browser cache has been cleared
- [ ] Build completed successfully (check Deploys tab)

## Still Not Working?

If you've completed all steps above and it's still not working:

1. **Check the browser console** (F12 → Console tab) for any error messages
2. **Check Netlify build logs** for any warnings or errors
3. **Verify the deployment** shows the variables in the "Resolved config" section of build logs
4. **Try accessing the site in an incognito window** to rule out caching

## Expected Behavior After Fix

Once properly configured:
- Login page should work (no "Firebase is not configured" error)
- You should be able to log in with valid credentials
- Dashboard pages should load
- No console errors about missing Firebase variables

