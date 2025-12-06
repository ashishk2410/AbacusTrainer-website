import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | Abacus Trainer',
  description: 'Find answers to common questions about Abacus Trainer app. Learn about features, pricing, tutorials, challenges, offline mode, and more. Get help with abacus learning and mental math training.',
  keywords: [
    'abacus trainer FAQ',
    'abacus app help',
    'mental math questions',
    'abacus learning guide',
    'app support',
    'abacus tutorial help',
    'abacus trainer support',
    'mental math training FAQ'
  ],
  openGraph: {
    title: 'FAQ - Abacus Trainer Help & Support',
    description: 'Get answers to frequently asked questions about Abacus Trainer app, features, and usage.',
    url: 'https://abacustrainer.netlify.app/faq',
    type: 'website',
  },
  alternates: {
    canonical: 'https://abacustrainer.netlify.app/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


