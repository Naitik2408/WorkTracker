'use client';

import React, { useEffect, useState } from 'react';
import { 
  HeartPulse, 
  Dumbbell, 
  Droplet, 
  Moon, 
  Flame, 
  CheckCircle2, 
  Calendar,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { HealthFitnessLog } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function HealthPage() {
  const [logs, setLogs] = useState<HealthFitnessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealthData() {
      try {
        setLoading(true);
        const { data } = await supabase.from('health_fitness_logs').select('*').order('log_date', { ascending: false });
        if (data) setLogs(data);
      } finally {
        setLoading(false);
      }
    }
    loadHealthData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                Health & Fitness
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Physical energy, workout consistency, hydration, and recovery habits for sustainable performance.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-rose-500 mb-2">
                <Dumbbell className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Strength Workout Target
                </span>
              </div>
              <div className="text-2xl font-bold">5x / week</div>
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">On Track (3 sessions logged this week)</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-blue-500 mb-2">
                <Droplet className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Daily Hydration
                </span>
              </div>
              <div className="text-2xl font-bold">3.0 Liters</div>
              <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">2.2L consumed today</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-500 mb-2">
                <Moon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Average Sleep
                </span>
              </div>
              <div className="text-2xl font-bold">7.4 Hours</div>
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">Consistent circadian rhythm</p>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
            <h2 className="text-sm font-semibold tracking-tight pb-3 mb-4 border-b border-[var(--border)]">
              Recent Fitness Sessions & Movement
            </h2>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-sm text-[var(--card-foreground)] block">
                      {log.workout_type || 'General Movement'}
                    </span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      {log.duration_mins} mins · {log.movement_summary || 'Push / Pull strength training'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {formatDate(log.log_date)}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
                  No fitness entries logged yet.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
