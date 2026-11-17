'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutGrid, 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  HeartPulse, 
  Wallet, 
  CheckSquare, 
  Compass, 
  Target, 
  Lightbulb, 
  BarChart3, 
  CalendarCheck2, 
  Sparkles, 
  Plus,
  Command,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd?: () => void;
  onOpenCommandPalette?: () => void;
}

const navSections = [
  {
    title: 'Command Center',
    items: [
      { name: 'Morning Control Center', href: '/', icon: LayoutGrid },
      { name: 'Life at a Glance (7 Domains)', href: '/overview', icon: Compass },
    ],
  },
  {
    title: 'The 7 Life Areas',
    items: [
      { name: 'Career & 95/5 Job Hunt', href: '/career', icon: Briefcase, badge: '95/5' },
      { name: 'Business & Ventures (Klarone)', href: '/ventures', icon: Rocket },
      { name: 'Learning & Capability Matrix', href: '/learning', icon: GraduationCap },
      { name: 'Health & Fitness Routines', href: '/health', icon: HeartPulse },
      { name: 'Personal Finance & Cashflow', href: '/finance', icon: Wallet },
      { name: 'Personal Operations & Schedule', href: '/operations', icon: CheckSquare, badge: 'Due' },
      { name: 'Personal Growth & Reflection', href: '/growth', icon: Compass },
    ],
  },
  {
    title: 'Strategy & Cadence',
    items: [
      { name: 'Goals & Cascading Milestones', href: '/goals', icon: Target },
      { name: 'Idea Evaluation Sandbox', href: '/sandbox', icon: Lightbulb },
      { name: 'Analytics & Trend Patterns', href: '/analytics', icon: BarChart3 },
      { name: 'Cadence Reviews (Daily/Weekly)', href: '/reviews', icon: CalendarCheck2 },
    ],
  },
];

export function MobileNav({
  isOpen,
  onClose,
  onOpenQuickAdd,
  onOpenCommandPalette,
}: MobileNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer: slides in from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 flex w-[85%] max-w-xs flex-col justify-between border-r border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl select-none"
          >
            <div className="overflow-y-auto">
              
              {/* Top Drawer Header with Brand & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold">
                    N
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">
                      Naitik Kumar
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">
                      WorkTracker Mobile
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close navigation"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Action Buttons for Mobile */}
              <div className="grid grid-cols-2 gap-2 py-3 border-b border-[var(--border)]">
                <Button
                  size="sm"
                  variant="primary"
                  className="min-h-[40px] w-full text-xs"
                  onClick={() => {
                    onClose();
                    if (onOpenQuickAdd) onOpenQuickAdd();
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Quick Add</span>
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="min-h-[40px] w-full text-xs"
                  onClick={() => {
                    onClose();
                    if (onOpenCommandPalette) onOpenCommandPalette();
                  }}
                >
                  <Command className="h-3.5 w-3.5 mr-1" />
                  <span>Search</span>
                </Button>
              </div>

              {/* Navigation Sections */}
              <div className="py-3 space-y-4">
                {navSections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] px-2">
                      {sec.title}
                    </span>
                    <div className="space-y-0.5">
                      {sec.items.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`min-h-[40px] flex items-center justify-between rounded-[6px] px-3 py-2 text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-[var(--background-2)] text-[var(--foreground)] font-semibold'
                                : 'text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)]'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon
                                className={`h-4 w-4 shrink-0 ${
                                  isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                                }`}
                              />
                              <span>{item.name}</span>
                            </div>

                            {item.badge ? (
                              <span className="rounded px-1.5 py-0.2 text-[9px] font-bold bg-[var(--accent)]/10 text-[var(--accent)]">
                                {item.badge}
                              </span>
                            ) : (
                              <ChevronRight className="h-3 w-3 text-[var(--subtle)]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Footer with Theme Toggle */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-[11px] text-[var(--muted)]">
                Theme: <strong className="capitalize text-[var(--foreground)]">{theme}</strong>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] text-[var(--foreground)]"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
