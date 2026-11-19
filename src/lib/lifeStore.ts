import { LifeAnalyticsData } from '@/types/life';

export const INITIAL_LIFE_DATA: LifeAnalyticsData = {
  lastSyncedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // 85m ago
  isStale: false,
  habits: [
    {
      id: 'h-gym',
      name: 'Gym & Physical Fitness',
      isActive: true,
      streakDays: 7,
      completionRate30d: 83,
      recentCompletions: {
        '2026-11-18': true,
        '2026-11-17': true,
        '2026-11-16': true,
        '2026-11-15': true,
        '2026-11-14': true,
        '2026-11-13': true,
        '2026-11-12': true,
        '2026-11-11': false,
      }
    },
    {
      id: 'h-read',
      name: 'Technical Reading / Architecture (30m)',
      isActive: true,
      streakDays: 4,
      completionRate30d: 90,
      recentCompletions: {
        '2026-11-18': true,
        '2026-11-17': true,
        '2026-11-16': true,
        '2026-11-15': true,
        '2026-11-14': false,
      }
    },
    {
      id: 'h-code',
      name: 'Daily Deep Work & Commit',
      isActive: true,
      streakDays: 14,
      completionRate30d: 97,
      recentCompletions: {
        '2026-11-18': true,
        '2026-11-17': true,
        '2026-11-16': true,
        '2026-11-15': true,
        '2026-11-14': true,
      }
    },
    {
      id: 'h-sleep',
      name: 'Sleep by 11:30 PM',
      isActive: true,
      streakDays: 3,
      completionRate30d: 70,
      recentCompletions: {
        '2026-11-18': false,
        '2026-11-17': true,
        '2026-11-16': true,
        '2026-11-15': true,
      }
    },
    {
      id: 'h-review',
      name: 'Evening Daily Reflection',
      isActive: true,
      streakDays: 5,
      completionRate30d: 88,
      recentCompletions: {
        '2026-11-18': true,
        '2026-11-17': true,
        '2026-11-16': true,
        '2026-11-15': true,
        '2026-11-14': true,
      }
    }
  ],
  focusSessions: [
    {
      id: 'f-1',
      taskTitle: 'WorkTracker multi-module architecture & tokens',
      durationMinutes: 135,
      date: '2026-11-18',
      status: 'COMPLETED'
    },
    {
      id: 'f-2',
      taskTitle: 'LaunchFast checkout webhook testing',
      durationMinutes: 75,
      date: '2026-11-17',
      status: 'COMPLETED'
    },
    {
      id: 'f-3',
      taskTitle: 'Acme AI prep: Next.js 16 partial prerendering notes',
      durationMinutes: 90,
      date: '2026-11-16',
      status: 'COMPLETED'
    },
    {
      id: 'f-4',
      taskTitle: 'General algorithm practice',
      durationMinutes: 45,
      date: '2026-11-15',
      status: 'INTERRUPTED',
      interruptionReason: 'Phone call'
    }
  ],
  finance: {
    currency: 'INR',
    totalIncomeThisMonthMinor: 14500000, // ₹1,45,000.00
    totalExpenseThisMonthMinor: 4235000, // ₹42,350.00
    transactions: [
      {
        id: 'tx-1',
        date: '2026-11-16',
        category: 'Software & Infrastructure',
        type: 'EXPENSE',
        amountMinor: 219900,
        currency: 'INR',
        note: 'Domain renewals & cloud dev tools'
      },
      {
        id: 'tx-2',
        date: '2026-11-14',
        category: 'Food & Groceries',
        type: 'EXPENSE',
        amountMinor: 385000,
        currency: 'INR',
        note: 'Weekly provisions'
      },
      {
        id: 'tx-3',
        date: '2026-11-10',
        category: 'Freelance & Contracting',
        type: 'INCOME',
        amountMinor: 8500000,
        currency: 'INR',
        note: 'Milestone 2 payout — Client Portal UI'
      }
    ]
  },
  dailyReviews: [
    {
      date: '2026-11-17',
      wentWell: 'Shipped the WorkTracker 6-month test re-entry module. Clean build with 0 TypeScript errors.',
      improveTomorrow: 'Protect morning focus block before checking social media or emails.',
      remember: 'Simplicity and craft always win over excessive feature clutter.',
      status: 'COMPLETED'
    },
    {
      date: '2026-11-16',
      wentWell: 'Good workout session and solid deep focus on LaunchFast SEO verification.',
      improveTomorrow: 'Ensure dinner is finished earlier to improve sleep streak.',
      remember: 'Consistency compounds quietly.',
      status: 'COMPLETED'
    }
  ]
};

const LIFE_STORAGE_KEY = 'worktracker_life_store_v1';

export function getStoredLifeData(): LifeAnalyticsData {
  if (typeof window === 'undefined') return INITIAL_LIFE_DATA;
  try {
    const raw = localStorage.getItem(LIFE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LIFE_STORAGE_KEY, JSON.stringify(INITIAL_LIFE_DATA));
      return INITIAL_LIFE_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse life store:', err);
    return INITIAL_LIFE_DATA;
  }
}
