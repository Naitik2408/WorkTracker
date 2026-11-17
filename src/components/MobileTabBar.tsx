'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Compass, 
  Briefcase, 
  Sparkles, 
  Menu 
} from 'lucide-react';

interface MobileTabBarProps {
  onOpenMobileNav: () => void;
  onToggleAdvisor: () => void;
  approvalCount?: number;
}

export function MobileTabBar({
  onOpenMobileNav,
  onToggleAdvisor,
  approvalCount = 0,
}: MobileTabBarProps) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Morning', href: '/', icon: LayoutGrid },
    { label: '7 Areas', href: '/overview', icon: Compass },
    { label: 'Career', href: '/career', icon: Briefcase },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md pb-safe">
      <div className="flex h-14 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`min-h-[44px] min-w-[48px] flex flex-col items-center justify-center space-y-0.5 rounded-[6px] transition-colors ${
                isActive
                  ? 'text-[var(--foreground)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* Advisor Tab */}
        <button
          onClick={onToggleAdvisor}
          className="relative min-h-[44px] min-w-[48px] flex flex-col items-center justify-center space-y-0.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <div className="relative">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            {approvalCount > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--warning)] animate-ping" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Advisor</span>
        </button>

        {/* Menu Tab (Triggers full drawer) */}
        <button
          onClick={onOpenMobileNav}
          className="min-h-[44px] min-w-[48px] flex flex-col items-center justify-center space-y-0.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Menu className="h-4 w-4" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>
    </div>
  );
}
