'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function QuickAddModal({ isOpen, onClose, onRefresh }: QuickAddModalProps) {
  const [tab, setTab] = useState<'priority' | 'job' | 'idea' | 'ops'>('priority');
  const [loading, setLoading] = useState(false);

  // Form states
  const [priorityTitle, setPriorityTitle] = useState('');
  const [priorityRank, setPriorityRank] = useState(1);

  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaPurpose, setIdeaPurpose] = useState<'PERSONAL' | 'LEARNING' | 'PORTFOLIO' | 'BUSINESS'>('BUSINESS');

  const [opsTitle, setOpsTitle] = useState('');
  const [opsType, setOpsType] = useState<'TASK' | 'APPOINTMENT' | 'COMMITMENT' | 'RECURRING'>('TASK');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === 'priority') {
        await supabase.from('daily_priorities').insert({
          priority_date: new Date().toISOString().split('T')[0],
          rank: priorityRank,
          title: priorityTitle,
          status: 'PLANNED'
        });
        setPriorityTitle('');
      } else if (tab === 'job') {
        await supabase.from('job_applications').insert({
          company_name: companyName,
          role_title: roleTitle,
          salary_range: salaryRange || null,
          status: 'APPLIED',
          applied_at: new Date().toISOString().split('T')[0]
        });
        setCompanyName('');
        setRoleTitle('');
      } else if (tab === 'idea') {
        await supabase.from('idea_sandbox').insert({
          title: ideaTitle,
          description: ideaDescription || null,
          proposed_purpose: ideaPurpose,
          status: 'EVALUATING'
        });
        setIdeaTitle('');
        setIdeaDescription('');
      } else if (tab === 'ops') {
        await supabase.from('personal_ops_items').insert({
          item_type: opsType,
          title: opsTitle,
          status: 'PENDING'
        });
        setOpsTitle('');
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error('Error saving item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Quick Capture</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--card-foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 py-3 border-b border-[var(--border)]">
          {[
            { id: 'priority', label: 'Top 3 Priority' },
            { id: 'job', label: 'Job Application' },
            { id: 'idea', label: 'Sandbox Idea' },
            { id: 'ops', label: 'Ops / Task' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--card-foreground)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-4 space-y-3.5 text-xs">
          
          {tab === 'priority' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">
                  Focus Rank (Top 3)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setPriorityRank(r)}
                      className={`flex-1 rounded border py-1 font-semibold ${
                        priorityRank === r
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-[var(--border)] hover:bg-[var(--accent)]'
                      }`}
                    >
                      Priority #{r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">
                  What is the one critical priority?
                </label>
                <input
                  type="text"
                  required
                  value={priorityTitle}
                  onChange={(e) => setPriorityTitle(e.target.value)}
                  placeholder="e.g., Finalize technical interview project demo"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </>
          )}

          {tab === 'job' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Vercel"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Engineer"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Salary / Compensation (Optional)</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g., $140,000 - $160,000"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </>
          )}

          {tab === 'idea' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Idea Name</label>
                <input
                  type="text"
                  required
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="e.g., High-throughput Next.js edge caching bot"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Category / Purpose</label>
                <select
                  value={ideaPurpose}
                  onChange={(e) => setIdeaPurpose(e.target.value as any)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="BUSINESS">Business Venture</option>
                  <option value="PORTFOLIO">Portfolio Project</option>
                  <option value="LEARNING">Skill / Learning</option>
                  <option value="PERSONAL">Personal Tool</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  placeholder="Keep it in sandbox until verified and approved..."
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </>
          )}

          {tab === 'ops' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Type</label>
                <select
                  value={opsType}
                  onChange={(e) => setOpsType(e.target.value as any)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="TASK">Personal Task</option>
                  <option value="APPOINTMENT">Appointment / Interview</option>
                  <option value="COMMITMENT">Personal Commitment</option>
                  <option value="RECURRING">Recurring Responsibility</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={opsTitle}
                  onChange={(e) => setOpsTitle(e.target.value)}
                  placeholder="e.g., Update bank IFSC code on payroll portal"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-3 py-1.5 font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 rounded bg-black text-white dark:bg-white dark:text-black px-4 py-1.5 font-medium shadow-xs hover:opacity-90 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{loading ? 'Saving...' : 'Save to Dashboard'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
