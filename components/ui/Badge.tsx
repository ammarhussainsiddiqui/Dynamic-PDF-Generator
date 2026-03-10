import { cn } from '@/lib/utils';
import React from 'react';

export function Badge({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
      {active && (
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
      )}
      <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
        {children}
      </span>
    </div>
  );
}
