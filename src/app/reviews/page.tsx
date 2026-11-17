'use client';

import React, { useState } from 'react';
import { 
  CalendarCheck2, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

type ReviewCadence = 'daily' | 'weekly' | 'monthly';

export default function ReviewsPage() {
  const [cadence, setCadence] = useState<ReviewCadence>('daily');
  const [delays, setDelays] = useState('');
  const [continueDoing, setContinueDoing] = useState('');
  const [stopDoing, setStopDoing] = useState('');
  const [changeNext, setChangeNext] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
                <CalendarCheck2 className="h-4 w-4 text-indigo-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Cadence Reviews & Executive Retrospective
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                Close the loop daily, weekly, and monthly to make informed life adjustments.
              </p>
            </div>

            {/* Cadence Tabs */}
            <div className="flex space-x-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 self-start sm:self-auto">
              {(['daily', 'weekly', 'monthly'] as ReviewCadence[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCadence(c)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                    cadence === c
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]'
                  }`}
                >
                  {c} Review
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs max-w-3xl space-y-5">
            <h2 className="text-sm font-semibold tracking-tight pb-3 border-b border-[var(--border)]">
              {cadence.toUpperCase()} Executive Retrospective
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-[var(--card-foreground)] mb-1">
                  What interrupted, delayed, or surprised you?
                </label>
                <textarea
                  rows={3}
                  value={delays}
                  onChange={(e) => setDelays(e.target.value)}
                  placeholder="e.g., Extended debugging on third-party API webhook latency..."
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    What to Continue
                  </label>
                  <textarea
                    rows={2}
                    value={continueDoing}
                    onChange={(e) => setContinueDoing(e.target.value)}
                    placeholder="Morning focus block..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-rose-600 dark:text-rose-400 mb-1">
                    What to Stop
                  </label>
                  <textarea
                    rows={2}
                    value={stopDoing}
                    onChange={(e) => setStopDoing(e.target.value)}
                    placeholder="Checking emails before 10 AM..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    What to Change Next
                  </label>
                  <textarea
                    rows={2}
                    value={changeNext}
                    onChange={(e) => setChangeNext(e.target.value)}
                    placeholder="Block 15m post-lunch for admin..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                {saved ? (
                  <span className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Review recorded successfully!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Takes &lt;2 minutes and recalibrates tomorrow&apos;s priorities.
                  </span>
                )}

                <button
                  type="submit"
                  className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 font-medium shadow-xs hover:opacity-90"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
