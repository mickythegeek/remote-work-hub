import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bookmark, ArrowLeft } from 'lucide-react';
import { apiGet } from '../lib/api';
import { useApp, Job } from '../context/AppContext';

const CATEGORIES = ['All Categories', 'Software Dev', 'Design', 'Marketing', 'Customer Service', 'Data', 'DevOps', 'Finance', 'HR'];

export default function AllJobsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const { saveJob, removeSavedJob, isJobSaved, authToken } = useApp();

  // Initialize filters from location state or query params
  useEffect(() => {
    if (location.state?.search) setSearch(location.state.search);
    if (location.state?.category) setCategory(location.state.category);
  }, [location.state]);

  // Fetch all jobs
  useEffect(() => {
    apiGet('/jobs?limit=500')
      .then(data => {
        setJobs(data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company_name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || j.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  const goToDetails = (job: Job) => {
    const to = `/jobs/${job.id}`;
    if (!authToken) {
      navigate('/auth', { state: { redirectTo: to, job, from: location.pathname } });
      return;
    }
    navigate(to, { state: { job } });
  };

  return (
    <div>
      {/* Header Section */}
      <section style={{ background: 'var(--bg-base)', padding: '40px var(--space-lg)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-4xl font-bold">All Job Listings</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            {filtered.length} {filtered.length === 1 ? 'position' : 'positions'} matching your filters
          </p>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flex: 1, minWidth: 300, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, keywords, or company..."
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: 'var(--text-primary)', width: '100%', padding: '12px 0' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', minWidth: 180, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, width: '100%' }}>
                <ChevronDown size={16} color="var(--text-muted)" />
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', width: '100%' }}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {loading ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            No jobs found matching your criteria. Try adjusting your search or filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtered.map(job => (
              <JobRow key={job.id} job={job} onClick={() => goToDetails(job)} isSaved={isJobSaved(job.id)} onSave={() => isJobSaved(job.id) ? removeSavedJob(job.id) : saveJob(job)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobRow({ job, onClick, isSaved, onSave }: { job: Job; onClick: () => void; isSaved: boolean; onSave: () => void }) {
  return (
    <div className="card" style={{ padding: '20px 24px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', borderRadius: 0 }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: 'var(--bg-base)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src={job.company_logo}
              alt="company logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>{job.title}</h3>
              <span className="chip chip--blue">{job.category || 'ENGINEERING'}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, marginBottom: 8 }}>{job.company_name}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🌐 REMOTE</span>
              {job.salary && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💰 {job.salary}</span>}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🕐 {job.job_type || 'Full-time'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onSave(); }}
          style={{ marginLeft: 12, color: isSaved ? 'var(--navy)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          <Bookmark size={20} fill={isSaved ? 'var(--navy)' : 'none'} style={{ cursor: 'pointer' }} />
        </button>
      </div>
    </div>
  );
}
