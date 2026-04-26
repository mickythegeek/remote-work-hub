import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiPost } from '../lib/api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const { setAuthToken } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

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
        const state = location.state as undefined | { redirectTo?: string; job?: unknown };
        const redirectTo = state?.redirectTo || '/';
        const job = state?.job;
        setTimeout(() => {
          navigate(redirectTo, job ? { state: { job } } : undefined);
        }, 1000);
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Network error. Is the API server running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56,
          background: 'var(--navy)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
          boxShadow: '0 4px 14px rgba(44, 111, 166, 0.35)',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="white" strokeWidth="1.8" />
            <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          The Digital Curator
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Elevate your remote professional journey
        </p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 480, overflow: 'hidden' }}>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setFeedback(null); }}
              style={{
                flex: 1,
                padding: '18px 0',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: mode === m ? 'var(--navy)' : 'var(--text-muted)',
                borderBottom: mode === m ? '2px solid var(--navy)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.2s',
                background: 'transparent',
                justifyContent: 'center',
                display: 'flex'
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '36px 40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  className="form-input"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {mode === 'login' && (
                  <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {feedback && (
              <div className={`feedback feedback--${feedback.type}`}>{feedback.msg}</div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={loading}
              style={{ marginTop: 4, padding: '15px 24px', fontSize: '1rem' }}
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                  ? 'Log In to Your Workspace'
                  : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom link */}
      <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        {mode === 'login' ? (
          <>
            New to the platform?{' '}
            <button
              onClick={() => { setMode('register'); setFeedback(null); }}
              style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.875rem' }}
            >
              Explore featured opportunities
            </button>{' '}
            before joining.
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); setFeedback(null); }}
              style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.875rem' }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}