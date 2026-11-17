'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  AlertCircle, 
  ChevronDown, 
  Command, 
  Menu,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

interface HeaderProps {
  onOpenQuickAdd?: () => void;
  onToggleAdvisor?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenMobileNav?: () => void;
  isAdvisorOpen?: boolean;
  approvalCount?: number;
}

export function Header({
  onOpenQuickAdd,
  onToggleAdvisor,
  onOpenCommandPalette,
  onOpenMobileNav,
  isAdvisorOpen,
  approvalCount = 1,
}: HeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: '/' },
    { name: '7 Domains', href: '/overview' },
    { name: 'Career & 95/5', href: '/career' },
    { name: 'Ventures', href: '/ventures' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Reviews', href: '/reviews' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md select-none">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6">
        
        {/* Left: Mobile Menu Trigger + Brand & Project Breadcrumb */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Mobile hamburger button */}
          <button
            onClick={onOpenMobileNav}
            aria-label="Open mobile navigation"
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo & Brand */}
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

          {/* Project switcher dropdown */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center space-x-1.5 rounded-[6px] px-2 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--background-2)] transition-colors"
          >
            <span>All Projects</span>
            <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
          </button>
        </div>

        {/* Center: Top Navigation Tabs (Desktop) with sliding underline */}
        <nav className="hidden lg:flex items-center space-x-1 h-full pt-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
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
          
          {/* Cmd+K trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center space-x-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors"
          >
            <Command className="h-3 w-3" />
            <span className="text-[11px] font-mono">K</span>
          </button>

          {/* Create New (+ button) */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenQuickAdd}
            className="min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Create New</span>
          </Button>

          {/* Pending Approval Badge (5% Action Guardrail) */}
          {approvalCount > 0 && (
            <button
              onClick={onToggleAdvisor}
              className="flex items-center space-x-1.5 rounded-[6px] border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-2 sm:px-2.5 py-1 text-xs font-semibold text-[var(--warning)] hover:bg-[var(--warning)]/20 transition-colors min-h-[36px] sm:min-h-[32px]"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{approvalCount} Pending</span>
              <span className="sm:hidden">{approvalCount}</span>
            </button>
          )}

          {/* Gemini Advisor Button */}
          <Button
            size="sm"
            variant={isAdvisorOpen ? 'primary' : 'secondary'}
            onClick={onToggleAdvisor}
            className="min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 sm:mr-1.5" />
            <span className="hidden sm:inline">Advisor</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle className="min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]" />
        </div>

      </div>
    </header>
  );
}
