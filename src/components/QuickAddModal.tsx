'use client';

import React, { useState } from 'react';
import { X, Plus, Check, Globe } from 'lucide-react';
import { Button } from './ui/Button';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

export function QuickAddModal({ isOpen, onClose, onProjectCreated }: QuickAddModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [repo, setRepo] = useState('');
  const [framework, setFramework] = useState('nextjs');
  const [domain, setDomain] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    const newProject = {
      id: `manual-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      framework,
      domain: domain.trim() || `${name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`,
      status: 'READY',
      branch: 'main',
      commitMsg: 'Initial monitored release',
      repo: repo.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      repoOwner: 'Naitik2408',
      updatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      onProjectCreated(newProject);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <h3 className="text-xs font-semibold text-[var(--foreground)]">Track New Project</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-[var(--muted)] mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., ai-search-engine"
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] mb-1">
                Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 text-xs focus:outline-none"
              >
                <option value="nextjs">Next.js</option>
                <option value="vite">Vite / React</option>
                <option value="node">Node.js / Express</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] mb-1">
                GitHub Repository
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g., ai-search-engine"
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[var(--muted)] mb-1">
              Live Domain / URL (Optional)
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., demo.naitik.work"
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>Track Project</span>
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
