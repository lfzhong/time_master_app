import { createContext } from 'react';
import type { AppState, Task } from '../types';

export interface TimeTrackerContextType {
  state: AppState;
  addTask: (
    title: string,
    description?: string,
    priority?: Task['priority'],
    category?: string,
    dueDate?: string,
  ) => void;
  deleteTask: (taskId: string) => void;
  startTask: (taskId: string) => void;
  stopTask: () => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  reorderTasks: (orderedIds: string[]) => void;
  setSortMode: (sortMode: AppState['sortMode']) => void;
}

export const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined);
