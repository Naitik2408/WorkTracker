'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, ArrowUpRight, Layers } from 'lucide-react';
import { Project } from '@/types/project';
import { Badge } from './ui/Badge';
import { formatTimeAgo } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  layoutMode: 'grid' | 'list';
}

export function ProjectCard({ project, layoutMode }: ProjectCardProps) {
  const statusVariant =
    project.status === 'Active'
      ? 'success'
      : project.status === 'Maintenance'
      ? 'accent'
      : project.status === 'Paused'
      ? 'warning'
      : 'default';

  const visibleTech = project.techStack.slice(0, 3);
  const remainingTech = project.techStack.length - visibleTech.length;

  // Build deployment summary string (e.g. "Frontend: Vercel | Database: Supabase")
  const deploymentSummary =
    project.deployments.length > 0
      ? project.deployments
          .map((d) => `${d.component}: ${d.platform}`)
          .slice(0, 2)
          .join(' · ')
      : 'No deployment set';

  if (layoutMode === 'list') {
    return (
      <Link
        href={`/project/${project.slug}`}
        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-3.5 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-subtle)]"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <Badge variant={statusVariant} dot pulse={project.status === 'Active'}>
            {project.status}
          </Badge>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
                {project.name}
              </span>
              {project.attentionGaps && project.attentionGaps.length > 0 && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-[var(--warning)] font-medium">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  <span>{project.attentionGaps.length} gap</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--muted)] truncate max-w-md mt-0.5">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0 text-xs text-[var(--muted)]">
          <span className="font-mono text-[11px] hidden md:inline">{deploymentSummary}</span>
          <div className="flex items-center space-x-1 text-[11px] font-mono text-[var(--subtle)]">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(project.lastWorkedAt)}</span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-[var(--subtle)] group-hover:text-[var(--foreground)] transition-colors" />
        </div>
      </Link>
    );
  }

  // Grid Card View
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group flex flex-col justify-between rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--border-hover)] hover:-translate-y-0.5"
    >
      <div>
        {/* Top: Name + Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-xs text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
                {project.name}
              </span>
            </div>
          </div>
          <Badge variant={statusVariant} dot pulse={project.status === 'Active'}>
            {project.status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed mb-3 min-h-[32px]">
          {project.description}
        </p>

        {/* Tech Chips */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {visibleTech.map((t) => (
              <span
                key={t.name}
                className="rounded-[4px] border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--muted)] font-mono"
              >
                {t.name}
              </span>
            ))}
            {remainingTech > 0 && (
              <span className="rounded-[4px] border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--subtle)] font-mono">
                +{remainingTech}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        {/* Deployment Summary */}
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[var(--muted)] py-2 border-t border-[var(--border)]">
          <Layers className="h-3 w-3 text-[var(--subtle)] shrink-0" />
          <span className="truncate">{deploymentSummary}</span>
        </div>

        {/* Footer: Attention Gaps + Timestamp */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--border)]">
          {project.attentionGaps && project.attentionGaps.length > 0 ? (
            <span className="flex items-center space-x-1 text-[10px] text-[var(--warning)] font-medium">
              <AlertTriangle className="h-3 w-3" />
              <span>{project.attentionGaps[0]}</span>
            </span>
          ) : (
            <span className="text-[10px] text-[var(--subtle)]">All components live</span>
          )}

          <div className="flex items-center space-x-1 text-[10px] text-[var(--subtle)] font-mono ml-auto">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(project.lastWorkedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
