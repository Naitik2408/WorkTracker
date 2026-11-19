'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ExternalLink, 
  GitBranch, 
  Layers, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Clock, 
  FileText, 
  KeyRound, 
  Server, 
  SlidersHorizontal 
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types/project';
import { getStoredProjects, saveStoredProjects, updateProject } from '@/lib/projectStore';
import { TopNav } from '@/components/TopNav';
import { ResumeCard } from '@/components/ResumeCard';
import { NotesTimeline } from '@/components/NotesTimeline';
import { StackTab } from '@/components/StackTab';
import { DeploymentsTab } from '@/components/DeploymentsTab';
import { EnvTab } from '@/components/EnvTab';
import { Tabs } from '@/components/ui/Tabs';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatTimeAgo } from '@/lib/utils';

function ProjectDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { success, error } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const projects = getStoredProjects();
    const found = projects.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setProject(found);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <TopNav breadcrumbs={[{ label: 'Projects', href: '/' }, { label: 'Loading...' }]} />
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 text-center text-xs text-[var(--muted)]">
          Finding project details...
        </main>
      </div>
    );
  }

  const handleUpdate = (updated: Project) => {
    setProject(updated);
    updateProject(updated);
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    const updated: Project = {
      ...project,
      status: newStatus,
      lastWorkedAt: new Date().toISOString(),
    };
    handleUpdate(updated);
    setIsChangingStatus(false);
    success('Status updated', `${project.name} is now ${newStatus}`);
  };

  const handleDelete = () => {
    const all = getStoredProjects();
    const next = all.filter((p) => p.id !== project.id);
    saveStoredProjects(next);
    success('Project removed', `${project.name} was removed from monitoring.`);
    router.push('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'stack', label: 'Stack & Services', icon: SlidersHorizontal, count: project.techStack.length + project.services.length },
    { id: 'deployments', label: 'Deployments', icon: Server, count: project.deployments.length },
    { id: 'environment', label: 'Environment', icon: KeyRound, count: project.envVars.length },
    { id: 'notes', label: 'Notes & Journal', icon: Layers, count: project.notes.length },
  ];

  const statusVariant =
    project.status === 'Active'
      ? 'success'
      : project.status === 'Maintenance'
      ? 'accent'
      : project.status === 'Paused'
      ? 'warning'
      : 'default';

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top Global Shell */}
      <TopNav
        breadcrumbs={[
          { label: 'Projects', href: '/' },
          { label: project.name }
        ]}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Project Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[var(--border)]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1 -ml-1 rounded"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] truncate">
                {project.name}
              </h1>

              {/* Status Badge with Inline Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsChangingStatus(!isChangingStatus)}
                  className="cursor-pointer"
                  title="Click to change status"
                >
                  <Badge variant={statusVariant} dot pulse={project.status === 'Active'}>
                    {project.status} ▾
                  </Badge>
                </button>

                {isChangingStatus && (
                  <div className="absolute top-7 left-0 z-30 rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg space-y-0.5">
                    {(['Active', 'Maintenance', 'Paused', 'Idea', 'Archived'] as ProjectStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className="w-full text-left rounded-[4px] px-2.5 py-1 text-xs hover:bg-[var(--surface-subtle)] text-[var(--foreground)] block"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] max-w-2xl">
              {project.description}
            </p>

            <div className="flex items-center space-x-3 pt-1 text-[11px] text-[var(--subtle)] font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last worked: {formatTimeAgo(project.lastWorkedAt)}</span>
              </span>
            </div>
          </div>

          {/* Quick Actions (Repo, Live, Delete) */}
          <div className="flex items-center space-x-2 shrink-0">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-subtle)] transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ExternalLink className="h-2.5 w-2.5 text-[var(--subtle)]" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <span>Open Live</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
              title="Remove project from WorkTracker"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        {/* Tab Content Panes */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 6-Month Test Re-Entry Module */}
              <ResumeCard project={project} onUpdate={handleUpdate} />

              {/* Quick Summary Cards (Stack + Deployments at a glance) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 text-xs space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
                    Deployment Summary
                  </div>
                  {project.deployments.length > 0 ? (
                    <ul className="space-y-1.5">
                      {project.deployments.map((d) => (
                        <li key={d.id} className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-[var(--foreground)]">{d.component} ({d.platform})</span>
                          <span className="text-[var(--success)]">{d.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-[var(--subtle)] italic">No deployments configured yet.</p>
                  )}
                </div>

                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 text-xs space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
                    Third-Party Services ({project.services.length})
                  </div>
                  {project.services.length > 0 ? (
                    <ul className="space-y-1.5">
                      {project.services.map((s) => (
                        <li key={s.id} className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[var(--foreground)]">{s.name}</span>
                          <span className="text-[var(--muted)] truncate max-w-[150px]">{s.purpose}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-[var(--subtle)] italic">No services linked yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <StackTab project={project} onUpdate={handleUpdate} />
          )}

          {activeTab === 'deployments' && (
            <DeploymentsTab project={project} onUpdate={handleUpdate} />
          )}

          {activeTab === 'environment' && (
            <EnvTab project={project} onUpdate={handleUpdate} />
          )}

          {activeTab === 'notes' && (
            <NotesTimeline project={project} onUpdate={handleUpdate} />
          )}
        </div>

      </main>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          <TopNav breadcrumbs={[{ label: 'Projects', href: '/' }, { label: 'Loading...' }]} />
          <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 text-center text-xs text-[var(--muted)]">
            Loading project...
          </main>
        </div>
      }
    >
      <ProjectDetailContent />
    </Suspense>
  );
}
