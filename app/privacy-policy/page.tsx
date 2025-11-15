'use client'

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '180px 20px 40px', 
      background: '#F8FAFC',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px' }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)'
        }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                Privacy Policy — Abacus Trainer
              </h1>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px', marginTop: '8px' }}>
                App package: <strong>com.abacus.trainer</strong> • Website:{' '}
                <a 
                  href="https://abacustrainer.netlify.app" 
                  target="_blank" 
                  rel="noopener"
                  style={{ color: '#0B69FF', textDecoration: 'none' }}
                >
                  abacustrainer.netlify.app
                </a>
              </div>
            </div>
          </header>

          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            <strong>Effective Date:</strong> September 28, 2025
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>1. Overview</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            Abacus Trainer (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Abacus Trainer Android application (the &quot;App&quot;) and the accompanying website. This Privacy Policy explains how we handle your information when you use our App and Website. We respect your privacy and collect only minimal data necessary for the App&apos;s functionality.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            We do not automatically collect personal information. The only information that may be collected is:
          </p>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li><strong>Name and Email Address (optional):</strong> Collected only if you create an account to enable data sync with Firebase.</li>
            <li><strong>Session Data (practice records, scores, progress):</strong> Stored locally on your device by default. You may choose to export this data as a PDF or image and share it yourself, or you may choose to sync your session data with Firebase for backup or multi-device use.</li>
          </ul>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>3. How We Use Information</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            The limited data collected is used only to:
          </p>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li>Enable optional account creation and session sync.</li>
            <li>Allow you to export or share your practice results.</li>
            <li>Improve the reliability and performance of the App.</li>
          </ul>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            We do not sell, rent, or share your personal information with third parties for marketing purposes.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>4. Third-Party Services</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            The App may use third-party services strictly to provide core functionality:
          </p>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li>Google Play Services</li>
            <li>Firebase (Authentication, Firestore/Realtime Database, Cloud Storage)</li>
          </ul>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            Please review their privacy policies for details:{' '}
            <a 
              href="https://policies.google.com/privacy" 
              target="_blank" 
              rel="noopener"
              style={{ color: '#0B69FF', textDecoration: 'none' }}
            >
              Google Privacy Policy
            </a>{' '}
            and{' '}
            <a 
              href="https://firebase.google.com/support/privacy" 
              target="_blank" 
              rel="noopener"
              style={{ color: '#0B69FF', textDecoration: 'none' }}
            >
              Firebase Privacy
            </a>.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>5. Data Security</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            All session data is stored securely on your device unless you choose to share or sync it. Any data transmitted to Firebase is sent over encrypted channels (HTTPS). While we take reasonable measures to protect your data, no method of electronic storage or transmission can be guaranteed 100% secure.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>6. Your Privacy Choices</h2>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li>You can use the App entirely without creating an account or syncing data.</li>
            <li>You decide whether to share or sync your session data.</li>
            <li>You may request deletion of any synced data by contacting us at the email below.</li>
            <li>You may uninstall the App at any time to stop all data collection.</li>
          </ul>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>7. Children&apos;s Privacy</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            The App is designed for educational use by learners, including children. We do not knowingly collect personal data from children under 13 without parental consent. If you believe your child has provided such data, please contact us to have it deleted.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>8. Changes to This Policy</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            We may update this Privacy Policy from time to time. Any updates will be posted on this page and the &quot;Effective Date&quot; will be updated accordingly.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>9. Contact Us</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <strong>Email:</strong>{' '}
            <a 
              href="mailto:MyAbacusTrainer@GMail.com" 
              style={{ color: '#0B69FF', textDecoration: 'none' }}
            >
              MyAbacusTrainer@GMail.com
            </a>
            <br />
            <strong>Website:</strong>{' '}
            <a 
              href="https://abacustrainer.netlify.app" 
              target="_blank" 
              rel="noopener"
              style={{ color: '#0B69FF', textDecoration: 'none' }}
            >
              https://abacustrainer.netlify.app
            </a>
          </p>

          <footer style={{ marginTop: '18px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            © Abacus Trainer — Built with care. Last updated: September 28, 2025
          </footer>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/" style={{
              color: '#0B69FF',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

