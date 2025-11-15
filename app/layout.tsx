import type { Metadata } from 'next'
import { Poppins, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InviteBanner from '@/components/InviteBanner'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

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
  title: 'Abacus Trainer - Start Your Math Adventure! | Download Now',
  description: 'Start your math adventure with Abacus Trainer! Fun, kid-friendly learning with AI-powered practice, challenges, and games. Perfect for ages 6+. Download now!',
  keywords: 'abacus, mental math, AI learning, educational app, math practice, abacus trainer, mental arithmetic, math games, learning app',
  authors: [{ name: 'Abacus Trainer' }],
  openGraph: {
    type: 'website',
    url: 'https://abacustrainer.netlify.app/',
    title: 'Abacus Trainer - Start Your Math Adventure!',
    description: 'Fun, kid-friendly abacus learning with AI recommendations, practice challenges, and 7-day tutorial system. Perfect for ages 6+!',
    images: ['https://abacustrainer.netlify.app/images/phone-mockup.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abacus Trainer - Start Your Math Adventure!',
    description: 'Fun, kid-friendly abacus learning with AI recommendations, practice challenges, and 7-day tutorial system. Perfect for ages 6+!',
    images: ['https://abacustrainer.netlify.app/images/phone-mockup.png'],
  },
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
      </head>
      <body className={`${poppins.variable} ${nunito.variable} font-primary`}>
        <ErrorBoundary>
          <AuthProvider>
            <InviteBanner />
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}


