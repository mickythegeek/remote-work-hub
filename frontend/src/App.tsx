import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import JobBoardPage from './pages/JobBoardPage';
import AllJobsPage from './pages/AllJobsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import TrackerPage from './pages/TrackerPage';
import JobDetailsPage from './pages/JobDetailsPage';
// import ResumeBuilderPage from './pages/ResumeBuilderPage';
// import ResumePreviewPage from './pages/ResumePreviewPage';

function NavBar() {
  const { authToken, setAuthToken, savedJobs } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  // const isResumeActive = isActive('/resume') || location.pathname.startsWith('/resume/');

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = (
    <>
      <Link
        to="/"
        className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
        onClick={closeMenu}
      >
        Jobs
      </Link>

      {authToken && (
        <>
          <Link
            to="/saved"
            className={`navbar__link ${isActive('/saved') ? 'navbar__link--active' : ''}`}
            onClick={closeMenu}
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
            onClick={closeMenu}
          >
            Tracker
          </Link>

          {/* <Link
            to="/resume"
            className={`navbar__link ${isResumeActive ? 'navbar__link--active' : ''}`}
            onClick={closeMenu}
          >
            Resume
          </Link> */}
        </>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
      <Link
        to="/"
        className={`navbar__mobile-link ${isActive('/') ? 'navbar__mobile-link--active' : ''}`}
        onClick={closeMenu}
      >
        Jobs
      </Link>

      {authToken && (
        <>
          <Link
            to="/saved"
            className={`navbar__mobile-link ${isActive('/saved') ? 'navbar__mobile-link--active' : ''}`}
            onClick={closeMenu}
          >
            Saved {savedJobs.length > 0 && `(${savedJobs.length})`}
          </Link>

          <Link
            to="/tracker"
            className={`navbar__mobile-link ${isActive('/tracker') ? 'navbar__mobile-link--active' : ''}`}
            onClick={closeMenu}
          >
            Tracker
          </Link>

          {/* <Link
            to="/resume"
            className={`navbar__mobile-link ${isResumeActive ? 'navbar__mobile-link--active' : ''}`}
            onClick={closeMenu}
          >
            Resume
          </Link> */}
        </>
      )}
    </>
  );

  

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand-link" onClick={closeMenu}>
        Remote Work Hub
      </Link>

      <nav className="navbar__nav">{navLinks}</nav>

      <div className="navbar__actions">
        {authToken ? (
          <button
            onClick={() => { setAuthToken(null); closeMenu(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            <User size={18} />
            <span className="navbar__sign-out-text">Sign Out</span>
          </button>
        ) : (
          <Link to="/auth" onClick={closeMenu}>
            <User size={22} color="var(--text-secondary)" />
          </Link>
        )}

        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setMenuOpen(open => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        {mobileNavLinks}
      </nav>
    </header>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <HideNavOnAuth />
      <Routes>
        <Route path="/" element={<JobBoardPage />} />
        <Route path="/jobs-all" element={<AllJobsPage />} />
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        {/* <Route path="/resume" element={<ResumeBuilderPage />} />
        <Route path="/resume/:id" element={<ResumePreviewPage />} /> */}
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
