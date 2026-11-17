'use client';

import React, { useEffect, useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FinanceEntry, UpcomingPayment } from '@/types/database';
import { formatDate } from '@/lib/utils';

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                Personal Finance & Cashflow
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Track income, infrastructure expenses, and upcoming commitments with high transparency.
            </p>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Recent Inflows
              </span>
              <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{totalIncome.toLocaleString()}
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Client consulting & development payouts</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Operating Outflows
              </span>
              <div className="mt-1 text-2xl font-bold text-[var(--card-foreground)]">
                ₹{totalExpenses.toLocaleString()}
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">SaaS, cloud databases & infrastructure</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Allocated to Savings
              </span>
              <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ₹{totalSavings.toLocaleString()}
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Venture runway & emergency reserves</p>
            </div>
          </div>

          {/* 2 Column: Upcoming Payments & Entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Upcoming Payments */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <h2 className="text-sm font-semibold tracking-tight pb-3 mb-3 border-b border-[var(--border)] flex items-center justify-between">
                <span>Upcoming Recurring Payments</span>
                <span className="text-[11px] text-[var(--muted-foreground)] font-normal">{payments.length} scheduled</span>
              </h2>
              <div className="space-y-2.5">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[var(--card-foreground)] block">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        Due {formatDate(p.due_date)} {p.is_recurring && '· Monthly Recurring'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[var(--card-foreground)]">
                      ₹{Number(p.amount_inr).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Cashflow Entries */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
              <h2 className="text-sm font-semibold tracking-tight pb-3 mb-3 border-b border-[var(--border)]">
                Recent Cashflow Entries
              </h2>
              <div className="space-y-2.5">
                {entries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[var(--card-foreground)] block">
                        {e.notes || e.category}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {e.category} · {formatDate(e.entry_date)}
                      </span>
                    </div>
                    <span className={`font-mono font-bold ${
                      e.entry_type === 'INCOME'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : e.entry_type === 'SAVINGS'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-[var(--card-foreground)]'
                    }`}>
                      {e.entry_type === 'INCOME' ? '+' : '-'}₹{Number(e.amount_inr).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
