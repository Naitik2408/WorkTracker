'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Clock,
  Briefcase
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                Analytics & Patterns
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Meaningful observations and cross-domain correlations—not decorative numbers.
            </p>
          </div>

          {/* 3 Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Attention vs. Neglect Distribution
              </span>
              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Career & Income</span>
                    <span className="font-mono">38%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-1.5 bg-black dark:bg-white rounded-full w-[38%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Business (Klarone)</span>
                    <span className="font-mono">32%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-1.5 bg-black dark:bg-white rounded-full w-[32%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Learning & Skills</span>
                    <span className="font-mono">18%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-1.5 bg-black dark:bg-white rounded-full w-[18%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Personal Operations</span>
                    <span className="font-mono text-rose-500">12% (Neglected)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-1.5 bg-rose-500 rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Job Search Funnel Health
              </span>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-[var(--background)] border border-[var(--border)]">
                  <span>Applications Sent</span>
                  <span className="font-mono font-bold">4</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[var(--background)] border border-[var(--border)]">
                  <span>Recruiter Replies</span>
                  <span className="font-mono font-bold text-emerald-600">3 (75%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[var(--background)] border border-[var(--border)]">
                  <span>Interviews Scheduled</span>
                  <span className="font-mono font-bold text-indigo-600">2 (50%)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Habit Streak & Velocity
              </span>
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-lg font-bold text-emerald-600">6 Days Streak</div>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Consecutive Morning Briefing priority completions</p>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-lg font-bold text-[var(--card-foreground)]">5 Workouts</div>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Consistent physical conditioning weekly</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
