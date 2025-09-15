import React, { useMemo, useState } from 'react';
import { useTimeTracker } from '../hooks/useTimeTracker';
import TaskItem from './TaskItem';
import type { Task } from '../types';
import type { TimeTrackerContextType } from '../context/TimeTrackerContext';

type Priority = NonNullable<Task['priority']>;
const ADD_NEW_SENTINEL = '__add_new_category__';
const UNCATEGORIZED = 'None';

const TaskList: React.FC<{ tasks?: Task[]; freezeSort?: boolean; setFreezeSort?: (v: boolean) => void }> = ({ tasks, setFreezeSort }) => {
  const { state, addTask, deleteTask, startTask, stopTask, updateTask, reorderTasks, setSortMode } = useTimeTracker() as TimeTrackerContextType;
  const list = tasks ?? state.tasks;

  // Drag and drop indices
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setFreezeSort?.(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex ?? Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from)) {
      setDragIndex(null);
      setFreezeSort?.(false);
      return;
    }
    const ids = list.map(t => t.id);
    const fromClamped = Math.max(0, Math.min(from, ids.length - 1));
    const toClamped = Math.max(0, Math.min(index, ids.length - 1));
    const [moved] = ids.splice(fromClamped, 1);
    ids.splice(toClamped, 0, moved);
    if (state.sortMode !== 'custom') setSortMode('custom');
    reorderTasks(ids);
    setDragIndex(null);
    setFreezeSort?.(false);
  };

  const onDragEnd = () => {
    setDragIndex(null);
    setFreezeSort?.(false);
  };

  // Hybrid creator state
  const [newTitle, setNewTitle] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [priority, setPriority] = useState<Priority>('none');
  const [category, setCategory] = useState<string>('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    state.tasks.forEach(t => { if (t.category) set.add(t.category); });
    return Array.from(set);
  }, [state.tasks]);

  const commitNewCategory = () => {
    const value = newCategoryText.trim();
    if (!value) return;
    setCategory(value);
    setNewCategoryText('');
    setShowNewCat(false);
  };

  const handleCreate = () => {
    const title = newTitle.trim();
    if (!title) return;

    // Defaults when collapsed
    const usedPriority: Priority = expanded ? priority : 'none';
    let usedCategory: string | undefined;
    if (expanded) {
      if (showNewCat) {
        const typed = newCategoryText.trim();
        usedCategory = typed || UNCATEGORIZED;
      } else {
        usedCategory = category || UNCATEGORIZED;
      }
    } else {
      usedCategory = UNCATEGORIZED;
    }

    addTask(title, undefined, usedPriority, usedCategory);
    // reset
    setNewTitle('');
    setPriority('none');
    setCategory('');
    setShowNewCat(false);
    setNewCategoryText('');
    // keep expanded state as-is; user decides
  };

  const onKeyDownTitle: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  const onKeyDownNewCategory: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitNewCategory();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowNewCat(false);
      setNewCategoryText('');
    }
  };

  const handleSelectCategory: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const val = e.target.value;
    if (val === ADD_NEW_SENTINEL) {
      setShowNewCat(true);
      setCategory('');
    } else {
      setShowNewCat(false);
      setCategory(val);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    const task = list.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { isCompleted: !task.isCompleted });
    }
  };

  const handleStart = (taskId: string) => { startTask(taskId); };
  const handleStop = () => { stopTask(); };
  const handleDelete = (taskId: string) => { deleteTask(taskId); };
  const handleUpdateDate = (taskId: string, value: string | undefined) => { updateTask(taskId, { dueDate: value }); };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:shadow-md">
        <div className="px-4 py-3 border-b border-gray-200 lg:px-6 lg:py-4">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Master Your Day. Master Your Life.</h2>
        </div>

        {/* Hybrid creator */}
        <div className="p-4 lg:p-6 border-b border-gray-100">
          {/* Top row: title + add + expand */}
          <div className="flex items-center gap-3 lg:gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={onKeyDownTitle}
              placeholder="Add a new task…"
              className="flex-1 px-4 py-3 lg:px-4 lg:py-2.5 text-base lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center px-4 py-3 lg:px-4 lg:py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base lg:text-base font-medium"
              title="Add task"
              aria-label="Add task"
            >
              <span className="lg:hidden">+</span>
              <span className="hidden lg:inline">Add Task</span>
            </button>
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              className="w-10 h-10 lg:w-9 lg:h-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              title={expanded ? 'Hide options' : 'Show options'}
              aria-label={expanded ? 'Hide options' : 'Show options'}
            >
              <span className="text-sm lg:text-base">…</span>
            </button>
          </div>

          {/* Expanded advanced options */}
          <div className={`${expanded ? 'max-h-48 mt-4' : 'max-h-0'} overflow-hidden transition-all duration-200`}> 
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Priority</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  title="Priority"
                  aria-label="Priority"
                >
                  <option value="none">None</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-gray-500 font-medium">Category</span>
                <select
                  value={showNewCat ? ADD_NEW_SENTINEL : (category || '')}
                  onChange={handleSelectCategory}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 max-w-xs"
                  title="Category"
                  aria-label="Category"
                >
                  <option value="">None</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value={ADD_NEW_SENTINEL}>+ Add new</option>
                </select>
                {showNewCat && (
                  <input
                    type="text"
                    value={newCategoryText}
                    onChange={(e) => setNewCategoryText(e.target.value)}
                    onKeyDown={onKeyDownNewCategory}
                    placeholder="New category"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
                    autoFocus
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {list.length === 0 ? (
          <div className="p-6 lg:p-8 text-center text-gray-400">
            <p className="inline-flex items-center gap-2 justify-center text-sm lg:text-base">
              {/* Clipboard icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6">
                <rect x="9" y="2" width="6" height="4" rx="1" />
                <path d="M9 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
              </svg>
              No tasks yet. Add your first task above!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map((task, index) => (
              <div
                key={task.id}
                onDragOver={onDragOver}
                onDrop={onDrop(index)}
                onDragEnd={onDragEnd}
                className="bg-white"
                aria-grabbed={dragIndex === index}
              >
                <TaskItem
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onStart={handleStart}
                  onStop={handleStop}
                  onDelete={handleDelete}
                  onUpdateDate={handleUpdateDate}
                  onDatePickerOpen={() => setFreezeSort?.(true)}
                  onDatePickerClose={() => setFreezeSort?.(false)}
                  onDragStartHandle={onDragStart(index)}
                  onDragEndHandle={onDragEnd}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
