'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none group',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-primary text-white shadow-lg shadow-accent/20 hover:shadow-accent/40',
        secondary:
          'border border-accent/30 bg-transparent text-foreground hover:border-accent/50 hover:bg-accent/5',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onAnimationStart'>,
    VariantProps<typeof buttonVariants> {
  withArrow?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, withArrow, isLoading, children, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
        {withArrow && !isLoading && (
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
