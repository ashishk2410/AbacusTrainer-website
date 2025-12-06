# Cookie Consent Implementation

## Overview

A comprehensive cookie consent system has been implemented that:
- ✅ Shows a cookie consent banner to users
- ✅ Respects user's choice (Accept/Reject)
- ✅ Only enables Google Analytics if user accepts
- ✅ Stores consent preference for 365 days
- ✅ Complies with GDPR/CCPA requirements
- ✅ Provides detailed cookie information

## Features

### 1. Cookie Consent Banner
- Appears at the bottom of the page on first visit
- Non-intrusive design matching site theme
- Three action buttons:
  - **Reject All** - Disables all tracking cookies
  - **Customize** - Shows detailed cookie information
  - **Accept All** - Enables all cookies including Google Analytics

### 2. Consent Management
- Consent preference stored in `localStorage` for 365 days
- Automatically expires after 1 year (user will see banner again)
- Respects user choice across all pages

### 3. Google Analytics Integration
- **Only loads if user accepts cookies**
- Automatically disabled if user rejects
- Uses Google Consent Mode v2 for proper compliance
- Respects consent state changes in real-time

### 4. Tracking Behavior
- Button click tracking only works if cookies accepted
- Page time tracking only works if cookies accepted
- All tracking respects user's consent choice

## Files Created

1. **`contexts/CookieConsentContext.tsx`**
   - Manages cookie consent state
   - Stores/retrieves consent from localStorage
   - Provides consent status to components

2. **`components/CookieConsentBanner.tsx`**
   - Cookie consent banner UI
   - Accept/Reject/Customize buttons
   - Detailed cookie information

3. **`GOOGLE_ANALYTICS_AUDIENCES_SETUP.md`** (updated)
   - Documentation for audiences setup

## Files Modified

1. **`app/layout.tsx`**
   - Added `CookieConsentProvider` wrapper
   - Added `CookieConsentBanner` component

2. **`components/GoogleAnalytics.tsx`**
   - Only loads if user accepts cookies
   - Uses Google Consent Mode v2
   - Listens for consent changes

3. **`components/PageTracking.tsx`**
   - Simplified to always call hooks (hooks check consent internally)

4. **`hooks/useButtonTracking.ts`**
   - Checks cookie consent before tracking
   - Returns early if consent not given

5. **`hooks/usePageTracking.ts`**
   - Checks cookie consent before tracking
   - Returns early if consent not given

6. **`style.css`**
   - Added comprehensive styling for cookie banner
   - Responsive design for mobile/tablet
   - Smooth animations

## How It Works

### Initial Load
1. User visits website
2. System checks for existing consent in localStorage
3. If no consent found, banner appears
4. If consent found and valid, banner hidden

### User Accepts Cookies
1. User clicks "Accept All"
2. Consent stored in localStorage with 365-day expiry
3. Custom event dispatched: `cookieConsentChanged`
4. Google Analytics loads and initializes
5. Button and page tracking enabled
6. Banner disappears

### User Rejects Cookies
1. User clicks "Reject All"
2. Consent stored as "rejected" in localStorage
3. Google Analytics does NOT load
4. All tracking disabled
5. Banner disappears

### Consent Expiry
- After 365 days, consent expires
- Banner reappears on next visit
- User can update their preference

## Cookie Types Explained

### Essential Cookies
- Required for website functionality
- Always enabled (cannot be disabled)
- No tracking involved

### Analytics Cookies
- Google Analytics tracking
- Anonymous usage data
- Only enabled if user accepts

### Marketing Cookies
- Ad personalization
- Campaign tracking
- Only enabled if user accepts

## Privacy Compliance

### GDPR Compliance
- ✅ Clear consent request
- ✅ Granular control (Accept/Reject)
- ✅ Information about cookie types
- ✅ Easy to withdraw consent (clear localStorage)
- ✅ No tracking without consent

### CCPA Compliance
- ✅ "Do Not Sell" option (Reject All)
- ✅ Clear disclosure of data collection
- ✅ User control over data sharing

## Testing

### Test Accept Flow
1. Clear browser localStorage
2. Refresh page
3. Click "Accept All"
4. Verify:
   - Banner disappears
5. Check Network tab for Google Analytics requests
6. Check localStorage for `cookie-consent` entry

### Test Reject Flow
1. Clear browser localStorage
2. Refresh page
3. Click "Reject All"
4. Verify:
   - Banner disappears
   - No Google Analytics requests in Network tab
   - localStorage has `cookie-consent: "rejected"`

### Test Customize Flow
1. Clear browser localStorage
2. Refresh page
3. Click "Customize"
4. Verify:
   - Detailed cookie information appears
   - Can still Accept/Reject

### Test Persistence
1. Accept cookies
2. Navigate to different pages
3. Verify:
   - Banner does not reappear
   - Tracking continues to work
   - Consent persists across sessions

## Customization

### Change Consent Expiry
Edit `contexts/CookieConsentContext.tsx`:
```typescript
const CONSENT_EXPIRY_DAYS = 365 // Change to desired days
```

### Modify Banner Text
Edit `components/CookieConsentBanner.tsx`:
- Update the description text
- Modify cookie type descriptions
- Change button labels

### Styling
Edit `style.css`:
- Search for `.cookie-consent-banner`
- Modify colors, spacing, animations
- Adjust responsive breakpoints

## User Experience

### Banner Appearance
- Slides up from bottom with smooth animation
- Fixed position (stays visible while scrolling)
- High z-index (appears above all content)
- Responsive design (mobile-friendly)

### Banner Behavior
- Only shows once per consent period
- Can be dismissed by Accept/Reject
- Shows detailed info on "Customize" click
- Links to privacy policy for more information

## Technical Details

### localStorage Structure
```json
{
  "consent": "accepted" | "rejected",
  "expiry": "2025-01-01T00:00:00.000Z",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Event System
- Custom event: `cookieConsentChanged`
- Dispatched when consent changes
- Google Analytics listens and responds

### Google Consent Mode
- Uses Consent Mode v2
- Properly sets consent states
- Respects user choice for all Google services

## Troubleshooting

### Banner Not Appearing
- Check if consent already exists in localStorage
- Clear localStorage and refresh
- Check browser console for errors

### Analytics Not Working After Accept
- Verify Google Analytics script loads (Network tab)
- Check browser console for errors
- Verify consent is "accepted" in localStorage

### Banner Appears Every Time
- Check localStorage expiry date
- Verify consent data structure
- Check for JavaScript errors

## Next Steps

1. ✅ Code implementation complete
2. ⚠️ **Optional**: Add cookie preference page for granular control
3. ⚠️ **Optional**: Add cookie consent analytics (track accept/reject rates)
4. ⚠️ **Recommended**: Update privacy policy with cookie details
5. ⚠️ **Recommended**: Test on production with real users

## Support

For questions or issues:
- Check browser console for errors
- Verify localStorage contents
- Test in incognito/private mode
- Review Google Analytics Real-Time reports

