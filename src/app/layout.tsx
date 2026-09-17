import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ISLAH — See it. Snap it. Solved.',
  description: 'ISLAH is a modern civic technology platform enabling citizens to report local civic issues in seconds and allowing departments to transparently route, resolve, verify, and track them.',
  keywords: ['civic tech', 'municipal reporting', 'pothole report', 'smart city', 'civic infrastructure', 'ISLAH'],
  openGraph: {
    title: 'ISLAH — See it. Snap it. Solved.',
    description: 'Civic problem-to-progress platform. Report local issues instantly and follow transparent department resolution.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[--bg-base] text-[--text-primary] selection:bg-zinc-800 selection:text-white"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppProvider>
            <Navbar />
            <main className="flex-1 w-full bg-[--bg-base]">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
