'use client';

import React, { useState } from 'react';
import { CalendarCheck2, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarCheck2 className="h-4 w-4 text-indigo-500" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Cadence Reviews
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Daily, weekly, and monthly retrospectives to make informed life adjustments.
          </p>
        </div>

        <div className="flex space-x-1 rounded-[8px] border border-[var(--border)] bg-[var(--background-2)] p-1 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as ReviewCadence[]).map((c) => (
            <button
              key={c}
              onClick={() => setCadence(c)}
              className={`min-h-[36px] px-3 py-1 text-xs font-semibold capitalize rounded-[6px] transition-colors ${
                cadence === c
                  ? 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-4 sm:p-6 max-w-3xl space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border)]">
          {cadence.toUpperCase()} Retrospective
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              What interrupted or delayed you?
            </label>
            <textarea
              rows={3}
              value={delays}
              onChange={(e) => setDelays(e.target.value)}
              placeholder="e.g., Extended debugging on third-party API webhook latency..."
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-3 text-xs focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[var(--success)] uppercase mb-1">
                Continue
              </label>
              <textarea
                rows={2}
                value={continueDoing}
                onChange={(e) => setContinueDoing(e.target.value)}
                placeholder="Morning focus block..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[var(--danger)] uppercase mb-1">
                Stop
              </label>
              <textarea
                rows={2}
                value={stopDoing}
                onChange={(e) => setStopDoing(e.target.value)}
                placeholder="Checking email early..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[var(--accent)] uppercase mb-1">
                Change Next
              </label>
              <textarea
                rows={2}
                value={changeNext}
                onChange={(e) => setChangeNext(e.target.value)}
                placeholder="Block 15m for admin..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] p-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {saved ? (
              <span className="flex items-center space-x-1.5 text-xs text-[var(--success)] font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Review recorded!</span>
              </span>
            ) : (
              <span className="text-[11px] text-[var(--muted)]">
                Takes &lt;2 minutes and recalibrates tomorrow.
              </span>
            )}

            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
              Save Review
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
