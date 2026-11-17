'use client';

import React, { useEffect, useState } from 'react';
import { CheckSquare, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { PersonalOpsItem } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function OperationsPage() {
  const [items, setItems] = useState<PersonalOpsItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOpsData() {
    try {
      setLoading(true);
      const { data } = await supabase.from('personal_ops_items').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpsData();
  }, []);

  const toggleItem = async (item: PersonalOpsItem) => {
    const nextStatus = item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await supabase.from('personal_ops_items').update({ status: nextStatus }).eq('id', item.id);
    loadOpsData();
  };

  return (
    <AppShell onRefreshData={loadOpsData}>
      <div>
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-4 w-4 text-[var(--warning)]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Personal Operations
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
          Appointments, commitments, and administrative responsibilities.
        </p>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border)]">
          Active Responsibilities
        </h2>

        <div className="space-y-2">
          {items.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item)}
                className={`min-h-[44px] flex items-center justify-between p-3 sm:p-3.5 rounded-[6px] border transition-all cursor-pointer select-none ${
                  isCompleted
                    ? 'border-[var(--success)]/30 bg-[var(--success)]/5 line-through text-[var(--muted)]'
                    : 'border-[var(--border)] bg-[var(--background-2)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                    ) : (
                      <Circle className="h-4 w-4 text-[var(--muted)]" />
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] mr-2">
                      {item.item_type}
                    </span>
                    <span className="font-medium text-xs sm:text-sm text-[var(--foreground)]">
                      {item.title}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[var(--subtle)] hidden sm:inline">
                  {item.due_at ? `Due ${formatDate(item.due_at)}` : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}
