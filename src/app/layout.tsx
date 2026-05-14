// Root layout for EventGo app-router pages
// Provides global providers, fetch config and base metadata
import { FetchConfig } from 'http-react';
import './styles/globals.css';
import ProvidersWrapper from './providerswrapper';

const BASE = process.env.NEXTAUTH_URL || 'https://eventgo.app';

export const metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'EventGo — Plan smarter. Execute calmer.',
    template: '%s | EventGo',
  },
  description:
    'EventGo is an AI-powered event planning workspace. Create themes, build visual flowcharts, track vendors, and manage notes — all in one place.',
  keywords: [
    'event planning',
    'event theme generator',
    'AI event planner',
    'event flowchart',
    'party planning app',
    'wedding planner tool',
    'corporate event planning',
  ],
  authors: [{ name: 'EventGo' }],
  creator: 'EventGo',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE,
    siteName: 'EventGo',
    title: 'EventGo — Plan smarter. Execute calmer.',
    description:
      'AI-powered event planning workspace. Create themes, build planning boards, manage vendors and notes.',
    images: [{ url: '/icon.png', width: 192, height: 192, alt: 'EventGo logo' }],
  },
  twitter: {
    card: 'summary',
    title: 'EventGo — Plan smarter. Execute calmer.',
    description: 'AI-powered event planning workspace.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <FetchConfig baseUrl="/api">
      <html lang="en">
        <body className="min-h-screen antialiased">
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </body>
      </html>
    </FetchConfig>
  );
}
