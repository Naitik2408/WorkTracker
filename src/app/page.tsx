'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Globe, 
  Layers, 
  Plus, 
  AlertTriangle,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { TopNav } from '@/components/TopNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { getStoredProjects } from '@/lib/projectStore';
import { getStoredJobs } from '@/lib/jobStore';
import { getStoredLifeData } from '@/lib/lifeStore';
import { Project } from '@/types/project';
import { Application } from '@/types/job';
import { LifeAnalyticsData } from '@/types/life';
import { formatTimeAgo } from '@/lib/utils';
import { usePrivacy } from '@/components/PrivacyProvider';

export default function HomePage() {
  const router = useRouter();
  const { hideNumbers } = usePrivacy();

  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<Application[]>([]);
  const [life, setLife] = useState<LifeAnalyticsData | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    setProjects(getStoredProjects());
    setJobs(getStoredJobs().applications);
    setLife(getStoredLifeData());
  }, []);

  // Global Keybindings: G H, G P, G J, G L, and /
  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const now = Date.now();
      const key = e.key.toLowerCase();

      if (key === 'g') {
        lastKey = 'g';
        lastKeyTime = now;
        return;
      }

      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        if (key === 'h') {
          e.preventDefault();
          router.push('/');
        } else if (key === 'p') {
          e.preventDefault();
          router.push('/projects');
        } else if (key === 'j') {
          e.preventDefault();
          router.push('/jobs');
        } else if (key === 'l') {
          e.preventDefault();
          router.push('/life');
        }
        lastKey = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const [todayIso, setTodayIso] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  useEffect(() => {
    const d = new Date();
    setTodayIso(d.toISOString().split('T')[0]);
    setCurrentDateFormatted(d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));
  }, []);

  // Urgent Job Actions (Overdue or Due Today)
  const urgentJobActions = useMemo(() => {
    if (!todayIso) return [];
    return jobs.filter((j) => {
      if (j.stage === 'Closed') return false;
      const dueDate = j.nextActionDue.split('T')[0];
      return dueDate <= todayIso;
    });
  }, [jobs, todayIso]);

  // Upcoming Interviews in next 7 days
  const upcomingInterviews = useMemo(() => {
    if (!todayIso) return [];
    const now = new Date(todayIso).getTime();
    const next7Days = now + 7 * 24 * 60 * 60 * 1000;
    return jobs.filter((j) => {
      if (j.stage === 'Closed') return false;
      return j.interviewRounds.some((r) => {
        const time = new Date(r.date).getTime();
        return time >= now && time <= next7Days;
      });
    });
  }, [jobs, todayIso]);

  // 3 most recent active projects
  const recentProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === 'Active')
      .slice(0, 3);
  }, [projects]);

  // Life Snapshot: today's completed habits count
  const todayHabitCompletion = useMemo(() => {
    if (!life || !todayIso) return { completed: 0, total: 0 };
    const activeHabits = life.habits.filter((h) => h.isActive);
    const completed = activeHabits.filter((h) => h.recentCompletions[todayIso]).length;
    return { completed, total: activeHabits.length };
  }, [life, todayIso]);

  const totalFocusMinutesThisWeek = useMemo(() => {
    if (!life) return 0;
    return life.focusSessions
      .filter((s) => s.status === 'COMPLETED')
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [life]);

  const formatCurrency = (minor: number) => {
    if (hideNumbers) return '••••••';
    const num = (minor / 100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return num;
  };


  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <TopNav onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-7">
        
        {/* Header: Title + Date */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-[var(--border)]">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              Today
            </h1>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              High-clarity daily command center for opportunities, software projects, and personal health.
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--muted)]">
            {currentDateFormatted}
          </span>
        </div>

        {/* 1. Job Hunting Block (Only appears if follow-ups or interviews exist) */}
        {(urgentJobActions.length > 0 || upcomingInterviews.length > 0) && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] font-mono">
                  Opportunities Requiring Action ({urgentJobActions.length})
                </h2>
              </div>
              <Link
                href="/jobs"
                className="text-[11px] font-medium text-[var(--accent)] hover:underline flex items-center space-x-1"
              >
                <span>Open Pipeline</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentJobActions.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs?open=${j.id}`}
                  className="group flex flex-col justify-between rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--border-hover)] hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                          {j.company}
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">· {j.role}</span>
                      </div>
                      <Badge variant="warning" dot>
                        {j.stage}
                      </Badge>
                    </div>

                    <div className="text-xs text-[var(--foreground)] flex items-start space-x-2 bg-[var(--surface-subtle)] p-2.5 rounded-[6px] border border-[var(--border)] mb-2">
                      <span className="text-[var(--accent)] shrink-0 font-mono">↳</span>
                      <span className="font-medium">{j.nextAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-[var(--subtle)] font-mono">
                    <span>Source: {j.source}</span>
                    <span className="text-[var(--warning)] font-semibold">
                      Due: {j.nextActionDue.split('T')[0]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Projects Block: Next steps from 3 most recently touched projects */}
        {recentProjects.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-[var(--foreground)]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] font-mono">
                  Active Projects (Pick up where you left off)
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-[11px] font-medium text-[var(--accent)] hover:underline flex items-center space-x-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentProjects.map((p) => {
                const nextStep = p.resume.nextSteps.find((s) => !s.completed);
                return (
                  <Link
                    key={p.id}
                    href={`/project/${p.slug}`}
                    className="group flex flex-col justify-between rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--border-hover)] hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                          {p.name}
                        </span>
                        <Badge variant="success" dot pulse>
                          {p.status}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono block mb-1">
                          Next step:
                        </span>
                        <p className="text-xs text-[var(--foreground)] line-clamp-2">
                          {nextStep ? nextStep.text : 'All current steps completed. Review project brief.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-[var(--subtle)] font-mono">
                      <span>{formatTimeAgo(p.lastWorkedAt)}</span>
                      <span className="text-[var(--accent)] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        Continue <ArrowRight className="h-2.5 w-2.5 ml-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Life Analytics Block: View-Only snapshot */}
        {life && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-[var(--success)]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] font-mono">
                  Life Pulse (Read-Only Phone Sync)
                </h2>
                <Badge variant="default">View only</Badge>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-[var(--subtle)] font-mono">
                  Last synced: {formatTimeAgo(life.lastSyncedAt)}
                </span>
                <Link
                  href="/life"
                  className="font-medium text-[var(--accent)] hover:underline flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Habit Completion */}
              <Card className="p-3.5 space-y-1 border-[var(--border)]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
                  Habits Today
                </span>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {todayHabitCompletion.completed} of {todayHabitCompletion.total} done
                </div>
                <p className="text-[11px] text-[var(--success)] font-medium">
                  {Math.round((todayHabitCompletion.completed / Math.max(todayHabitCompletion.total, 1)) * 100)}% daily completion
                </p>
              </Card>

              {/* Deep Focus */}
              <Card className="p-3.5 space-y-1 border-[var(--border)]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
                  Deep Focus (Week)
                </span>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {Math.floor(totalFocusMinutesThisWeek / 60)}h {totalFocusMinutesThisWeek % 60}m
                </div>
                <p className="text-[11px] text-[var(--muted)]">
                  {life.focusSessions.length} recorded focus sessions
                </p>
              </Card>

              {/* Finance Snapshot */}
              <Card className="p-3.5 space-y-1 border-[var(--border)]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
                  Monthly Outflow
                </span>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {formatCurrency(life.finance.totalExpenseThisMonthMinor)}
                </div>
                <p className="text-[11px] text-[var(--muted)]">
                  Under monthly budget target
                </p>
              </Card>
            </div>
          </section>
        )}

      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
