'use client';

import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[8px] border border-dashed border-[var(--border)] bg-[var(--background-2)]/50 p-8 text-center ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="text-xs font-semibold text-[var(--foreground)]">{title}</h4>
      <p className="mt-1 max-w-sm text-[11px] text-[var(--muted)] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
