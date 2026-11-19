'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Project } from '@/types/project';
import { Badge } from './ui/Badge';
import { formatTimeAgo } from '@/lib/utils';

interface PickUpCardProps {
  project: Project;
}

export function PickUpCard({ project }: PickUpCardProps) {
  const nextIncompleteStep = project.resume.nextSteps.find((s) => !s.completed);
  const statusVariant =
    project.status === 'Active'
      ? 'success'
      : project.status === 'Maintenance'
      ? 'accent'
      : project.status === 'Paused'
      ? 'warning'
      : 'default';

  return (
    <Link
      href={`/project/${project.slug}`}
      className="group block rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--border-hover)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="font-semibold text-xs text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
            {project.name}
          </span>
          <Badge variant={statusVariant} dot pulse={project.status === 'Active'}>
            {project.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-[var(--subtle)] shrink-0 font-mono">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(project.lastWorkedAt)}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1">
          Next Step:
        </div>
        <div className="text-xs text-[var(--foreground)] flex items-start space-x-1.5 font-normal">
          <span className="text-[var(--muted)] shrink-0">↳</span>
          <span className="line-clamp-2">
            {nextIncompleteStep ? nextIncompleteStep.text : 'All immediate tasks completed. Review resume card.'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] text-[var(--muted)]">
        <div className="truncate font-mono text-[10px]">
          {project.deployments.length > 0
            ? `${project.deployments[0].component}: ${project.deployments[0].platform}`
            : 'No deployments set'}
        </div>
        <span className="flex items-center text-[var(--accent)] font-medium text-[11px] group-hover:translate-x-0.5 transition-transform">
          Continue <ArrowRight className="h-3 w-3 ml-1" />
        </span>
      </div>
    </Link>
  );
}
