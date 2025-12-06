import type { Metadata } from 'next'
import { Poppins, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InviteBanner from '@/components/InviteBanner'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieConsentProvider } from '@/contexts/CookieConsentContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import PageTracking from '@/components/PageTracking'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import TawkTo from '@/components/TawkTo'
import BackToTop from '@/components/BackToTop'

const poppins = Poppins({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-primary',
})

const nunito = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-secondary',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://abacustrainer.netlify.app'),
  title: {
    default: 'Abacus Trainer - AI-Powered Mental Math Training App | Download Free',
    template: '%s | Abacus Trainer'
  },
  description: 'Master mental math with Abacus Trainer! AI-powered abacus learning app for students, teachers, and parents. Adaptive practice, offline mode, progress tracking, and gamification. Free during beta. Download now on Google Play!',
  keywords: [
    'abacus trainer',
    'abacus app',
    'mental math',
    'mental arithmetic',
    'abacus learning',
    'math practice app',
    'AI-powered abacus',
    'abacus for kids',
    'mental math training',
    'abacus calculator',
    'math education',
    'educational app',
    'abacus tutorial',
    'mental calculation',
    'abacus practice',
    'math learning app',
    'cognitive math training',
    'abacus training',
    'mental math games',
    'abacus for students',
    'math skills development',
    'abacus online',
    'mental math practice',
    'abacus teacher',
    'math coaching app'
  ],
  authors: [{ name: 'Abacus Trainer', url: 'https://abacustrainer.netlify.app' }],
  creator: 'Abacus Trainer',
  publisher: 'Abacus Trainer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abacustrainer.netlify.app/',
    siteName: 'Abacus Trainer',
    title: 'Abacus Trainer - AI-Powered Mental Math Training App',
    description: 'Master mental math with AI-powered abacus learning. Adaptive practice, offline mode, progress tracking. Free during beta. Download now!',
    images: [
      {
        url: 'https://abacustrainer.netlify.app/images/phone-mockup.png',
        width: 1200,
        height: 630,
        alt: 'Abacus Trainer App - AI-Powered Mental Math Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abacus Trainer - AI-Powered Mental Math Training App',
    description: 'Master mental math with AI-powered abacus learning. Adaptive practice, offline mode, progress tracking. Free during beta!',
    images: ['https://abacustrainer.netlify.app/images/phone-mockup.png'],
    creator: '@abacustrainer',
  },
  alternates: {
    canonical: 'https://abacustrainer.netlify.app/',
  },
  category: 'Education',
  classification: 'Educational Software',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
        <link rel="canonical" href="https://abacustrainer.netlify.app/" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="google-site-verification" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Abacus Trainer" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Abacus Trainer",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "ratingCount": "100"
              },
              "description": "AI-powered abacus and mental math training app with adaptive practice, offline mode, progress tracking, and gamification features.",
              "screenshot": "https://abacustrainer.netlify.app/images/phone-mockup.png",
              "softwareVersion": "4.3",
              "releaseNotes": "Latest version with AI-powered practice and offline mode",
              "downloadUrl": "https://play.google.com/store/apps/details?id=com.abacus.trainer",
              "author": {
                "@type": "Organization",
                "name": "Abacus Trainer",
                "url": "https://abacustrainer.netlify.app"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Abacus Trainer",
              "url": "https://abacustrainer.netlify.app",
              "logo": "https://abacustrainer.netlify.app/images/logo.svg",
              "description": "AI-powered abacus and mental math training platform for students, teachers, and parents.",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "myabacustrainer@gmail.com",
                "contactType": "Customer Support"
              },
              "sameAs": [
                "https://play.google.com/store/apps/details?id=com.abacus.trainer"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Abacus Trainer",
              "url": "https://abacustrainer.netlify.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://abacustrainer.netlify.app/faq?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${poppins.variable} ${nunito.variable} font-primary`}>
        <ErrorBoundary>
          <CookieConsentProvider>
            <GoogleAnalytics />
            <AuthProvider>
              <PageTracking />
              <InviteBanner />
              <Navbar />
              {children}
              <Footer />
              <CookieConsentBanner />
              <BackToTop />
              <TawkTo />
            </AuthProvider>
          </CookieConsentProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}


