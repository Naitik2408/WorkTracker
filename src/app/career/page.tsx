'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ExternalLink, 
  Clock, 
  Mail, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Columns3,
  List,
  Calendar,
  MessageSquare,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { JobApplication, ApprovalAction } from '@/types/database';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { GeminiAdvisorPanel } from '@/components/GeminiAdvisorPanel';
import { QuickAddModal } from '@/components/QuickAddModal';

type ViewMode = 'status_board' | 'list' | 'timeline' | 'responses' | 'trends';

const statusColumns: Array<JobApplication['status']> = [
  'INTERESTED',
  'APPLIED',
  'PENDING',
  'SHORTLISTED',
  'INTERVIEWING',
  'OFFER',
  'REJECTED'
];

export default function CareerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [approvals, setApprovals] = useState<ApprovalAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('status_board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleAdvisor={() => setIsAdvisorOpen((prev) => !prev)}
        isAdvisorOpen={isAdvisorOpen}
        approvalCount={approvals.length}
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Executive Philosophy Banner: 95% Observation / 5% Action */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                <h1 className="text-xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Career & Income (95/5 Job-Hunting Monitor)
                </h1>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)] max-w-2xl">
                95% high-clarity monitoring of applications and recruiter responses. 5% lightweight human action with strict Gemini approval protection.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAdvisorOpen(true)}
                className="flex items-center space-x-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--accent)] transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Advisor & Drafts ({approvals.length})</span>
              </button>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="flex items-center space-x-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-medium shadow-xs hover:opacity-90 transition-opacity"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log Role</span>
              </button>
            </div>
          </div>

          {/* 5 Observation Modes Selector & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
            
            {/* Segmented View Mode Tabs */}
            <div className="flex items-center space-x-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
              {[
                { id: 'status_board', label: 'Status Board', icon: Columns3 },
                { id: 'list', label: 'Application List', icon: List },
                { id: 'timeline', label: 'Activity Stream', icon: Calendar },
                { id: 'responses', label: 'Recruiter Replies', icon: MessageSquare },
                { id: 'trends', label: 'Trends & Velocity', icon: TrendingUp }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id as ViewMode)}
                    className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      viewMode === m.id
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-1 text-xs text-[var(--card-foreground)] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white w-full sm:w-64"
              />
            </div>
          </div>

          {/* Mode 1: Status Kanban Board */}
          {viewMode === 'status_board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {['APPLIED', 'PENDING', 'SHORTLISTED', 'INTERVIEWING'].map((colStatus) => {
                const colJobs = filteredJobs.filter((j) => j.status === colStatus);
                return (
                  <div
                    key={colStatus}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 space-y-3 min-w-[260px]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] text-xs">
                      <span className="font-semibold">{colStatus}</span>
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-mono">
                        {colJobs.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {colJobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-1.5 shadow-xs hover:border-black dark:hover:border-white transition-colors"
                        >
                          <div className="font-semibold text-[var(--card-foreground)]">
                            {job.role_title}
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)]">
                            {job.company_name} {job.location && `· ${job.location}`}
                          </div>
                          {job.salary_range && (
                            <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                              {job.salary_range}
                            </div>
                          )}
                          {job.latest_message_snippet && (
                            <div className="rounded border border-[var(--border)] bg-[var(--card)] p-2 text-[10px] text-[var(--muted-foreground)] line-clamp-2">
                              &ldquo;{job.latest_message_snippet}&rdquo;
                            </div>
                          )}
                          <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                            <span>{formatDate(job.applied_at)}</span>
                            {job.needs_follow_up && (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                Follow-up due
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {colJobs.length === 0 && (
                        <div className="py-8 text-center text-[11px] text-[var(--muted-foreground)]">
                          No active roles in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode 2: Sortable Application List */}
          {viewMode === 'list' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Role & Company</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Applied</th>
                    <th className="py-3 px-4">Last Contact</th>
                    <th className="py-3 px-4">Recruiter / Notes</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[var(--accent)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[var(--card-foreground)]">{job.role_title}</div>
                        <div className="text-[11px] text-[var(--muted-foreground)]">{job.company_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-[var(--muted)] text-[var(--card-foreground)]">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--muted-foreground)]">{formatDate(job.applied_at)}</td>
                      <td className="py-3 px-4 text-[var(--muted-foreground)]">{formatTimeAgo(job.last_contact_at)}</td>
                      <td className="py-3 px-4 text-[var(--muted-foreground)] max-w-xs truncate">
                        {job.recruiter_name ? `${job.recruiter_name} · ` : ''}{job.latest_message_snippet || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {job.needs_follow_up ? (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Follow-up due</span>
                        ) : (
                          <span className="text-[10px] text-[var(--muted-foreground)]">Up to date</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mode 3: Activity Stream */}
          {viewMode === 'timeline' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Chronological Activity Stream
              </h3>
              <div className="relative pl-6 space-y-4 border-l border-[var(--border)]">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] bg-black dark:bg-white" />
                    <div className="text-xs font-semibold text-[var(--card-foreground)]">
                      {job.role_title} at {job.company_name}
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {job.latest_message_snippet || `Submitted application for ${job.role_title}`}
                    </p>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {formatDate(job.applied_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 4: Recruiter Replies & Follow-Ups */}
          {viewMode === 'responses' && (
            <div className="space-y-4">
              {filteredJobs
                .filter((j) => j.latest_message_snippet)
                .map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">
                        {job.recruiter_name || 'Recruiter'} · {job.company_name}
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {formatTimeAgo(job.last_contact_at)}
                      </span>
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs font-mono">
                      &ldquo;{job.latest_message_snippet}&rdquo;
                    </div>
                    {job.recruiter_email && (
                      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-1">
                        <span>Email: {job.recruiter_email}</span>
                        <a
                          href={`mailto:${job.recruiter_email}`}
                          className="font-medium text-black dark:text-white hover:underline flex items-center space-x-1"
                        >
                          <span>Open in Mail</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Mode 5: Trends & Velocity */}
          {viewMode === 'trends' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Total Applications</span>
                <span className="block mt-2 text-2xl font-bold">{jobs.length}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+2 this week</span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Response Rate</span>
                <span className="block mt-2 text-2xl font-bold">75%</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">3 of 4 active responses</span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Shortlist Velocity</span>
                <span className="block mt-2 text-2xl font-bold">50%</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">2 in shortlist/interview</span>
              </div>
            </div>
          )}

        </main>
      </div>

      <GeminiAdvisorPanel
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        approvalActions={approvals}
        onApproveAction={handleApproveAction}
        onRejectAction={handleRejectAction}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={loadData}
      />
    </div>
  );
}
