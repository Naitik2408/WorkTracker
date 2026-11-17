'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Analytics & Patterns
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Meaningful observations and cross-domain correlations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-5 sm:p-6 space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Attention Distribution
          </span>
          <div className="space-y-2 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Career & Income</span>
                <span className="font-mono">38%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--background-2)] rounded-full overflow-hidden">
                <div className="h-1.5 bg-[var(--foreground)] rounded-full w-[38%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Business (Klarone)</span>
                <span className="font-mono">32%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--background-2)] rounded-full overflow-hidden">
                <div className="h-1.5 bg-[var(--foreground)] rounded-full w-[32%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Learning & Skills</span>
                <span className="font-mono">18%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--background-2)] rounded-full overflow-hidden">
                <div className="h-1.5 bg-[var(--foreground)] rounded-full w-[18%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[var(--danger)]">Personal Operations</span>
                <span className="font-mono text-[var(--danger)]">12%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--background-2)] rounded-full overflow-hidden">
                <div className="h-1.5 bg-[var(--danger)] rounded-full w-[12%]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Job Search Funnel Health
          </span>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
              <span>Applications Sent</span>
              <span className="font-mono font-bold">4</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
              <span>Recruiter Replies</span>
              <span className="font-mono font-bold text-[var(--success)]">3 (75%)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
              <span>Interviews Scheduled</span>
              <span className="font-mono font-bold text-[var(--accent)]">2 (50%)</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Habit Consistency
          </span>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)]">
              <div className="text-lg font-bold font-mono text-[var(--success)]">6 Days Streak</div>
              <p className="text-[10px] text-[var(--muted)]">Morning focus priorities logged</p>
            </div>
            <div className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)]">
              <div className="text-lg font-bold font-mono text-[var(--foreground)]">5 Workouts</div>
              <p className="text-[10px] text-[var(--muted)]">Weekly strength target hit</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
