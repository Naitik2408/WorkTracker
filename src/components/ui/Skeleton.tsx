'use client';

import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-[6px] skeleton-shimmer bg-[var(--background-2)] ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-7 w-7 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-48" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full mt-4" />
    </div>
  );
}
