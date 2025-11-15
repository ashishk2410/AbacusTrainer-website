'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Ensure this component can render even if there are errors
export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent hydration errors
  useEffect(() => {
    try {
      setMounted(true);
      // Debug: Log when component mounts
      console.log('FAQ Page mounted');
    } catch (err) {
      console.error('FAQ Page error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqSections = [
    {
      title: 'General Questions',
      icon: 'fa-mobile-alt',
      items: [
        {
          question: 'What is Abacus Trainer?',
          answer: 'Abacus Trainer is an Android educational app designed to help students learn and practice mental arithmetic using the abacus method. It provides interactive practice sessions, progress tracking, and AI-powered question generation to enhance learning efficiency.'
        },
        {
          question: 'Who can use this app?',
          answer: (
            <ul>
              <li><strong>Students</strong>: Learning abacus arithmetic methods</li>
              <li><strong>Teachers</strong>: Managing multiple student progress</li>
              <li><strong>Parents</strong>: Monitoring child&apos;s learning progress</li>
              <li><strong>Educational Institutions</strong>: Classroom and homework support</li>
            </ul>
          )
        },
        {
          question: 'What Android versions are supported?',
          answer: 'The app requires Android 8.0 (API 26) or higher and supports up to Android 15+ (API 35).'
        },
        {
          question: 'Does the app work offline?',
          answer: 'Yes! The app is designed to work entirely offline. All core features including practice sessions, AI question generation, and progress tracking work without internet connectivity.'
        },
        {
          question: 'What is the current app version?',
          answer: 'The current version is 4.3 (Build 18), released in November 2025. The app requires Android 8.0 (API 26) or higher and supports up to Android 15+ (API 35).'
        }
      ]
    },
    {
      title: 'Tutorial System & Challenges',
      icon: 'fa-graduation-cap',
      items: [
        {
          question: 'How does the tutorial system work for new users?',
          answer: 'New users are guided through features over 7 days with contextual hints. Tutorials appear when you first visit each screen, and completing them automatically marks them as done. This prevents overwhelm and ensures a smooth learning experience. One hint per screen keeps kids focused.'
        },
        {
          question: 'Why aren&apos;t all features visible when I first open the app?',
          answer: 'To prevent overwhelm, features are introduced progressively over 7 days. This kid-friendly approach ensures children focus on one thing at a time and learn gradually. All features are still accessible; tutorials just guide you to discover them naturally as you&apos;re ready.'
        },
        {
          question: 'Can I create challenges for my students?',
          answer: 'Yes! Teachers and students can create practice challenges. Challenges can be shared via email or WhatsApp using invite codes, and all participants&apos; progress is tracked in real-time. Created challenges, participant records, and progress all sync automatically via Firestore.'
        },
        {
          question: 'How do challenges sync across devices?',
          answer: 'Challenges are stored in Firestore and automatically sync when you&apos;re online. Created challenges, participant records, and progress are all synchronized in real-time across all devices.'
        },
        {
          question: 'How do I get full access as a student for a year?',
          answer: 'Students can use the invite code ABACUSTRAINER when creating their account to get full access for 1 year. This special offer provides all premium features including unlimited practice sessions, challenge creation, full AI recommendations, cognitive metrics dashboard, and cloud sync.'
        }
      ]
    },
    {
      title: 'Getting Started',
      icon: 'fa-play-circle',
      items: [
        {
          question: 'How do I start my first practice session?',
          answer: (
            <ol>
              <li>Open the app and you&apos;ll see the Statistics Dashboard</li>
              <li>Click "Start Practice"</li>
              <li>Configure your practice settings (difficulty, duration, etc.)</li>
              <li>Choose between Traditional Practice or AI-Powered Practice</li>
              <li>Begin your session</li>
            </ol>
          )
        },
        {
          question: 'What&apos;s the difference between Traditional and AI-Powered Practice?',
          answer: (
            <ul>
              <li><strong>Traditional Practice</strong>: Uses standard abacus arithmetic problems with fixed difficulty</li>
              <li><strong>AI-Powered Practice</strong>: Smart question generation that adapts to your performance, focusing on areas that need improvement</li>
            </ul>
          )
        },
        {
          question: 'Can I use the app without creating an account?',
          answer: 'Yes! The app offers Guest Mode for quick access without account creation. However, guest users have limited features and daily usage limits.'
        }
      ]
    },
    {
      title: 'Practice Sessions',
      icon: 'fa-calculator',
      items: [
        {
          question: 'How do I set up a practice session?',
          answer: (
            <React.Fragment>
              <p>From the Statistics Dashboard, click &quot;Start Practice&quot; and configure these settings:</p>
              <ul>
                <li><strong>Digit Range</strong>: 1D, 2D, or 3D number complexity</li>
                <li><strong>Operation Types</strong>: Addition, subtraction, multiplication, division</li>
                <li><strong>Session Duration</strong>: Set custom timer (MM:SS format)</li>
                <li><strong>Question Count</strong>: Number of questions per session</li>
                <li><strong>Speech Settings</strong>: TTS speed and gap preferences</li>
              </ul>
            </React.Fragment>
          )
        },
        {
          question: 'What is OCR scanning?',
          answer: 'OCR (Optical Character Recognition) allows you to scan practice sheets using your device camera. The app extracts questions from the image and creates practice sessions from them instantly.'
        },
        {
          question: 'How does AI-powered practice work?',
          answer: 'AI-powered practice analyzes your performance and generates questions tailored to your skill level. It focuses on areas where you need improvement and adapts difficulty based on your accuracy and speed.'
        }
      ]
    },
    {
      title: 'Pricing & Subscriptions',
      icon: 'fa-credit-card',
      items: [
        {
          question: 'Is there a free trial?',
          answer: 'Yes! New users get a 20-day free trial with unlimited practice sessions and questions, and access to all core features. No credit card required.'
        },
        {
          question: 'What are the subscription plans?',
          answer: (
            <ul>
              <li><strong>Guest Mode</strong>: Free forever with limited features (2 sessions/day, 20 questions/day)</li>
              <li><strong>Free Trial</strong>: 20 days with full access</li>
              <li><strong>Individual</strong>: ₹300/month for learners with all features</li>
              <li><strong>Teacher</strong>: ₹250/month per student for educators with student management tools</li>
            </ul>
          )
        },
        {
          question: 'What happens after my free trial ends?',
          answer: 'After the 20-day free trial, you can continue using Guest Mode with limited features, or subscribe to Individual or Teacher plans for full access to all features.'
        }
      ]
    },
    {
      title: 'Progress & Analytics',
      icon: 'fa-chart-line',
      items: [
        {
          question: 'What metrics does the app track?',
          answer: 'The app tracks accuracy, efficiency (prompts per minute), streaks, cognitive metrics (concentration, memory, visualization, reaction time), and provides detailed performance trends over time.'
        },
        {
          question: 'Can teachers see student progress?',
          answer: 'Yes! Teachers can view detailed analytics for all their students including session history, performance trends, accuracy, efficiency, and cognitive metrics. Teachers can also assign levels and create improvement plans.'
        },
        {
          question: 'How do I view my progress?',
          answer: 'Your progress is displayed on the Statistics Dashboard, which shows your current stats, performance trends, achievements, and detailed session history.'
        }
      ]
    }
  ];

  // Flatten FAQ items for search
  const allFAQItems = faqSections.flatMap((section, sectionIndex) =>
    section.items.map((item, itemIndex) => ({
      ...item,
      sectionTitle: section.title,
      sectionIcon: section.icon,
      globalIndex: sectionIndex * 1000 + itemIndex
    }))
  );

  // Filter items based on search query
  const filteredItems = searchQuery
    ? allFAQItems.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allFAQItems;

  // Group filtered items back by section
  const filteredSections = faqSections.map(section => ({
    ...section,
    items: section.items.filter((item, itemIndex) => {
      const globalIndex = faqSections.findIndex(s => s.title === section.title) * 1000 + itemIndex;
      return filteredItems.some(fi => fi.globalIndex === globalIndex);
    })
  })).filter(section => section.items.length > 0);

  // Always render content - mounted check is just for preventing hydration mismatches
  // Content will render on both server and client

  // Show error if there's one
  if (error) {
    return (
      <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#EF4444', marginBottom: '1rem' }}>Error loading FAQ page</h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>{error}</p>
          <Link href="/" style={{
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-block'
          }}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* FAQ Hero Section */}
        <section className="faq-hero-section" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#1F2937' }}>
            Frequently Asked Questions <span className="emoji">❓</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6B7280', marginBottom: '2rem' }}>
            Find answers to common questions about Abacus Trainer
          </p>
          <div className="faq-search" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="search-input"
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 1rem',
                borderRadius: '0.75rem',
                border: '2px solid #E5E7EB',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B7280'
            }}></i>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="faq-content-section">
          <div className="faq-sections">
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="faq-section" style={{ marginBottom: '3rem' }}>
                <h2 className="faq-section-title" style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <i className={`fas ${section.icon}`} style={{ color: '#7C3AED' }}></i>
                  {section.title}
                </h2>
                <div className="faq-items">
                  {section.items.map((item, itemIndex) => {
                    const globalIndex = sectionIndex * 1000 + itemIndex;
                    const isOpen = openItems.has(globalIndex);
                    return (
                      <div key={itemIndex} className="faq-item" style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        marginBottom: '1rem',
                        border: '1px solid #E5E7EB',
                        overflow: 'hidden',
                        transition: 'all 0.3s'
                      }}>
                        <div
                          className="faq-question"
                          onClick={() => toggleItem(globalIndex)}
                          style={{
                            padding: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: isOpen ? '#F9FAFB' : 'white',
                            transition: 'background 0.2s'
                          }}
                        >
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', margin: 0 }}>
                            {item.question}
                          </h3>
                          <i
                            className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
                            style={{
                              color: '#7C3AED',
                              transition: 'transform 0.3s',
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          ></i>
                        </div>
                        {isOpen && (
                          <div className="faq-answer" style={{
                            padding: '0 1.5rem 1.5rem 1.5rem',
                            color: '#4B5563',
                            lineHeight: '1.6'
                          }}>
                            {typeof item.answer === 'string' ? (
                              <p style={{ margin: 0 }}>{item.answer}</p>
                            ) : (
                              <div style={{ margin: 0 }}>{item.answer}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No FAQs found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <Link href="/" style={{
            color: '#7C3AED',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.125rem'
          }}>
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
