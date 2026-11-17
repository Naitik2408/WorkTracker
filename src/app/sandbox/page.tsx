'use client';

import React, { useEffect, useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Rocket
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { IdeaItem } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { QuickAddModal } from '@/components/QuickAddModal';

export default function SandboxPage() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

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
    // 1. Mark idea as PROMOTED
    await supabase.from('idea_sandbox').update({ status: 'PROMOTED' }).eq('id', idea.id);

    // 2. Insert into projects
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
    <div className="min-h-screen bg-[var(--background)]">
      <Header onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Idea Evaluation Sandbox
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                Protect your active projects from clutter. Evaluate and validate raw ideas with Gemini before promoting them to active work.
              </p>
            </div>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center space-x-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-medium self-start sm:self-auto hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Capture Raw Idea</span>
            </button>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => {
              const isPromoted = idea.status === 'PROMOTED';
              return (
                <div
                  key={idea.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="font-semibold text-sm text-[var(--card-foreground)]">
                        {idea.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isPromoted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {idea.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                      {idea.description || 'No description provided.'}
                    </p>

                    {idea.feasibility_notes && (
                      <div className="mt-3 rounded bg-[var(--background)] border border-[var(--border)] p-2.5 text-[11px] text-[var(--muted-foreground)]">
                        <strong className="text-[var(--card-foreground)]">Feasibility Analysis:</strong> {idea.feasibility_notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                      {idea.proposed_purpose} · {formatDate(idea.created_at)}
                    </span>
                    {!isPromoted && (
                      <button
                        onClick={() => promoteIdea(idea)}
                        className="flex items-center space-x-1 font-medium text-black dark:text-white hover:underline"
                      >
                        <span>Promote to Project</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={loadIdeas}
      />
    </div>
  );
}
