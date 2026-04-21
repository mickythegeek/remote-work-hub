import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bookmark, ArrowRight } from 'lucide-react';
import { apiGet } from '../lib/api';
import { useApp, Job } from '../context/AppContext';

// Remotive categories to populate the filter dropdown
const CATEGORIES = ['All Categories', 'Software Dev', 'Design', 'Marketing', 'Customer Service', 'Data', 'DevOps', 'Finance', 'HR'];

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [featuredJob, setFeaturedJob] = useState<Job | null>(null);
  const { saveJob, removeSavedJob, isJobSaved, authToken } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    apiGet('/jobs?limit=30')
      .then(data => {
        const list: Job[] = data.data || [];
        setJobs(list);
        if (list.length) setFeaturedJob(list[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company_name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || j.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  const secondary = filtered.slice(1, 10);

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
      {/* Hero Section */}
      <section style={{ background: 'var(--bg-base)', padding: '56px var(--space-lg) 48px' }}>
        <div className='space-y-5' style={{ maxWidth: 'var(--container-width)', margin: '0 auto', background: "var(--navy)", padding: '20px', borderRadius: 'var(--radius-md)'}}>
          {/* <span className="chip chip--navy" style={{ marginBottom: 20, display: 'inline-block' }}>ELITE NETWORK</span> */}
          <h1 className="font-manrope  text-6xl font-bold text-white">
            Curating the world's most elite
            remote opportunities.
          </h1>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxWidth: 820, boxShadow: 'var(--shadow-card)', marginTop: "40px"}}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Job title, keywords, or company..."
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: 'var(--text-primary)', width: '100%', padding: '14px 0' }}
              />
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, minWidth: 180 }}>
              <ChevronDown size={16} color="var(--text-muted)" />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', width: '100%' }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn--secondary" style={{ borderRadius: 0, padding: '0 28px' }}>Search Jobs</button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--grid-gap)', alignItems: 'start' }}>

          {/* LEFT: Jobs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Latest Openings</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Hand-picked roles from top-tier organizations.</p>
              </div>
              <span style={{ color: 'var(--accent-blue)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                View all {filtered.length} jobs <ArrowRight size={14} />
              </span>
            </div>

            {loading ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading opportunities...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Featured large card */}
                {featuredJob && (
                  <FeaturedCard
                    job={featuredJob}
                    isSaved={isJobSaved(featuredJob.id)}
                    onSave={() => isJobSaved(featuredJob.id) ? removeSavedJob(featuredJob.id) : saveJob(featuredJob)}
                    onClick={() => goToDetails(featuredJob)}
                  />
                )}

                {/* Compact secondary cards — 3-column grid below featured */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--grid-gap)', marginTop: 'var(--grid-gap)' }}>
                  {secondary.map(job => (
                    <CompactCard
                      key={job.id}
                      job={job}
                      onClick={() => goToDetails(job)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Alert Widget */}
          <div className="card" style={{ padding: 28, background: 'var(--navy)', color: 'white', borderColor: 'transparent' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'white', marginBottom: 12 }}>Get curated alerts</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', marginBottom: 20, lineHeight: 1.6 }}>
              The best remote roles disappear in 48 hours. Don't miss out on your next career leap.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '0.875rem', marginBottom: 12, outline: 'none' }}
            />
            <button className="btn btn--full" style={{ background: 'white', color: 'var(--navy)', fontWeight: 700 }}>Subscribe Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ job, isSaved, onSave, onClick }: { job: Job; isSaved: boolean; onSave: () => void; onClick: () => void }) {
  return (
    <div className="card" style={{ padding: '28px 32px', cursor: 'pointer' }} >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }} onClick={onClick}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, background: 'var(--bg-base)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>💼</div>
            <div>
              <span className="chip chip--blue">{job.category || 'ENGINEERING'}</span>
              <span style={{ marginLeft: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 hours ago</span>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 4 }}>{job.title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 14 }}>{job.company_name}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="chip">🌐 REMOTE</span>
            {job.salary && <span className="chip">💰 {job.salary}</span>}
            <span className="chip">🕐 {job.job_type || 'Full-time'}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {job.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        </div>
        <button onClick={e => { e.stopPropagation(); onSave(); }} style={{ marginLeft: 20, color: isSaved ? 'var(--navy)' : 'var(--text-muted)' }}>
          <Bookmark size={20} fill={isSaved ? 'var(--navy)' : 'none'} />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={onClick} className="btn btn--primary btn--sm">View Details</button>
      </div>
    </div>
  );
}

function CompactCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div className="card" style={{ padding: 20, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, background: 'var(--bg-base)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🏢</div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', lineHeight: 1.3, fontWeight: 600, }}>{job.title}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, }}>{job.company_name}</p>
        </div>
      </div>
      <span className="chip ">{job.category || 'ENGINEERING'}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {job.salary ? <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{job.salary}</span> : <span />}
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          className="btn btn--primary btn--sm"
          style={{ fontSize: '12px' }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
