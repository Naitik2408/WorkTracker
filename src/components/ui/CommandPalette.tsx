'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
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
  Command
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  group: 'Navigation' | 'Actions' | 'Preferences';
  icon: React.ElementType;
  onSelect: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenQuickAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd?: () => void;
}) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: CommandItem[] = [
    {
      id: 'morning',
      title: 'Morning Control Center',
      subtitle: 'Today’s top 3 priorities and executive pulse',
      group: 'Navigation',
      icon: Sun,
      onSelect: () => router.push('/'),
    },
    {
      id: 'overview',
      title: 'Life at a Glance',
      subtitle: '7-domain executive grid & momentum states',
      group: 'Navigation',
      icon: Compass,
      onSelect: () => router.push('/overview'),
    },
    {
      id: 'career',
      title: 'Career & 95/5 Job Hunt',
      subtitle: 'Pipeline status, recruiter replies, follow-ups',
      group: 'Navigation',
      icon: Briefcase,
      onSelect: () => router.push('/career'),
    },
    {
      id: 'ventures',
      title: 'Business & Ventures (Klarone)',
      subtitle: 'Entrepreneurial ventures and active decisions',
      group: 'Navigation',
      icon: Rocket,
      onSelect: () => router.push('/ventures'),
    },
    {
      id: 'learning',
      title: 'Learning & Capability Matrix',
      subtitle: 'Mastered topics and skill evidence',
      group: 'Navigation',
      icon: GraduationCap,
      onSelect: () => router.push('/learning'),
    },
    {
      id: 'health',
      title: 'Health & Fitness Routines',
      subtitle: 'Workouts, hydration, and recovery habits',
      group: 'Navigation',
      icon: HeartPulse,
      onSelect: () => router.push('/health'),
    },
    {
      id: 'finance',
      title: 'Personal Finance & Cashflow',
      subtitle: 'Inflows, operating expenses, upcoming bills',
      group: 'Navigation',
      icon: Wallet,
      onSelect: () => router.push('/finance'),
    },
    {
      id: 'operations',
      title: 'Personal Operations & Schedule',
      subtitle: 'Administrative tasks, commitments, reminders',
      group: 'Navigation',
      icon: CheckSquare,
      onSelect: () => router.push('/operations'),
    },
    {
      id: 'sandbox',
      title: 'Idea Evaluation Sandbox',
      subtitle: 'Raw ideas separated from active projects',
      group: 'Navigation',
      icon: Lightbulb,
      onSelect: () => router.push('/sandbox'),
    },
    {
      id: 'analytics',
      title: 'Analytics & Pattern Trends',
      subtitle: 'Attention distribution and habit velocity',
      group: 'Navigation',
      icon: BarChart3,
      onSelect: () => router.push('/analytics'),
    },
    {
      id: 'reviews',
      title: 'Executive Cadence Reviews',
      subtitle: 'Daily, weekly, and monthly retrospectives',
      group: 'Navigation',
      icon: CalendarCheck2,
      onSelect: () => router.push('/reviews'),
    },
    {
      id: 'quick-add',
      title: 'Quick Add Item',
      subtitle: 'Capture priority, job, idea, or ops task',
      group: 'Actions',
      icon: Plus,
      onSelect: () => {
        onClose();
        if (onOpenQuickAdd) onOpenQuickAdd();
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme (Light / Dark)',
      subtitle: 'Switch between light default and dark mode',
      group: 'Preferences',
      icon: Sun,
      onSelect: () => toggleTheme(),
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
          setSelectedIndex(0);
        }
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          selected.onSelect();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl rounded-[12px] border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <Search className="h-4 w-4 text-[var(--muted)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent px-3 py-3.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-mono border border-[var(--border)] bg-[var(--background-2)] text-[var(--muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between rounded-[6px] px-3 py-2 text-xs cursor-pointer select-none transition-colors ${
                  isSelected
                    ? 'bg-[var(--background-2)] text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <div>
                    <span className="font-medium text-[var(--foreground)] block">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[10px] text-[var(--muted)]">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[var(--subtle)]">
                  {item.group}
                </span>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--muted)]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
