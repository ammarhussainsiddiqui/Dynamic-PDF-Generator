import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-2xl border-t border-muted/50 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-heading font-black text-xl tracking-tighter uppercase">FAST PDF</span>
            </Link>
            <p className="text-foreground/40 text-sm leading-relaxed max-w-xs">
              Industrial-grade PDF generation for modern development teams.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-12 gap-y-6">
            {/* <Link href="/#features" className="text-sm text-foreground/50 hover:text-accent transition-colors font-mono font-bold uppercase tracking-widest">
              Features
            </Link> */}
            <Link href="/dashboard" className="text-sm text-foreground/50 hover:text-accent transition-colors font-mono font-bold uppercase tracking-widest">
              Workspace
            </Link>
            <Link href="/privacy" className="text-sm text-foreground/50 hover:text-accent transition-colors font-mono font-bold uppercase tracking-widest">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-foreground/50 hover:text-accent transition-colors font-mono font-bold uppercase tracking-widest">
              Terms
            </Link>
          </nav>
        </div>

        <div className="pt-8 border-t border-muted/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono font-bold text-foreground/20 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Fast PDF Infrastructure. All systems functional.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono font-bold text-foreground/30 uppercase tracking-[0.15em]">Global Infrastructure Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
