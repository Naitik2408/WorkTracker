'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ElementType;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={`relative flex items-center ${
        variant === 'pill'
          ? 'space-x-1 rounded-[8px] border border-[var(--border)] bg-[var(--background-2)] p-1'
          : 'space-x-6 border-b border-[var(--border)]'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors select-none ${
              variant === 'pill'
                ? isActive
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                : isActive
                ? 'pb-3 text-[var(--foreground)]'
                : 'pb-3 text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {/* Sliding Pill or Underline using layoutId */}
            {isActive && variant === 'pill' && (
              <motion.div
                layoutId="active-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-[6px] bg-[var(--card)] shadow-xs border border-[var(--border)]"
              />
            )}

            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="active-underline"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--foreground)]"
              />
            )}

            <span className="relative z-10 flex items-center space-x-1.5">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive
                      ? 'bg-[var(--foreground)]/10 text-[var(--foreground)]'
                      : 'bg-[var(--border)] text-[var(--muted)]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
