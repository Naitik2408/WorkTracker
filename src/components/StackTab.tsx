'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Project, TechItem, ThirdPartyService } from '@/types/project';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface StackTabProps {
  project: Project;
  onUpdate: (updated: Project) => void;
}

export function StackTab({ project, onUpdate }: StackTabProps) {
  // Adding tech item
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [techName, setTechName] = useState('');
  const [techCategory, setTechCategory] = useState<TechItem['category']>('Frontend');

  // Adding 3rd-party service
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ThirdPartyService['category']>('other');
  const [servicePurpose, setServicePurpose] = useState('');
  const [servicePlan, setServicePlan] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');

  const categories: Array<TechItem['category']> = ['Frontend', 'Backend', 'Database', 'Tooling', 'Other'];

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName.trim()) return;

    const newItem: TechItem = {
      name: techName.trim(),
      category: techCategory,
    };

    onUpdate({
      ...project,
      lastWorkedAt: new Date().toISOString(),
      techStack: [...project.techStack, newItem],
    });

    setTechName('');
    setIsAddingTech(false);
  };

  const handleDeleteTech = (name: string) => {
    onUpdate({
      ...project,
      techStack: project.techStack.filter((t) => t.name !== name),
    });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const newService: ThirdPartyService = {
      id: `srv-${Date.now()}`,
      name: serviceName.trim(),
      category: serviceCategory,
      purpose: servicePurpose.trim() || 'General service',
      plan: servicePlan.trim() || 'Free tier',
      dashboardUrl: serviceUrl.trim(),
    };

    onUpdate({
      ...project,
      lastWorkedAt: new Date().toISOString(),
      services: [...project.services, newService],
    });

    setServiceName('');
    setServicePurpose('');
    setServicePlan('');
    setServiceUrl('');
    setIsAddingService(false);
  };

  const handleDeleteService = (id: string) => {
    onUpdate({
      ...project,
      services: project.services.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Categorized Tech Stack */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-xs font-semibold text-[var(--foreground)]">
              Core Tech Stack
            </h3>
            <p className="text-[11px] text-[var(--muted)]">
              Libraries, frameworks, databases, and tooling powering this project.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddingTech(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add tech</span>
          </Button>
        </div>

        {/* Tech by Category */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const items = project.techStack.filter((t) => t.category === cat);
            if (items.length === 0 && !isAddingTech) return null;

            return (
              <div key={cat} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs py-1.5 border-b border-[var(--border)] last:border-b-0">
                <span className="w-24 font-mono font-semibold text-[10px] uppercase tracking-wider text-[var(--muted)] shrink-0">
                  {cat}:
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {items.map((item) => (
                    <span
                      key={item.name}
                      className="group inline-flex items-center space-x-1 rounded-[4px] border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 text-xs text-[var(--foreground)] font-mono"
                    >
                      <span>{item.name}</span>
                      <button
                        onClick={() => handleDeleteTech(item.name)}
                        className="text-[var(--subtle)] hover:text-[var(--danger)] transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {items.length === 0 && (
                    <span className="text-[11px] text-[var(--subtle)] italic">None specified</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isAddingTech && (
          <form onSubmit={handleAddTech} className="flex items-center gap-2 pt-2 border-t border-[var(--border)] flex-wrap">
            <input
              type="text"
              placeholder="e.g. Next.js, Prisma, Tailwind"
              value={techName}
              onChange={(e) => setTechName(e.target.value)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              autoFocus
            />
            <select
              value={techCategory}
              onChange={(e) => setTechCategory(e.target.value as any)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Button size="sm" variant="primary" type="submit">Add</Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsAddingTech(false)}>Cancel</Button>
          </form>
        )}
      </Card>

      {/* 2. Third-Party Services */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-xs font-semibold text-[var(--foreground)]">
              Third-Party Services & Dependencies
            </h3>
            <p className="text-[11px] text-[var(--muted)]">
              External platforms (Auth, Payments, Email, Analytics, Database) with plans, dashboard URLs, and accounts.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddingService(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add service</span>
          </Button>
        </div>

        <div className="space-y-2">
          {project.services.length > 0 ? (
            project.services.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--card)] p-3 text-xs transition-colors hover:bg-[var(--surface-subtle)]"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[var(--foreground)]">{srv.name}</span>
                    <span className="rounded px-1.5 py-0.2 text-[9px] font-mono border border-[var(--border)] text-[var(--muted)]">
                      {srv.category}
                    </span>
                    <span className="text-[11px] text-[var(--subtle)]">· {srv.plan}</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] truncate max-w-md">
                    {srv.purpose}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {srv.dashboardUrl && (
                    <a
                      href={srv.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-[11px] text-[var(--accent)] hover:underline"
                    >
                      <span>Dashboard</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--subtle)] hover:text-[var(--danger)] transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[6px] border border-dashed border-[var(--border)] p-5 text-center text-xs text-[var(--muted)]">
              No third-party services linked yet. Add services like Stripe, Supabase, Resend, or AWS.
            </div>
          )}
        </div>

        {isAddingService && (
          <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
            <input
              type="text"
              placeholder="Service Name (e.g. Stripe, Resend)"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              autoFocus
            />
            <input
              type="text"
              placeholder="Purpose (e.g. Payment webhooks)"
              value={servicePurpose}
              onChange={(e) => setServicePurpose(e.target.value)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Plan / Cost (e.g. Free tier, $20/mo)"
              value={servicePlan}
              onChange={(e) => setServicePlan(e.target.value)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Dashboard URL (optional)"
              value={serviceUrl}
              onChange={(e) => setServiceUrl(e.target.value)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <div className="flex items-center space-x-2 sm:col-span-2 pt-1">
              <Button size="sm" variant="primary" type="submit">Save Service</Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setIsAddingService(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </Card>

    </div>
  );
}
