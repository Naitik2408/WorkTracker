'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { GeminiAdvisorPanel } from '@/components/GeminiAdvisorPanel';
import { QuickAddModal } from '@/components/QuickAddModal';
import { 
  LifeDomain, 
  DailyPriority, 
  JobApplication, 
  Venture, 
  PersonalOpsItem, 
  ApprovalAction 
} from '@/types/database';
import { formatDate, formatTimeAgo } from '@/lib/utils';

export default function MorningBriefingPage() {
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<LifeDomain[]>([]);
  const [priorities, setPriorities] = useState<DailyPriority[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [opsItems, setOpsItems] = useState<PersonalOpsItem[]>([]);
  const [approvals, setApprovals] = useState<ApprovalAction[]>([]);

  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        { data: dData },
        { data: pData },
        { data: jData },
        { data: vData },
        { data: oData },
        { data: aData }
      ] = await Promise.all([
        supabase.from('life_domains').select('*').order('name'),
        supabase.from('daily_priorities').select('*').order('rank'),
        supabase.from('job_applications').select('*').order('applied_at', { ascending: false }),
        supabase.from('ventures').select('*').order('name'),
        supabase.from('personal_ops_items').select('*').order('created_at', { ascending: false }),
        supabase.from('approval_queue_actions').select('*').eq('status', 'PENDING_APPROVAL')
      ]);

      if (dData) setDomains(dData);
      if (pData) setPriorities(pData);
      if (jData) setJobs(jData);
      if (vData) setVentures(vData);
      if (oData) setOpsItems(oData);
      if (aData) setApprovals(aData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const togglePriorityStatus = async (priority: DailyPriority) => {
    const nextStatus = priority.status === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    await supabase.from('daily_priorities').update({ status: nextStatus }).eq('id', priority.id);
    fetchDashboardData();
  };

  const handleApproveAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({
      status: 'APPROVED',
      approved_by_user_at: new Date().toISOString(),
      executed_at: new Date().toISOString()
    }).eq('id', id);
    fetchDashboardData();
  };

  const handleRejectAction = async (id: string) => {
    await supabase.from('approval_queue_actions').update({
      status: 'REJECTED'
    }).eq('id', id);
    fetchDashboardData();
  };

  // Identify slipping or neglected domains
  const slippingDomains = domains.filter((d) => d.momentum_state === 'SLIPPING' || d.momentum_state === 'NEGLECTED');

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

        {/* Main Morning Executive View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Top CEO Morning Briefing Banner */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Morning Executive Status
                  </span>
                </div>
                <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Welcome to your Morning Control Center
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
                  You have <span className="font-semibold text-[var(--card-foreground)]">{priorities.filter(p => p.status !== 'COMPLETED').length} active priorities</span> today. 
                  Career momentum is <span className="font-semibold text-emerald-600 dark:text-emerald-400">Improving</span> with 3 active job pipelines.
                </p>
              </div>

              {/* Slipping alert banner if any */}
              {slippingDomains.length > 0 && (
                <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs max-w-xs">
                  <div className="flex items-center space-x-1.5 font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Attention Needed</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    {slippingDomains.map(d => d.name).join(', ')} has not been reviewed recently.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 1: Top 3 Priorities for Today (CEO Focus) */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-[var(--card-foreground)]">
                  Today&apos;s Top 3 Priorities
                </h2>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  The three critical needles to move before anything else.
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]"
              >
                + Add / Swap
              </button>
            </div>

            <div className="space-y-2.5">
              {priorities.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePriorityStatus(item)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isCompleted
                        ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-[var(--muted-foreground)] line-through'
                        : 'border-[var(--border)] bg-[var(--background)] hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white dark:bg-white dark:text-black'
                      }`}>
                        #{item.rank}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium">
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--muted-foreground)]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 2-Column Executive Scan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: 95/5 Career & Job Search Monitor */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-indigo-500" />
                    <h2 className="text-sm font-semibold tracking-tight">
                      Career & Job-Hunt (95% Monitor)
                    </h2>
                  </div>
                  <Link
                    href="/career"
                    className="flex items-center space-x-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]"
                  >
                    <span>View all 5 modes</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[var(--card-foreground)]">
                            {job.role_title}
                          </span>
                          <span className="text-[var(--muted-foreground)]"> · {job.company_name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          job.status === 'SHORTLISTED' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : job.status === 'INTERVIEWING'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {job.status}
                        </span>
                      </div>

                      {job.latest_message_snippet && (
                        <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 bg-[var(--card)] p-2 rounded border border-[var(--border)]">
                          &ldquo;{job.latest_message_snippet}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--muted-foreground)]">
                        <span>Contact: {formatTimeAgo(job.last_contact_at)}</span>
                        {job.needs_follow_up && (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">Follow-up due</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center text-xs">
                <span className="text-[var(--muted-foreground)] text-[11px]">
                  95% automated observation · 5% human approval
                </span>
                <Link
                  href="/career"
                  className="font-medium text-black dark:text-white hover:underline flex items-center space-x-1"
                >
                  <span>Open Pipeline</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right Column: Business & Ventures (Klarone, etc.) */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
                  <div className="flex items-center space-x-2">
                    <Rocket className="h-4 w-4 text-purple-500" />
                    <h2 className="text-sm font-semibold tracking-tight">
                      Business Ventures & Entrepreneurship
                    </h2>
                  </div>
                  <Link
                    href="/ventures"
                    className="flex items-center space-x-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]"
                  >
                    <span>Manage</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {ventures.map((venture) => (
                    <div
                      key={venture.id}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[var(--card-foreground)]">
                          {venture.name}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                          {venture.milestone_progress_pct}% complete
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[var(--muted)] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${venture.milestone_progress_pct}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-1">
                        {venture.purpose}
                      </p>

                      {venture.ongoing_activities?.length > 0 && (
                        <div className="text-[10px] text-[var(--muted-foreground)] space-y-0.5">
                          <span className="font-semibold text-[var(--card-foreground)]">Active Focus:</span>
                          <p className="truncate">· {venture.ongoing_activities[0]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center text-xs">
                <span className="text-[var(--muted-foreground)] text-[11px]">
                  Ventures isolated from personal routines
                </span>
                <Link
                  href="/sandbox"
                  className="font-medium text-black dark:text-white hover:underline flex items-center space-x-1"
                >
                  <span>Idea Sandbox</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Section 3: Operations & Daily Commitments */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-[var(--card-foreground)]">
                  Personal Operations & Commitments
                </h2>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Schedule items, appointments, and pending tasks so nothing falls through the cracks.
                </p>
              </div>
              <Link
                href="/operations"
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {opsItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-1"
                >
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {item.item_type}
                  </span>
                  <p className="font-medium text-[var(--card-foreground)] line-clamp-2">
                    {item.title}
                  </p>
                  <div className="pt-1 text-[10px] text-[var(--muted-foreground)] flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.status === 'PENDING' ? 'Pending Action' : 'Completed'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Gemini Advisor Side Panel */}
      <GeminiAdvisorPanel
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        approvalActions={approvals}
        onApproveAction={handleApproveAction}
        onRejectAction={handleRejectAction}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
}
