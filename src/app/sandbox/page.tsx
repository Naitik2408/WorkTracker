'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb, ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { IdeaItem } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function SandboxPage() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadIdeas() {
    try {
      setLoading(true);
      const { data } = await supabase.from('idea_sandbox').select('*').order('created_at', { ascending: false });
      if (data) setIdeas(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdeas();
  }, []);

  const promoteIdea = async (idea: IdeaItem) => {
    await supabase.from('idea_sandbox').update({ status: 'PROMOTED' }).eq('id', idea.id);
    await supabase.from('projects').insert({
      name: idea.title,
      purpose_type: idea.proposed_purpose,
      source_idea_id: idea.id,
      lifecycle_stage: 'PLANNING',
      status: 'ACTIVE'
    });
    loadIdeas();
  };

  return (
    <AppShell onRefreshData={loadIdeas}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Idea Evaluation Sandbox
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Protect your active projects from clutter. Evaluate raw ideas before promoting them.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => {
          const isPromoted = idea.status === 'PROMOTED';
          return (
            <Card
              key={idea.id}
              className="p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="font-semibold text-xs sm:text-sm text-[var(--foreground)]">
                    {idea.title}
                  </span>
                  <Badge variant={isPromoted ? 'success' : 'warning'}>
                    {idea.status}
                  </Badge>
                </div>

                <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                  {idea.description || 'No description provided.'}
                </p>

                {idea.feasibility_notes && (
                  <div className="mt-3 rounded-[6px] bg-[var(--background-2)] border border-[var(--border)] p-2.5 text-[11px] text-[var(--muted)]">
                    <strong className="text-[var(--foreground)]">Feasibility:</strong> {idea.feasibility_notes}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[var(--subtle)] font-mono">
                  {idea.proposed_purpose} · {formatDate(idea.created_at)}
                </span>
                {!isPromoted && (
                  <button
                    onClick={() => promoteIdea(idea)}
                    className="min-h-[36px] flex items-center space-x-1 font-medium text-[var(--foreground)] hover:underline"
                  >
                    <span>Promote</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
