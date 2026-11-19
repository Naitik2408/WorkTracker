'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ExternalLink, 
  GitBranch, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  RotateCcw,
  Bell,
  HardDrive,
  Activity,
  Layers,
  Inbox,
  Globe,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MobileTabBar } from '@/components/MobileTabBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { PageTransition } from '@/components/ui/PageTransition';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { QuickAddModal } from '@/components/QuickAddModal';
import { useToast } from '@/components/ui/Toast';
import { formatTimeAgo } from '@/lib/utils';

export interface ProjectItem {
  id: string;
  name: string;
  framework: string;
  domain: string;
  status: string;
  branch: string;
  commitMsg: string;
  repo: string;
  repoOwner: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { success, toast } = useToast();
  
  // Real project data from Vercel API
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Filters & layout modes
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [frameworkFilter, setFrameworkFilter] = useState<'all' | 'nextjs' | 'vite'>('all');
  const [showEmptySim, setShowEmptySim] = useState(false);

  // Modals & Mobile
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Selected project for detailed side inspection (Full Monitoring UX)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Error fetching Vercel projects:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject: ProjectItem) => {
    setProjects((prev) => [newProject, ...prev]);
    success('Project Added', `${newProject.name} is now tracked in your dashboard.`);
  };

  // Filter projects by search query and framework
  const filteredProjects = showEmptySim
    ? []
    : projects.filter((p) => {
        const matchesQuery = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.commitMsg.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.repo.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (frameworkFilter !== 'all') {
          return matchesQuery && p.framework?.toLowerCase() === frameworkFilter;
        }
        return matchesQuery;
      });

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top Header */}
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      <div className="flex flex-1">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-8 w-full overflow-x-hidden">
          <PageTransition>

            {/* Error State */}
            {hasError && (
              <ErrorState
                whatHappened="Failed to connect to Vercel Project Monitor API"
                whyItHappened="The API token timed out or Vercel rate limits were temporarily reached."
                whatToDoNext="Click Retry Connection to reconnect and refresh live deployments."
                onRetry={fetchProjects}
              />
            )}

            {/* Top Overview & Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Total Projects
                </span>
                <div className="mt-1 text-2xl font-bold font-mono text-[var(--foreground)]">
                  {loading ? '—' : projects.length}
                </div>
                <span className="text-[10px] text-[var(--success)] font-medium">All monitored</span>
              </Card>

              <Card className="p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Live Deployments
                </span>
                <div className="mt-1 text-2xl font-bold font-mono text-[var(--success)]">
                  {loading ? '—' : projects.filter(p => p.status === 'READY').length}
                </div>
                <span className="text-[10px] text-[var(--muted)]">100% operational</span>
              </Card>

              <Card className="p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Next.js Apps
                </span>
                <div className="mt-1 text-2xl font-bold font-mono text-[var(--foreground)]">
                  {loading ? '—' : projects.filter(p => p.framework === 'nextjs').length}
                </div>
                <span className="text-[10px] text-[var(--accent)] font-medium">Turbopack SSR</span>
              </Card>

              <Card className="p-3.5 sm:p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Vite / React Apps
                </span>
                <div className="mt-1 text-2xl font-bold font-mono text-[var(--foreground)]">
                  {loading ? '—' : projects.filter(p => p.framework === 'vite').length}
                </div>
                <span className="text-[10px] text-[var(--muted)]">SPA Deployments</span>
              </Card>
            </div>

            {/* Vercel Search & Filter Header (Exact UI from screenshot) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              
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

              <div className="flex items-center space-x-2 flex-wrap">
                {/* Framework Filters */}
                <div className="flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-0.5">
                  <button
                    onClick={() => setFrameworkFilter('all')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors ${
                      frameworkFilter === 'all'
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    All ({projects.length})
                  </button>
                  <button
                    onClick={() => setFrameworkFilter('nextjs')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors ${
                      frameworkFilter === 'nextjs'
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Next.js
                  </button>
                  <button
                    onClick={() => setFrameworkFilter('vite')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors ${
                      frameworkFilter === 'vite'
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Vite
                  </button>
                </div>

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
                  className="text-[10px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 rounded border border-dashed border-[var(--border)]"
                >
                  {showEmptySim ? 'Reset Data' : 'Simulate Empty'}
                </button>
              </div>
            </div>

            {/* Layout Split: Left (Usage & Quick Status) + Right (Real Project Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Account Usage & Quick System Status matching image.png */}
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
                    <h4 className="text-xs font-semibold text-[var(--foreground)]">Deployment Alerts</h4>
                    <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                      Instant notifications when builds fail or performance slips across your repositories.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    Configure Alerts
                  </Button>
                </Card>

                {/* Selected Project Quick Inspector (Deep Detail Monitoring) */}
                {selectedProject && (
                  <Card className="p-4 space-y-3 border-[var(--accent)]/40 bg-[var(--accent)]/5">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold text-[var(--foreground)]">
                        Project Detail Inspector
                      </span>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-[10px] text-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--muted)] uppercase block">Project Name</span>
                        <span className="font-semibold font-mono">{selectedProject.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted)] uppercase block">Framework</span>
                        <span className="capitalize">{selectedProject.framework}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted)] uppercase block">Live Domain</span>
                        <a
                          href={`https://${selectedProject.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--accent)] hover:underline flex items-center space-x-1 font-mono text-[11px]"
                        >
                          <span>{selectedProject.domain}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted)] uppercase block">Last Commit</span>
                        <p className="text-[11px] text-[var(--foreground)] leading-tight mt-0.5">
                          {selectedProject.commitMsg}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

              </div>

              {/* Right Column: Monitored Projects (Grid or List View) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* New Repository Detected Banner (Matching image.png) */}
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs shrink-0">
                      N
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        New repository detected
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        Naitik2408/WorkTracker
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" className="self-start sm:self-auto">
                    Live Production Ready
                  </Button>
                </div>

                {/* Loading Skeletons */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProjectCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No projects match your filter"
                    description="Try searching with a different term or clearing your framework filter."
                    actionLabel="Reset Search"
                    onAction={() => {
                      setSearchQuery('');
                      setFrameworkFilter('all');
                      setShowEmptySim(false);
                    }}
                  />
                ) : layoutMode === 'grid' ? (
                  /* Projects Grid matching exact Vercel Card aesthetic from image.png */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map((p) => (
                      <Card
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className={`p-4 space-y-3 flex flex-col justify-between hover:border-[var(--border-hover)] cursor-pointer select-none transition-all ${
                          selectedProject?.id === p.id ? 'ring-2 ring-[var(--accent)] border-transparent' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="h-7 w-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shrink-0">
                                {p.name[0].toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <span className="text-xs font-bold text-[var(--foreground)] hover:underline truncate block">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-[var(--muted)] truncate block font-mono">
                                  {p.domain}
                                </span>
                              </div>
                            </div>

                            {/* Vercel Status Badge */}
                            <Badge variant={p.status === 'READY' ? 'success' : 'default'} pulse={p.status === 'READY'}>
                              {p.status === 'READY' ? 'Ready' : p.status}
                            </Badge>
                          </div>

                          {/* Commit message & branch */}
                          <div className="mt-3 text-[11px] text-[var(--muted)] flex items-center space-x-1.5 truncate">
                            <GitBranch className="h-3 w-3 shrink-0" />
                            <span className="truncate">{p.commitMsg}</span>
                          </div>
                        </div>

                        {/* Card Footer: Repo and timestamp */}
                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--muted)] font-mono">
                          <span className="truncate max-w-[140px]">{p.repoOwner}/{p.repo}</span>
                          <span>{formatTimeAgo(p.updatedAt)}</span>
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
                        onClick={() => setSelectedProject(p)}
                        className={`p-3 sm:p-3.5 flex items-center justify-between hover:bg-[var(--background-2)] transition-colors text-xs cursor-pointer ${
                          selectedProject?.id === p.id ? 'bg-[var(--background-2)] font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="h-6 w-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                            {p.name[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold block">{p.name}</span>
                            <span className="text-[10px] font-mono text-[var(--muted)]">{p.domain}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="hidden sm:inline text-[11px] text-[var(--muted)] max-w-xs truncate">
                            {p.commitMsg}
                          </span>
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

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        projects={projects}
      />

      {/* Quick Add Project Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Mobile Tab Bar */}
      <MobileTabBar
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />
    </div>
  );
}
