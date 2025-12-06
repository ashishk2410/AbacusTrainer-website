'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackTimeOnPage } from '@/lib/analytics'

// Check if cookies are accepted
function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem('cookie-consent')
    if (stored) {
      const consentData = JSON.parse(stored)
      const expiryDate = new Date(consentData.expiry)
      return expiryDate > new Date() && consentData.consent === 'accepted'
    }
  } catch {
    return false
  }
  return false
}

export function usePageTracking() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only track if user has accepted cookies
    if (!hasCookieConsent()) return

    // Reset start time when pathname changes
    startTimeRef.current = Date.now()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Track time on page every 30 seconds
    intervalRef.current = setInterval(() => {
      if (hasCookieConsent()) {
        const timeSpent = (Date.now() - startTimeRef.current) / 1000
        trackTimeOnPage(pathname || window.location.pathname, timeSpent)
      }
    }, 30000) // Every 30 seconds

    // Track final time when leaving the page
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      if (hasCookieConsent()) {
        const timeSpent = (Date.now() - startTimeRef.current) / 1000
        if (timeSpent > 0) {
          trackTimeOnPage(pathname || window.location.pathname, timeSpent)
        }
      }
    }
  }, [pathname])
}

