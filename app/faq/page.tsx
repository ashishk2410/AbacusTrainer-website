'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Category mapping: JSON key -> { title, icon }
const categoryMapping: Record<string, { title: string; icon: string }> = {
  general: { title: 'General Questions', icon: 'fa-mobile-alt' },
  learning_and_practice_modes: { title: 'Learning & Practice Modes', icon: 'fa-graduation-cap' },
  skill_practice_and_operations: { title: 'Skill Practice & Operations', icon: 'fa-calculator' },
  ai_and_cognitive_insights: { title: 'AI & Cognitive Insights', icon: 'fa-robot' },
  analytics_and_progress_tracking: { title: 'Analytics & Progress Tracking', icon: 'fa-chart-line' },
  audio_and_experience: { title: 'Audio & Experience', icon: 'fa-volume-up' },
  gamification_and_motivation: { title: 'Gamification & Motivation', icon: 'fa-trophy' },
  challenges_and_leaderboards: { title: 'Challenges & Leaderboards', icon: 'fa-gamepad' },
  teachers_and_dashboard: { title: 'Teachers & Dashboard', icon: 'fa-chalkboard-teacher' },
  parents_and_home_use: { title: 'Parents & Home Use', icon: 'fa-home' },
  technical_and_device_support: { title: 'Technical & Device Support', icon: 'fa-tools' },
  security_and_privacy: { title: 'Security & Privacy', icon: 'fa-shield-alt' },
  getting_started_and_access: { title: 'Getting Started & Access', icon: 'fa-play-circle' },
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  [key: string]: FAQItem[];
}

