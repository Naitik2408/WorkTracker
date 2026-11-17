'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Layers, 
  GitBranch, 
  Activity, 
  Terminal, 
  ShieldCheck, 
  Radio, 
  HardDrive, 
  KeyRound, 
  Globe, 
  Search, 
  X, 
  Bell, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'accent';
}

const navItems: NavItem[] = [
  { name: 'Projects', href: '/', icon: LayoutGrid },
  { name: 'Deployments', href: '/#deployments', icon: Layers },
  { name: 'Git & Branches', href: '/#git', icon: GitBranch },
  { name: 'Logs & Activity', href: '/#logs', icon: Terminal },
  { name: 'Analytics & Traffic', href: '/#analytics', icon: Activity },
  { name: 'Speed Insights', href: '/#speed', icon: Radio },
  { name: 'Observability', href: '/#observability', icon: ShieldCheck },
  { name: 'Environment Variables', href: '/#env', icon: KeyRound },
  { name: 'Domains & DNS', href: '/#domains', icon: Globe },
];

export function Sidebar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCallout, setShowCallout] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved === 'true') setIsCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('sidebar-collapsed', String(next));
    } catch {}
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 56 : 240 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 border-r border-[var(--border)] bg-[var(--card)] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between hidden md:flex select-none z-30"
    >
      <div>
        {/* Workspace Selector matching Vercel screenshot */}
        <div className="h-12 border-b border-[var(--border)] flex items-center justify-between px-3">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="h-5 w-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0">
              N
            </div>
            {!isCollapsed && (
              <div className="flex items-center space-x-1.5 overflow-hidden">
                <span className="text-xs font-semibold tracking-tight truncate text-[var(--foreground)]">
                  Naitik Kumar&apos;s ...
                </span>
                <span className="rounded px-1.5 py-0.2 text-[9px] font-medium border border-[var(--border)] bg-[var(--background-2)] text-[var(--muted)] shrink-0">
                  Hobby
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            className="rounded p-1 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-2)] transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Find Search Input */}
        {!isCollapsed ? (
          <div className="p-2 border-b border-[var(--border)]">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Search className="h-3.5 w-3.5" />
                <span className="text-[11px]">Find</span>
              </div>
              <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.2 text-[9px] font-mono">
                F
              </kbd>
            </button>
          </div>
        ) : (
          <div className="p-2 border-b border-[var(--border)] flex justify-center">
            <Tooltip content="Quick Find (Cmd+K)" side="right">
              <button
                onClick={onOpenCommandPalette}
                className="h-8 w-8 flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)]"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          </div>
        )}

        {/* Project Navigation list */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;

            const buttonContent = (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center rounded-[6px] px-2.5 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'font-medium text-[var(--foreground)] bg-[var(--background-2)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-2)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-[var(--foreground)] rounded-full"
                  />
                )}

                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="ml-auto rounded px-1.5 py-0.2 text-[9px] font-semibold tracking-tight bg-[var(--border)] text-[var(--muted)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.name} content={item.name} side="right">
                  {buttonContent}
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-[var(--border)] space-y-2">
        {!isCollapsed && showCallout && (
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--background-2)] p-2.5 text-xs space-y-2 relative">
            <button
              onClick={() => setShowCallout(false)}
              className="absolute top-2 right-2 text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-[11px] text-[var(--foreground)]">Vercel Connected</span>
              <span className="rounded bg-[var(--success)]/10 text-[var(--success)] px-1.5 py-0.2 text-[9px] font-bold">
                Live
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed">
              Monitoring 20 projects with real-time deployment status.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-1.5 rounded-[6px] hover:bg-[var(--background-2)] transition-colors">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              NK
            </div>
            {!isCollapsed && (
              <span className="text-xs font-semibold text-[var(--foreground)] truncate">
                Naitik Kumar
              </span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center space-x-1 text-[var(--muted)]">
              <button className="p-1 hover:text-[var(--foreground)]">
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button className="p-1 hover:text-[var(--foreground)]">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
