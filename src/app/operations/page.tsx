'use client';

import React, { useEffect, useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { PersonalOpsItem } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { QuickAddModal } from '@/components/QuickAddModal';

export default function OperationsPage() {
  const [items, setItems] = useState<PersonalOpsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4 text-amber-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--card-foreground)]">
                  Personal Operations
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                Prevent friction and forgotten commitments by centralizing appointments, administrative tasks, and references.
              </p>
            </div>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center space-x-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-medium self-start sm:self-auto hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Ops Items List */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] pb-2 border-b border-[var(--border)]">
              Pending & Active Responsibilities
            </h2>

            <div className="space-y-2">
              {items.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isCompleted
                        ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 line-through text-[var(--muted-foreground)]'
                        : 'border-[var(--border)] bg-[var(--background)] hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-[var(--muted-foreground)]" />
                        )}
                      </div>
                      <div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[var(--muted)] text-[var(--muted-foreground)] mr-2">
                          {item.item_type}
                        </span>
                        <span className="font-medium text-xs sm:text-sm">{item.title}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      {item.due_at ? `Due ${formatDate(item.due_at)}` : 'No hard deadline'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onRefresh={loadOpsData}
      />
    </div>
  );
}
