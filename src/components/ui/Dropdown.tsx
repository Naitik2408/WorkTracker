'use client';

import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  destructive?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ trigger, items, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-[160px] overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-1 text-xs shadow-lg animate-in fade-in-80 zoom-in-95 duration-150"
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <DropdownMenuPrimitive.Item
                key={idx}
                onClick={item.onClick}
                className={`flex cursor-pointer items-center space-x-2 rounded-[6px] px-2.5 py-1.5 outline-none select-none transition-colors ${
                  item.destructive
                    ? 'text-[var(--danger)] hover:bg-[var(--danger)]/10'
                    : 'text-[var(--foreground)] hover:bg-[var(--background-2)]'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span>{item.label}</span>
              </DropdownMenuPrimitive.Item>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
