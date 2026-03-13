import { cn } from '@/lib/utils';
import React from 'react';

export function Badge({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20", className)}>
      {active && (
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot shrink-0" />
      )}
      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
        {children}
      </span>
    </div>
  );
}
