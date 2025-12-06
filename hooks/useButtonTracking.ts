'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackButtonClick } from '@/lib/analytics'

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

export function useButtonTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      // Only track if user has accepted cookies
      if (!hasCookieConsent()) return

      const target = e.target as HTMLElement
      
      // Find the button element (could be button, a with button role, or parent button)
      const button = target.closest('button, a[role="button"], .nav-cta, .nav-link, [data-track="button"]')
      
      if (!button) return

      // Get button identifier
      let buttonName = ''
      let buttonLocation = pathname || window.location.pathname

      // Priority: data-track-name > aria-label > text content > id > className
      if (button instanceof HTMLElement) {
        buttonName = 
          button.getAttribute('data-track-name') ||
          button.getAttribute('aria-label') ||
          button.textContent?.trim() ||
          button.id ||
          button.className ||
          'Unknown Button'
      }

      // Skip if it's a navigation link (we'll track those separately if needed)
      if (button.tagName === 'A' && !buttonName.includes('Download') && !buttonName.includes('Login')) {
        // Track navigation links as well
        const href = button.getAttribute('href')
        if (href) {
          trackButtonClick(
            buttonName || href,
            buttonLocation,
            {
              link_url: href,
              link_type: 'navigation'
            }
          )
        }
        return
      }

      // Track the button click
      trackButtonClick(
        buttonName,
        buttonLocation,
        {
          button_type: button.tagName.toLowerCase(),
          button_id: button.id || undefined,
          button_class: button.className || undefined,
        }
      )
    }

    // Add event listener to document
    document.addEventListener('click', handleButtonClick, true)

    return () => {
      document.removeEventListener('click', handleButtonClick, true)
    }
  }, [pathname])
}

