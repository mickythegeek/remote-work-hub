import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, DollarSign, Clock, Bookmark, Share2, Globe, Gift, Monitor, Pencil, Code2, LayoutDashboard } from 'lucide-react';
import { useApp, Job } from '../context/AppContext';

// Core competency icons mapped to keywords
const COMPETENCY_ICONS: Record<string, JSX.Element> = {
  default: <Code2 size={16} />,
  design: <Pencil size={16} />,
  tailwind: <Code2 size={16} />,
  information: <LayoutDashboard size={16} />,
};

function getCompIcon(label: string) {
  const key = Object.keys(COMPETENCY_ICONS).find(k => label.toLowerCase().includes(k));
  return key ? COMPETENCY_ICONS[key] : COMPETENCY_ICONS.default;
}

// Parse basic competencies out of the HTML job description
function extractCompetencies(description: string): string[] {
  const clean = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const keywords = ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'Design Systems', 'Figma', 'Leadership', 'Communication'];
  return keywords.filter(k => clean.toLowerCase().includes(k.toLowerCase())).slice(0, 4);
}

export default function JobDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveJob, removeSavedJob, isJobSaved, authToken } = useApp();

  // Job is passed via router state from the Job Board
  const job: Job | undefined = location.state?.job;

  // Protect job details behind auth. If someone pastes the URL, send them to auth.
  useEffect(() => {
    if (authToken) return;
    navigate('/auth', { replace: true, state: { redirectTo: location.pathname, job } });
  }, [authToken, navigate, location.pathname, job]);

  if (!authToken) return null;

  // Graceful fallback if user lands directly on the URL without state
  if (!job) {
    return (
      <div className="container" style={{ paddingTop: 64, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Job not found. Please return to the board.</p>
        <Link to="/" className="btn btn--primary">← Back to Job Board</Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const competencies = extractCompetencies(job.description || '');
  const postedDate = job.publication_date
    ? new Date(job.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '2 days ago';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }}>
      {/* Back nav */}
      <div className="container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: 28 }}
        >
          <ArrowLeft size={16} /> Back to job board
        </button>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* ======== LEFT COLUMN ======== */}
          <div>
            {/* Job Header */}
            <div style={{ marginBottom: 32 }}>
              <span className="chip chip--blue" style={{ marginBottom: 16, display: 'inline-block' }}>
                {job.job_type?.toUpperCase() || 'FULL-TIME'}
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                lineHeight: 1.15,
                color: 'var(--navy)',
                marginBottom: 20,
              }}>
                {job.title}
              </h1>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}>
                  <Building2 size={16} color="var(--text-muted)" /> {job.company_name}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <MapPin size={15} color="var(--text-muted)" /> {job.candidate_required_location || 'Remote'}
                </span>
                {job.salary && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <DollarSign size={15} color="var(--text-muted)" /> {job.salary}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Clock size={15} /> Posted {postedDate}
                </span>
              </div>
            </div>

            {/* Role Overview */}
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                marginBottom: 20,
                paddingLeft: 16,
                borderLeft: '3px solid var(--navy)',
              }}>
                Role Overview
              </h2>
              <div
                style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{
                  __html: job.description
                    // Strip scripts/iframes for safety, keep formatting tags
                    ?.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
                    || '<p>No description available.</p>'
                }}
              />
            </div>

            {/* Company Card */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                  🏢
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>About {job.company_name}</h3>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
                {job.company_name} is a forward-thinking organization building remote-first products for a distributed world. They invest in people, process, and culture.
              </p>
              <button className="btn btn--secondary btn--sm">View Company Profile</button>
            </div>
          </div>

          {/* ======== RIGHT COLUMN (sticky) ======== */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* CTA Card */}
            <div className="card" style={{ padding: 24 }}>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary btn--full"
                style={{ marginBottom: 12, fontSize: '1rem', padding: '14px 24px' }}
              >
                Apply Now
              </a>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => saved ? removeSavedJob(job.id) : saveJob(job)}
                  className="btn btn--secondary"
                  style={{ flex: 1, gap: 8, color: saved ? 'var(--navy)' : undefined, borderColor: saved ? 'var(--navy)' : undefined }}
                >
                  <Bookmark size={16} fill={saved ? 'var(--navy)' : 'none'} />
                  {saved ? 'Saved' : 'Save Job'}
                </button>
                <button className="btn btn--secondary" style={{ flex: 1, gap: 8 }}>
                  <Share2 size={16} /> Share
                </button>
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center' }}>
                  Are you a good fit for {job.company_name}?
                </p>
                {/* Placeholder avatars */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: -8 }}>
                  {['👤', '👤', '👤'].map((a, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${i * 60 + 200}, 60%, 60%)`, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                      {a}
                    </div>
                  ))}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 10 }}>+12 from your network</span>
                </div>
              </div>
            </div>

            {/* Core Competencies */}
            {competencies.length > 0 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 16 }}>Core Competencies</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {competencies.map(comp => (
                    <div key={comp} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      <div style={{ color: 'var(--navy)', flexShrink: 0 }}>{getCompIcon(comp)}</div>
                      {comp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Join Us */}
            <div className="card" style={{ padding: 24, background: 'var(--navy)', color: 'white', borderColor: 'transparent' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', marginBottom: 16 }}>Why Join Us?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <Globe size={16} />, title: 'Work from Anywhere', sub: 'Global remote freedom' },
                  { icon: <Gift size={16} />, title: 'Wellness Stipend', sub: '$2k annual allowance' },
                  { icon: <Monitor size={16} />, title: 'Latest Equipment', sub: 'Top-tier tech setup' },
                ].map(({ icon, title, sub }) => (
                  <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{title}</p>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
