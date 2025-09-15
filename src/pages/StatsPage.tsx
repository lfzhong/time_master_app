import React from 'react';
import { useTimeTracker } from '../hooks/useTimeTracker';
import { formatDuration, formatTime } from '../utils/time';

const StatsPage: React.FC = () => {
  const { state } = useTimeTracker();

  const totalTimeSpent = state.tasks.reduce((total, task) => total + task.totalTime, 0);
  const totalTasks = state.tasks.length;
  const activeTasks = state.tasks.filter(task => task.isActive).length;
  const completedSessions = state.timeEntries.length;

  const taskStats = state.tasks.map(task => {
    const sessions = state.timeEntries.filter(entry => entry.taskId === task.id);
    return {
      ...task,
      sessionCount: sessions.length,
      averageSessionTime: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, entry) => sum + entry.duration, 0) / sessions.length)
        : 0,
    };
  }).sort((a, b) => b.totalTime - a.totalTime);

  const recentSessions = state.timeEntries
    .slice(-10)
    .reverse()
    .map(entry => {
      const task = state.tasks.find(t => t.id === entry.taskId);
      return {
        ...entry,
        taskTitle: task?.title || 'Unknown Task',
      };
    });

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Time Usage Statistics</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Time</h3>
            <p className="text-3xl font-bold text-blue-600">{formatTime(totalTimeSpent)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-green-600">{totalTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Tasks</h3>
            <p className="text-3xl font-bold text-orange-600">{activeTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">{completedSessions}</p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Overview Cards - Mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Time</h3>
            <p className="text-xl font-bold text-blue-600">{formatTime(totalTimeSpent)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tasks</h3>
            <p className="text-xl font-bold text-green-600">{totalTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active</h3>
            <p className="text-xl font-bold text-orange-600">{activeTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Sessions</h3>
            <p className="text-xl font-bold text-purple-600">{completedSessions}</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Task Breakdown and Recent Sessions */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Breakdown</h2>
            {taskStats.length === 0 ? (
              <p className="text-gray-500">No tasks tracked yet.</p>
            ) : (
              <div className="space-y-4">
                {taskStats.map((task) => (
                  <div key={task.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className="text-sm font-semibold text-blue-600">
                        {formatTime(task.totalTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{task.sessionCount} sessions</span>
                      <span>
                        Avg: {task.averageSessionTime > 0 ? formatDuration(task.averageSessionTime) : '0m'}
                      </span>
                    </div>
                    {totalTimeSpent > 0 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(task.totalTime / totalTimeSpent) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {((task.totalTime / totalTimeSpent) * 100).toFixed(1)}% of total time
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sessions</h2>
            {recentSessions.length === 0 ? (
              <p className="text-gray-500">No completed sessions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{session.taskTitle}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.startTime).toLocaleDateString()} at{' '}
                        {new Date(session.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Task Breakdown and Recent Sessions */}
      <div className="lg:hidden space-y-4">
        {/* Task Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Task Breakdown</h2>
          {taskStats.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks tracked yet.</p>
          ) : (
            <div className="space-y-3">
              {taskStats.map((task) => (
                <div key={task.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                    <span className="text-xs font-semibold text-blue-600">
                      {formatTime(task.totalTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>{task.sessionCount} sessions</span>
                    <span>
                      Avg: {task.averageSessionTime > 0 ? formatDuration(task.averageSessionTime) : '0m'}
                    </span>
                  </div>
                  {totalTimeSpent > 0 && (
                    <div>
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${(task.totalTime / totalTimeSpent) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {((task.totalTime / totalTimeSpent) * 100).toFixed(1)}% of total time
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Sessions</h2>
          {recentSessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No completed sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{session.taskTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.startTime).toLocaleDateString()} at{' '}
                      {new Date(session.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <span className="font-semibold text-blue-600 text-sm">
                    {formatDuration(session.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Summary (if there are sessions today) */}
      {state.timeEntries.some(entry => {
        const today = new Date();
        const entryDate = new Date(entry.startTime);
        return entryDate.toDateString() === today.toDateString();
      }) && (
        <>
          {/* Desktop Daily Summary */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const today = new Date();
                  const todaySessions = state.timeEntries.filter(entry => {
                    const entryDate = new Date(entry.startTime);
                    return entryDate.toDateString() === today.toDateString();
                  });
                  const todayTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
                  
                  return (
                    <>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{formatTime(todayTime)}</p>
                        <p className="text-sm text-gray-600">Total time today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{todaySessions.length}</p>
                        <p className="text-sm text-gray-600">Sessions completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {todaySessions.length > 0 
                            ? formatDuration(Math.round(todayTime / todaySessions.length))
                            : '0m'
                          }
                        </p>
                        <p className="text-sm text-gray-600">Average session</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Mobile Daily Summary */}
          <div className="lg:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Today's Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                {(() => {
                  const today = new Date();
                  const todaySessions = state.timeEntries.filter(entry => {
                    const entryDate = new Date(entry.startTime);
                    return entryDate.toDateString() === today.toDateString();
                  });
                  const todayTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
                  
                  return (
                    <>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{formatTime(todayTime)}</p>
                        <p className="text-xs text-gray-600">Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{todaySessions.length}</p>
                        <p className="text-xs text-gray-600">Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">
                          {todaySessions.length > 0 
                            ? formatDuration(Math.round(todayTime / todaySessions.length))
                            : '0m'
                          }
                        </p>
                        <p className="text-xs text-gray-600">Average</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