// Ensure this component can render even if there are errors
export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load FAQ data from JSON
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await fetch('/FAQs.json');
        if (!response.ok) {
          throw new Error('Failed to load FAQs');
        }
        const data: FAQData = await response.json();
        setFaqData(data);
      } catch (err) {
        console.error('Error loading FAQs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  // Prevent hydration errors - ensure this runs only on client
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      setMounted(true);
    } catch (err) {
      console.error('FAQ Page error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Convert JSON data to FAQ sections format
  const faqSections = faqData ? Object.entries(faqData).map(([categoryKey, items]) => {
    const category = categoryMapping[categoryKey] || { 
      title: categoryKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), 
      icon: 'fa-question-circle' 
    };
    return {
      title: category.title,
      icon: category.icon,
      items: items.map(item => ({
        question: item.question,
        answer: item.answer
      }))
    };
  }) : [];

  // Show loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 0 60px', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', color: '#6B7280' }}>
            <p style={{ fontSize: '1.125rem' }}>Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Flatten FAQ items for search
  const allFAQItems = faqSections.flatMap((section, sectionIndex) =>
    section.items.map((item, itemIndex) => ({
      ...item,
      sectionTitle: section.title,
      sectionIcon: section.icon,
      globalIndex: sectionIndex * 1000 + itemIndex
    }))
  );

  // Filter items based on search query and selected category
  const filteredItems = allFAQItems.filter(item => {
    // Category filter
    const categoryMatch = selectedCategory === 'All' || item.sectionTitle === selectedCategory;
    
    // Search filter
    const searchMatch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  // Group filtered items back by section
  const filteredSections = faqSections.map(section => ({
    ...section,
    items: section.items.filter((item, itemIndex) => {
      const globalIndex = faqSections.findIndex(s => s.title === section.title) * 1000 + itemIndex;
      return filteredItems.some(fi => fi.globalIndex === globalIndex);
    })
  })).filter(section => section.items.length > 0);

  // Get all unique category titles for filter buttons
  const categories = ['All', ...faqSections.map(s => s.title)];

  // Always render content - mounted check is just for preventing hydration mismatches
  // Content will render on both server and client
  
  // Render immediately - don't wait for mounted state
  // This ensures the page works even if there are client-side issues

  // Show error if there's one
  if (error) {
    return (
      <div style={{ minHeight: '100vh', padding: '120px 0 60px', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h1 style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '2rem', fontWeight: 700 }}>Error loading FAQ page</h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '1.125rem' }}>{error}</p>
          <Link href="/" style={{
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            background: '#6366f1',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-block',
            transition: 'all 0.25s ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4f46e5';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#6366f1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {mounted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": allFAQItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": typeof item.answer === 'string' ? item.answer : 'See details in the app'
                }
              }))
            })
          }}
        />
      )}
      {/* Header Section with Gradient Background */}
      <div style={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #8b5cf6 100%)',
        padding: '90px 0 30px',
        color: '#FFFFFF',
        marginTop: '0'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {/* FAQ Hero Section */}
          <section className="faq-hero-section" style={{ textAlign: 'center', marginTop: '0', paddingTop: '0', paddingBottom: '0', padding: '0' }}>
            <h1 className="faq-hero-title" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              marginTop: '0',
              marginBottom: '1.5rem', 
              color: '#FFFFFF',
              fontFamily: 'var(--font-secondary)',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              textTransform: 'uppercase'
            }}>
              FREQUENTLY ASKED QUESTIONS
            </h1>
            
            {/* Category Filter Links */}
            <div className="faq-category-filters" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1.25rem', 
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.9375rem',
              fontFamily: 'var(--font-primary)'
            }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="faq-category-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: selectedCategory === category ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-out',
                    fontFamily: 'var(--font-primary)',
                    textDecoration: selectedCategory === category ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.opacity = '0.8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Bar with Button */}
            <div className="faq-search" style={{ 
              display: 'flex', 
              maxWidth: '700px', 
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '0.5rem',
              border: '2px solid #FFFFFF',
              overflow: 'hidden'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Search is already handled by onChange
                  }
                }}
                placeholder="Search FAQs"
                className="search-input"
                style={{
                  flex: 1,
                  padding: '0.875rem 1.25rem',
                  border: 'none',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  background: '#FFFFFF',
                  color: '#1F2937',
                  fontFamily: 'var(--font-primary)'
                }}
              />
              <button
                onClick={() => {
                  // Search is handled by the input onChange
                }}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-primary)',
                  transition: 'opacity 0.2s ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Search
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Content Section with White Background */}
      <div style={{ 
        background: '#F9FAFB',
        padding: '20px 0 80px',
        minHeight: '50vh'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>

          {/* FAQ Content */}
          <section className="faq-content-section" style={{ marginTop: '0', paddingTop: '0' }}>
            <div className="faq-sections">
              {filteredSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="faq-section" style={{ marginBottom: '2rem', marginTop: sectionIndex === 0 ? '0' : '2rem' }}>
                  <h2 className="faq-section-title" style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    marginTop: sectionIndex === 0 ? '1rem' : '0',
                    marginBottom: '0.75rem',
                    color: '#1F2937',
                    fontFamily: 'var(--font-secondary)',
                    lineHeight: '1.3',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {section.title}
                  </h2>
                  <div className="faq-items">
                    {section.items.map((item, itemIndex) => {
                      const globalIndex = sectionIndex * 1000 + itemIndex;
                      const isOpen = openItems.includes(globalIndex);
                      return (
                        <div key={itemIndex} className="faq-item" style={{
                          background: '#FFFFFF',
                          borderBottom: '1px solid #E5E7EB',
                          paddingBottom: isOpen ? '1rem' : '0.75rem',
                          marginBottom: '0.75rem',
                          transition: 'all 0.25s ease-out',
                          minHeight: 'auto'
                        }}>
                          <div
                            className="faq-question"
                            onClick={() => toggleItem(globalIndex)}
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              transition: 'all 0.25s ease-out',
                              paddingTop: '0.5rem',
                              paddingBottom: '0.5rem'
                            }}
                          >
                            <h3 style={{ 
                              fontSize: '1rem', 
                              fontWeight: 500, 
                              color: '#1F2937', 
                              margin: 0,
                              fontFamily: 'var(--font-primary)',
                              lineHeight: '1.5',
                              flex: 1,
                              paddingRight: '1rem'
                            }}>
                              {item.question}
                            </h3>
                            <span
                              style={{
                                color: '#6366f1',
                                fontSize: '1.25rem',
                                fontWeight: 300,
                                flexShrink: 0,
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.25s ease-out',
                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                marginTop: '0.125rem'
                              }}
                            >
                              {isOpen ? '×' : '+'}
                            </span>
                          </div>
                          {isOpen && (
                            <div className="faq-answer" style={{
                              marginTop: '0.75rem',
                              color: '#4B5563',
                              lineHeight: '1.6',
                              fontSize: '0.9375rem',
                              fontFamily: 'var(--font-primary)',
                              paddingRight: '2rem',
                              paddingBottom: '0.25rem',
                              display: 'block',
                              visibility: 'visible',
                              opacity: 1,
                              maxHeight: 'none',
                              overflow: 'visible'
                            }}>
                              {typeof item.answer === 'string' ? (
                                <p style={{ margin: 0, color: '#4B5563' }}>{item.answer}</p>
                              ) : (
                                <div style={{ margin: 0, color: '#4B5563' }}>{item.answer}</div>
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
                <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>No FAQs found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease-out',
                    fontSize: '0.9375rem',
                    fontFamily: 'var(--font-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
