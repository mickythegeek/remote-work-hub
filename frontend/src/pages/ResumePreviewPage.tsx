import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiGet } from '../lib/api';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
}

interface Resume {
  id: string;
  title: string;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  summary: string | null;
  skills: string[];
  experiences: Experience[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { authToken } = useApp();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) {
      navigate('/auth', { replace: true, state: { redirectTo: `/resume/${id}` } });
      return;
    }
    if (!id) return;

    apiGet(`/resumes/${id}`)
      .then(data => {
        if (!data.success) {
          setError(data.message || 'Could not load resume.');
          return;
        }
        setResume(data.data);
      })
      .catch(() => setError('Network error. Is the API server running?'))
      .finally(() => setLoading(false));
  }, [authToken, id, navigate]);

  if (!authToken) return null;

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 64, textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading resume...
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container" style={{ paddingTop: 64, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error || 'Resume not found.'}</p>
        <Link to="/resume" className="btn btn--primary">Create a resume</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 'calc(100vh - 60px)', paddingBottom: 64 }}>
      <div className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Link to="/resume" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            ← Edit / new resume
          </Link>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => window.print()}>
            Print / Save PDF
          </button>
        </div>

        <article
          className="card resume-preview-card"
          style={{
            padding: 48,
            maxWidth: 800,
            margin: '0 auto',
            background: 'white',
          }}
        >
          <header className="resume-preview-header" style={{ borderBottom: '2px solid var(--navy)', paddingBottom: 20, marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', marginBottom: 8 }}>
              {resume.fullName}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {resume.email} · {resume.phone}
              {resume.address ? ` · ${resume.address}` : ''}
            </p>
          </header>

          {resume.summary && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 10 }}>
                Summary
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{resume.summary}</p>
            </section>
          )}

          {resume.skills.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 10 }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {resume.skills.map(skill => (
                  <span key={skill} className="chip chip--blue">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {resume.experiences.length > 0 && (
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 16 }}>
                Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {resume.experiences.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: '1rem' }}>{exp.role}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--navy)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>{exp.company}</p>
                    {exp.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
