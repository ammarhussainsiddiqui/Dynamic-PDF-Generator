'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/40 border-b border-muted/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <span className="font-heading font-black text-xl tracking-tighter uppercase">FAST PDF</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {/* <Link href="/#features" className="text-xs font-mono font-bold text-foreground/40 hover:text-accent transition-colors uppercase tracking-widest">Features</Link> */}
          <Link href="/dashboard" className="text-xs font-mono font-bold text-foreground/40 hover:text-accent transition-colors uppercase tracking-widest">Workspace</Link>
        </nav>

        <div className="flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono font-bold text-foreground/30 uppercase tracking-[0.2em] hidden md:block">
                {session.user?.name || session.user?.email?.split('@')[0]}
              </span>
              <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="font-mono text-[10px] tracking-widest uppercase">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-mono text-[10px] tracking-widest uppercase text-foreground/40 hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" withArrow className="font-mono text-[10px] tracking-widest uppercase">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
