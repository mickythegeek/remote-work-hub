import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import JobBoardPage from './pages/JobBoardPage';
import SavedJobsPage from './pages/SavedJobsPage';
import TrackerPage from './pages/TrackerPage';
import JobDetailsPage from './pages/JobDetailsPage';

function NavBar() {
  const { authToken, setAuthToken, savedJobs } = useApp();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar">
      <Link to="/" className="text-red-500">Remote Work Hub</Link>

      <nav className="navbar__nav">
  <Link
    to="/"
    className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
  >
    Jobs
  </Link>

  {authToken && (
    <>
      <Link
        to="/saved"
        className={`navbar__link ${isActive('/saved') ? 'navbar__link--active' : ''}`}
      >
        Saved
        {savedJobs.length > 0 && (
          <span
            style={{
              marginLeft: 2,
              background: 'var(--navy)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.65rem',
              padding: '1px 6px'
            }}
          >
            {savedJobs.length}
          </span>
        )}
      </Link>

      <Link
        to="/tracker"
        className={`navbar__link ${isActive('/tracker') ? 'navbar__link--active' : ''}`}
      >
        Tracker
      </Link>
    </>
  )}
</nav>

      <div>
        {authToken ? (
          <button onClick={() => setAuthToken(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
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
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HideNavOnAuth() {
  const location = useLocation();
  if (location.pathname === '/auth') return null;
  return <NavBar />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
