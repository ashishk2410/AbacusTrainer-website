import React from 'react';

export default function InviteBanner() {
  return (
    <div className="invite-banner" id="invite-banner">
      <div className="invite-content">
        <i className="fas fa-gift"></i>
        <span>
          <strong>Special Offer:</strong> Use invite code{' '}
          <strong className="invite-code">ABACUSTRAINER</strong> as a student for full access for 1 year!
        </span>
      </div>
    </div>
  );
}


