'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Filter, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types/project';
import { getStoredProjects, saveStoredProjects } from '@/lib/projectStore';
import { TopNav } from '@/components/TopNav';
import { PickUpCard } from '@/components/PickUpCard';
import { ProjectCard } from '@/components/ProjectCard';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function ProjectsPage() {
  const router = useRouter();
  const { success } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProjects(getStoredProjects());
  }, []);

  // Keyboard shortcut listener: 'N' creates project, '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNewDialogOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('project-search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Top 1-3 active projects for "Pick Up Where You Left Off"
  const pickUpProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === 'Active')
      .slice(0, 3);
  }, [projects]);

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.deployments.some((d) => d.platform.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleProjectCreated = (newProject: Project) => {
    const next = [newProject, ...projects];
    setProjects(next);
    saveStoredProjects(next);
    success('Project created', `${newProject.name} is ready for configuration.`);
    router.push(`/project/${newProject.slug}`);
  };

  const statusOptions: Array<'All' | ProjectStatus> = ['All', 'Active', 'Maintenance', 'Paused', 'Idea'];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top Navigation Shell */}
      <TopNav
        breadcrumbs={[{ label: 'Projects' }]}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-7">
        
        {/* Header: Title + Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                Projects
              </h1>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 text-xs font-mono text-[var(--muted)]">
                {projects.length}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Track deployments, service dependencies, environment keys, and 6-month re-entry state.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewDialogOpen(true)}
            className="flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New project</span>
            <kbd className="hidden sm:inline-block ml-1 rounded border border-white/20 bg-white/10 px-1 py-0.2 text-[9px] font-mono">
              N
            </kbd>
          </Button>
        </div>

        {/* Pick Up Where You Left Off Section (Only visible when projects exist) */}
        {pickUpProjects.length > 0 && !searchQuery && statusFilter === 'All' && (
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Pick up where you left off</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pickUpProjects.map((p) => (
                <PickUpCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Toolbar: Search, Status Filters, Layout Mode */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--subtle)]" />
              <input
                id="project-search-input"
                type="text"
                placeholder="Search projects or tech... [/]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--card)] pl-9 pr-8 py-2 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] hover:border-[var(--border-hover)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
              <kbd className="absolute right-2.5 top-2.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.2 text-[9px] font-mono text-[var(--muted)]">
                /
              </kbd>
            </div>

            {/* Status Filter Chips + Layout Toggle */}
            <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-0.5 overflow-x-auto">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-[4px] transition-colors whitespace-nowrap ${
                      statusFilter === opt
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Grid / List Layout Switcher */}
              <div className="hidden sm:flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-0.5">
                <button
                  onClick={() => setLayoutMode('grid')}
                  aria-label="Grid layout"
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
                  aria-label="List layout"
                  className={`p-1.5 rounded-[4px] transition-colors ${
                    layoutMode === 'list'
                      ? 'bg-[var(--foreground)] text-[var(--background)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Project List / Grid */}
          {filteredProjects.length > 0 ? (
            <div
              className={
                layoutMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5'
                  : 'space-y-2'
              }
            >
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} layoutMode={layoutMode} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Layers}
              title={projects.length === 0 ? 'No projects yet' : 'No matching projects found'}
              description={
                projects.length === 0
                  ? 'Create your first project to document its tech stack, deployments, and 6-month re-entry resume.'
                  : `No projects match "${searchQuery}". Clear your search query or filters.`
              }
              actionLabel={projects.length === 0 ? 'Create first project' : 'Clear filters'}
              onAction={
                projects.length === 0
                  ? () => setIsNewDialogOpen(true)
                  : () => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }
              }
            />
          )}
        </section>

      </main>

      {/* Screen B: New Project Dialog */}
      <NewProjectDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onCreated={handleProjectCreated}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => setIsNewDialogOpen(true)}
        projects={projects.map((p) => ({
          name: p.name,
          domain: p.liveUrl?.replace('https://', ''),
          framework: p.techStack[0]?.name || 'App',
        }))}
      />
    </div>
  );
}
