'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[11px] font-medium text-[var(--muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full rounded-[6px] border bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] transition-all ${
              error
                ? 'border-[var(--danger)] focus:border-[var(--danger)] animate-shake'
                : 'border-[var(--border)] hover:border-[var(--border-hover)] focus:border-[var(--accent)]'
            } focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ${className}`}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] text-[var(--danger)]"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <p className="text-[11px] text-[var(--muted)]">{hint}</p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
