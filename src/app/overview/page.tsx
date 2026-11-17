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
  TrendingUp,
  AlertCircle,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { LifeDomain } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils';

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                My Life at a Glance
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                CEO executive dashboard across all 7 essential life areas.
              </p>
            </div>
          </div>

          {/* 7 Domains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((d) => {
              const Icon = domainIcons[d.slug] || Activity;
              const isImproving = d.momentum_state === 'IMPROVING';
              const isSlipping = d.momentum_state === 'SLIPPING' || d.momentum_state === 'NEGLECTED';

              return (
                <div
                  key={d.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between hover:border-black dark:hover:border-white transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-[var(--muted)] text-[var(--card-foreground)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-semibold text-[var(--card-foreground)]">
                          {d.name}
                        </h2>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                        isImproving
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isSlipping
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {d.momentum_state}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-2">
                      {d.current_summary || d.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      Activity: {formatTimeAgo(d.last_activity_at)}
                    </span>
                    <Link
                      href={`/${d.slug}`}
                      className="font-medium text-black dark:text-white flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Banner */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
              Cross-Domain Health & Momentum
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">3</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">Domains Improving</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <span className="block text-xl font-bold text-[var(--card-foreground)]">3</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">Domains Stable</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <span className="block text-xl font-bold text-amber-600 dark:text-amber-400">1</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">Domain Slipping</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <span className="block text-xl font-bold text-black dark:text-white">100%</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">Audit Coverage</span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
