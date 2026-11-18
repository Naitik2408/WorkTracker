'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pin } from 'lucide-react';
import { Project, NoteItem } from '@/types/project';
import { Button } from './ui/Button';
import { formatTimeAgo } from '@/lib/utils';

interface NotesTimelineProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

export function NotesTimeline({ project, onUpdate }: NotesTimelineProps) {
  const [noteBody, setNoteBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      body: noteBody.trim(),
      pinned: isPinned,
      createdAt: new Date().toISOString(),
    };

    const updated: Project = {
      ...project,
      lastWorkedAt: new Date().toISOString(), // Adding note marks "Last worked"
      notes: [newNote, ...project.notes],
    };

    onUpdate(updated);
    setNoteBody('');
    setIsPinned(false);
  };

  const handleTogglePin = (noteId: string) => {
    const updatedNotes = project.notes.map((n) =>
      n.id === noteId ? { ...n, pinned: !n.pinned } : n
    );
    onUpdate({ ...project, notes: updatedNotes });
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = project.notes.filter((n) => n.id !== noteId);
    onUpdate({ ...project, notes: updatedNotes });
  };

  // Sort notes: pinned first, then newest
  const sortedNotes = [...project.notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-5">
      
      {/* Create Note Input Form */}
      <form onSubmit={handleAddNote} className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-3">
        <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] font-mono">
          Engineering Journal & Decisions
        </label>
        <textarea
          rows={3}
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          placeholder="Log architecture decisions, migrations, bug fixes, or key learnings... (Markdown supported)"
          className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] placeholder-[var(--subtle)] focus:border-[var(--accent)] focus:outline-none"
        />
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-1.5 text-xs text-[var(--muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--accent)]"
            />
            <span className="text-[11px]">Pin this note</span>
          </label>
          <Button type="submit" size="sm" variant="primary" disabled={!noteBody.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Note</span>
          </Button>
        </div>
      </form>

      {/* Notes Stream */}
      <div className="space-y-3">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`rounded-[8px] border p-3.5 transition-colors ${
                note.pinned
                  ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
                  : 'border-[var(--border)] bg-[var(--card)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {note.pinned && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                      <Pin className="h-3 w-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[var(--subtle)]">
                    {formatTimeAgo(note.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className="text-[11px] text-[var(--subtle)] hover:text-[var(--foreground)]"
                  >
                    {note.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-[11px] text-[var(--subtle)] hover:text-[var(--danger)]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                {note.body}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[8px] border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted)]">
            No engineering notes yet. Add your first architectural decision or change summary above.
          </div>
        )}
      </div>

    </div>
  );
}
