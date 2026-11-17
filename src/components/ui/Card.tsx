'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

export function Card({
  hoverEffect = true,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -1 } : undefined}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] transition-colors ${
        hoverEffect ? 'hover:border-[var(--border-hover)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)] ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={`text-xs font-semibold tracking-tight text-[var(--foreground)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`text-[11px] text-[var(--muted)] leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
