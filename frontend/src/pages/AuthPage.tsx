import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiPost } from '../lib/api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const { setAuthToken } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const payload = mode === 'register' ? { email, password, name } : { email, password };
    try {
      const data = await apiPost(`/auth/${mode}`, payload);
      if (!data.success) {
        setFeedback({ type: 'error', msg: data.message || 'Authentication failed.' });
      } else {
        setAuthToken(data.data.token);
        setFeedback({ type: 'success', msg: 'Success! Redirecting...' });
        setTimeout(() => navigate('/'), 1000);
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Network error. Is the API server running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48 }}>
      {/* Brand heading */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: 32 }}>
        Remote Work Hub
      </h1>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24, gap: 4 }}>
        {(['login', 'register'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setFeedback(null); }}
            style={{
              padding: '10px 28px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: mode === m ? 'var(--navy)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {m === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 8, color: 'var(--text-primary)' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28 }}>
          {mode === 'login'
            ? "Access the world's most curated remote opportunities."
            : "Join the hub and start tracking your next career move."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="curator@hub.com" />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              {mode === 'login' && <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 500 }}>Forgot password?</a>}
            </div>
            <input className="form-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" />
          </div>

          {feedback && (
            <div className={`feedback feedback--${feedback.type}`}>{feedback.msg}</div>
          )}

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Continue to Workspace' : 'Create Account'}
          </button>
        </form>

        <div className="divider" style={{ margin: '24px 0' }}>OR CONTINUE WITH</div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="social-btn">
            <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="Google" />
            Google
          </button>
          <button className="social-btn">
            <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.2-162.6-98.2-240.4-190.5-278.8C555.8 43.2 505.2 32 456 32 317.6 32 203.8 105.5 149.9 212H150C90.5 212 32 269.5 32 340.9c0 72.8 58.9 131.8 131.5 131.8h4.5c-12.1 34-18.9 70.2-18.9 107.9 0 168.7 108.2 296.4 262.7 349C460 956.8 524 968 591 968c66 0 123.3-11 162-26C893 909.7 982 784.9 982 628c0-161.3-89.4-274.1-193.9-287.1zm-363.9 546c-118 0-213.4-86.9-213.4-193.9 0-2.4.1-4.7.2-7h.2c-4.6-10.4-7.2-21.9-7.2-34 0-46.8 38-84.8 84.8-84.8 5.5 0 10.9.5 16.1 1.5 52.6 29 107.5 45.5 165.4 45.5 57.8 0 112.8-16.5 165.4-45.5 5.2-1 10.6-1.5 16.1-1.5 46.8 0 84.8 38 84.8 84.8 0 12.1-2.5 23.5-7 33.9h.1c.1 2.4.2 4.7.2 7.1C724.6 799.1 629.2 886 511.2 886z"/></svg>
            Apple
          </button>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        {mode === 'login' ? (
          <>New to the hub? <Link to="/auth" onClick={() => setMode('register')} style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Create an account</Link></>
        ) : (
          <>Already have an account? <Link to="/auth" onClick={() => setMode('login')} style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Log in</Link></>
        )}
      </p>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '32px var(--space-lg)', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', marginTop: 64 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2024 REMOTE WORK HUB. THE CURATED AUTHORITY.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['PRIVACY', 'TERMS', 'SUPPORT'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
