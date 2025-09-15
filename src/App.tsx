import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { TimeTrackerProvider } from './store/TimeTrackerContext';
import TasksPage from './pages/TasksPage';
import StatsPage from './pages/StatsPage';
import { useState } from 'react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <TimeTrackerProvider>
      <Router>
        <div className="min-h-screen bg-[#F9FAFB]">
          {/* Web Layout - Desktop */}
          <div className="hidden lg:block">
            <div className="max-w-none mx-auto px-8 py-8">
              {/* Header */}
              <header className="flex items-center justify-between mb-8">
                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-8 h-8 text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    Master
                  </span>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-6 text-base">
                  <NavLink 
                    to="/tasks"
                    className={({ isActive }) => `px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    Tasks
                  </NavLink>
                  <NavLink 
                    to="/stats"
                    className={({ isActive }) => `px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    Dashboard
                  </NavLink>
                </nav>
              </header>

              {/* Main content */}
              <main className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
                <Routes>
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/" element={<Navigate to="/tasks" replace />} />
                </Routes>
              </main>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="min-h-screen flex flex-col">
              {/* Mobile Header */}
              <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    {/* Logo + Title */}
                    <div className="flex items-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-6 h-6 text-blue-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      <span className="text-xl font-bold tracking-tight text-gray-900">
                        Master
                      </span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Toggle menu"
                    >
                      <svg 
                        className="w-6 h-6 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        {mobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                  <div className="bg-white border-t border-gray-200 px-4 py-3">
                    <nav className="flex flex-col space-y-2">
                      <NavLink 
                        to="/tasks"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `px-4 py-3 rounded-lg transition-colors font-medium ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        Tasks
                      </NavLink>
                      <NavLink 
                        to="/stats"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `px-4 py-3 rounded-lg transition-colors font-medium ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        Dashboard
                      </NavLink>
                    </nav>
                  </div>
                )}
              </header>

              {/* Mobile Main content */}
              <main className="flex-1 px-3 py-4">
                <Routes>
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/" element={<Navigate to="/tasks" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </TimeTrackerProvider>
  );
}

export default App;
