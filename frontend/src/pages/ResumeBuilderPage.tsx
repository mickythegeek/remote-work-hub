import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiPost } from '../lib/api';

export default function ResumeBuilderPage() {
  const { authToken } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');
  const [skillsText, setSkillsText] = useState('');

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentRole, setCurrentRole] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate('/auth', { replace: true, state: { redirectTo: '/resume' } });
    }
  }, [authToken, navigate]);

  if (!authToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      fullName,
      email,
      phone,
      address: address || undefined,
      summary: summary || undefined,
      skills: skills.length ? skills : undefined,
    };

    if (company && role && startDate) {
      payload.experience = {
        company,
        role,
        description: expDescription || undefined,
        startDate,
        endDate: currentRole ? null : endDate || undefined,
      };
    }

    try {
      const data = await apiPost('/resumes', payload);
      if (!data.success) {
        setError(data.message || 'Failed to create resume.');
        return;
      }
      navigate(`/resume/${data.data.id}`);
    } catch {
      setError('Network error. Is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 64, maxWidth: 720 }}>
      <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24, display: 'inline-block' }}>
        ← Back to job board
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: 8 }}>Build your resume</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Add your details and one work experience. You can preview and print when you are done.
      </p>

      <form onSubmit={handleSubmit} className="card resume-form-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Personal info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" required value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Address (optional)</label>
              <input className="form-input" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Professional summary (optional)</label>
              <textarea
                className="form-input"
                rows={4}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                className="form-input"
                placeholder="React, TypeScript, Node.js"
                value={skillsText}
                onChange={e => setSkillsText(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Work experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Role / title</label>
              <input className="form-input" value={role} onChange={e => setRole(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-input"
                rows={3}
                value={expDescription}
                onChange={e => setExpDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Start date</label>
                <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">End date</label>
                <input
                  className="form-input"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  disabled={currentRole}
                />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={currentRole} onChange={e => setCurrentRole(e.target.checked)} />
              I currently work here
            </label>
          </div>
        </section>

        {error && <div className="feedback feedback--error">{error}</div>}

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? 'Saving...' : 'Save & preview resume'}
        </button>
      </form>
    </div>
  );
}
