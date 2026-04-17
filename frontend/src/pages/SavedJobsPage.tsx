import { Trash2, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SavedJobsPage() {
  const { savedJobs, removeSavedJob } = useApp();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem' }}>Saved Jobs</h1>
        <span style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '2px 12px',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
        }}>
          {savedJobs.length}
        </span>
      </div>

      {savedJobs.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No saved jobs yet. Browse the Job Board to bookmark roles.</p>
          <button onClick={() => navigate('/')} className="btn btn--primary" style={{ marginTop: 20 }}>Browse Jobs</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--grid-gap)' }}>
          {savedJobs.map(job => (
            <div key={job.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, background: 'var(--bg-base)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏢</div>
                <button onClick={() => removeSavedJob(job.id)} style={{ color: 'var(--text-muted)' }}>
                  <Trash2 size={17} />
                </button>
              </div>

              {/* Job Info */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', lineHeight: 1.3, marginBottom: 4 }}>{job.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 8 }}>{job.company_name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <MapPin size={12} />
                  {job.candidate_required_location || 'Remote, Worldwide'}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {job.job_type && <span className="chip">{job.job_type}</span>}
                {job.salary && <span className="chip">{job.salary}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                <button className="btn btn--primary btn--full" onClick={() => navigate('/')} style={{ gap: 8 }}>
                  Move to Tracker <ArrowRight size={15} />
                </button>
                <button className="btn btn--secondary btn--full" style={{ fontSize: '0.85rem' }}>
                  View Job Description
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
