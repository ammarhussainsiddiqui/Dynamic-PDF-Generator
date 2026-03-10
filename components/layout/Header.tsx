'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-muted">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity">
          Fast<span className="text-gradient"> PDF</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">Pricing</Link>
          {session && (
            <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden md:block">{session.user?.name || session.user?.email}</span>
              <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" withArrow>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
