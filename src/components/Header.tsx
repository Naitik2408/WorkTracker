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
  Bell, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

interface HeaderProps {
  onOpenQuickAdd?: () => void;
  onToggleAdvisor?: () => void;
  onOpenCommandPalette?: () => void;
  isAdvisorOpen?: boolean;
  approvalCount?: number;
}

export function Header({
  onOpenQuickAdd,
  onToggleAdvisor,
  onOpenCommandPalette,
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
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Project Selector Breadcrumb */}
        <div className="flex items-center space-x-3">
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

          <span className="text-[var(--border)]">/</span>

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-1.5 rounded-[6px] px-2 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--background-2)] transition-colors"
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
        <div className="flex items-center space-x-2">
          
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
            className="hidden sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Create New</span>
          </Button>

          {/* Pending Approval Badge (5% Action Guardrail) */}
          {approvalCount > 0 && (
            <button
              onClick={onToggleAdvisor}
              className="flex items-center space-x-1.5 rounded-[6px] border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--warning)] hover:bg-[var(--warning)]/20 transition-colors"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{approvalCount} Pending</span>
            </button>
          )}

          {/* Gemini Advisor Button */}
          <Button
            size="sm"
            variant={isAdvisorOpen ? 'primary' : 'secondary'}
            onClick={onToggleAdvisor}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 mr-1.5" />
            <span>Advisor</span>
          </Button>

          {/* Theme Toggle (Light default + 200ms rotating Sun/Moon) */}
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
