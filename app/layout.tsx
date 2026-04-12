import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Email Responder | SaaS',
  description: 'Generate professional email replies in 3 languages powered by AI',
  keywords: 'email, AI, responder, customer service, SaaS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
