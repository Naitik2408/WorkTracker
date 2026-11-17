'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MobileTabBar } from '@/components/MobileTabBar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { QuickAddModal } from '@/components/QuickAddModal';
import { PageTransition } from '@/components/ui/PageTransition';

interface AppShellProps {
  children: React.ReactNode;
  onRefreshData?: () => void;
  onProjectCreated?: (project: any) => void;
}

export function AppShell({
  children,
  onRefreshData = () => {},
  onProjectCreated = () => {},
}: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-8 w-full overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onProjectCreated={onProjectCreated}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <MobileTabBar
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />
    </div>
  );
}
