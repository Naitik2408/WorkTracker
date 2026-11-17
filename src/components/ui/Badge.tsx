'use client';

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent';

export interface BadgeProps {
  variant?: BadgeVariant;
  pulse?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  pulse = false,
  dot = true,
  children,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: {
      wrapper: 'bg-[var(--background-2)] text-[var(--foreground)] border border-[var(--border)]',
      dot: 'bg-[var(--subtle)]',
    },
    success: {
      wrapper: 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20',
      dot: 'bg-[var(--success)]',
    },
    warning: {
      wrapper: 'bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20',
      dot: 'bg-[var(--warning)]',
    },
    danger: {
      wrapper: 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20',
      dot: 'bg-[var(--danger)]',
    },
    accent: {
      wrapper: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
      dot: 'bg-[var(--accent)]',
    },
  }[variant];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-tight ${variantStyles.wrapper} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${variantStyles.dot} ${
            pulse ? 'animate-soft-pulse' : ''
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
