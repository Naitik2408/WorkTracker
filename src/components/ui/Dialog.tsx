'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = '',
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop fade */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
              />
            </DialogPrimitive.Overlay>

            {/* Modal Content: 12px radius, scale from 0.97 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 4 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full max-w-lg rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl ${className}`}
                >
                  <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
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

                  <div className="pt-4">{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
