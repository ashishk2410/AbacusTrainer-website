'use client'

import React, { useState } from 'react';

export default function InviteBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="invite-banner" id="invite-banner">
      <button
        className="invite-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close offer"
      >
        <i className="fas fa-times"></i>
      </button>
      <div className="invite-content">
        <div className="invite-icon">
          <i className="fas fa-gift"></i>
        </div>
        <div className="invite-text">
          <div className="invite-title">Exclusive Student Deal</div>
          <div className="invite-description">
            Sign up with the invite code{' '}
            <strong className="invite-code">ABACUSTRAINER</strong> and unlock 6 weeks of complete app access.
          </div>
        </div>
      </div>
    </div>
  );
}


