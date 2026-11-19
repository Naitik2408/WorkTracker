'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  LayoutGrid, 
  Briefcase, 
  Activity, 
  Calendar, 
  Plus, 
  Sun,
  Globe,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { usePrivacy } from '../PrivacyProvider';
import { getStoredProjects } from '@/lib/projectStore';
import { getStoredJobs } from '@/lib/jobStore';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  group: 'Modules' | 'Projects' | 'Jobs' | 'Actions' | 'Preferences';
  icon: React.ElementType;
  shortcut?: string;
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
  projects?: any[];
}) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { hideNumbers, toggleHideNumbers } = usePrivacy();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Dynamic projects
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProjectsList(getStoredProjects());
      setJobsList(getStoredJobs().applications);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const moduleItems: CommandItem[] = [
    {
      id: 'mod-today',
      title: 'Go to Today',
      subtitle: 'Daily standup overview of jobs, projects, and life',
      group: 'Modules',
      icon: Calendar,
      shortcut: 'G H',
      onSelect: () => router.push('/')
    },
    {
      id: 'mod-projects',
      title: 'Go to Projects',
      subtitle: 'Technical monitoring and 6-month re-entry brief',
      group: 'Modules',
      icon: LayoutGrid,
      shortcut: 'G P',
      onSelect: () => router.push('/projects')
    },
    {
      id: 'mod-jobs',
      title: 'Go to Jobs',
      subtitle: 'Opportunity pipeline, targets, outreach, and resumes',
      group: 'Modules',
      icon: Briefcase,
      shortcut: 'G J',
      onSelect: () => router.push('/jobs')
    },
    {
      id: 'mod-life',
      title: 'Go to Life Analytics',
      subtitle: 'Read-only view of habits, focus, and finances',
      group: 'Modules',
      icon: Activity,
      shortcut: 'G L',
      onSelect: () => router.push('/life')
    }
  ];

  const projectItems: CommandItem[] = projectsList.map((p) => ({
    id: `project-${p.id}`,
    title: p.name,
    subtitle: `Project · ${p.status} · ${p.description || 'Open project brief'}`,
    group: 'Projects',
    icon: Globe,
    onSelect: () => router.push(`/project/${p.slug}`)
  }));

  const jobItems: CommandItem[] = jobsList.map((j) => ({
    id: `job-${j.id}`,
    title: `${j.company} — ${j.role}`,
    subtitle: `Job · Stage: ${j.stage} · Next: ${j.nextAction || 'Review application'}`,
    group: 'Jobs',
    icon: Briefcase,
    onSelect: () => router.push(`/jobs?open=${j.id}`)
  }));

  const actionItems: CommandItem[] = [
    {
      id: 'act-new-proj',
      title: 'New Project',
      subtitle: 'Create a new project tracking space',
      group: 'Actions',
      icon: Plus,
      shortcut: 'N',
      onSelect: () => {
        if (onOpenQuickAdd) onOpenQuickAdd();
        else router.push('/projects');
      }
    },
    {
      id: 'act-new-job',
      title: 'Add Job Application',
      subtitle: 'Log a new opportunity into your pipeline',
      group: 'Actions',
      icon: Plus,
      onSelect: () => router.push('/jobs?new=true')
    },
    {
      id: 'pref-privacy',
      title: hideNumbers ? 'Show Sensitive Numbers' : 'Hide Sensitive Numbers (Privacy Mode)',
      subtitle: 'Mask or unmask financial and compensation numbers',
      group: 'Preferences',
      icon: hideNumbers ? Eye : EyeOff,
      onSelect: () => toggleHideNumbers()
    },
    {
      id: 'pref-theme',
      title: 'Toggle Theme (Light / Dark)',
      subtitle: 'Switch between light default and dark mode',
      group: 'Preferences',
      icon: Sun,
      onSelect: () => toggleTheme()
    }
  ];

  const allItems = [...moduleItems, ...projectItems, ...jobItems, ...actionItems];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
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
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -4 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl rounded-[12px] border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <Search className="h-4 w-4 text-[var(--subtle)] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search projects, jobs, targets, or actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full py-3 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] bg-transparent focus:outline-none"
          />
          <kbd className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] shrink-0">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[6px] text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--surface-subtle)] text-[var(--foreground)] border border-[var(--border)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-1 rounded-[4px] bg-[var(--card)] border border-[var(--border)] text-[var(--subtle)] shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[var(--foreground)] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--subtle)] shrink-0">
                          {item.group}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-[var(--muted)] truncate max-w-md">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.shortcut ? (
                    <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.2 text-[9px] font-mono text-[var(--muted)] shrink-0">
                      {item.shortcut}
                    </kbd>
                  ) : (
                    <ArrowRight className="h-3 w-3 text-[var(--subtle)] opacity-0 group-hover:opacity-100 shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-[var(--muted)]">
              No results found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-between text-[10px] text-[var(--subtle)] font-mono">
          <span>Navigate with ↑↓ · Select with Enter</span>
          <span>Shortcuts: G H, G P, G J, G L</span>
        </div>
      </motion.div>
    </div>
  );
}
