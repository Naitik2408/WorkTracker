'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ChevronDown, 
  Command, 
  ExternalLink,
  Menu
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

interface HeaderProps {
  onOpenQuickAdd?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenMobileNav?: () => void;
}

export function Header({
  onOpenQuickAdd,
  onOpenCommandPalette,
  onOpenMobileNav,
}: HeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: '/' },
    { name: 'Deployments', href: '/#deployments' },
    { name: 'Analytics', href: '/#analytics' },
    { name: 'Settings', href: '/#settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md select-none">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6">
        
        {/* Left: Mobile Menu Trigger + Project Selector Breadcrumb */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          <button
            onClick={onOpenMobileNav}
            aria-label="Open mobile navigation"
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <svg
              height="18"
              viewBox="0 0 115 100"
              fill="currentColor"
              className="text-[var(--foreground)]"
            >
              <path d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
            <span className="font-semibold text-xs tracking-tight text-[var(--foreground)]">
              WorkTracker
            </span>
          </Link>

          <span className="text-[var(--border)] hidden sm:inline">/</span>

          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center space-x-1.5 rounded-[6px] px-2 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--background-2)] transition-colors"
          >
            <span>All Projects</span>
            <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
          </button>
        </div>

        {/* Center: Top Navigation Tabs (Desktop) matching Vercel */}
        <nav className="hidden lg:flex items-center space-x-1 h-full pt-1">
          {tabs.map((tab) => {
            const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative px-3 py-4 text-xs font-medium transition-colors select-none ${
                  isActive
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <span>{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="header-tab-indicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--foreground)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center space-x-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors"
          >
            <Command className="h-3 w-3" />
            <span className="text-[11px] font-mono">K</span>
          </button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenQuickAdd}
            className="min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Create Project</span>
          </Button>

          <ThemeToggle className="min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]" />
        </div>

      </div>
    </header>
  );
}
