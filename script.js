// Enhanced JavaScript for Abacus Trainer Website
// SEO, Performance, and User Experience Optimizations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeFAQ();
    initializeAnimations();
    initializePerformanceOptimizations();
    initializeSEOFeatures();
    initializeAnalytics();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    const breadcrumbLink = document.querySelector('.breadcrumb-link');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // Dynamic breadcrumb updates
    const sections = document.querySelectorAll('section[id]');
    const breadcrumbText = document.querySelector('.breadcrumb-text');
    
    function updateBreadcrumb() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('-', ' ');
                if (breadcrumbText) {
                    breadcrumbText.textContent = sectionName;
                }
            }
        });
    }
    
    window.addEventListener('scroll', debounce(updateBreadcrumb, 100), { passive: true });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .feature-card, .audience-card, .pricing-card, .testimonial-card, .step');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }, { passive: true });
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                // Track FAQ interactions for analytics
                if (item.classList.contains('active')) {
                    trackEvent('FAQ', 'Question Opened', question.textContent.trim());
                }
            });
        }
    });
}

// Animation utilities
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Optimize scroll events
    let ticking = false;
    function updateScrollEffects() {
        // Your scroll-based updates here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// SEO and analytics features
function initializeSEOFeatures() {
    // Track page views
    trackPageView();
    
    // Track user interactions
    trackUserInteractions();
    
    // Add structured data for better SEO
    addStructuredData();
    
    // Optimize for Core Web Vitals
    optimizeCoreWebVitals();
}

function initializeAnalytics() {
    // Google Analytics 4 implementation
    if (typeof gtag !== 'undefined') {
        // Track custom events
        window.trackEvent = function(category, action, label, value) {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        };
        
        // Track page views
        window.trackPageView = function(pagePath = window.location.pathname) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: pagePath
            });
        };
    } else {
        // Fallback tracking for when GA is not loaded
        window.trackEvent = function(category, action, label, value) {
            console.log('Event tracked:', { category, action, label, value });
        };
        
        window.trackPageView = function(pagePath = window.location.pathname) {
            console.log('Page view tracked:', pagePath);
        };
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Track user interactions
function trackUserInteractions() {
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonType = this.classList.contains('btn-primary') ? 'Primary' : 'Secondary';
            trackEvent('Button', 'Click', `${buttonType} - ${buttonText}`);
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'Click', this.textContent.trim());
        });
    });
    
    // Track pricing card interactions
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('click', function() {
            const planName = this.querySelector('h3').textContent.trim();
            trackEvent('Pricing', 'Card Click', planName);
        });
    });
    
    // Track external link clicks
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('External Link', 'Click', this.href);
        });
    });
}

// Add structured data for better SEO
function addStructuredData() {
    // Add FAQ structured data
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    };
    
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        const question = item.querySelector('.faq-question h3').textContent.trim();
        const answer = item.querySelector('.faq-answer p').textContent.trim();
        
        faqData.mainEntity.push({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answer
            }
        });
    });
    
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify(faqData);
    document.head.appendChild(faqScript);
    
    // Add organization structured data
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Abacus Trainer",
        "url": "https://abacustrainer.netlify.app",
        "logo": "https://abacustrainer.netlify.app/images/logo.svg",
        "description": "Master abacus faster with AI-powered practice sessions, progress tracking, and gamification.",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "MyAbacusTrainer@GMail.com",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://play.google.com/store/apps/details?id=com.abacus.trainer"
        ]
    };
    
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.textContent = JSON.stringify(organizationData);
    document.head.appendChild(orgScript);
}

// Optimize for Core Web Vitals
function optimizeCoreWebVitals() {
    // Optimize Largest Contentful Paint (LCP)
    const heroImage = document.querySelector('.phone-mockup');
    if (heroImage) {
        heroImage.loading = 'eager';
        heroImage.fetchPriority = 'high';
    }
    
    // Optimize Cumulative Layout Shift (CLS)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            img.style.aspectRatio = '1 / 1';
        }
    });
    
    // Optimize First Input Delay (FID)
    document.addEventListener('click', function() {
        // Preload critical resources on first interaction
        const criticalImages = document.querySelectorAll('img[data-src]');
        criticalImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }, { once: true });
}

// Error handling and monitoring
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    if (typeof trackEvent === 'function') {
        trackEvent('Error', 'JavaScript Error', e.message);
    }
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (typeof trackEvent === 'function') {
                    trackEvent('Performance', 'Page Load Time', loadTime.toString());
                }
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        trackEvent,
        trackPageView
    };
}