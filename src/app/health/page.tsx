'use client';

import React, { useEffect, useState } from 'react';
import { 
  HeartPulse, 
  Dumbbell, 
  Droplet, 
  Moon 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { HealthFitnessLog } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

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
    <AppShell>
      <div>
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-4 w-4 text-[var(--danger)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Health & Fitness
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Physical conditioning, workouts, hydration, and circadian recovery routines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[var(--danger)]">
            <Dumbbell className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Workout Target
            </span>
          </div>
          <div className="text-2xl font-bold font-mono">5x / week</div>
          <p className="text-[11px] text-[var(--success)]">3 sessions logged this week</p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[var(--accent)]">
            <Droplet className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Hydration
            </span>
          </div>
          <div className="text-2xl font-bold font-mono">3.0 Liters</div>
          <p className="text-[11px] text-[var(--muted)]">2.2L consumed today</p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-500">
            <Moon className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Sleep Average
            </span>
          </div>
          <div className="text-2xl font-bold font-mono">7.4 Hours</div>
          <p className="text-[11px] text-[var(--success)]">Restorative recovery</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border)]">
          Recent Fitness Logs
        </h2>
        <div className="space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-semibold text-xs sm:text-sm text-[var(--foreground)] block">
                  {log.workout_type || 'General Movement'}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {log.duration_mins} mins · {log.movement_summary || 'Push / Pull session'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--subtle)]">
                {formatDate(log.log_date)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
