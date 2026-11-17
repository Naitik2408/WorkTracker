'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Exact Vercel heights: 32px, 36px, 40px with 6px border-radius
    const sizeClasses = {
      sm: 'h-8 px-2.5 text-xs font-medium',
      md: 'h-9 px-3.5 text-xs font-medium',
      lg: 'h-10 px-4 text-sm font-medium',
    }[size];

    const variantClasses = {
      primary:
        'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:opacity-100 disabled:opacity-40 border border-transparent shadow-xs',
      secondary:
        'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--background-2)] disabled:opacity-40 shadow-xs',
      ghost:
        'bg-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-2)] disabled:opacity-40',
      destructive:
        'border border-transparent bg-[var(--danger)] text-white hover:opacity-90 disabled:opacity-40 shadow-xs',
    }[variant];

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || isLoading}
        className={`relative inline-flex items-center justify-center rounded-[6px] whitespace-nowrap transition-colors select-none ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="opacity-70">Loading...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
