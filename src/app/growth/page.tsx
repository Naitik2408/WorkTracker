'use client';

import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award,
  ArrowRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function GrowthPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="h-4 w-4 text-indigo-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                Personal Growth & Reflection
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Objective self-observation and long-term trajectory alignment without punitive scoring.
            </p>
          </div>

          {/* Core Reflections Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold tracking-tight pb-3 border-b border-[var(--border)] flex items-center space-x-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span>Executive Trajectory Alignment</span>
              </h2>
              <div className="space-y-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
                <p>
                  <strong className="text-[var(--card-foreground)]">Daily Action vs. Long-Term Goal:</strong> Your daily priorities directly feed your Monthly Goal (Klarone Architecture) and Long-Term Goal (Senior Full-Stack Role).
                </p>
                <p>
                  <strong className="text-[var(--card-foreground)]">Observed Weak Spot:</strong> Personal Operations tasks are routinely carried forward. Suggestion: Allocate a 15-minute daily administration block right after lunch.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold tracking-tight pb-3 border-b border-[var(--border)] flex items-center space-x-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Recent Milestone Wins</span>
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="font-semibold text-[var(--card-foreground)] block">Next.js 15 & Modular Monolith Setup</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Shipped with zero bundle regression</span>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="font-semibold text-[var(--card-foreground)] block">Shortlisted at Vercel Ecosystem Labs</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Recruiter interview scheduled this week</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
