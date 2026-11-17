'use client';

import React from 'react';
import { Compass, Target, Award } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';

export default function GrowthPage() {
  return (
    <AppShell>
      <div>
        <div className="flex items-center space-x-2">
          <Compass className="h-4 w-4 text-indigo-500" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Personal Growth & Reflection
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Objective self-observation and long-term trajectory alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight pb-3 border-b border-[var(--border)] flex items-center space-x-2">
            <Target className="h-4 w-4 text-[var(--success)]" />
            <span>Executive Trajectory Alignment</span>
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-[var(--muted)]">
            <p>
              <strong className="text-[var(--foreground)]">Daily vs Long-Term:</strong> Your daily priorities directly feed Klarone Architecture and your Senior Full-Stack role milestones.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Attention Note:</strong> Personal Operations tasks should have an allocated 15-minute daily administration block.
            </p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight pb-3 border-b border-[var(--border)] flex items-center space-x-2">
            <Award className="h-4 w-4 text-[var(--warning)]" />
            <span>Recent Milestone Wins</span>
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3">
              <span className="font-semibold text-[var(--foreground)] block">Next.js 15 & Vercel Design System</span>
              <span className="text-[10px] text-[var(--muted)]">Shipped with 0 layout shift</span>
            </div>
            <div className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3">
              <span className="font-semibold text-[var(--foreground)] block">Shortlisted at Vercel Ecosystem Labs</span>
              <span className="text-[10px] text-[var(--muted)]">Interview scheduled</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
