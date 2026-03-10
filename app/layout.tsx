import type { Metadata } from 'next';
import { Inter, Calistoga, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const calistoga = Calistoga({ weight: '400', subsets: ['latin'], variable: '--font-calistoga' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Fast PDF Generator',
  description: 'Self-hosted PDF Monkey clone with Minimalist Modern design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans min-h-screen selection:bg-accent/20 selection:text-accent">
        <Providers>
          {/* Subtle radial glow in background */}
          <div className="fixed top-[-150px] left-[-150px] w-[500px] h-[500px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
