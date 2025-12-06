# Google Analytics Setup

## Overview

Google Analytics has been successfully integrated into your Next.js website with comprehensive tracking for:
- ✅ **Button Clicks** - All button clicks are automatically tracked
- ✅ **Page Visits** - Automatic page view tracking on navigation
- ✅ **Time on Page** - Tracks how long users spend on each page

## Implementation Details

### Files Created

1. **`lib/analytics.ts`** - Core analytics utility functions
   - `initGA()` - Initializes Google Analytics
   - `pageview(url)` - Tracks page views
   - `trackButtonClick()` - Tracks button clicks with details
   - `trackEvent()` - Generic event tracking
   - `trackTimeOnPage()` - Tracks time spent on pages

2. **`components/GoogleAnalytics.tsx`** - Google Analytics script component
   - Loads the gtag.js script
   - Automatically tracks page views on route changes
   - Uses Next.js Script component for optimal loading

3. **`components/PageTracking.tsx`** - Main tracking component
   - Combines button click tracking and page time tracking
   - Added to root layout

4. **`hooks/useButtonTracking.ts`** - Button click tracking hook
   - Automatically tracks all button clicks using event delegation
   - Captures button name, location, type, and additional metadata
   - Works for buttons, links with button role, and navigation links

5. **`hooks/usePageTracking.ts`** - Page time tracking hook
   - Tracks time spent on each page
   - Sends updates every 30 seconds
   - Records final time when user leaves the page

### Files Modified

1. **`app/layout.tsx`** - Added Google Analytics components
   - `<GoogleAnalytics />` - Loads GA script
   - `<PageTracking />` - Enables button and time tracking

## Tracking ID

Your Google Analytics Tracking ID: **G-0J7G42DR9P**

## What Gets Tracked

### 1. Button Clicks
All button clicks are automatically tracked with:
- **Button Name**: Text content, aria-label, or data-track-name attribute
- **Button Location**: Current page path
- **Button Type**: HTML tag (button, a, etc.)
- **Button ID/Class**: For identification

**Event Name**: `button_click`

**Event Parameters**:
- `button_name`: Name of the button
- `button_location`: Page where button was clicked
- `button_type`: Type of element (button, a, etc.)
- `button_id`: ID if available
- `button_class`: CSS classes if available

### 2. Page Visits
Page views are automatically tracked when:
- User navigates to a new page
- User refreshes the page
- User lands on the site

**Event**: Automatic page view tracking via gtag config

### 3. Time on Page
Time tracking includes:
- Updates every 30 seconds while user is on page
- Final time recorded when user leaves
- Time measured in seconds

**Event Name**: `time_on_page`

**Event Parameters**:
- `page_path`: Current page path
- `time_seconds`: Time spent in seconds

## How to View Data in Google Analytics

1. **Button Clicks**:
   - Go to Google Analytics → Events
   - Look for event name: `button_click`
   - Filter by `button_name` to see which buttons are clicked most

2. **Page Visits**:
   - Go to Google Analytics → Behavior → Site Content → All Pages
   - See page views, unique page views, average time on page

3. **Time on Page**:
   - Go to Google Analytics → Events
   - Look for event name: `time_on_page`
   - See average time spent per page

## Custom Button Tracking (Optional)

If you want to add custom tracking to specific buttons, you can add a `data-track-name` attribute:

```tsx
<button 
  data-track-name="Download App - Hero Section"
  onClick={handleDownload}
>
  Download Now
</button>
```

The tracking will automatically use this name instead of the button text.

## Testing

To verify Google Analytics is working:

1. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - Filter by "gtag" or "collect"
   - You should see requests to `www.google-analytics.com`

2. **Check Google Analytics Real-Time**:
   - Go to Google Analytics → Real-Time → Overview
   - Visit your website
   - You should see your visit appear within seconds

3. **Test Button Clicks**:
   - Click any button on your site
   - Check Real-Time → Events
   - You should see `button_click` events

## Notes

- All tracking is client-side only (runs in browser)
- Tracking respects user privacy (no personal data collected)
- Scripts load asynchronously to not block page rendering
- Works with Next.js App Router automatic page view tracking

## Troubleshooting

If tracking doesn't appear:

1. **Check Tracking ID**: Verify `G-0J7G42DR9P` is correct in `lib/analytics.ts`
2. **Check Ad Blockers**: Some ad blockers block Google Analytics
3. **Check Browser Console**: Look for any JavaScript errors
4. **Wait for Data**: Google Analytics can take 24-48 hours to show historical data (Real-Time works immediately)

## Next Steps

1. Deploy the changes to production
2. Verify tracking in Google Analytics Real-Time view
3. Set up custom reports/dashboards in Google Analytics for button clicks and time on page
4. Consider setting up goals/conversions for important actions (e.g., "Download App" button clicks)

