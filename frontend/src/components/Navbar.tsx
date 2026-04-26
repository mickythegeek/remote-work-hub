import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

function NavBar() {
    const { authToken, setAuthToken, savedJobs } = useApp();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="navbar">
            {/* Brand with briefcase icon */}
            <Link to="/" className="navbar__brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                    width: 28, height: 28,
                    background: 'var(--navy)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8" />
                        <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </div>
                The Digital Curator
            </Link>

            {/* Nav links — Tracker, Jobs, Saved */}
            <nav className="navbar__nav">
                <Link to="/tracker" className={`navbar__link ${isActive('/tracker') ? 'navbar__link--active' : ''}`}>
                    Tracker
                </Link>
                <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
                    Jobs
                </Link>
                <Link to="/saved" className={`navbar__link ${isActive('/saved') ? 'navbar__link--active' : ''}`}>
                    Saved
                    {savedJobs.length > 0 && (
                        <span className="navbar__badge">{savedJobs.length}</span>
                    )}
                </Link>
            </nav>

            {/* Avatar / auth */}
            <div>
                {authToken ? (
                    <button onClick={() => setAuthToken(null)} style={{
                        width: 36, height: 36,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--border-subtle)',
                    }}>
                        <img src="https://i.pravatar.cc/36?img=12" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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