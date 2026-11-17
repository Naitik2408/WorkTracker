'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink,
  Plus,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { LearningSkill } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils';

export default function LearningPage() {
  const [skills, setSkills] = useState<LearningSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        const { data } = await supabase.from('learning_skills').select('*').order('skill_name');
        if (data) setSkills(data);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
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
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Learning & Capability Growth
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                Measured by capability expansion and real projects shipped—not merely hours logged.
              </p>
            </div>
          </div>

          {/* Capability Matrix Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div>
                    <h2 className="text-base font-bold text-[var(--card-foreground)]">
                      {skill.skill_name}
                    </h2>
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)]">
                    Practiced {formatTimeAgo(skill.last_practiced_at)}
                  </span>
                </div>

                {/* Capability Now */}
                {skill.capability_now && (
                  <div className="rounded-lg bg-[var(--background)] border border-[var(--border)] p-3 text-xs">
                    <span className="font-semibold text-[var(--card-foreground)] block mb-1">
                      Current Verified Capability:
                    </span>
                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                      {skill.capability_now}
                    </p>
                  </div>
                )}

                {/* Completed Topics */}
                {skill.topics_completed?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-2">
                      Mastered Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.topics_completed.map((t, idx) => (
                        <span
                          key={idx}
                          className="flex items-center space-x-1 rounded px-2 py-0.5 text-[11px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics in Progress */}
                {skill.topics_in_progress?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
                      Active In-Progress
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.topics_in_progress.map((t, idx) => (
                        <span
                          key={idx}
                          className="flex items-center space-x-1 rounded px-2 py-0.5 text-[11px] bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50"
                        >
                          <Clock className="h-3 w-3 text-indigo-600" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Link */}
                {skill.evidence_project_url && (
                  <div className="pt-2 border-t border-[var(--border)] flex justify-end">
                    <a
                      href={skill.evidence_project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-black dark:text-white hover:underline flex items-center space-x-1"
                    >
                      <span>View GitHub Evidence</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
