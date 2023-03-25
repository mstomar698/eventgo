import { FetchConfig } from 'http-react';
import './styles/globals.css';
import ProvidersWrapper from './providerswrapper';

export const metadata = {
  title: 'eventgo',
  description: 'An visualized event planner to help planning a better event',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FetchConfig baseUrl="/api">
      <html lang="en">
        <body>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </body>
      </html>
    </FetchConfig>
  );
}
