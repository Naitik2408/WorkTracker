'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Copy, Check, AlertCircle } from 'lucide-react';
import { Project, EnvVarItem } from '@/types/project';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface EnvTabProps {
  project: Project;
  onUpdate: (updated: Project) => void;
}

export function EnvTab({ project, onUpdate }: EnvTabProps) {
  const [activeEnv, setActiveEnv] = useState<'Production' | 'Preview' | 'Development'>('Production');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedExample, setCopiedExample] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [newKey, setNewKey] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newWhereSet, setNewWhereSet] = useState('Vercel');
  const [newRequired, setNewRequired] = useState(true);
  const [newValue, setNewValue] = useState('');

  const envs: Array<'Production' | 'Preview' | 'Development'> = ['Production', 'Preview', 'Development'];

  // Filter vars for the selected environment
  const currentVars = project.envVars.filter((v) => v.environment === activeEnv);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // Auto re-hide after 10s for security
      if (next[id]) {
        setTimeout(() => {
          setRevealedIds((current) => ({ ...current, [id]: false }));
        }, 10000);
      }
      return next;
    });
  };

  const handleCopyExample = () => {
    // Generate .env.example with keys and descriptions only (never values)
    const lines = project.envVars
      .filter((v) => v.environment === activeEnv || v.environment === 'Production')
      .map((v) => `# ${v.description || 'Environment variable'}\n${v.key}=`)
      .join('\n\n');

    navigator.clipboard.writeText(lines || '# No environment variables documented yet.');
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 1500);
  };

  const handleAddVar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    const newVar: EnvVarItem = {
      id: `env-${Date.now()}`,
      key: newKey.trim().toUpperCase(),
      environment: activeEnv,
      component: 'Frontend',
      whereSet: newWhereSet.trim() || 'Vercel',
      required: newRequired,
      description: newDesc.trim() || 'Required application key',
      value: newValue.trim(),
      isMasked: true,
      updatedAt: new Date().toISOString(),
    };

    onUpdate({
      ...project,
      lastWorkedAt: new Date().toISOString(),
      envVars: [...project.envVars, newVar],
    });

    setNewKey('');
    setNewDesc('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDeleteVar = (id: string) => {
    onUpdate({
      ...project,
      envVars: project.envVars.filter((v) => v.id !== id),
    });
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      {/* Top Header + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-xs font-semibold text-[var(--foreground)]">
            Environment Variables
          </h3>
          <p className="text-[11px] text-[var(--muted)]">
            Know which keys are needed, where they are set, and export safe .env.example templates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyExample}
            className="flex items-center space-x-1"
          >
            {copiedExample ? (
              <>
                <Check className="h-3 w-3 text-[var(--success)]" />
                <span className="text-[var(--success)]">Copied .env.example</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy as .env.example</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add Key</span>
          </Button>
        </div>
      </div>

      {/* Environment Switcher Tabs (Dev / Preview / Production) */}
      <div className="flex items-center space-x-1 border-b border-[var(--border)] pb-2">
        {envs.map((env) => {
          const count = project.envVars.filter((v) => v.environment === env).length;
          return (
            <button
              key={env}
              onClick={() => setActiveEnv(env)}
              className={`rounded-[4px] px-3 py-1 text-xs font-medium transition-colors ${
                activeEnv === env
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <span>{env}</span>
              <span className="ml-1.5 opacity-70 font-mono text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Variables Table */}
      <div className="overflow-x-auto">
        {currentVars.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2 pr-4 font-semibold">Key Name</th>
                <th className="py-2 px-4 font-semibold">Purpose</th>
                <th className="py-2 px-4 font-semibold">Where Set</th>
                <th className="py-2 px-4 font-semibold">Required</th>
                <th className="py-2 px-4 font-semibold">Value</th>
                <th className="py-2 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentVars.map((v) => {
                const isRevealed = revealedIds[v.id];
                const hasValue = Boolean(v.value);

                return (
                  <tr key={v.id} className="group hover:bg-[var(--surface-subtle)]">
                    <td className="py-2.5 pr-4 font-mono font-medium text-[var(--foreground)]">
                      {v.key}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--muted)] max-w-xs truncate">
                      {v.description}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[var(--foreground)]">
                      {v.whereSet}
                    </td>
                    <td className="py-2.5 px-4">
                      {v.required ? (
                        <span className="rounded px-1.5 py-0.2 text-[9px] font-bold uppercase bg-[var(--danger)]/10 text-[var(--danger)]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--subtle)]">Optional</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      {hasValue ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-[var(--foreground)] truncate max-w-[140px]">
                            {isRevealed ? v.value : '••••••••••••••••'}
                          </span>
                          <button
                            onClick={() => toggleReveal(v.id)}
                            className="text-[var(--subtle)] hover:text-[var(--foreground)] transition-colors"
                            title={isRevealed ? 'Hide value' : 'Reveal for 10s'}
                          >
                            {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center space-x-1 text-[var(--warning)] text-[10px] font-semibold">
                          <AlertCircle className="h-2.5 w-2.5" />
                          <span>Not set</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      <button
                        onClick={() => handleDeleteVar(v.id)}
                        className="opacity-0 group-hover:opacity-100 text-[var(--subtle)] hover:text-[var(--danger)] transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="rounded-[6px] border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted)]">
            No environment keys recorded for {activeEnv}. Add keys so you immediately know which variables to set when deploying.
          </div>
        )}
      </div>

      {/* Add Variable Form */}
      {isAdding && (
        <form onSubmit={handleAddVar} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
          <input
            type="text"
            placeholder="KEY_NAME (e.g. DATABASE_URL)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent)] focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Purpose (e.g. PostgreSQL pooler URL)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Where Set (e.g. Vercel, Railway, .env.local)"
            value={newWhereSet}
            onChange={(e) => setNewWhereSet(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Encrypted Value (optional, masked)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent)] focus:outline-none"
          />
          <div className="flex items-center space-x-2 sm:col-span-2 pt-1">
            <Button size="sm" variant="primary" type="submit">Save Variable</Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </Card>
  );
}
