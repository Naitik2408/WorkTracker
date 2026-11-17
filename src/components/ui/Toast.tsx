'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...item, id }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'success' });
  }, [toast]);

  const error = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'error' });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-lg text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />}
                  {t.type === 'error' && <AlertCircle className="h-4 w-4 text-[var(--danger)] shrink-0 mt-0.5" />}
                  {(!t.type || t.type === 'info') && <Info className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />}
                  <div>
                    <h5 className="font-medium text-[var(--foreground)]">{t.title}</h5>
                    {t.description && (
                      <p className="mt-0.5 text-[11px] text-[var(--muted)] leading-relaxed">{t.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {t.action && (
                    <button
                      onClick={() => {
                        t.action?.onClick();
                        removeToast(t.id);
                      }}
                      className="rounded px-2 py-0.5 text-[11px] font-semibold text-[var(--foreground)] hover:bg-[var(--background-2)] transition-colors"
                    >
                      {t.action.label}
                    </button>
                  )}
                  <button
                    onClick={() => removeToast(t.id)}
                    className="rounded p-0.5 text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar auto-dismiss indicator */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-[2px] bg-[var(--foreground)] opacity-10"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
