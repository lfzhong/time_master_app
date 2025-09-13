import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { TimeTrackerProvider } from './store/TimeTrackerContext';
import TasksPage from './pages/TasksPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <TimeTrackerProvider>
      <Router>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
            
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              {/* Logo + Title */}
              <div className="flex items-center gap-2">
                {/* Simple checkmark-circle logo (inline SVG) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-7 h-7 text-blue-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-3xl font-semibold tracking-tight text-gray-900">
                  Master
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-4 text-sm">
                <NavLink 
                  to="/tasks"
                  className={({ isActive }) => `transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Tasks
                </NavLink>
                <NavLink 
                  to="/stats"
                  className={({ isActive }) => `px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  Dashboard
                </NavLink>
              </nav>
            </header>

            {/* Main content */}
            <main>
              <Routes>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/" element={<Navigate to="/tasks" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </TimeTrackerProvider>
  );
}

export default App;
