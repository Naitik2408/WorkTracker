export interface HabitSnapshot {
  id: string;
  name: string;
  isActive: boolean;
  streakDays: number;
  completionRate30d: number;
  recentCompletions: Record<string, boolean>; // YYYY-MM-DD -> isCompleted
}

export interface FocusSessionSnapshot {
  id: string;
  taskTitle?: string;
  durationMinutes: number;
  date: string;
  status: 'COMPLETED' | 'INTERRUPTED';
  interruptionReason?: string;
}

export interface FinanceTransactionSnapshot {
  id: string;
  date: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amountMinor: number;
  currency: string;
  note?: string;
}

export interface DailyReviewSnapshot {
  date: string;
  wentWell?: string;
  improveTomorrow?: string;
  remember?: string;
  status: string;
}

export interface LifeAnalyticsData {
  lastSyncedAt: string;
  isStale: boolean;
  habits: HabitSnapshot[];
  focusSessions: FocusSessionSnapshot[];
  finance: {
    currency: string;
    totalIncomeThisMonthMinor: number;
    totalExpenseThisMonthMinor: number;
    transactions: FinanceTransactionSnapshot[];
  };
  dailyReviews: DailyReviewSnapshot[];
}
