'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type CookieConsent = 'accepted' | 'rejected' | 'pending'

interface CookieConsentContextType {
  consent: CookieConsent
  acceptCookies: () => void
  rejectCookies: () => void
  showBanner: boolean
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const CONSENT_KEY = 'cookie-consent'
const CONSENT_EXPIRY_DAYS = 365

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>('pending')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check for existing consent
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored) {
        try {
          const consentData = JSON.parse(stored)
          const expiryDate = new Date(consentData.expiry)
          
          // Check if consent is still valid
          if (expiryDate > new Date()) {
            setConsent(consentData.consent)
            setShowBanner(false)
          } else {
            // Consent expired, show banner again
            localStorage.removeItem(CONSENT_KEY)
            setConsent('pending')
            setShowBanner(true)
          }
        } catch {
          // Invalid stored data, show banner
          localStorage.removeItem(CONSENT_KEY)
          setConsent('pending')
          setShowBanner(true)
        }
      } else {
        // No consent stored, show banner
        setConsent('pending')
        setShowBanner(true)
      }
    }
  }, [])

  const saveConsent = (userConsent: 'accepted' | 'rejected') => {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

    const consentData = {
      consent: userConsent,
      expiry: expiryDate.toISOString(),
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData))
    setConsent(userConsent)
    setShowBanner(false)

    // Dispatch event for Google Analytics component to listen
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: { consent: userConsent } 
    }))
  }

  const acceptCookies = () => {
    saveConsent('accepted')
  }

  const rejectCookies = () => {
    saveConsent('rejected')
  }

  return (
    <CookieConsentContext.Provider value={{ consent, acceptCookies, rejectCookies, showBanner }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

