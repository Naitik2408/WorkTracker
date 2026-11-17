'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  GitBranch, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  RotateCcw,
  Bell,
  HardDrive,
  Activity,
  Layers,
  Inbox
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { PageTransition } from '@/components/ui/PageTransition';
import { StatCardSkeleton, ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { GeminiAdvisorPanel } from '@/components/GeminiAdvisorPanel';
import { QuickAddModal } from '@/components/QuickAddModal';
import { MobileNav } from '@/components/MobileNav';
import { MobileTabBar } from '@/components/MobileTabBar';
import { 
  LifeDomain, 
  DailyPriority, 
  JobApplication, 
  Venture, 
  ApprovalAction 
} from '@/types/database';
import { formatTimeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const { success, error, toast } = useToast();
  
  // Data state
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [priorities, setPriorities] = useState<DailyPriority[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [approvals, setApprovals] = useState<ApprovalAction[]>([]);
  
  // UI filter & layout controls matching Vercel screenshot
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'ventures' | 'jobs'>('all');
  const [showEmptySim, setShowEmptySim] = useState(false);

  // Modals & Sheets
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);

      const [
        { data: pData, error: pErr },
        { data: jData, error: jErr },
        { data: vData, error: vErr },
        { data: aData, error: aErr }
      ] = await Promise.all([
        supabase.from('daily_priorities').select('*').order('rank'),
        supabase.from('job_applications').select('*').order('applied_at', { ascending: false }),
        supabase.from('ventures').select('*').order('name'),
        supabase.from('approval_queue_actions').select('*').eq('status', 'PENDING_APPROVAL')
      ]);

      if (pErr || jErr || vErr || aErr) {
        throw new Error('Supabase query error');
      }

      if (pData) setPriorities(pData);
      if (jData) setJobs(jData);
      if (vData) setVentures(vData);
      if (aData) setApprovals(aData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Optimistic UI for toggling priorities with Toast rollback
  const handleTogglePriority = async (priority: DailyPriority) => {
    const previousStatus = priority.status;
    const nextStatus = previousStatus === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';

    // 1. Optimistic instant local update
    setPriorities((prev) =>
      prev.map((p) => (p.id === priority.id ? { ...p, status: nextStatus } : p))
    );

    toast({
      title: nextStatus === 'COMPLETED' ? 'Priority Marked Completed' : 'Priority Restored',
      description: priority.title,
      type: 'success',
      action: {
        label: 'Undo',
        onClick: async () => {
          setPriorities((prev) =>
            prev.map((p) => (p.id === priority.id ? { ...p, status: previousStatus } : p))
          );
          await supabase.from('daily_priorities').update({ status: previousStatus }).eq('id', priority.id);
        },
      },
    });

    try {
      const { error: updateErr } = await supabase
        .from('daily_priorities')
        .update({ status: nextStatus })
        .eq('id', priority.id);
      if (updateErr) throw updateErr;
    } catch {
      // Rollback on failure
      setPriorities((prev) =>
        prev.map((p) => (p.id === priority.id ? { ...p, status: previousStatus } : p))
      );
      error('Failed to update priority', 'Reverting to previous state.');
    }
  };

  const handleApproveAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({
      status: 'APPROVED',
      approved_by_user_at: new Date().toISOString(),
      executed_at: new Date().toISOString()
    }).eq('id', id);
    success('Action Approved & Executed', 'Email follow-up processed via secure queue.');
    fetchDashboardData();
  };

  const handleRejectAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({ status: 'REJECTED' }).eq('id', id);
    toast({ title: 'Action Discarded', type: 'info' });
    fetchDashboardData();
  };

  // Projects list modeled from Vercel dashboard screenshot
  const projectCards = [
    {
      id: 'klarone',
      name: 'klarone-staging',
      domain: 'klarone-staging.vercel.app',
      status: 'READY',
      branch: 'main',
      commitMsg: 'feat: setup PostgreSQL architecture & client auth',
      updatedAt: 'Nov 17',
      isVenture: true
    },
    {
      id: 'worktracker',
      name: 'WorkTracker',
      domain: 'worktracker.naitik.work',
      status: 'READY',
      branch: 'main',
      commitMsg: 'feat: complete Vercel-inspired Personal Life Dashboard',
      updatedAt: 'Just now',
      isVenture: true
    },
    {
      id: 'web',
      name: 'web',
      domain: 'naitik.work',
      status: 'READY',
      branch: 'main',
      commitMsg: 'feat: update resume with latest experience & projects',
      updatedAt: 'Nov 6',
      isVenture: false
    },
    {
      id: 'launchfast',
      name: 'launchfast',
      domain: 'launchfast.naitik.work',
      status: 'READY',
      branch: 'main',
      commitMsg: 'feat(seo): add sitemap, robots, GA4 analytics',
      updatedAt: 'Oct 26',
      isVenture: true
    },
    {
      id: 'template-nextjs-stripe',
      name: 'template-nextjs-stripe',
      domain: 'demo.launchfast.naitik.work',
      status: 'READY',
      branch: 'main',
      commitMsg: 'feat: add subscription webhook sync',
      updatedAt: 'Oct 26',
      isVenture: false
    },
    {
      id: 'krishna-infotech',
      name: 'krishna-infotech-solution',
      domain: 'krishnainfotech.in',
      status: 'NO_DEPLOYMENT',
      branch: 'main',
      commitMsg: 'Update Services2.jsx',
      updatedAt: '1/14/25',
      isVenture: true
    }
  ];

  const filteredProjects = showEmptySim
    ? []
    : projectCards.filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.commitMsg.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTabFilter === 'ventures') return matchesQuery && p.isVenture;
        return matchesQuery;
      });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleAdvisor={() => setIsAdvisorOpen((prev) => !prev)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isAdvisorOpen={isAdvisorOpen}
        approvalCount={approvals.length}
      />

      <div className="flex">
        <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-8 w-full overflow-x-hidden">
          <PageTransition>
            
            {/* Error Handling State Demonstration */}
            {hasError && (
              <ErrorState
                whatHappened="Database query failed"
                whyItHappened="The Supabase service timed out or table permissions are restricted."
                whatToDoNext="Verify your network and credentials in Project Settings, then retry."
                onRetry={fetchDashboardData}
              />
            )}

            {/* Top Stat Cards Grid (Count-up, delta badges, sparklines) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : (
                <>
                  <StatCard
                    label="Today's Priorities"
                    value={priorities.filter((p) => p.status !== 'COMPLETED').length}
                    suffix=" Remaining"
                    delta={{ value: '1 Completed', isPositive: true }}
                    sparkline={[1, 2, 1, 3, 2, 3, 2]}
                  />
                  <StatCard
                    label="Active Job Pipelines"
                    value={jobs.length}
                    delta={{ value: '+2 this week', isPositive: true }}
                    sparkline={[1, 1, 2, 2, 3, 3, 4]}
                  />
                  <StatCard
                    label="Active Ventures"
                    value={ventures.length}
                    delta={{ value: 'Klarone Active', isPositive: true, neutral: true }}
                    sparkline={[1, 1, 2, 2, 2, 2, 2]}
                  />
                  <StatCard
                    label="Audit Coverage"
                    value={100}
                    suffix="%"
                    delta={{ value: '7 Domains', isPositive: true }}
                    sparkline={[90, 92, 95, 96, 98, 100, 100]}
                  />
                </>
              )}
            </div>

            {/* Today's Top 3 Priorities Section (CEO Morning Focus) */}
            <Card className="p-5">
              <CardHeader className="pb-3 mb-3">
                <div>
                  <CardTitle>Today&apos;s Top 3 Priorities</CardTitle>
                  <CardDescription>
                    The critical needles to move today. Click to toggle; changes are optimistically saved with 1-click Undo.
                  </CardDescription>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setIsQuickAddOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Priority</span>
                </Button>
              </CardHeader>

              <div className="space-y-2">
                {priorities.map((item) => {
                  const isDone = item.status === 'COMPLETED';
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleTogglePriority(item)}
                      className={`flex items-center justify-between p-3 rounded-[6px] border transition-all cursor-pointer select-none ${
                        isDone
                          ? 'border-[var(--success)]/30 bg-[var(--success)]/5 text-[var(--muted)] line-through'
                          : 'border-[var(--border)] bg-[var(--background-2)] hover:border-[var(--border-hover)] text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] text-xs font-mono font-bold ${
                            isDone
                              ? 'bg-[var(--success)] text-white'
                              : 'bg-[var(--foreground)] text-[var(--background)]'
                          }`}
                        >
                          #{item.rank}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{item.title}</span>
                      </div>
                      <div>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                        ) : (
                          <Circle className="h-4 w-4 text-[var(--muted)]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Vercel Search & Filter Header (Exact UI from screenshot) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search Projects [/]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--card)] pl-9 pr-8 py-2 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] hover:border-[var(--border-hover)] focus:border-[var(--accent)] focus:outline-none"
                />
                <kbd className="absolute right-2.5 top-2.5 rounded border border-[var(--border)] bg-[var(--background-2)] px-1.5 py-0.2 text-[9px] font-mono text-[var(--muted)]">
                  /
                </kbd>
              </div>

              <div className="flex items-center space-x-2">
                {/* Filter toggle */}
                <Button
                  size="sm"
                  variant={activeTabFilter === 'ventures' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTabFilter(activeTabFilter === 'ventures' ? 'all' : 'ventures')}
                >
                  <Filter className="h-3 w-3 mr-1.5" />
                  <span>{activeTabFilter === 'ventures' ? 'Showing: Ventures' : 'Filter Ventures'}</span>
                </Button>

                {/* Grid / List Layout toggle */}
                <div className="flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-0.5">
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`p-1.5 rounded-[4px] transition-colors ${
                      layoutMode === 'grid'
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('list')}
                    className={`p-1.5 rounded-[4px] transition-colors ${
                      layoutMode === 'list'
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Empty State Simulator toggle for UX testing */}
                <button
                  onClick={() => setShowEmptySim(!showEmptySim)}
                  className="text-[11px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 rounded border border-dashed border-[var(--border)]"
                >
                  {showEmptySim ? 'Reset Data' : 'Simulate Empty'}
                </button>
              </div>
            </div>

            {/* Main Content Layout: Left Sidebar (Usage & Alerts) + Right Grid (Projects) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Usage, Alerts, Previews matching screenshot) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Usage Card */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
                    <span className="font-semibold text-[var(--foreground)] flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-[var(--muted)]" />
                      <span>Usage · Last 30 days</span>
                    </span>
                    <button className="rounded px-2 py-0.5 text-[10px] font-semibold bg-[var(--foreground)] text-[var(--background)]">
                      Hobby
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[var(--muted)]">Deployment Storage</span>
                        <span className="font-mono">401.18 MB / 10 GB</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--background-2)] overflow-hidden">
                        <div className="h-1.5 bg-[var(--accent)] rounded-full w-[4%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[var(--muted)]">CDN Requests</span>
                        <span className="font-mono">11K / 1M</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--background-2)] overflow-hidden">
                        <div className="h-1.5 bg-[var(--accent)] rounded-full w-[1.1%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[var(--muted)]">Fast Data Transfer</span>
                        <span className="font-mono">1.01 GB / 100 GB</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--background-2)] overflow-hidden">
                        <div className="h-1.5 bg-[var(--accent)] rounded-full w-[1%]" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Alerts Card matching screenshot */}
                <Card className="p-4 space-y-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background-2)] border border-[var(--border)] mx-auto text-[var(--muted)]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--foreground)]">System Alerts</h4>
                    <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                      Get notified when life domain momentum slips or recruiter follow-ups are overdue.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    Configure Alerts
                  </Button>
                </Card>

                {/* Recent Previews matching screenshot */}
                <Card className="p-4 space-y-2 text-center text-xs">
                  <div className="text-[var(--muted)] text-[11px]">
                    Preview deployments and active branch tests will appear here.
                  </div>
                </Card>

              </div>

              {/* Right Column: Projects & Active Ventures Grid */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* New Repository Detected Banner (as in screenshot) */}
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                      N
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        New repository connected
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        Naitik2408/WorkTracker
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary">
                    Synced & Live
                  </Button>
                </div>

                {/* Empty State if no projects match */}
                {filteredProjects.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No projects found"
                    description="No projects match your current search query or filter. Try resetting your filters."
                    actionLabel="Clear Filter"
                    onAction={() => {
                      setSearchQuery('');
                      setActiveTabFilter('all');
                      setShowEmptySim(false);
                    }}
                  />
                ) : layoutMode === 'grid' ? (
                  /* Projects Grid matching exact Vercel Card style from image.png */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map((p) => (
                      <Card
                        key={p.id}
                        className="p-4 space-y-3 flex flex-col justify-between hover:border-[var(--border-hover)]"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="h-7 w-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shrink-0">
                                {p.name[0].toUpperCase()}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[var(--foreground)] hover:underline cursor-pointer block">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-[var(--muted)] block font-mono">
                                  {p.domain}
                                </span>
                              </div>
                            </div>

                            {/* Status indicator matching checkmark with circle */}
                            <div className="flex items-center space-x-1">
                              {p.status === 'READY' ? (
                                <Badge variant="success" pulse>
                                  Ready
                                </Badge>
                              ) : (
                                <Badge variant="default" dot={false}>
                                  Offline
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 text-[11px] text-[var(--muted)] flex items-center space-x-1.5 truncate">
                            <GitBranch className="h-3 w-3 shrink-0" />
                            <span className="truncate">{p.commitMsg}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--muted)] font-mono">
                          <span>github.com/Naitik2408</span>
                          <span>{p.updatedAt}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 flex items-center justify-between hover:bg-[var(--background-2)] transition-colors text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-[11px] font-mono text-[var(--muted)]">{p.domain}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-[var(--muted)]">
                          <span>{p.commitMsg}</span>
                          <Badge variant={p.status === 'READY' ? 'success' : 'default'}>
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </PageTransition>
        </main>
      </div>

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Gemini Personal Advisor Side Panel */}
      <GeminiAdvisorPanel
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        approvalActions={approvals}
        onApproveAction={handleApproveAction}
        onRejectAction={handleRejectAction}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={fetchDashboardData}
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
        approvalCount={approvals.length}
      />
    </div>
  );
}
