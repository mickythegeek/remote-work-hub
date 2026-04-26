import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../api/jobs';
import type { Job } from '../api/jobs';

const LIMIT = 10;
const CATEGORIES = ['All', 'Software Development', 'Design', 'Marketing', 'Customer Support', 'Sales', 'Product', 'Engineering', 'Data', 'Finance'];

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// ─── Job Row ──────────────────────────────────────────────────────────────────
function JobRow({ job }: { job: Job }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* Company Logo */}
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
        {job.company_logo ? (
          <img
            src={job.company_logo}
            alt={job.company_name}
            className="w-8 h-8 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-xs font-bold text-gray-400">{job.company_name.charAt(0)}</span>
        )}
      </div>

      {/* Job Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 text-sm">{job.title}</span>
          <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
            Remote
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {/* building icon */}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
              <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {job.company_name}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              {/* dollar icon */}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 4.5v7M6.5 6h2.5a1 1 0 1 1 0 2h-1a1 1 0 1 0 0 2H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1">
            {/* clock icon */}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {timeAgo(job.publication_date)}
          </span>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}
        className="flex-shrink-0 px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        View Details
      </button>
    </div>
  );
}

// ─── Pagination Button ────────────────────────────────────────────────────────
function PageBtn({ label, active, disabled, onClick }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-700 text-white' :
          disabled ? 'text-gray-300 cursor-not-allowed' :
            'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {label}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJobs({ page, limit: LIMIT, search, category });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <div
        className="relative px-6 py-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #1e5799 50%, #2980b9 100%)' }}
      >
        {/* subtle background image overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-white text-2xl font-bold leading-snug mb-1">
            Curating the world's most
          </h1>
          <h1 className="text-white text-2xl font-bold leading-snug mb-6">
            elite remote opportunities.
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden shadow-md max-w-xl">
            <div className="flex items-center px-3 text-gray-400 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="m15 15 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Job title or keyword"
              className="flex-1 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <div className="flex items-center border-l border-gray-200 px-2">
              <svg className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 20 20">
                <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPage(1); }}
                className="py-3 pr-2 text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 text-sm transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Job List ── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 font-bold text-lg">Latest Openings</h2>
          <span className="text-sm text-gray-400">
            {loading ? 'Loading…' : `${total} jobs found`}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-7 h-7 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading opportunities…</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-400 text-sm">No jobs found. Try a different search.</p>
            </div>
          ) : (
            jobs.map(job => <JobRow key={job.id} job={job} />)
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <PageBtn label="‹" disabled={page === 1} onClick={() => setPage(p => p - 1)} />
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
              <PageBtn key={i + 1} label={String(i + 1)} active={page === i + 1} onClick={() => setPage(i + 1)} />
            ))}
            {totalPages > 3 && <span className="px-1 text-gray-400 text-sm">…</span>}
            <PageBtn label="›" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-6 mt-4">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-3 text-xs text-gray-400">
          <div className="flex gap-6">
            {['Browse Jobs', 'Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
              <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
            ))}
          </div>
          <span className="font-semibold text-gray-600">The Digital Curator</span>
          <span>© 2024 The Digital Curator. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}