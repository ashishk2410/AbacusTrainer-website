'use client'

import { useEffect, useState, Suspense } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_TRACKING_ID, pageview } from '@/lib/analytics'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { consent } = useCookieConsent()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Only load GA if user has accepted cookies
    if (consent === 'accepted') {
      setShouldLoad(true)
    } else if (consent === 'rejected') {
      setShouldLoad(false)
      // Clear any existing GA data
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        })
      }
    }
  }, [consent])

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      if (event.detail.consent === 'accepted') {
        setShouldLoad(true)
      } else {
        setShouldLoad(false)
      }
    }

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener)
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!pathname || !shouldLoad) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    pageview(url)
  }, [pathname, searchParams, shouldLoad])

  if (!GA_TRACKING_ID || !shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
            });
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              allow_google_signals: true,
              allow_ad_personalization_signals: true,
              anonymize_ip: false,
            });
          `,
        }}
      />
    </>
  )
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}

