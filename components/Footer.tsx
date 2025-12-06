import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/images/logo.svg" alt="Abacus Trainer" className="logo-img" />
              <h3>Abacus Trainer</h3>
            </div>
            <p>
              The most advanced abacus practice app powered by AI, featuring innovative features and comprehensive gamification.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.abacus.trainer" 
                  target="_blank" 
                  rel="noopener"
                >
                  Download
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><a href="mailto:myabacustrainer@gmail.com">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p><i className="fas fa-envelope"></i> myabacustrainer@gmail.com</p>
            <div className="social-links">
              <a 
                href="https://play.google.com/store/apps/details?id=com.abacus.trainer" 
                target="_blank" 
                rel="noopener" 
                aria-label="Google Play"
              >
                <i className="fab fa-google-play"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Abacus Trainer. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link href="/terms">Terms of Use</Link>
            <span className="footer-separator">|</span>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className="footer-separator">|</span>
            <Link href="/privacy-policy#cookies">Cookie Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


