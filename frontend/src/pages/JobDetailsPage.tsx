import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../api/jobs';
import type { Job } from '../api/jobs';

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
}

const COMPETENCY_ICONS: Record<string, string> = {
  default: '✦', design: '✦', react: '⬡', node: '⬡',
  figma: '◈', research: '◉', typescript: '⬡', tailwind: '✦', system: '◈',
};

function getIcon(label: string): string {
  const key = Object.keys(COMPETENCY_ICONS).find(k => label.toLowerCase().includes(k));
  return key ? COMPETENCY_ICONS[key] : COMPETENCY_ICONS.default;
}

const CORE_COMPETENCIES = [
  { title: 'Editorial Eye', desc: 'Proven ability to manage complex information hierarchies with generous whitespace.' },
  { title: 'Systemic Thinking', desc: 'Deep experience building and maintaining multi-platform design systems using Tailwind.' },
  { title: 'Strategic Empathy', desc: 'Ability to translate user friction into seamless, high-end digital experiences.' },
  { title: 'Prototyping Mastery', desc: 'Expertise in high-fidelity motion and interaction documentation for dev handoff.' },
];

const PERKS = [
  { title: 'Work from Anywhere', desc: 'True location independence across all timezones.' },
  { title: 'Wellness Stipend', desc: '$3,000 annual budget for mental and physical health.' },
  { title: 'Hardware Budget', desc: 'Top-of-the-line MacBook Pro and office setup allowance.' },
  { title: 'Equity Package', desc: 'Meaningful ownership in a high-growth scale-up.' },
];

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchJobById(id)
      .then(setJob)
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">{error ?? 'Something went wrong.'}</p>
          <button onClick={() => navigate('/')} className="text-blue-700 text-sm hover:underline">
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Custom top bar (replaces global navbar) ── */}
      <div className="border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900 text-sm">The Digital Curator</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <img src="https://i.pravatar.cc/36?img=12" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Mobile: Apply button strip */}
        <div className="flex items-center justify-end gap-2 mb-5 lg:hidden">
          <button className="p-2 rounded-lg border border-gray-200 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3.027 3.027 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <button
            onClick={() => setSaved(s => !s)}
            className={`p-2 rounded-lg border transition-colors ${saved ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400'}`}
          >
            <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 20 20">
              <path d="M5 3h10a1 1 0 0 1 1 1v13l-6-3-6 3V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Apply Now
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0 w-full">

            {/* Job Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-8 h-8 object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <span className="text-white text-xs font-bold">{job.company_name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Design Operations
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-4">
                {job.title}
              </h1>

              {/* Meta row — wraps on mobile */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {job.company_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  Remote (Global)
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 4.5v7M6.5 6h2.5a1 1 0 1 1 0 2h-1a1 1 0 1 0 0 2H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {timeAgo(job.publication_date)}
                </span>
              </div>
            </div>

            {/* Role Overview */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-700 rounded-full inline-block flex-shrink-0" />
                Role Overview
              </h2>
              <div
                className="text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: job.description
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
                }}
              />
            </div>

            {/* Core Competencies */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-700 rounded-full inline-block flex-shrink-0" />
                Core Competencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CORE_COMPETENCIES.map(comp => (
                  <div key={comp.title} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div className="text-blue-700 text-lg mb-2">{getIcon(comp.title)}</div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{comp.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            {job.tags?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Tech Stack & Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile: Why Join Us + Hiring Manager */}
            <div className="lg:hidden space-y-4 mb-8">
              <WhyJoinUs />
              <HiringManager />
            </div>
          </div>

          {/* ── Right Sidebar (desktop only) ── */}
          <div className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-4">
            {/* Desktop action buttons */}
            <div className="flex items-center justify-end gap-2">
              <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3.027 3.027 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <button
                onClick={() => setSaved(s => !s)}
                className={`p-2 rounded-lg border transition-colors ${saved ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400 hover:text-blue-700'}`}
              >
                <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 20 20">
                  <path d="M5 3h10a1 1 0 0 1 1 1v13l-6-3-6 3V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Apply Now
              </a>
            </div>
            <WhyJoinUs />
            <HiringManager />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 mt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span className="font-semibold text-gray-600">The Digital Curator</span>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            {['Browse Jobs', 'Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
              <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
            ))}
          </div>
          <span>© 2024 The Digital Curator. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Extracted sidebar components ─────────────────────────────────────────────

function WhyJoinUs() {
  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-white">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Why Join Us?</h3>
      <div className="space-y-4">
        {PERKS.map(perk => (
          <div key={perk.title} className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-blue-700" fill="none" viewBox="0 0 16 16">
                <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6A4.5 4.5 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{perk.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HiringManager() {
  return (
    <div className="border border-blue-100 rounded-xl p-5 bg-blue-50">
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Hiring Manager</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img src="https://i.pravatar.cc/40?img=12" alt="Julian Vane" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Julian Vane</p>
          <p className="text-xs text-gray-500">Head of Design Architecture</p>
        </div>
      </div>
      <button className="w-full border border-blue-200 text-blue-700 text-xs font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors">
        View LinkedIn Profile
      </button>
    </div>
  );
}