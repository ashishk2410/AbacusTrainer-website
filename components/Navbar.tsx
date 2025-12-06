'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openSubmenu && !target.closest('.nav-item-with-submenu')) {
        setOpenSubmenu(null);
      }
    };

    if (openSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openSubmenu]);

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
    <>
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
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
              <Link href="/#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <div 
                className="nav-item-with-submenu"
                onMouseEnter={() => setOpenSubmenu('resources')}
              >
                <button 
                  className="nav-link nav-link-with-submenu"
                  onClick={() => setOpenSubmenu(openSubmenu === 'resources' ? null : 'resources')}
                >
                  Resources
                  <i className={`fas fa-chevron-down ${openSubmenu === 'resources' ? 'rotate' : ''}`} style={{ marginLeft: '0.25rem', fontSize: '0.7rem', transition: 'transform 0.25s ease-out' }}></i>
                </button>
                {openSubmenu === 'resources' && (
                  <div className="nav-submenu">
                    <Link href="/blog" className="nav-submenu-link" onClick={() => { setIsMenuOpen(false); setOpenSubmenu(null); }}>
                      Blog
                    </Link>
                    <Link href="/faq" className="nav-submenu-link" onClick={() => { setIsMenuOpen(false); setOpenSubmenu(null); }}>
                      FAQ
                    </Link>
                  </div>
                )}
              </div>
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
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          id="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    </>
  );
}

