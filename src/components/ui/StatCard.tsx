'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: {
    value: string;
    isPositive: boolean;
    neutral?: boolean;
  };
  sparkline?: number[];
  className?: string;
}

export function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  delta,
  sparkline = [20, 25, 22, 30, 28, 35, 42, 40, 48],
  className = '',
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // 600ms count-up ease-out
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 600;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value]);

  // Generate SVG path for sparkline
  const maxVal = Math.max(...sparkline, 1);
  const minVal = Math.min(...sparkline, 0);
  const height = 24;
  const width = 80;
  const points = sparkline
    .map((v, i) => {
      const x = (i / (sparkline.length - 1)) * width;
      const y = height - ((v - minVal) / (maxVal - minVal || 1)) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={`rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] transition-colors hover:border-[var(--border-hover)] ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted)]">
        <span>{label}</span>
        {delta && (
          <span
            className={`inline-flex items-center space-x-0.5 rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold ${
              delta.neutral
                ? 'bg-[var(--background-2)] text-[var(--muted)]'
                : delta.isPositive
                ? 'bg-[var(--success)]/10 text-[var(--success)]'
                : 'bg-[var(--danger)]/10 text-[var(--danger)]'
            }`}
          >
            {delta.neutral ? (
              <Minus className="h-3 w-3" />
            ) : delta.isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{delta.value}</span>
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight font-mono text-[var(--foreground)]">
          {prefix}
          {displayValue.toLocaleString()}
          {suffix}
        </span>

        {/* Sparkline that draws in */}
        {sparkline && sparkline.length > 1 && (
          <svg width={width} height={height} className="overflow-visible opacity-70">
            <motion.polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
