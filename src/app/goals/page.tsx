'use client';

import React, { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Goal } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true);
        const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
        if (data) setGoals(data);
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
  }, []);

  const horizons: Array<Goal['horizon']> = ['LONG_TERM', 'MONTHLY', 'WEEKLY', 'DAILY'];

  return (
    <AppShell onRefreshData={() => {}}>
      <div>
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-[var(--success)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Goals & Milestones Hierarchy
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Multi-horizon goal cascading: daily actions advancing weekly milestones and long-term vision.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {horizons.map((horizon) => {
          const horizonGoals = goals.filter((g) => g.horizon === horizon);
          return (
            <Card key={horizon} className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {horizon.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {horizonGoals.length} Active
                </span>
              </div>

              <div className="space-y-2.5">
                {horizonGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3 sm:p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-[var(--foreground)]">
                        {goal.title}
                      </span>
                      <Badge variant="success">{goal.status}</Badge>
                    </div>

                    {goal.why_it_matters && (
                      <p className="text-[11px] text-[var(--muted)] italic">
                        &ldquo;{goal.why_it_matters}&rdquo;
                      </p>
                    )}

                    <div>
                      <div className="flex justify-between text-[11px] text-[var(--muted)] mb-1">
                        <span>Progress</span>
                        <span className="font-mono">{goal.progress_pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--card)] overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-[var(--foreground)] transition-all duration-300"
                          style={{ width: `${goal.progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
