'use client'

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
                Terms of Use — Abacus Trainer
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

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>1. Eligibility</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            You must be at least 13 years old to use the App without parental supervision. Children under 13 may use the App only with parental or guardian consent.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>2. Use of the App</h2>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li>The App is intended solely for educational purposes.</li>
            <li>You agree not to misuse the App, attempt unauthorized access, or use it for illegal activities.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials (if you create an account).</li>
          </ul>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>3. User Data</h2>
          <ul style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            <li>By default, session data is stored locally on your device.</li>
            <li>You may choose to share or sync session data to Firebase. Syncing is entirely optional.</li>
            <li>You retain ownership of your session data.</li>
          </ul>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>4. Intellectual Property</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            The App and Website, including all design, content, and code, are owned by Abacus Trainer. You may not copy, distribute, or modify the App except as permitted by applicable law.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>5. Disclaimer of Warranties</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            The App is provided <strong>&quot;as is&quot;</strong> without warranties of any kind. We do not guarantee uninterrupted availability, accuracy, or error-free performance.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>6. Limitation of Liability</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            To the maximum extent permitted by law, Abacus Trainer and its team shall not be liable for any damages arising from your use of the App, including data loss or indirect damages.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>7. Termination</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            We reserve the right to suspend or terminate access to the App if you violate these Terms.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>8. Changes to Terms</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            We may update these Terms from time to time. The latest version will always be posted on our Website, with the &quot;Effective Date&quot; updated accordingly.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>9. Governing Law</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
          </p>

          <h2 style={{ marginTop: '18px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>10. Contact Us</h2>
          <p style={{ lineHeight: 1.6, color: '#374151', marginBottom: '1rem' }}>
            If you have questions or concerns about these Terms, please contact us:
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

