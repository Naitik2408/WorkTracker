'use client';

import React, { useEffect, useState } from 'react';
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Goal } from '@/types/database';
import { formatDate } from '@/lib/utils';

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                Goals & Milestones Hierarchy
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Multi-horizon goal cascading: see how daily actions directly advance weekly milestones and long-term vision.
            </p>
          </div>

          {/* Cascading Horizons */}
          <div className="space-y-6">
            {horizons.map((horizon) => {
              const horizonGoals = goals.filter((g) => g.horizon === horizon);
              return (
                <div key={horizon} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {horizon.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">
                      {horizonGoals.length} Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {horizonGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[var(--card-foreground)]">
                            {goal.title}
                          </span>
                          <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {goal.status}
                          </span>
                        </div>

                        {goal.why_it_matters && (
                          <p className="text-[11px] text-[var(--muted-foreground)] italic">
                            &ldquo;{goal.why_it_matters}&rdquo;
                          </p>
                        )}

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] mb-1">
                            <span>Progress</span>
                            <span className="font-mono">{goal.progress_pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                            <div
                              className="h-1.5 rounded-full bg-black dark:bg-white transition-all duration-300"
                              style={{ width: `${goal.progress_pct}%` }}
                            />
                          </div>
                        </div>

                        {goal.next_action && (
                          <div className="text-[11px] text-[var(--card-foreground)] flex items-center space-x-1.5 pt-1">
                            <span className="font-semibold">Next Action:</span>
                            <span>{goal.next_action}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {horizonGoals.length === 0 && (
                      <div className="py-4 text-center text-xs text-[var(--muted-foreground)]">
                        No goals set for this horizon.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
