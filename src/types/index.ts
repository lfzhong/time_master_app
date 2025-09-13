export interface Task {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted?: boolean;
  category?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low' | 'none';
  totalTime: number; // in seconds
  startTime?: number; // timestamp
  createdAt: number; // timestamp
  order?: number; // manual ordering index
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
}

export interface AppState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTaskId: string | null;
  sortMode: 'custom' | 'date' | 'priority' | 'category';
}
