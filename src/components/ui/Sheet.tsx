'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className = '',
}: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ x: side === 'right' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: side === 'right' ? '100%' : '-100%' }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed inset-y-0 ${
                  side === 'right' ? 'right-0' : 'left-0'
                } z-50 flex w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl ${className}`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div>
                    {title && (
                      <DialogPrimitive.Title className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description className="mt-1 text-xs text-[var(--muted)]">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close className="rounded-[6px] p-1 text-[var(--muted)] hover:bg-[var(--background-2)] hover:text-[var(--foreground)] transition-colors">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>

                <div className="flex-1 overflow-y-auto pt-4">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
