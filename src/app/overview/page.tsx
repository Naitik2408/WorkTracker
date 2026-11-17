'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  HeartPulse, 
  Wallet, 
  CheckSquare, 
  Compass, 
  ArrowUpRight, 
  Activity,
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LifeDomain } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

const domainIcons: Record<string, React.ElementType> = {
  career: Briefcase,
  ventures: Rocket,
  learning: GraduationCap,
  health: HeartPulse,
  finance: Wallet,
  operations: CheckSquare,
  growth: Compass
};

export default function OverviewPage() {
  const [domains, setDomains] = useState<LifeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDomains() {
      try {
        const { data } = await supabase.from('life_domains').select('*').order('name');
        if (data) setDomains(data);
      } finally {
        setLoading(false);
      }
    }
    loadDomains();
  }, []);

  return (
    <AppShell>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            My Life at a Glance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Executive observation across all 7 essential life areas.
          </p>
        </div>
      </div>

      {/* 7 Domains Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          : domains.map((d) => {
              const Icon = domainIcons[d.slug] || Activity;
              const isImproving = d.momentum_state === 'IMPROVING';
              const isSlipping = d.momentum_state === 'SLIPPING' || d.momentum_state === 'NEGLECTED';

              return (
                <Card
                  key={d.id}
                  className="p-5 flex flex-col justify-between group hover:border-[var(--border-hover)]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-[6px] bg-[var(--background-2)] text-[var(--foreground)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h2 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                          {d.name}
                        </h2>
                      </div>
                      <Badge
                        variant={isImproving ? 'success' : isSlipping ? 'danger' : 'default'}
                        pulse={isImproving}
                      >
                        {d.momentum_state}
                      </Badge>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed mt-2 line-clamp-3">
                      {d.current_summary || d.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[var(--subtle)]">
                      {formatTimeAgo(d.last_activity_at)}
                    </span>
                    <Link
                      href={`/${d.slug}`}
                      className="min-h-[36px] px-2 flex items-center space-x-1 font-medium text-[var(--foreground)] hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
      </div>

      {/* Quick Stats Summary Banner */}
      <Card className="p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Cross-Domain Momentum
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
            <span className="block text-xl font-bold font-mono text-[var(--success)]">3</span>
            <span className="text-[10px] text-[var(--muted)]">Improving</span>
          </div>
          <div className="p-3 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
            <span className="block text-xl font-bold font-mono text-[var(--foreground)]">3</span>
            <span className="text-[10px] text-[var(--muted)]">Stable</span>
          </div>
          <div className="p-3 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
            <span className="block text-xl font-bold font-mono text-[var(--warning)]">1</span>
            <span className="text-[10px] text-[var(--muted)]">Attention Needed</span>
          </div>
          <div className="p-3 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)]">
            <span className="block text-xl font-bold font-mono text-[var(--foreground)]">100%</span>
            <span className="text-[10px] text-[var(--muted)]">Coverage</span>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
