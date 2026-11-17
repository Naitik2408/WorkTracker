'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Layers, GitBranch, Menu } from 'lucide-react';

interface MobileTabBarProps {
  onOpenMobileNav: () => void;
}

export function MobileTabBar({
  onOpenMobileNav,
}: MobileTabBarProps) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Projects', href: '/', icon: LayoutGrid },
    { label: 'Deployments', href: '/#deployments', icon: Layers },
    { label: 'Branches', href: '/#git', icon: GitBranch },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md pb-safe">
      <div className="flex h-14 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center space-y-0.5 rounded-[6px] transition-colors ${
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

        <button
          onClick={onOpenMobileNav}
          className="min-h-[44px] min-w-[56px] flex flex-col items-center justify-center space-y-0.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Menu className="h-4 w-4" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
}
