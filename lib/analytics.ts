// Google Analytics utility functions

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-0J7G42DR9P';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    anonymize_ip: false,
  });
};

// Track page view
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
  });
};

// Track button click event
export const trackButtonClick = (
  buttonName: string,
  buttonLocation?: string,
  additionalData?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'button_click', {
    button_name: buttonName,
    button_location: buttonLocation || window.location.pathname,
    ...additionalData,
  });
};

// Track custom event
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

// Track time on page
export const trackTimeOnPage = (pagePath: string, timeInSeconds: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'time_on_page', {
    page_path: pagePath,
    time_seconds: Math.round(timeInSeconds),
  });
};

