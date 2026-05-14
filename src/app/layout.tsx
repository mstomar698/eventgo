// Root layout for EventGo app-router pages
// Provides global providers, fetch config and base metadata
import { FetchConfig } from 'http-react';
import './styles/globals.css';
import ProvidersWrapper from './providerswrapper';

export const metadata = {
  title: 'EventGo',
  description:
    'EventGo — professional event planning workspace with structured planners, reusable templates, and AI-assisted ideation for small-to-medium events.',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
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
