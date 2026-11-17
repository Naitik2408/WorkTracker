'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Trash2, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { ApprovalAction } from '@/types/database';
import { cn } from '@/lib/utils';

interface GeminiAdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  approvalActions: ApprovalAction[];
  onApproveAction: (id: string) => Promise<void>;
  onRejectAction: (id: string) => Promise<void>;
}

export function GeminiAdvisorPanel({
  isOpen,
  onClose,
  approvalActions,
  onApproveAction,
  onRejectAction
}: GeminiAdvisorPanelProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'advisor'>('approvals');
  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: "Good morning, Naitik. I analyzed your 7 life domains. Your technical progress on Next.js 15 and Klarone is strong. However, Personal Operations has slipped (6 days since check-in), and follow-up is due for the Acme AI Frontend Architect application. What would you like to review?",
      time: '9:00 AM'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isProcessing) return;

    const query = userQuery.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: query, time: timeNow }]);
    setUserQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      let reply = "Based on your active priorities and calendar, you should lock in Priority 1 (Technical Challenge) before 2 PM. Your energy is highest before noon.";
      if (query.toLowerCase().includes('job') || query.toLowerCase().includes('career')) {
        reply = "You have 3 shortlisted roles. Sarah Jenkins at Vercel Ecosystem Labs expects your 30m interview confirmation. Acme AI is pending follow-up (8 business days elapsed). I drafted a polite follow-up in your Approval Queue.";
      } else if (query.toLowerCase().includes('neglect') || query.toLowerCase().includes('attention')) {
        reply = "Your Personal Operations domain has not been reviewed in 6 days (threshold is 3 days). You have 1 pending appointment confirmation and 1 resume update task.";
      } else if (query.toLowerCase().includes('klarone') || query.toLowerCase().includes('venture')) {
        reply = "Klarone is at 45% milestone completion. The most impactful next step is finalizing the PostgreSQL schema and email transactional provider (Resend recommended for Next.js stack).";
      }

      setMessages((prev) => [...prev, { sender: 'gemini', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl transition-transform animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold">Gemini Personal Advisor</h3>
            <p className="text-[10px] text-[var(--muted-foreground)]">CEO Executive Guidance & Action Guardrail</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--card-foreground)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] bg-[var(--background)]">
        <button
          onClick={() => setActiveTab('approvals')}
          className={cn(
            'flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors relative',
            activeTab === 'approvals'
              ? 'border-black dark:border-white text-[var(--card-foreground)]'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]'
          )}
        >
          Approval Queue ({approvalActions.length})
        </button>
        <button
          onClick={() => setActiveTab('advisor')}
          className={cn(
            'flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors',
            activeTab === 'advisor'
              ? 'border-black dark:border-white text-[var(--card-foreground)]'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]'
          )}
        >
          Ask Gemini Advisor
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'approvals' ? (
          <div>
            <div className="mb-3 rounded-md bg-[var(--muted)] p-2.5 text-[11px] text-[var(--muted-foreground)] flex items-start space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>5% Action Guardrail:</strong> Gemini drafts recruiter emails and external submissions, but nothing sends without your explicit review and sign-off.
              </span>
            </div>

            {approvalActions.length === 0 ? (
              <div className="py-12 text-center">
                <Check className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-1">No pending external actions require your approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvalActions.map((action) => (
                  <div
                    key={action.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[var(--card-foreground)]">
                        {action.summary_title}
                      </span>
                      <span className="rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-semibold">
                        Requires Approval
                      </span>
                    </div>

                    {action.ai_rationale && (
                      <p className="text-[11px] text-[var(--muted-foreground)] italic bg-[var(--accent)] p-2 rounded">
                        &ldquo;{action.ai_rationale}&rdquo;
                      </p>
                    )}

                    {action.payload_json?.body && (
                      <div className="rounded border border-[var(--border)] bg-[var(--background)] p-2 font-mono text-[11px] whitespace-pre-line text-[var(--card-foreground)]">
                        <div className="text-[10px] text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1 mb-1 font-sans">
                          <strong>To:</strong> {action.payload_json.to} <br />
                          <strong>Subject:</strong> {action.payload_json.subject}
                        </div>
                        {action.payload_json.body}
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[var(--border)]">
                      <button
                        onClick={() => onRejectAction(action.id)}
                        className="flex items-center space-x-1 rounded px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Discard</span>
                      </button>
                      <button
                        onClick={() => onApproveAction(action.id)}
                        className="flex items-center space-x-1 rounded bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-[11px] font-medium shadow-xs hover:opacity-90 transition-opacity"
                      >
                        <Check className="h-3 w-3" />
                        <span>Approve & Execute</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'rounded-lg p-3 text-xs leading-relaxed max-w-[90%]',
                    m.sender === 'user'
                      ? 'ml-auto bg-black text-white dark:bg-white dark:text-black'
                      : 'border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]'
                  )}
                >
                  <p>{m.text}</p>
                  <span className="block mt-1 text-[9px] opacity-60 text-right">{m.time}</span>
                </div>
              ))}
              {isProcessing && (
                <div className="text-[11px] text-[var(--muted-foreground)] flex items-center space-x-1.5 animate-pulse">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  <span>Gemini is synthesizing cross-domain insights...</span>
                </div>
              )}
            </div>

            {/* Suggested quick questions */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]">
              {[
                'What should I focus on today?',
                'Which area is slipping?',
                'What is the next step for Klarone?'
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setUserQuery(suggestion)}
                  className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-[10px] text-[var(--muted-foreground)] hover:text-[var(--card-foreground)] hover:border-black dark:hover:border-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendQuery} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask your Personal Advisor..."
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--card-foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="submit"
                disabled={!userQuery.trim() || isProcessing}
                className="rounded-md bg-black text-white dark:bg-white dark:text-black p-1.5 hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
