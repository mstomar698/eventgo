import { FetchConfig } from 'http-react';
import './styles/globals.css';
import ProvidersWrapper from './providerswrapper';

export const metadata = {
  title: 'EventGo',
  description: 'Professional event planning workspace powered by AI-assisted workflows.',
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
