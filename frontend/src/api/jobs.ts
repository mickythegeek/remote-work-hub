import { DUMMY_JOBS, DUMMY_DASHBOARD } from '../data/dummy';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Job {
    id: string;
    title: string;
    company_name: string;
    company_logo?: string;
    category: string;
    salary?: string;
    candidate_required_location?: string;
    publication_date: string;
    url: string;
    description: string;
    tags: string[];
}

export interface JobsResponse {
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
}

export interface FetchJobsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

export type ActivityType = 'INTERVIEW' | 'APPLIED' | 'OFFER' | 'REJECTED';

export interface DashboardData {
    user: { name: string };
    stats: { totalApplications: number; applied: number; interviewing: number; offers: number };
    weeklyData: { day: string; applications: number }[];
    recentActivity: { id: string; type: ActivityType; title: string; description: string; timestamp: string }[];
}

// ─── Feature flag ─────────────────────────────────────────────────────────────
// Set VITE_USE_DUMMY_DATA=true in .env to use dummy data
// Remove when backend is ready
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── fetchJobs ────────────────────────────────────────────────────────────────
export async function fetchJobs(params: FetchJobsParams = {}): Promise<JobsResponse> {
    if (USE_DUMMY) {
        const { page = 1, limit = 10, search = '', category = 'All' } = params;
        let filtered = DUMMY_JOBS;
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company_name.toLowerCase().includes(q) ||
                j.tags.some(t => t.toLowerCase().includes(q))
            );
        }
        if (category && category !== 'All') {
            filtered = filtered.filter(j => j.category.toLowerCase().includes(category.toLowerCase()));
        }
        const start = (page - 1) * limit;
        return { jobs: filtered.slice(start, start + limit), total: filtered.length, page, limit };
    }

    const url = new URL(`${API_BASE}/api/jobs`);
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.limit) url.searchParams.set('limit', String(params.limit));
    if (params.search) url.searchParams.set('search', params.search);
    if (params.category && params.category !== 'All') url.searchParams.set('category', params.category);
    const res = await fetch(url.toString(), { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

// ─── fetchJobById ─────────────────────────────────────────────────────────────
export async function fetchJobById(id: string): Promise<Job> {
    if (USE_DUMMY) {
        const job = DUMMY_JOBS.find(j => j.id === id);
        if (!job) throw new Error('Job not found');
        return job;
    }
    const res = await fetch(`${API_BASE}/api/jobs/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Job not found');
    return res.json();
}

// ─── fetchDashboard ───────────────────────────────────────────────────────────
export async function fetchDashboard(): Promise<DashboardData> {
    if (USE_DUMMY) return DUMMY_DASHBOARD;
    const res = await fetch(`${API_BASE}/api/dashboard`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
}