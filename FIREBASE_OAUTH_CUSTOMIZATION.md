# Firebase OAuth Customization - Change Domain to "Abacus Trainer"

## Problem
When users sign in with Google, they see:
> "Choose an account to continue to myabacustrainer-51e6a.firebaseapp.com"

This shows the Firebase project domain. You want it to show "Abacus Trainer" or your website domain.

## Solution: Two-Part Fix

The message shows the **authorized domain**, not just the app name. To fix this, you need to:

### Part 1: Add Your Website Domain to Firebase Authorized Domains

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `myabacustrainer-51e6a`

2. **Navigate to Authentication Settings**
   - Go to **Authentication** → **Settings** tab
   - Scroll down to **"Authorized domains"** section

3. **Add Your Netlify Domain**
   - Click **"Add domain"**
   - Enter: `abacustrainer.netlify.app`
   - Click **"Add"**

4. **If You Have a Custom Domain**
   - Also add your custom domain (e.g., `abacustrainer.com` or `www.abacustrainer.com`)
   - This allows Firebase Auth to work on your custom domain

### Part 2: Update OAuth Consent Screen in Google Cloud Console

The app name shown in Google Sign-In is controlled by the **OAuth consent screen** configuration.

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your Firebase project: `myabacustrainer-51e6a`

2. **Navigate to OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Or direct link: https://console.cloud.google.com/apis/credentials/consent

3. **Update Application Name**
   - Find the **"Application name"** field
   - Change it to: **"Abacus Trainer"**
   - Click **"Save"**

4. **Update Authorized Domains (if shown)**
   - In the OAuth consent screen, look for **"Authorized domains"** section
   - Add: `abacustrainer.netlify.app`
   - Add your custom domain if you have one

5. **Optional: Add Application Logo**
   - Upload your app logo
   - This will appear in the OAuth consent screen

### Important Note About authDomain

**You cannot change the `authDomain` in your code** to use `abacustrainer.netlify.app` because:
- Firebase Authentication requires the `authDomain` to be either:
  - The Firebase project's default domain (`myabacustrainer-51e6a.firebaseapp.com`), OR
  - A custom domain set up in **Firebase Hosting** (not Netlify)

Since you're using Netlify for hosting (not Firebase Hosting), you must keep:
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myabacustrainer-51e6a.firebaseapp.com
```

However, by adding your Netlify domain to Firebase's authorized domains and updating the OAuth consent screen name, Google should show "Abacus Trainer" instead of the Firebase domain.

### Alternative: Use Firebase Hosting with Custom Domain (Advanced)

If you want to completely remove the Firebase domain from the OAuth flow:

1. **Set up Firebase Hosting**
   - Firebase Console → **Hosting** → **Get started**
   - Deploy a simple redirect or your site to Firebase Hosting

2. **Add Custom Domain to Firebase Hosting**
   - Firebase Console → **Hosting** → **Add custom domain**
   - Add your domain (e.g., `abacustrainer.com`)
   - Follow DNS verification steps

3. **Update authDomain**
   - Once custom domain is verified, you can use it as `authDomain`
   - Update `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` to your custom domain

### Current Configuration

Your website is hosted at: `abacustrainer.netlify.app`
Your Firebase project uses:
- **Project ID**: `myabacustrainer-51e6a`
- **Auth Domain**: `myabacustrainer-51e6a.firebaseapp.com` (must stay as is)

### Verification

After updating:
1. Clear browser cache or use incognito mode
2. Try signing in with Google
3. You should see: **"Choose an account to continue to Abacus Trainer"**

### Notes

- Changes may take a few minutes to propagate
- The OAuth consent screen name is separate from the Firebase project name
- For production apps, Google may require app verification for certain changes
- The `authDomain` in your code must remain as the Firebase domain unless you set up Firebase Hosting

