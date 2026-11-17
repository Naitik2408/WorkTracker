'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  Command, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  onOpenQuickAdd?: () => void;
  onToggleAdvisor?: () => void;
  isAdvisorOpen?: boolean;
  approvalCount?: number;
}

export function Header({ 
  onOpenQuickAdd, 
  onToggleAdvisor, 
  isAdvisorOpen,
  approvalCount = 1 
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [formattedDate, setFormattedDate] = React.useState('Wednesday, Nov 18');

  React.useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand & Date indicator */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs tracking-tighter">
              WT
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:inline-block">
              WorkTracker
            </span>
          </Link>
          <span className="text-[var(--border)] hidden sm:inline">/</span>
          <div className="flex items-center space-x-1.5 text-xs text-[var(--muted-foreground)]">
            <span>{formattedDate}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Live Pulse</span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center space-x-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--card-foreground)] shadow-xs hover:bg-[var(--accent)] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {/* Pending Approval Badge (Guardrail 5% Action) */}
          {approvalCount > 0 && (
            <button
              onClick={onToggleAdvisor}
              className="flex items-center space-x-1.5 rounded-md border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors"
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>{approvalCount} Action Pending</span>
            </button>
          )}

          {/* Gemini Advisor Toggle */}
          <button
            onClick={onToggleAdvisor}
            className={`flex items-center space-x-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              isAdvisorOpen 
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] hover:bg-[var(--accent)]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden md:inline">Gemini Advisor</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="rounded-md border border-[var(--border)] p-1.5 text-[var(--muted-foreground)] hover:text-[var(--card-foreground)] hover:bg-[var(--accent)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>
    </header>
  );
}
