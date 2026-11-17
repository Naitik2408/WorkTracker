'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors ${className || ''}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
