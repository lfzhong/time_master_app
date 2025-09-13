import React, { useReducer, useEffect } from 'react';
import type { AppState, Task, TimeEntry } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { getCurrentTimestamp } from '../utils/time';
import { generateId } from '../utils/helpers';
import { TimeTrackerContext } from '../context/TimeTrackerContext';
import { saveTask, loadTasks } from '../services/firestore';

const USER_ID = 'test-users';

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_TASK'; payload: { title: string; description?: string; priority?: Task['priority']; category?: string; dueDate?: string } }
  | { type: 'DELETE_TASK'; payload: { taskId: string } }
  | { type: 'START_TASK'; payload: { taskId: string } }
  | { type: 'STOP_TASK' }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'REORDER_TASKS'; payload: { orderedIds: string[] } }
  | { type: 'SET_SORT_MODE'; payload: { sortMode: AppState['sortMode'] } }
  | { type: 'TICK' };

const initialState: AppState = {
  tasks: [],
  timeEntries: [],
  activeTaskId: null,
  sortMode: 'custom',
};


const timeTrackerReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_TASK': {
      const newOrder = (state.tasks.reduce((max, t) => Math.max(max, t.order ?? 0), 0) + 1);
      const todayYmd = new Date().toISOString().slice(0, 10);
      const newTask: Task = {
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description,
        isActive: false,
        isCompleted: false,
        category: action.payload.category,
        dueDate: action.payload.dueDate ?? todayYmd,
        priority: action.payload.priority ?? 'none',
        totalTime: 0,
        createdAt: getCurrentTimestamp(),
        order: newOrder,
      };
      // Fire-and-forget write to Firestore
      void saveTask(USER_ID, newTask);
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.taskId),
        activeTaskId: state.activeTaskId === action.payload.taskId ? null : state.activeTaskId,
      };

    case 'START_TASK': {
      const updatedTasksStart = state.tasks.map(task => ({
        ...task,
        isActive: task.id === action.payload.taskId,
        startTime: task.id === action.payload.taskId ? getCurrentTimestamp() : task.startTime,
      }));
      return {
        ...state,
        tasks: updatedTasksStart,
        activeTaskId: action.payload.taskId,
      };
    }

    case 'STOP_TASK': {
      if (!state.activeTaskId) return state;
      
      const activeTask = state.tasks.find(task => task.id === state.activeTaskId);
      if (!activeTask || !activeTask.startTime) return state;

      const endTime = getCurrentTimestamp();
      const duration = Math.floor((endTime - activeTask.startTime) / 1000);

      const newTimeEntry: TimeEntry = {
        id: generateId(),
        taskId: state.activeTaskId,
        startTime: activeTask.startTime,
        endTime,
        duration,
      };

      const updatedTasksStop = state.tasks.map(task => 
        task.id === state.activeTaskId
          ? {
              ...task,
              isActive: false,
              totalTime: task.totalTime + duration,
              startTime: undefined,
            }
          : task
      );

      return {
        ...state,
        tasks: updatedTasksStop,
        timeEntries: [...state.timeEntries, newTimeEntry],
        activeTaskId: null,
      };
    }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case 'REORDER_TASKS': {
      const idToOrder: Record<string, number> = {};
      action.payload.orderedIds.forEach((id, idx) => { idToOrder[id] = idx + 1; });
      const idToTask: Record<string, Task> = {};
      state.tasks.forEach(t => { idToTask[t.id] = t; });
      const reordered: Task[] = action.payload.orderedIds
        .map(id => idToTask[id])
        .filter((t): t is Task => Boolean(t))
        .map(t => ({ ...t, order: idToOrder[t.id] }));
      const remaining = state.tasks.filter(t => !(t.id in idToOrder));
      const resultTasks = [...reordered, ...remaining];
      return {
        ...state,
        tasks: resultTasks,
      };
    }

    case 'SET_SORT_MODE':
      return {
        ...state,
        sortMode: action.payload.sortMode,
      };

    case 'TICK': {
      if (!state.activeTaskId) return state;
      
      const tickedTasks = state.tasks.map(task =>
        task.id === state.activeTaskId && task.startTime
          ? {
              ...task,
              totalTime: task.totalTime + Math.floor((getCurrentTimestamp() - task.startTime) / 1000),
              startTime: getCurrentTimestamp(),
            }
          : task
      );
      
      return {
        ...state,
        tasks: tickedTasks,
      };
    }

    default:
      return state;
  }
};


export const TimeTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(timeTrackerReducer, initialState);

  // Load data from Firestore on mount (fallback to localStorage)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tasks = await loadTasks(USER_ID);
        if (!mounted) return;
        const mapped = (tasks as unknown as Task[]) || [];
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, tasks: mapped, sortMode: 'custom' } });
      } catch {
        const savedState = loadFromStorage();
        if (savedState && mounted) {
          dispatch({ type: 'LOAD_STATE', payload: savedState });
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Timer for active task
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (state.activeTaskId) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.activeTaskId]);

  const addTask = (title: string, description?: string, priority?: Task['priority'], category?: string, dueDate?: string) => {
    dispatch({ type: 'ADD_TASK', payload: { title, description, priority, category, dueDate } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId } });
  };

  const startTask = (taskId: string) => {
    if (state.activeTaskId) {
      dispatch({ type: 'STOP_TASK' });
    }
    dispatch({ type: 'START_TASK', payload: { taskId } });
  };

  const stopTask = () => {
    dispatch({ type: 'STOP_TASK' });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  };

  const reorderTasks = (orderedIds: string[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: { orderedIds } });
  };

  const setSortMode = (sortMode: AppState['sortMode']) => {
    dispatch({ type: 'SET_SORT_MODE', payload: { sortMode } });
  };

  return (
    <TimeTrackerContext.Provider value={{
      state,
      addTask,
      deleteTask,
      startTask,
      stopTask,
      updateTask,
      reorderTasks,
      setSortMode,
    }}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

