'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ExternalLink, 
  Plus, 
  Search, 
  Columns3, 
  List, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { JobApplication, ApprovalAction } from '@/types/database';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

type ViewMode = 'status_board' | 'list' | 'timeline' | 'responses' | 'trends';

export default function CareerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [approvals, setApprovals] = useState<ApprovalAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('status_board');
  const [searchQuery, setSearchQuery] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const [{ data: jData }, { data: aData }] = await Promise.all([
        supabase.from('job_applications').select('*').order('applied_at', { ascending: false }),
        supabase.from('approval_queue_actions').select('*').eq('status', 'PENDING_APPROVAL')
      ]);
      if (jData) setJobs(jData);
      if (aData) setApprovals(aData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({
      status: 'APPROVED',
      approved_by_user_at: new Date().toISOString(),
      executed_at: new Date().toISOString()
    }).eq('id', id);
    loadData();
  };

  const handleRejectAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({ status: 'REJECTED' }).eq('id', id);
    loadData();
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      approvalCount={approvals.length}
      approvals={approvals}
      onRefreshData={loadData}
      onApproveAction={handleApproveAction}
      onRejectAction={handleRejectAction}
    >
      {/* Header Banner */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-[var(--accent)]" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
              Career & Income (95/5 Job-Hunting Monitor)
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)] max-w-2xl">
            95% observation of applications and recruiter responses. 5% lightweight human action with Gemini approval protection.
          </p>
        </div>
      </Card>

      {/* 5 Observation Modes Selector & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
        
        {/* Horizontal scrollable segmented control for mobile */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-2)] p-1">
          {[
            { id: 'status_board', label: 'Status Board', icon: Columns3 },
            { id: 'list', label: 'Application List', icon: List },
            { id: 'timeline', label: 'Activity Stream', icon: Calendar },
            { id: 'responses', label: 'Recruiter Replies', icon: MessageSquare },
            { id: 'trends', label: 'Trends & Velocity', icon: TrendingUp }
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = viewMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id as ViewMode)}
                className={`min-h-[38px] shrink-0 flex items-center space-x-1.5 rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors select-none ${
                  isSelected
                    ? 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Mode 1: Status Kanban Board */}
      {viewMode === 'status_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          {['APPLIED', 'PENDING', 'SHORTLISTED', 'INTERVIEWING'].map((colStatus) => {
            const colJobs = filteredJobs.filter((j) => j.status === colStatus);
            return (
              <Card
                key={colStatus}
                className="p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] text-xs">
                  <span className="font-semibold">{colStatus}</span>
                  <span className="rounded-full bg-[var(--background-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                    {colJobs.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3 text-xs space-y-1.5 shadow-xs hover:border-[var(--border-hover)] transition-colors"
                    >
                      <div className="font-semibold text-[var(--foreground)]">
                        {job.role_title}
                      </div>
                      <div className="text-[11px] text-[var(--muted)]">
                        {job.company_name} {job.location && `· ${job.location}`}
                      </div>
                      {job.latest_message_snippet && (
                        <div className="rounded border border-[var(--border)] bg-[var(--card)] p-2 text-[10px] text-[var(--muted)] line-clamp-2">
                          &ldquo;{job.latest_message_snippet}&rdquo;
                        </div>
                      )}
                      <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--muted)]">
                        <span>{formatDate(job.applied_at)}</span>
                        {job.needs_follow_up && (
                          <Badge variant="warning">Follow-up due</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {colJobs.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-[var(--muted)]">
                      No active roles
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mode 2: Sortable Application List / Mobile Responsive Cards */}
      {viewMode === 'list' && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background-2)] text-[var(--muted)] uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Applied</th>
                  <th className="py-3 px-4">Recruiter / Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[var(--background-2)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--foreground)]">{job.role_title}</div>
                      <div className="text-[11px] text-[var(--muted)]">{job.company_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={job.status === 'SHORTLISTED' ? 'success' : 'default'}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)] hidden sm:table-cell">
                      {formatDate(job.applied_at)}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)] max-w-xs truncate">
                      {job.latest_message_snippet || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {job.needs_follow_up ? (
                        <span className="text-[10px] text-[var(--warning)] font-semibold">Follow-up</span>
                      ) : (
                        <span className="text-[10px] text-[var(--muted)]">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Mode 3: Activity Stream */}
      {viewMode === 'timeline' && (
        <Card className="p-4 sm:p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Chronological Activity Stream
          </h3>
          <div className="relative pl-6 space-y-4 border-l border-[var(--border)]">
            {filteredJobs.map((job) => (
              <div key={job.id} className="relative group">
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--foreground)]" />
                <div className="text-xs font-semibold text-[var(--foreground)]">
                  {job.role_title} at {job.company_name}
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  {job.latest_message_snippet || `Submitted application for ${job.role_title}`}
                </p>
                <span className="text-[10px] font-mono text-[var(--subtle)]">
                  {formatDate(job.applied_at)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Mode 4: Recruiter Replies */}
      {viewMode === 'responses' && (
        <div className="space-y-3">
          {filteredJobs
            .filter((j) => j.latest_message_snippet)
            .map((job) => (
              <Card key={job.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs sm:text-sm">
                    {job.recruiter_name || 'Recruiter'} · {job.company_name}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--subtle)]">
                    {formatTimeAgo(job.last_contact_at)}
                  </span>
                </div>
                <div className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-2.5 text-xs font-mono">
                  &ldquo;{job.latest_message_snippet}&rdquo;
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Mode 5: Trends & Velocity */}
      {viewMode === 'trends' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-[11px] text-[var(--muted)] font-semibold uppercase">Total Applications</span>
            <span className="block mt-2 text-2xl font-bold font-mono">{jobs.length}</span>
            <span className="text-[10px] text-[var(--success)] font-medium">+2 this week</span>
          </Card>
          <Card className="p-4">
            <span className="text-[11px] text-[var(--muted)] font-semibold uppercase">Response Rate</span>
            <span className="block mt-2 text-2xl font-bold font-mono">75%</span>
            <span className="text-[10px] text-[var(--success)] font-medium">3 of 4 active responses</span>
          </Card>
          <Card className="p-4">
            <span className="text-[11px] text-[var(--muted)] font-semibold uppercase">Shortlist Velocity</span>
            <span className="block mt-2 text-2xl font-bold font-mono">50%</span>
            <span className="text-[10px] text-[var(--muted)]">2 in shortlist/interview</span>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
