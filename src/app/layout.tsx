import { FetchConfig } from 'http-react';
import './styles/globals.css';

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
        <body>{children}</body>
      </html>
    </FetchConfig>
  );
}
