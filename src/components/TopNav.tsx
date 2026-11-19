'use client';

import React from 'react';
import Link from 'next/link';
import { Command, ChevronRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopNavProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onOpenCommandPalette?: () => void;
}

export function TopNav({ breadcrumbs = [], onOpenCommandPalette }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md select-none">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6 max-w-[1400px] mx-auto">
        
        {/* Left: Brand + Dynamic Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs">
          <Link href="/" className="flex items-center space-x-2 text-[var(--foreground)] hover:opacity-80 transition-opacity">
            <svg
              height="16"
              viewBox="0 0 115 100"
              fill="currentColor"
              className="text-[var(--foreground)]"
            >
              <path d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
            <span className="font-semibold tracking-tight">WorkTracker</span>
          </Link>

          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-[var(--subtle)] shrink-0" />
              {b.href ? (
                <Link
                  href={b.href}
                  className="font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {b.label}
                </Link>
              ) : (
                <span className="font-medium text-[var(--foreground)] truncate max-w-[150px] sm:max-w-none">
                  {b.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center space-x-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Open command palette"
            >
              <span className="text-[11px]">Search projects...</span>
              <kbd className="flex items-center space-x-0.5 rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.2 text-[9px] font-mono text-[var(--muted)]">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </kbd>
            </button>
          )}

          <ThemeToggle className="h-7 w-7" />

          {/* User Avatar */}
          <div className="h-7 w-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-medium tracking-tight">
            NK
          </div>
        </div>

      </div>
    </header>
  );
}
