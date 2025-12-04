'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!userData) return '/login';
    if (userData.role === 'centre') return '/centre/dashboard';
    if (userData.role === 'teacher') return '/teacher/dashboard';
    return '/login';
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">
            <img src="/images/logo.svg" alt="Abacus Trainer Logo" className="logo-img" />
            <span className="logo-text">Abacus Trainer</span>
          </Link>
        </div>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
          {user && userData ? (
            // Personalized menu for logged-in users
            <>
              <Link 
                href={getDashboardLink()} 
                className={`nav-link ${pathname?.includes('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-tachometer-alt" style={{ marginRight: '0.5rem' }}></i>
                Dashboard
              </Link>
              <Link 
                href="/profile"
                className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-circle" style={{ marginRight: '0.5rem' }}></i>
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
                Logout
              </button>
            </>
          ) : (
            // Public menu for non-logged-in users
            <>
              <Link href="/#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/#for-students" className="nav-link" onClick={() => setIsMenuOpen(false)}>Students</Link>
              <Link href="/#for-teachers" className="nav-link" onClick={() => setIsMenuOpen(false)}>Teachers</Link>
              <Link href="/#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link href="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link href="/faq" className="nav-link" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              <Link href="/login" className="nav-cta" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
            </>
          )}
          <a 
            href="https://play.google.com/store/apps/details?id=com.abacus.trainer" 
            target="_blank" 
            rel="noopener" 
            className="nav-cta"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fab fa-google-play"></i>
            Download
          </a>
        </div>
        <button 
          className="hamburger" 
          id="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

