import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

