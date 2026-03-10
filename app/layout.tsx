import type { Metadata } from 'next';
import { Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'], 
  subsets: ['latin'], 
  variable: '--font-poppins' 
});
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://fastpdfv1.vercel.app'),
  title: 'Fast PDF Generator',
  description: 'Self-hosted Fast PDF with Minimalist Modern design',
};

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans min-h-screen selection:bg-accent/20 selection:text-accent">
        <Providers>
          {/* Subtle radial glow in background */}
          <div className="fixed top-[-150px] left-[-150px] w-[500px] h-[500px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 shrink-0 flex flex-col relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
