'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  whatHappened?: string;
  whyItHappened?: string;
  whatToDoNext?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  whatHappened = 'Unable to synchronize your dashboard data',
  whyItHappened = 'The connection to the database timed out or was interrupted.',
  whatToDoNext = 'Check your network connection and click retry to reload the data safely.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`rounded-[8px] border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5 text-xs text-[var(--foreground)] ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <h4 className="font-semibold text-[var(--foreground)] text-xs">
            {whatHappened}
          </h4>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            <strong>Reason:</strong> {whyItHappened}
          </p>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            <strong>Suggested Action:</strong> {whatToDoNext}
          </p>

          {onRetry && (
            <div className="pt-2">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                <span>Retry Connection</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
