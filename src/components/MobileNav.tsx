'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutGrid, 
  Layers, 
  GitBranch, 
  Terminal, 
  Activity, 
  Radio, 
  ShieldCheck, 
  KeyRound, 
  Globe, 
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

const navItems = [
  { name: 'Projects Overview', href: '/', icon: LayoutGrid },
  { name: 'Deployments', href: '/#deployments', icon: Layers },
  { name: 'Git Branches', href: '/#git', icon: GitBranch },
  { name: 'Logs & Realtime Activity', href: '/#logs', icon: Terminal },
  { name: 'Analytics & Traffic', href: '/#analytics', icon: Activity },
  { name: 'Speed Insights', href: '/#speed', icon: Radio },
  { name: 'Observability', href: '/#observability', icon: ShieldCheck },
  { name: 'Environment Variables', href: '/#env', icon: KeyRound },
  { name: 'Domains & DNS', href: '/#domains', icon: Globe },
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 flex w-[85%] max-w-xs flex-col justify-between border-r border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl select-none"
          >
            <div className="overflow-y-auto">
              
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
                      Project Monitor v1
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
                  <span>New Project</span>
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

              <div className="py-3 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] px-2">
                  Navigation
                </span>
                {navItems.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`min-h-[40px] flex items-center justify-between rounded-[6px] px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--background-2)] text-[var(--foreground)] font-semibold'
                          : 'text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-[var(--subtle)]" />
                    </Link>
                  );
                })}
              </div>

            </div>

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
