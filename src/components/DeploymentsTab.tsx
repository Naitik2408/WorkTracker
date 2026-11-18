'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Globe, Server, Database, Cpu } from 'lucide-react';
import { Project, DeploymentItem, DeploymentComponent, DeploymentStatus } from '@/types/project';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatTimeAgo } from '@/lib/utils';

interface DeploymentsTabProps {
  project: Project;
  onUpdate: (updated: Project) => void;
}

export function DeploymentsTab({ project, onUpdate }: DeploymentsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [component, setComponent] = useState<DeploymentComponent>('Frontend');
  const [platform, setPlatform] = useState('Vercel');
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [environment, setEnvironment] = useState<'Production' | 'Staging' | 'Preview'>('Production');
  const [status, setStatus] = useState<DeploymentStatus>('live');

  const components: DeploymentComponent[] = ['Frontend', 'Backend', 'Database', 'Workers', 'Other'];

  const getComponentIcon = (comp: DeploymentComponent) => {
    switch (comp) {
      case 'Frontend': return Globe;
      case 'Backend': return Server;
      case 'Database': return Database;
      case 'Workers': return Cpu;
      default: return Server;
    }
  };

  const handleAddDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim()) return;

    const newDep: DeploymentItem = {
      id: `dep-${Date.now()}`,
      component,
      platform: platform.trim(),
      url: url.trim() ? (url.startsWith('http') ? url : `https://${url}`) : undefined,
      branch: branch.trim() || 'main',
      environment,
      status,
      lastDeployedAt: new Date().toISOString(),
    };

    onUpdate({
      ...project,
      lastWorkedAt: new Date().toISOString(),
      deployments: [...project.deployments, newDep],
    });

    setUrl('');
    setIsAdding(false);
  };

  const handleDeleteDeployment = (id: string) => {
    onUpdate({
      ...project,
      deployments: project.deployments.filter((d) => d.id !== id),
    });
  };

  const handleToggleStatus = (id: string, current: DeploymentStatus) => {
    const nextStatus: DeploymentStatus = current === 'live' ? 'down' : 'live';
    const updated = project.deployments.map((d) =>
      d.id === id ? { ...d, status: nextStatus, lastDeployedAt: new Date().toISOString() } : d
    );
    onUpdate({ ...project, deployments: updated });
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-xs font-semibold text-[var(--foreground)]">
            Multi-Component Deployments
          </h3>
          <p className="text-[11px] text-[var(--muted)]">
            Explicit tracking of where each part is deployed (Frontend, Backend, DB, Workers) and its live status.
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-1"
        >
          <Plus className="h-3 w-3" />
          <span>Add component</span>
        </Button>
      </div>

      <div className="space-y-2">
        {project.deployments.length > 0 ? (
          project.deployments.map((dep) => {
            const Icon = getComponentIcon(dep.component);
            const isLive = dep.status === 'live';

            return (
              <div
                key={dep.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-3.5 text-xs transition-colors hover:bg-[var(--surface-subtle)]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="h-8 w-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--muted)] shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[var(--foreground)]">
                        {dep.component}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--muted)]">
                        on {dep.platform}
                      </span>
                      <span className="rounded px-1.5 py-0.2 text-[9px] font-mono border border-[var(--border)] text-[var(--muted)]">
                        {dep.environment}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-[var(--subtle)]">
                      {dep.url ? (
                        <a
                          href={dep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-[var(--accent)] hover:underline font-mono truncate max-w-xs"
                        >
                          <span>{dep.url.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="italic">No public URL</span>
                      )}
                      <span>· branch: <code className="font-mono text-[var(--foreground)]">{dep.branch || 'main'}</code></span>
                      {dep.lastDeployedAt && (
                        <span>· deployed {formatTimeAgo(dep.lastDeployedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(dep.id, dep.status)}
                    title="Click to toggle status"
                  >
                    <Badge variant={isLive ? 'success' : 'danger'} dot pulse={isLive}>
                      {dep.status}
                    </Badge>
                  </button>

                  <button
                    onClick={() => handleDeleteDeployment(dep.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--subtle)] hover:text-[var(--danger)] transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[6px] border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted)]">
            No deployment targets recorded. Add your frontend hosting, database provider, or backend workers.
          </div>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddDeployment} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value as any)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            {components.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Platform (e.g. Vercel, Railway, Supabase)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            autoFocus
          />

          <input
            type="text"
            placeholder="Live URL (e.g. launchfast.naitik.work)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />

          <input
            type="text"
            placeholder="Git Branch (e.g. main)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />

          <div className="flex items-center space-x-2 sm:col-span-2 pt-1">
            <Button size="sm" variant="primary" type="submit">Add Deployment</Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </Card>
  );
}
