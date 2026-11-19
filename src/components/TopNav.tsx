'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command, ChevronRight, Eye, EyeOff, LayoutGrid, Briefcase, Activity, Calendar } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePrivacy } from './PrivacyProvider';

interface TopNavProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onOpenCommandPalette?: () => void;
}

export function TopNav({ breadcrumbs = [], onOpenCommandPalette }: TopNavProps) {
  const pathname = usePathname();
  const { hideNumbers, toggleHideNumbers } = usePrivacy();

  const modules = [
    { id: 'home', label: 'Today', href: '/', icon: Calendar },
    { id: 'projects', label: 'Projects', href: '/projects', icon: LayoutGrid },
    { id: 'jobs', label: 'Jobs', href: '/jobs', icon: Briefcase },
    { id: 'life', label: 'Life', href: '/life', icon: Activity, badge: 'View only' },
  ];

  const isModuleActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md select-none">
      <div className="flex h-12 items-center justify-between px-3 sm:px-6 max-w-[1400px] mx-auto gap-2">
        
        {/* Left: Custom WorkTracker Glyph Mark + Brand + Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs shrink-0">
          <Link href="/" className="flex items-center space-x-2 text-[var(--foreground)] hover:opacity-85 transition-opacity">
            {/* Original WorkTracker Glyph: Geometric dual-ring progress mark */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--foreground)] shrink-0"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 17.5h7M17.5 14v7" />
            </svg>
            <span className="font-bold tracking-tight text-xs hidden xs:inline">WorkTracker</span>
          </Link>

          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3 w-3 text-[var(--subtle)] shrink-0" />
              {b.href ? (
                <Link
                  href={b.href}
                  className="font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors truncate max-w-[110px] sm:max-w-none"
                >
                  {b.label}
                </Link>
              ) : (
                <span className="font-medium text-[var(--foreground)] truncate max-w-[110px] sm:max-w-none">
                  {b.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Center: Module Switcher (Home, Projects, Jobs, Life) */}
        <nav className="flex items-center space-x-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5 overflow-x-auto max-w-full">
          {modules.map((m) => {
            const active = isModuleActive(m.href);
            return (
              <Link
                key={m.id}
                href={m.href}
                className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <span>{m.label}</span>
                {m.badge && (
                  <span className="rounded px-1 py-0 text-[8px] font-mono border border-[var(--border)] text-[var(--muted)] hidden sm:inline">
                    {m.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar: Privacy Eye + Cmd+K + Theme + User */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Privacy Blur Toggle */}
          <button
            onClick={toggleHideNumbers}
            className={`flex items-center justify-center h-7 w-7 rounded-[6px] border transition-colors ${
              hideNumbers
                ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
            title={hideNumbers ? 'Show sensitive numbers' : 'Hide sensitive numbers (privacy mode)'}
            aria-label="Toggle privacy masking"
          >
            {hideNumbers ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>

          {/* Search Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center space-x-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Open command palette"
            >
              <span className="text-[11px]">Cmd+K</span>
              <kbd className="flex items-center space-x-0.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1 py-0.2 text-[9px] font-mono text-[var(--muted)]">
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
