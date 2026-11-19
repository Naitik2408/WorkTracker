'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  LayoutGrid, 
  Layers, 
  GitBranch, 
  ExternalLink, 
  Terminal, 
  Plus, 
  Sun,
  Globe
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  group: 'Projects' | 'Actions' | 'Preferences';
  icon: React.ElementType;
  onSelect: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenQuickAdd,
  projects = []
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd?: () => void;
  projects?: Array<{ name: string; domain?: string; framework?: string }>;
}) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Dynamic project items jumping directly to /project/[slug]
  const projectItems: CommandItem[] = projects.map((p) => ({
    id: `project-${p.name}`,
    title: p.name,
    subtitle: `${p.framework || 'Project'} · Resume & monitor`,
    group: 'Projects',
    icon: Globe,
    onSelect: () => {
      onClose();
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      router.push(`/project/${slug}`);
    }
  }));

  const staticItems: CommandItem[] = [
    {
      id: 'action-new',
      title: 'New Project (N)',
      subtitle: 'Create a new project space to track re-entry resume',
      group: 'Actions',
      icon: Plus,
      onSelect: () => {
        onClose();
        if (onOpenQuickAdd) onOpenQuickAdd();
      }
    },
    {
      id: 'pref-theme',
      title: 'Toggle Theme (Light / Dark)',
      subtitle: 'Switch between minimal light default and dark mode',
      group: 'Preferences',
      icon: Sun,
      onSelect: () => {
        toggleTheme();
        onClose();
      }
    }
  ];

  const allItems = [...projectItems, ...staticItems];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
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
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
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
            placeholder="Search projects by name, repo, or domain..."
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
              No projects match &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
