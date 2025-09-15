import React, { useMemo, useState, useRef, useEffect } from "react";
import type { Task } from "../types";
import { useTimeTracker } from "../hooks/useTimeTracker";

// remove DateTrigger and react-datepicker usage

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onStart: (taskId: string) => void;
  onStop: () => void;
  onDelete: (taskId: string) => void;
  onUpdateDate: (taskId: string, value: string | undefined) => void;
  onDatePickerOpen?: () => void;
  onDatePickerClose?: () => void;
  onDragStartHandle?: (e: React.DragEvent) => void;
  onDragEndHandle?: (e: React.DragEvent) => void;
}

const circleBgColor = (priority?: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

const formatTimeHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Safe formatter for YYYY-MM-DD without timezone conversion
const formatYmdLabel = (ymd?: string): string => {
  if (!ymd) return "";
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(ymd);
  if (!m) return ymd;
  const year = m[1];
  const monthIdx = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[monthIdx] ?? m[2];
  return `${monthName} ${day}, ${year}`;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onStart,
  onStop,
  onDelete,
  onUpdateDate,
  onDatePickerOpen,
  onDatePickerClose,
  onDragStartHandle,
  onDragEndHandle,
}) => {
  const { state, updateTask } = useTimeTracker();

  // collect unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    state.tasks.forEach((t) => t.category && set.add(t.category));
    return Array.from(set);
  }, [state.tasks]);

  // dropdown states
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  
  // title editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const priorityMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (
        showPriorityMenu &&
        priorityMenuRef.current &&
        !priorityMenuRef.current.contains(e.target as Node)
      ) {
        setShowPriorityMenu(false);
      }
      if (
        showCategoryMenu &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target as Node)
      ) {
        setShowCategoryMenu(false);
        setAddingCategory(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [showPriorityMenu, showCategoryMenu]);

  // Update edited title when task title changes externally
  useEffect(() => {
    if (!isEditingTitle) {
      setEditedTitle(task.title);
    }
  }, [task.title, isEditingTitle]);

  const changePriority = (p: NonNullable<Task["priority"]>) => {
    updateTask(task.id, { priority: p });
    setShowPriorityMenu(false);
  };

  const changeCategory = (cat?: string) => {
    updateTask(task.id, { category: cat });
    setShowCategoryMenu(false);
    setAddingCategory(false);
    setNewCategory("");
  };

  const commitNewCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    changeCategory(trimmed);
  };

  // Title editing functions
  const startEditingTitle = () => {
    setIsEditingTitle(true);
    setEditedTitle(task.title);
    // Focus the input after the state update
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 0);
  };

  const cancelEditingTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle(task.title);
  };

  const saveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditingTitle();
    }
  };

  // Date handling: native input, isolated per task
  const dateInputRef = useRef<HTMLInputElement>(null);
  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    onDatePickerOpen?.();
    input.focus();
    const pickerCapable = input as HTMLInputElement & { showPicker?: () => void };
    // Defer picker opening to next tick to ensure focus is applied
    setTimeout(() => {
      if (typeof pickerCapable.showPicker === 'function') pickerCapable.showPicker();
      else input.click();
    }, 0);
  };
  const handleNativeDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    onUpdateDate(task.id, val || undefined);
    dateInputRef.current?.blur();
    onDatePickerClose?.();
  };
  const handleNativeDateBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    onDatePickerClose?.();
  };

  return (
    <div
      className={`group relative p-4 lg:p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition flex flex-col gap-3 ${
        task.isActive ? "bg-blue-50/30" : ""
      }`}
    >
      {/* First row: title + priority */}
      <div className="flex items-center gap-3">
        {/* Drag handle icon */}
        <span
          className="inline-flex items-center justify-center w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
          aria-label="Drag to reorder"
          draggable
          onDragStart={onDragStartHandle}
          onDragEnd={onDragEndHandle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M9 4h2v2H9V4zm0 4h2v2H9V8zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 4h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
        </span>
        <input
          type="checkbox"
          checked={!!task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="w-5 h-5 lg:w-4 lg:h-4"
        />

        {/* Priority menu */}
        <div className="relative" ref={priorityMenuRef}>
          <button
            type="button"
            className="w-6 h-6 lg:w-5 lg:h-5 inline-flex items-center justify-center rounded-full hover:ring-2 hover:ring-gray-200"
            onClick={() => setShowPriorityMenu((v) => !v)}
          >
            <span
              className={`w-4 h-4 lg:w-3 lg:h-3 rounded-full inline-block ${circleBgColor(
                task.priority
              )} ${task.isCompleted ? "opacity-50" : ""}`}
            />
          </button>
          {showPriorityMenu && (
            <div className="absolute z-10 mt-1 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-1 text-sm">
              {["high", "medium", "low", "none"].map((p) => (
                <button
                  key={p}
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2"
                  onClick={() =>
                    changePriority(p as NonNullable<Task["priority"]>)
                  }
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      p === "high"
                        ? "bg-red-500"
                        : p === "medium"
                        ? "bg-yellow-500"
                        : p === "low"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {p.charAt(0).toUpperCase() + p.slice(1)} Priority
                </button>
              ))}
            </div>
          )}
        </div>

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={saveTitle}
            className={`flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium text-base ${
              task.isCompleted
                ? "line-through text-gray-400 opacity-70"
                : "text-gray-900"
            }`}
            placeholder="Task title"
          />
        ) : (
          <span
            className={`truncate font-medium cursor-pointer hover:bg-gray-100 px-3 py-2 rounded text-base ${
              task.isCompleted
                ? "line-through text-gray-400 opacity-70"
                : "text-gray-900"
            }`}
            onClick={startEditingTitle}
            title="Click to edit title"
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Second row: metadata + actions */}
      <div className="flex items-center justify-between text-base text-gray-500">
        <div className="flex items-center gap-4">
          {/* Date: native hidden input + trigger */}
          <input
            ref={dateInputRef}
            type="date"
            value={task.dueDate || ''}
            onChange={handleNativeDateChange}
            onBlur={handleNativeDateBlur}
            className="absolute left-0 top-0 w-[1px] h-[1px] opacity-0"
          />
          {task.dueDate ? (
            <button
              type="button"
              onClick={openDatePicker}
              className="text-base text-gray-500 hover:text-gray-700"
              title="Change date"
              aria-label="Change date"
            >
              {formatYmdLabel(task.dueDate)}
            </button>
          ) : (
            <button
              type="button"
              onClick={openDatePicker}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-base hover:bg-gray-200 flex items-center gap-2"
              title="Set date"
              aria-label="Set date"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                />
              </svg>
              Set date
            </button>
          )}

          {/* Category dropdown */}
          <div className="relative" ref={categoryMenuRef}>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
              onClick={() => setShowCategoryMenu((v) => !v)}
            >
              {task.category || "None"}
            </button>
            {showCategoryMenu && (
              <div className="absolute z-10 mt-1 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-1 text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => changeCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
                {!addingCategory && (
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-blue-600"
                    onClick={() => setAddingCategory(true)}
                  >
                    + Add new
                  </button>
                )}
                {addingCategory && (
                  <div className="px-1 py-1">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitNewCategory();
                        }
                        if (e.key === "Escape") {
                          setAddingCategory(false);
                          setNewCategory("");
                        }
                      }}
                      placeholder="New category"
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      autoFocus
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={commitNewCategory}
                      >
                        Add
                      </button>
                      <button
                        className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => {
                          setAddingCategory(false);
                          setNewCategory("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: timer + actions */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-500">
            {formatTimeHHMMSS(task.totalTime)}
          </span>
          <button
            onClick={task.isActive ? onStop : () => onStart(task.id)}
            aria-label={task.isActive ? "Stop" : "Start"}
            className={`w-10 h-10 lg:w-8 lg:h-8 inline-flex items-center justify-center rounded-full text-white transition ${
              task.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {task.isActive ? "⏹" : "▶"}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete"
            className="inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
