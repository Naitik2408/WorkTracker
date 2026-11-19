'use client';

import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/types/project';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: Project) => void;
}

export function NewProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses: ProjectStatus[] = ['Active', 'Idea', 'Paused'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Project name is required');
      return;
    }

    setIsSubmitting(true);
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProject: Project = {
      id: `prj-${Date.now()}`,
      slug: slug || `project-${Date.now()}`,
      name: trimmedName,
      description: description.trim() || 'No description provided yet.',
      status,
      repoUrl: '',
      liveUrl: '',
      docsUrl: '',
      lastWorkedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      attentionGaps: ['Complete project checklist'],
      resume: {
        currentState: 'Project just initialized. Add repository, setup instructions, and deployment details.',
        nextSteps: [
          { id: 'step-1', text: 'Connect GitHub repository link', completed: false },
          { id: 'step-2', text: 'Document how to run locally', completed: false },
        ],
        blockers: [],
        runLocally: 'pnpm install && pnpm dev',
      },
      techStack: [],
      services: [],
      deployments: [],
      envVars: [],
      notes: [
        {
          id: `note-${Date.now()}`,
          body: 'Project created in WorkTracker.',
          pinned: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setTimeout(() => {
      onCreated(newProject);
      setIsSubmitting(false);
      setName('');
      setDescription('');
      setStatus('Active');
      setError('');
      onOpenChange(false);
    }, 250);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Project"
      description="Create a project space to track deployments, environment keys, and 6-month re-entry state."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Project Name"
            placeholder="e.g. launchfast"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[var(--muted)] mb-1.5">
            One-line Description
          </label>
          <input
            type="text"
            placeholder="e.g. Next.js SaaS starter kit with Stripe and Supabase"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] hover:border-[var(--border-hover)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[var(--muted)] mb-1.5">
            Initial Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-[6px] border px-3 py-2 text-xs font-medium transition-colors ${
                  status === s
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Create Project
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
