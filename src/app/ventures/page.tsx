'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Venture, IdeaItem } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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
    <AppShell onRefreshData={loadVenturesData}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Rocket className="h-4 w-4 text-purple-500" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Business & Ventures
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Entrepreneurial ventures like Klarone cleanly isolated from routine obligations.
          </p>
        </div>

        <Link href="/sandbox">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto">
            <Lightbulb className="h-3.5 w-3.5 mr-1 text-amber-500" />
            <span>Idea Sandbox ({ideas.length})</span>
          </Button>
        </Link>
      </div>

      {/* Active Ventures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {ventures.map((venture) => (
          <Card
            key={venture.id}
            className="p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                  {venture.name}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {venture.purpose}
                </p>
              </div>
              <Badge variant="success">
                {venture.status}
              </Badge>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                <span>Milestone Progress</span>
                <span className="font-mono font-semibold text-[var(--foreground)]">
                  {venture.milestone_progress_pct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--background-2)] overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[var(--foreground)] transition-all duration-300"
                  style={{ width: `${venture.milestone_progress_pct}%` }}
                />
              </div>
            </div>

            {/* Ongoing Activities */}
            {venture.ongoing_activities?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Ongoing Activities
                </span>
                <div className="space-y-1">
                  {venture.ongoing_activities.map((act, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-[var(--foreground)]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Decisions */}
            {venture.pending_decisions?.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--warning)]">
                  Pending Strategic Decisions
                </span>
                <div className="space-y-1">
                  {venture.pending_decisions.map((dec, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-[var(--foreground)]">
                      <HelpCircle className="h-3.5 w-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
