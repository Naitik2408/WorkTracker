'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MobileTabBar } from '@/components/MobileTabBar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { GeminiAdvisorPanel } from '@/components/GeminiAdvisorPanel';
import { QuickAddModal } from '@/components/QuickAddModal';
import { PageTransition } from '@/components/ui/PageTransition';
import { ApprovalAction } from '@/types/database';

interface AppShellProps {
  children: React.ReactNode;
  approvalCount?: number;
  approvals?: ApprovalAction[];
  onRefreshData?: () => void;
  onApproveAction?: (id: string) => Promise<void>;
  onRejectAction?: (id: string) => Promise<void>;
}

export function AppShell({
  children,
  approvalCount = 0,
  approvals = [],
  onRefreshData = () => {},
  onApproveAction = async () => {},
  onRejectAction = async () => {},
}: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top Header with mobile hamburger and command trigger */}
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleAdvisor={() => setIsAdvisorOpen((prev) => !prev)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isAdvisorOpen={isAdvisorOpen}
        approvalCount={approvalCount}
      />

      <div className="flex flex-1">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Responsive Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-8 w-full overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Gemini Personal Advisor Side Panel / Drawer */}
      <GeminiAdvisorPanel
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        approvalActions={approvals}
        onApproveAction={onApproveAction}
        onRejectAction={onRejectAction}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={onRefreshData}
      />

      {/* Mobile Slide-Over Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onToggleAdvisor={() => setIsAdvisorOpen((prev) => !prev)}
        approvalCount={approvalCount}
      />
    </div>
  );
}
