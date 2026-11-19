'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';
import { Project, NextStepItem } from '@/types/project';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ResumeCardProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

export function ResumeCard({ project, onUpdate }: ResumeCardProps) {
  const [copied, setCopied] = useState(false);
  const [newStepText, setNewStepText] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [isEditingState, setIsEditingState] = useState(false);
  const [currentStateText, setCurrentStateText] = useState(project.resume.currentState);
  const [saveFlash, setSaveFlash] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(project.resume.runLocally);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleStep = (stepId: string) => {
    const updatedSteps = project.resume.nextSteps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    const updated: Project = {
      ...project,
      lastWorkedAt: new Date().toISOString(),
      resume: {
        ...project.resume,
        nextSteps: updatedSteps,
      },
    };
    onUpdate(updated);
    triggerSaveFlash();
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;

    const newStep: NextStepItem = {
      id: `step-${Date.now()}`,
      text: newStepText.trim(),
      completed: false,
    };

    const updated: Project = {
      ...project,
      lastWorkedAt: new Date().toISOString(),
      resume: {
        ...project.resume,
        nextSteps: [...project.resume.nextSteps, newStep],
      },
    };
    onUpdate(updated);
    setNewStepText('');
    setIsAddingStep(false);
    triggerSaveFlash();
  };

  const handleDeleteStep = (stepId: string) => {
    const updated: Project = {
      ...project,
      lastWorkedAt: new Date().toISOString(),
      resume: {
        ...project.resume,
        nextSteps: project.resume.nextSteps.filter((s) => s.id !== stepId),
      },
    };
    onUpdate(updated);
    triggerSaveFlash();
  };

  const handleSaveCurrentState = () => {
    const updated: Project = {
      ...project,
      lastWorkedAt: new Date().toISOString(),
      resume: {
        ...project.resume,
        currentState: currentStateText.trim(),
      },
    };
    onUpdate(updated);
    setIsEditingState(false);
    triggerSaveFlash();
  };

  const triggerSaveFlash = () => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  };

  return (
    <Card className="p-4 sm:p-5 space-y-5 border-[var(--border)]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] font-mono">
            6-Month Re-Entry Resume
          </span>
          <h2 className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
            Quickly understand state, blockers, and local run command.
          </h2>
        </div>
        {saveFlash && (
          <span className="text-[10px] font-mono text-[var(--success)] animate-pulse">
            ✓ Saved
          </span>
        )}
      </div>

      {/* 1. Current State (Inline editable) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
            Current State
          </label>
          {!isEditingState ? (
            <button
              onClick={() => setIsEditingState(true)}
              className="text-[11px] text-[var(--accent)] hover:underline"
            >
              Edit
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setCurrentStateText(project.resume.currentState);
                  setIsEditingState(false);
                }}
                className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCurrentState}
                className="text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {isEditingState ? (
          <textarea
            value={currentStateText}
            onChange={(e) => setCurrentStateText(e.target.value)}
            rows={3}
            className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Describe what state the project was left in..."
          />
        ) : (
          <p className="text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface-subtle)] p-2.5 rounded-[6px] border border-[var(--border)]">
            {project.resume.currentState || 'No state recorded yet.'}
          </p>
        )}
      </div>

      {/* 2. Next Steps Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
            Next Steps
          </label>
          <button
            onClick={() => setIsAddingStep(true)}
            className="text-[11px] text-[var(--accent)] hover:underline flex items-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add step</span>
          </button>
        </div>

        <div className="space-y-1.5">
          {project.resume.nextSteps.map((step) => (
            <div
              key={step.id}
              className="group flex items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs transition-colors hover:bg-[var(--surface-subtle)]"
            >
              <button
                onClick={() => handleToggleStep(step.id)}
                className="flex items-center space-x-2 text-left min-w-0"
              >
                {step.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)] shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[var(--subtle)] shrink-0" />
                )}
                <span
                  className={`truncate ${
                    step.completed ? 'line-through text-[var(--muted)]' : 'text-[var(--foreground)]'
                  }`}
                >
                  {step.text}
                </span>
              </button>

              <button
                onClick={() => handleDeleteStep(step.id)}
                className="opacity-0 group-hover:opacity-100 text-[var(--subtle)] hover:text-[var(--danger)] transition-opacity p-1"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          {isAddingStep && (
            <form onSubmit={handleAddStep} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="What were you about to do next?"
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                autoFocus
                className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] focus:border-[var(--accent)] focus:outline-none"
              />
              <Button type="submit" size="sm" variant="primary">
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNewStepText('');
                  setIsAddingStep(false);
                }}
              >
                Cancel
              </Button>
            </form>
          )}

          {project.resume.nextSteps.length === 0 && !isAddingStep && (
            <p className="text-[11px] text-[var(--subtle)] italic">
              No next steps logged. Add the very first task to resume smoothly.
            </p>
          )}
        </div>
      </div>

      {/* 3. Blockers / Known Issues */}
      {project.resume.blockers.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--warning)] font-mono flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Blockers & Known Issues</span>
          </label>
          <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)] bg-[var(--warning)]/5 border border-[var(--warning)]/20 p-2.5 rounded-[6px]">
            {project.resume.blockers.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. How to Run Locally with 1-click Copy */}
      <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
        <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono flex items-center space-x-1">
          <Terminal className="h-3 w-3" />
          <span>How to Run Locally</span>
        </label>
        <div className="flex items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 font-mono text-xs">
          <code className="text-[var(--foreground)] truncate mr-2 select-all">
            {project.resume.runLocally}
          </code>
          <button
            onClick={handleCopyCommand}
            className="flex items-center space-x-1 rounded-[4px] border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-[var(--success)]" />
                <span className="text-[var(--success)]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

    </Card>
  );
}
