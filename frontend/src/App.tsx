import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import JobBoardPage from './pages/JobBoardPage';
import SavedJobsPage from './pages/SavedJobsPage';
import TrackerPage from './pages/TrackerPage';
import JobDetailsPage from './pages/JobDetailsPage';
import DashboardPage from './pages/DashboardPage';
import ActivityPage from './pages/ActivityPage';


function NavBar() {
  const { authToken, setAuthToken, savedJobs } = useApp();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">The Digital Curator</Link>

      <nav className="navbar__nav">
        <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
          Jobs
        </Link>
        <Link to="/saved" className={`navbar__link ${isActive('/saved') ? 'navbar__link--active' : ''}`}>
          Saved
          {savedJobs.length > 0 && (
            <span className="navbar__badge">{savedJobs.length}</span>
          )}
        </Link>
        <Link to="/tracker" className={`navbar__link ${isActive('/tracker') ? 'navbar__link--active' : ''}`}>
          Tracker
        </Link>
      </nav>

      <div>
        {authToken ? (
          <button
            onClick={() => setAuthToken(null)}
            className="navbar__sign-out"
          >
            <User size={18} /> Sign Out
          </button>
        ) : (
          <Link to="/auth">
            <User size={22} color="var(--text-secondary)" />
          </Link>
        )}
      </div>
    </header>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <HideNavOnAuth />
      <Routes>
        <Route path="/" element={<JobBoardPage />} />
        <Route path="/jobs" element={<JobBoardPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HideNavOnAuth() {
  const location = useLocation();
  if (location.pathname === '/auth') return null;
  if (location.pathname.startsWith('/jobs/')) return null;
  return <NavBar />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}