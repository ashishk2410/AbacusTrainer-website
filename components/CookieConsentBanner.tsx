'use client'

import React, { useState } from 'react'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

export default function CookieConsentBanner() {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)

  if (!showBanner) {
    return null
  }

  return (
    <div className="cookie-consent-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-header">
          <div className="cookie-consent-icon">
            <i className="fas fa-cookie-bite"></i>
          </div>
          <h3>We Value Your Privacy</h3>
        </div>
        
        <div className="cookie-consent-body">
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can also choose to 
            &quot;Reject All&quot; or customize your preferences.
          </p>

          {showDetails && (
            <div className="cookie-consent-details">
              <div className="cookie-detail-item">
                <strong>Essential Cookies:</strong> Required for the website to function properly.
              </div>
              <div className="cookie-detail-item">
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website 
                (Google Analytics). These cookies collect anonymous information.
              </div>
              <div className="cookie-detail-item">
                <strong>Marketing Cookies:</strong> Used to deliver personalized advertisements and track 
                campaign performance.
              </div>
              <p className="cookie-consent-link">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Learn more about our cookie policy
                </a>
              </p>
            </div>
          )}

          <div className="cookie-consent-actions">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="cookie-btn cookie-btn-know-more"
              aria-label="Show cookie details"
            >
              Know more
            </button>
            <button
              type="button"
              onClick={rejectCookies}
              className="cookie-btn cookie-btn-reject"
              aria-label="Reject all cookies"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={acceptCookies}
              className="cookie-btn cookie-btn-accept"
              aria-label="Accept all cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

