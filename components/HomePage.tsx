'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link && link.hash) {
        e.preventDefault();
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 120; // Account for fixed navbar
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = 120;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="math-symbols-bg">
          <span className="math-sym">+</span>
          <span className="math-sym">−</span>
          <span className="math-sym">×</span>
          <span className="math-sym">÷</span>
          <span className="math-sym">=</span>
          <span className="math-sym num">5</span>
          <span className="math-sym num">10</span>
          <span className="math-sym num">20</span>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="highlight">Start Your Math Adventure!</span>
                <br />Become a Mental Math Superstar! ⭐
              </h1>
              <p className="hero-subtitle">
                Join thousands of kids on an exciting learning journey! 🎯 Play fun challenges, watch your skills grow, and unlock amazing features step by step. Perfect for ages 6+!
              </p>
              
              <div className="hero-cta">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.abacus.trainer" 
                  target="_blank" 
                  rel="noopener" 
                  className="btn btn-primary btn-large"
                >
                  <i className="fab fa-google-play"></i>
                  Download on Google Play
                </a>
                <a href="#pricing" className="btn btn-secondary btn-large">
                  <i className="fas fa-rocket"></i>
                  Try Trial Subscription
                </a>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="abacus-illustration">
                <svg viewBox="0 0 400 250" className="abacus-svg">
                  <rect x="50" y="50" width="300" height="150" fill="#8B4513" rx="8"/>
                  <rect x="60" y="60" width="280" height="130" fill="#D2691E" rx="5"/>
                  <line x1="100" y1="60" x2="100" y2="190" stroke="#654321" strokeWidth="3"/>
                  <line x1="150" y1="60" x2="150" y2="190" stroke="#654321" strokeWidth="3"/>
                  <line x1="200" y1="60" x2="200" y2="190" stroke="#654321" strokeWidth="3"/>
                  <line x1="250" y1="60" x2="250" y2="190" stroke="#654321" strokeWidth="3"/>
                  <line x1="300" y1="60" x2="300" y2="190" stroke="#654321" strokeWidth="3"/>
                  <circle cx="100" cy="90" r="10" fill="#FF6B6B" className="bead"/>
                  <circle cx="100" cy="120" r="10" fill="#FECA57" className="bead"/>
                  <circle cx="150" cy="100" r="10" fill="#48DBFB" className="bead"/>
                  <circle cx="200" cy="85" r="10" fill="#26DE81" className="bead"/>
                  <circle cx="200" cy="125" r="10" fill="#A55EEA" className="bead"/>
                  <circle cx="250" cy="95" r="10" fill="#FF9FF3" className="bead"/>
                  <circle cx="300" cy="110" r="10" fill="#54A0FF" className="bead"/>
                  <circle cx="300" cy="150" r="10" fill="#FECA57" className="bead"/>
                </svg>
              </div>
              <div className="phone-mockup">
                <img src="/images/phone-mockup.png" alt="Abacus Trainer App" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits">
        <div className="container">
          <div className="section-header">
            <h2>Why Kids Love Abacus Trainer! <span className="emoji">✨</span></h2>
            <p>Super fun features that make learning math an awesome adventure!</p>
          </div>
          
          <div className="benefits-grid benefits-grid-all">
            <div className="benefit-card">
              <div className="benefit-icon icon-1">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Play & Learn with AI! 🎮</h3>
              <p>The app learns what you're awesome at and gives you perfect questions! Get better super fast with your own fun learning path!</p>
              <div className="benefit-tags">
                <span className="tag">AI-Powered</span>
                <span className="tag">Adaptive</span>
                <span className="tag">Personalized</span>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon icon-2">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Watch Your Skills Grow! 📈</h3>
              <p>See your scores, winning streaks, and how super awesome you're getting! All your stats update in real-time - watch yourself become a math champion!</p>
              <div className="benefit-tags">
                <span className="tag">Real-time</span>
                <span className="tag">Analytics</span>
                <span className="tag">Trends</span>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon icon-3">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>Earn Awesome Badges! 🏆</h3>
              <p>Unlock cool badges, collect points, and keep your winning streak going! Play fun challenges while you learn - it's like a game!</p>
              <div className="benefit-tags">
                <span className="tag">Badges</span>
                <span className="tag">Points</span>
                <span className="tag">Challenges</span>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon icon-4">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Friendly Guides for 7 Days! 🎓</h3>
              <p>New? No worries! We guide you step-by-step for 7 days with fun hints and celebration animations! Features unlock as you're ready - no overwhelm!</p>
              <div className="benefit-tags">
                <span className="tag">7-Day Guide</span>
                <span className="tag">Kid-Friendly</span>
                <span className="tag">Step-by-Step</span>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon icon-5">
                <i className="fas fa-users"></i>
              </div>
              <h3>Challenge Your Friends! 👥</h3>
              <p>Make learning super fun! Create challenges, share with friends via email or WhatsApp, and see who's winning in real-time! 🎯</p>
              <div className="benefit-tags">
                <span className="tag">Share Challenges</span>
                <span className="tag">Real-time Sync</span>
                <span className="tag">Leaderboards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works - Super Simple! <span className="emoji">🎯</span></h2>
            <p>Get started in just 3 easy steps - you'll be learning in no time! ⚡</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Sign Up or Try as Guest</h3>
              <p>Start practicing right away with no registration required. Create an account for full features.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>Practice Smarter</h3>
              <p>AI-generated or scanned questions tailored for you. Choose your difficulty and practice mode.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Track & Improve</h3>
              <p>Measure progress, earn achievements, and level up with detailed performance insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Amazing Features That Make Learning Fun! <span className="emoji">🎨</span></h2>
            <p>Everything you need to become a math superstar! ⭐</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <h3>Practice Sessions</h3>
              <p>Traditional abacus problems + AI-powered smart practice with unlimited questions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3>OCR Scanning</h3>
              <p>Snap a sheet, let the app scan, and practice instantly with your own questions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive progress tracking with accuracy, efficiency, streaks, cognitive metrics (concentration, memory, visualization, reaction time), and performance trends.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3>Gamification</h3>
              <p>40+ achievements, levels, badges, and challenges to keep you motivated.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Teacher Tools</h3>
              <p>Manage students, monitor progress, and share results with advanced analytics.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Offline Mode</h3>
              <p>Practice anywhere, anytime with full offline functionality and local data storage.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Kid-Friendly Tutorial System</h3>
              <p>Contextual guidance for new users over 7 days. Progressive feature introduction with auto-completing interactive hints and micro-celebrations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>Practice Challenges</h3>
              <p>Create custom practice challenges and share via email or WhatsApp with invite codes. Real-time sync across devices with participant leaderboards.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Smart Notifications</h3>
              <p>Daily AI-recommended focus areas, motivation messages, and usage reminders. Role-based filtering ensures teachers don't get practice reminders.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>AI-Powered Recommendations</h3>
              <p>Daily personalized focus area recommendations with natural language coaching insights. ML-based predictions for readiness to next difficulty level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section id="audience" className="audience">
        <div className="container">
          <div className="section-header">
            <h2>Perfect for Everyone! <span className="emoji">👥</span></h2>
            <p>Made for kids, teachers, and parents - everyone can join the fun! 🎉</p>
          </div>
          
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Students</h3>
              <p>Boost mental math skills with adaptive practice sessions tailored to your learning pace.</p>
              <ul>
                <li>Personalized learning paths</li>
                <li>Fun challenges and games</li>
                <li>Progress tracking</li>
                <li>Achievement badges</li>
              </ul>
            </div>
            
            <div className="audience-card">
              <div className="audience-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Teachers</h3>
              <p>Manage multiple students, track progress, and create engaging classroom activities.</p>
              <ul>
                <li>Student management</li>
                <li>Class analytics</li>
                <li>Progress reports</li>
                <li>Level assignment</li>
              </ul>
            </div>
            
            <div className="audience-card">
              <div className="audience-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Parents</h3>
              <p>Monitor your child's progress and support their learning journey with detailed insights.</p>
              <ul>
                <li>Progress monitoring</li>
                <li>Performance reports</li>
                <li>Encouragement tools</li>
                <li>Learning insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Pick Your Perfect Plan! <span className="emoji">🎯</span></h2>
            <p>Start free, level up when you're ready! 🚀</p>
          </div>
          
          {/* Desktop Pricing Table */}
          <div className="pricing-table desktop-only">
            <table>
              <thead>
                <tr>
                  <th className="feature-col">Features</th>
                  <th className="plan-col">
                    <div className="plan-header">
                      <h3>Guest Mode</h3>
                      <div className="price">$0<span className="period">/forever</span></div>
                      <p className="price-desc">Try it out!</p>
                      <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline btn-small">Get Started</a>
                    </div>
                  </th>
                  <th className="plan-col">
                    <div className="plan-header">
                      <h3>Free Trial</h3>
                      <div className="price free-trial-price">(20 Days)</div>
                      <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline btn-small">Start Trial</a>
                    </div>
                  </th>
                  <th className="plan-col featured">
                    <div className="plan-header">
                      <div className="popular-badge">Most Popular</div>
                      <h3>Individual</h3>
                      <div className="price">₹300<span className="period">/month</span></div>
                      <p className="price-desc">For learners</p>
                      <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-primary btn-small">Choose</a>
                    </div>
                  </th>
                  <th className="plan-col">
                    <div className="plan-header">
                      <h3>Teacher</h3>
                      <div className="price">₹250<span className="period">/month</span></div>
                      <p className="price-desc">For educators</p>
                      <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline btn-small">Choose</a>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Kid-friendly tutorials</td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Sessions per day</td><td><span className="check">2</span></td><td><span className="check">Unlimited</span></td><td className="featured"><span className="check">Unlimited</span></td><td><span className="check">Unlimited</span></td></tr>
                <tr><td>Questions per day</td><td><span className="check">20</span></td><td><span className="check">Unlimited</span></td><td className="featured"><span className="check">Unlimited</span></td><td><span className="check">Unlimited</span></td></tr>
                <tr><td>AI-powered practice</td><td><span className="cross">✗</span></td><td><span className="check">✓</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>OCR scanning</td><td><span className="cross">✗</span></td><td><span className="check">✓</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Challenge participation</td><td><span className="check-limited">Limited</span></td><td><span className="check-limited">Limited</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Challenge creation</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Daily AI recommendations</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Cognitive metrics</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Cloud sync</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Full history access</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Student management</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="cross">✗</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Class analytics</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="cross">✗</span></td><td><span className="check">✓</span></td></tr>
                <tr><td>Challenge creation for classes</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="featured"><span className="cross">✗</span></td><td><span className="check">✓</span></td></tr>
              </tbody>
            </table>
          </div>
          
          {/* Mobile Pricing Cards */}
          <div className="pricing-cards mobile-only">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Guest Mode</h3>
                <div className="price">$0<span>/forever</span></div>
                <p>Try it out!</p>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i> Kid-friendly tutorials</li>
                <li><i className="fas fa-check"></i> 2 sessions per day</li>
                <li><i className="fas fa-check"></i> 20 questions per day</li>
              </ul>
              <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline">Get Started</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Free Trial</h3>
                <div className="price free-trial-price">(20 Days)</div>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i> Kid-friendly tutorials</li>
                <li><i className="fas fa-check"></i> Unlimited sessions</li>
                <li><i className="fas fa-check"></i> Unlimited questions</li>
                <li><i className="fas fa-check"></i> AI-powered practice</li>
                <li><i className="fas fa-check"></i> OCR scanning</li>
                <li><i className="fas fa-check"></i> Challenge participation (limited)</li>
              </ul>
              <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline">Start Trial</a>
            </div>
            
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Individual</h3>
                <div className="price">₹300<span>/month</span></div>
                <p>For learners</p>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i> Everything in Free Trial</li>
                <li><i className="fas fa-check"></i> Challenge creation</li>
                <li><i className="fas fa-check"></i> Daily AI recommendations</li>
                <li><i className="fas fa-check"></i> Cognitive metrics</li>
                <li><i className="fas fa-check"></i> Cloud sync</li>
                <li><i className="fas fa-check"></i> Full history access</li>
              </ul>
              <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-primary">Choose</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Teacher</h3>
                <div className="price">₹250<span>/month</span></div>
                <p>For educators</p>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i> Everything in Individual</li>
                <li><i className="fas fa-check"></i> Student management</li>
                <li><i className="fas fa-check"></i> Class analytics</li>
                <li><i className="fas fa-check"></i> Challenge creation for classes</li>
                <li><i className="fas fa-check"></i> Progress reports</li>
              </ul>
              <a href="https://play.google.com/store/apps/details?id=com.abacus.trainer" target="_blank" rel="noopener" className="btn btn-outline">Choose</a>
            </div>
          </div>
          
          <div className="pricing-note">
            <p>All plans include offline functionality and local data storage</p>
            <p className="pricing-footnote"><small>* Teacher plan pricing is per student</small></p>
          </div>
        </div>
      </section>

      {/* FAQ Section (Preview) */}
      <section id="faq" className="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions <span className="emoji">❓</span></h2>
            <p>Everything you need to know about Abacus Trainer</p>
          </div>
          
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">
                <h3>What is Abacus Trainer?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>Abacus Trainer is an Android educational app designed to help students learn and practice mental arithmetic using the abacus method. It provides interactive practice sessions, progress tracking, and AI-powered question generation to enhance learning efficiency.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>Who can use this app?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>The app is designed for students learning abacus arithmetic methods, teachers managing multiple student progress, parents monitoring their child's learning progress, and educational institutions for classroom and homework support.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>Does the app work offline?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>Yes! The app is designed to work entirely offline. All core features including practice sessions, AI question generation, and progress tracking work without internet connectivity.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>Is there a free trial?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>Yes! New users get a 20-day free trial with unlimited practice sessions and questions, and access to all core features. No credit card required.</p>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-outline">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
