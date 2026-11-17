'use client';

import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { LearningSkill } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
    <AppShell>
      <div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-4 w-4 text-[var(--success)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Learning & Capability Growth
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Measured by capability expansion and shipped projects—not merely hours logged.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {skills.map((skill) => (
          <Card key={skill.id} className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                  {skill.skill_name}
                </h2>
                <span className="text-[11px] text-[var(--muted)]">
                  {skill.category}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--subtle)]">
                {formatTimeAgo(skill.last_practiced_at)}
              </span>
            </div>

            {skill.capability_now && (
              <div className="rounded-[6px] bg-[var(--background-2)] border border-[var(--border)] p-3 text-xs">
                <span className="font-semibold text-[var(--foreground)] block mb-1">
                  Current Verified Capability:
                </span>
                <p className="text-[var(--muted)] leading-relaxed">
                  {skill.capability_now}
                </p>
              </div>
            )}

            {skill.topics_completed?.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] block mb-2">
                  Mastered Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skill.topics_completed.map((t, idx) => (
                    <Badge key={idx} variant="success">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {skill.topics_in_progress?.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] block mb-2">
                  In-Progress
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skill.topics_in_progress.map((t, idx) => (
                    <Badge key={idx} variant="accent">
                      {t}
                    </Badge>
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
