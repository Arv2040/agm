import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ActiveStateProvider } from './context'; // import your context provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caterpillar Fleet Management System',
  description: 'Advanced analytics and real-time monitoring for your heavy equipment fleet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-cat-dark text-cat-text-primary antialiased`}>
        <ActiveStateProvider>
          {children}
        </ActiveStateProvider>
      </body>
    </html>
  );
}
