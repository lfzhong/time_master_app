import React, { useState } from 'react';
import { useTimeTracker } from '../hooks/useTimeTracker';

const predefinedCategories = ['Work', 'Personal'];

type Priority = 'high' | 'medium' | 'low' | 'none';

const TaskForm: React.FC = () => {
  const { addTask } = useTimeTracker();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [categories, setCategories] = useState<string[]>(predefinedCategories);
  const [category, setCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const priority: Priority = 'none';
      addTask(newTaskTitle.trim(), newTaskDescription.trim() || undefined, priority, category || undefined);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setCategory('');
    }
  };

  const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = newCategory.trim();
      if (!value) return;
      if (!categories.includes(value)) {
        setCategories(prev => [...prev, value]);
      }
      setCategory(value);
      setNewCategory('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Add New Task</h2>
      <form onSubmit={handleAddTask} className="space-y-4 md:space-y-5">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="taskTitle"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add New Category</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleAddCategory}
            className="w-full px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a new category and press Enter"
          />
        </div>

        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="taskDescription"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter task description..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2.5 text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Task
        </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
