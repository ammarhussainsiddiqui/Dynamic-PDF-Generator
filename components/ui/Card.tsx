'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

export function Card({
  className,
  children,
  featured = false,
}: {
  className?: string;
  children: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-xl bg-card p-6 shadow-md transition-shadow hover:shadow-xl',
        className
      )}
    >
      {/* Featured gradient border illusion */}
      {featured && (
        <div className="absolute -inset-[1px] -z-10 rounded-xl bg-gradient-to-br from-accent to-accent-light opacity-50" />
      )}
      {children}
    </motion.div>
  );
}
