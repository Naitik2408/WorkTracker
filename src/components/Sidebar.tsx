'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun,
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
  CalendarCheck2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const mainNav: NavItem[] = [
  { name: 'Morning Briefing', href: '/', icon: Sun },
  { name: 'Life at a Glance', href: '/overview', icon: LayoutGrid },
];

const lifeAreas: NavItem[] = [
  { name: 'Career & Income', href: '/career', icon: Briefcase, badge: '95/5' },
  { name: 'Business & Ventures', href: '/ventures', icon: Rocket },
  { name: 'Learning & Skills', href: '/learning', icon: GraduationCap },
  { name: 'Health & Fitness', href: '/health', icon: HeartPulse },
  { name: 'Personal Finance', href: '/finance', icon: Wallet },
  { name: 'Personal Operations', href: '/operations', icon: CheckSquare, badge: 'Due', badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
  { name: 'Personal Growth', href: '/growth', icon: Compass },
];

const strategyNav: NavItem[] = [
  { name: 'Goals & Milestones', href: '/goals', icon: Target },
  { name: 'Idea Sandbox', href: '/sandbox', icon: Lightbulb },
  { name: 'Analytics & Trends', href: '/analytics', icon: BarChart3 },
  { name: 'Cadence Reviews', href: '/reviews', icon: CalendarCheck2 },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">
        {title}
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[var(--accent)] text-[var(--card-foreground)] font-semibold shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--card-foreground)]'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-[var(--card-foreground)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)]'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium tracking-tight',
                    item.badgeColor || 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-4 min-h-[calc(100vh-3.5rem)] hidden md:block">
      {renderNavGroup('Command Center', mainNav)}
      {renderNavGroup('The 7 Life Areas', lifeAreas)}
      {renderNavGroup('Strategy & Cadence', strategyNav)}
      
      {/* CEO Executive Philosophy Card */}
      <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
        <p className="text-[11px] font-medium text-[var(--card-foreground)]">
          &ldquo;Act as the CEO of your own life.&rdquo;
        </p>
        <p className="mt-1 text-[10px] text-[var(--muted-foreground)] leading-relaxed">
          High-clarity observation over manual busywork.
        </p>
      </div>
    </aside>
  );
}
