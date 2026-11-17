'use client';

import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { FinanceEntry, UpcomingPayment } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export default function FinancePage() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [payments, setPayments] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinanceData() {
      try {
        setLoading(true);
        const [{ data: eData }, { data: pData }] = await Promise.all([
          supabase.from('finance_entries').select('*').order('entry_date', { ascending: false }),
          supabase.from('upcoming_payments').select('*').order('due_date', { ascending: true })
        ]);
        if (eData) setEntries(eData);
        if (pData) setPayments(pData);
      } finally {
        setLoading(false);
      }
    }
    loadFinanceData();
  }, []);

  const totalIncome = entries
    .filter((e) => e.entry_type === 'INCOME')
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  const totalExpenses = entries
    .filter((e) => e.entry_type === 'EXPENSE')
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  const totalSavings = entries
    .filter((e) => e.entry_type === 'SAVINGS')
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  return (
    <AppShell>
      <div>
        <div className="flex items-center space-x-2">
          <Wallet className="h-4 w-4 text-[var(--success)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Personal Finance & Cashflow
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Inflows, operating expenses, and recurring server/API commitments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Recent Inflows
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-[var(--success)]">
            ₹{totalIncome.toLocaleString()}
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-1">Client consulting & payouts</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Operating Outflows
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-[var(--foreground)]">
            ₹{totalExpenses.toLocaleString()}
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-1">SaaS & cloud hosting</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Venture Reserve
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-[var(--accent)]">
            ₹{totalSavings.toLocaleString()}
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-1">Capital reserve</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border)]">
            Upcoming Recurring Payments
          </h2>
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] text-xs"
              >
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">
                    {p.title}
                  </span>
                  <span className="text-[10px] text-[var(--muted)]">
                    Due {formatDate(p.due_date)} {p.is_recurring && '· Recurring'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[var(--foreground)]">
                  ₹{Number(p.amount_inr).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border)]">
            Recent Cashflow Entries
          </h2>
          <div className="space-y-2">
            {entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-[6px] border border-[var(--border)] bg-[var(--background-2)] text-xs"
              >
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">
                    {e.notes || e.category}
                  </span>
                  <span className="text-[10px] text-[var(--muted)]">
                    {e.category} · {formatDate(e.entry_date)}
                  </span>
                </div>
                <span className={`font-mono font-bold ${
                  e.entry_type === 'INCOME' ? 'text-[var(--success)]' : 'text-[var(--foreground)]'
                }`}>
                  {e.entry_type === 'INCOME' ? '+' : '-'}₹{Number(e.amount_inr).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
