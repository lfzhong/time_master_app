import React, { useMemo, useState, useRef, useEffect } from 'react';
import TaskList from '../components/TaskList';
import { useTimeTracker } from '../hooks/useTimeTracker';
import type { Task } from '../types';

type SortBy = 'custom' | 'date' | 'priority' | 'category';

const priorityRank: Record<NonNullable<Task['priority']>, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

const TasksPage: React.FC = () => {
  const { state } = useTimeTracker();
  const [sortBy, setSortBy] = useState<SortBy>('custom');
  const [open, setOpen] = useState(false);
  const [freezeSort, setFreezeSort] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const sortedTasks = useMemo(() => {
    const source = freezeSort ? state.tasks : [...state.tasks];
    if (freezeSort) return source; // maintain current order while editing

    if (sortBy === 'custom') {
      source.sort((a, b) => (a.order ?? a.createdAt) - (b.order ?? b.createdAt));
    } else if (sortBy === 'date') {
      source.sort((a, b) => (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0));
    } else if (sortBy === 'priority') {
      source.sort((a, b) => (priorityRank[b.priority ?? 'none'] - priorityRank[a.priority ?? 'none']));
    } else if (sortBy === 'category') {
      source.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    return source;
  }, [state.tasks, sortBy, freezeSort]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        {/* Removed page heading for cleaner header */}
        <div className="flex-1" />
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Sort by</span>
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-sm inline-flex items-center gap-2"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <span className="capitalize">{sortBy}</span>
            </button>
          </div>
          {open && (
            <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black/5">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setSortBy('custom'); setOpen(false); }}>Custom</button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setSortBy('date'); setOpen(false); }}>Date</button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setSortBy('priority'); setOpen(false); }}>Priority</button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setSortBy('category'); setOpen(false); }}>Category</button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <TaskList tasks={sortedTasks} freezeSort={freezeSort} setFreezeSort={setFreezeSort} />
      </div>
    </div>
  );
};

export default TasksPage;
