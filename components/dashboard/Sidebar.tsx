'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutTemplate, 
  BarChart3, 
  History, 
  Key, 
  Settings, 
  Plus, 
  LogOut,
  ChevronRight,
  Zap
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Templates', href: '/dashboard', icon: LayoutTemplate },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card/30 backdrop-blur-2xl border-r border-muted flex flex-col z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <span className="font-heading font-black text-xl tracking-tighter">FAST PDF</span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto pt-4">
        <div>
          <p className="px-4 text-[10px] font-mono font-bold text-foreground/30 uppercase tracking-[0.2em] mb-4">
            Workspace
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative",
                    isActive 
                      ? "text-accent bg-accent/5 font-bold" 
                      : "text-foreground/50 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-foreground/40 group-hover:text-foreground")} />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                    />
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-mono font-bold text-foreground/30 uppercase tracking-[0.2em] mb-4">
            Actions
          </p>
          <Link href="/templates/new">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-light transition-all active:scale-[0.98]">
              <Plus className="w-5 h-5" />
              <span className="text-sm font-bold">New Template</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-muted bg-muted/20">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-all font-mono text-xs uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
