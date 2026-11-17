'use client';

import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  isNumeric?: boolean;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Filter records...',
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display matching your criteria.',
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {searchKey && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] hover:border-[var(--border-hover)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <span className="text-[11px] font-mono text-[var(--muted)]">
            {sortedData.length} total
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-[8px] border border-[var(--border)] bg-[var(--card)] shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 border-b border-[var(--border)] bg-[var(--background-2)] text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === String(col.key);
                return (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    className={`py-3 px-4 select-none ${
                      col.sortable ? 'cursor-pointer hover:text-[var(--foreground)]' : ''
                    } ${col.isNumeric ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`flex items-center space-x-1 ${
                        col.isNumeric ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-[var(--muted)]">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sortedData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`group transition-colors hover:bg-[var(--background-2)] ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`py-3 px-4 ${
                      col.isNumeric ? 'font-mono text-right' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key as keyof T] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="p-8">
            <EmptyState
              icon={Filter}
              title={emptyTitle}
              description={emptyDescription}
            />
          </div>
        )}
      </div>
    </div>
  );
}
