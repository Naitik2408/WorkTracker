'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Lightbulb, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Venture, IdeaItem } from '@/types/database';

export default function VenturesPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadVenturesData() {
    try {
      setLoading(true);
      const [{ data: vData }, { data: iData }] = await Promise.all([
        supabase.from('ventures').select('*').order('name'),
        supabase.from('idea_sandbox').select('*').order('created_at', { ascending: false })
      ]);
      if (vData) setVentures(vData);
      if (iData) setIdeas(iData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenturesData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Rocket className="h-4 w-4 text-purple-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Business & Ventures
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                Track active entrepreneurial ventures like Klarone cleanly isolated from career and routine responsibilities.
              </p>
            </div>

            <Link
              href="/sandbox"
              className="flex items-center space-x-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--accent)] transition-colors self-start sm:self-auto"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Idea Sandbox ({ideas.length})</span>
            </Link>
          </div>

          {/* Active Ventures Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ventures.map((venture) => (
              <div
                key={venture.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div>
                    <h2 className="text-base font-bold text-[var(--card-foreground)]">
                      {venture.name}
                    </h2>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {venture.purpose}
                    </p>
                  </div>
                  <span className="rounded px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {venture.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                    <span>Milestone Progress</span>
                    <span className="font-mono font-semibold text-[var(--card-foreground)]">
                      {venture.milestone_progress_pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-black dark:bg-white transition-all duration-300"
                      style={{ width: `${venture.milestone_progress_pct}%` }}
                    />
                  </div>
                </div>

                {/* Ongoing Activities */}
                {venture.ongoing_activities?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Ongoing Activities
                    </span>
                    <div className="space-y-1">
                      {venture.ongoing_activities.map((act, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-[var(--card-foreground)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Decisions */}
                {venture.pending_decisions?.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Pending Strategic Decisions
                    </span>
                    <div className="space-y-1">
                      {venture.pending_decisions.map((dec, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-[var(--card-foreground)]">
                          <HelpCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{dec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
