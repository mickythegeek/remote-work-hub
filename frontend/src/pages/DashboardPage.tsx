import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bookmark, LayoutGrid } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchDashboard } from '../api/jobs';
import type { DashboardData, ActivityType } from '../api/jobs';

const ACTIVITY_STYLE: Record<ActivityType, { bg: string; text: string; label: string }> = {
    INTERVIEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'INTERVIEW' },
    APPLIED: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'APPLIED' },
    OFFER: { bg: 'bg-green-100', text: 'text-green-700', label: 'OFFER' },
    REJECTED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'REJECTED' },
};

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}H AGO`;
    if (hrs < 48) return 'YESTERDAY';
    return `${Math.floor(hrs / 24)}D AGO`;
}

function StatCard({ label, value, badge }: { label: string; value: number; badge?: string }) {
    return (
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {badge && (
                    <span className="mb-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <p className="text-gray-400 mb-0.5">{label}</p>
            <p className="font-semibold">{payload[0].value} applications</p>
        </div>
    );
}

function ActivityIcon({ type }: { type: ActivityType }) {
    if (type === 'INTERVIEW') return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
    if (type === 'APPLIED') return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <path d="M8 2v9M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
    if (type === 'OFFER') return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard()
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const { user, stats, weeklyData, recentActivity } = data;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Greeting */}
                <div className="border border-dashed border-blue-200 rounded-lg px-6 py-5 mb-5">
                    <h1 className="text-3xl font-bold text-gray-900">Good morning, {user.name}</h1>
                    <p className="text-sm text-gray-400 mt-1">Your workspace is ready for today's focus.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
                    <StatCard label="Total Applications" value={stats.totalApplications} />
                    <StatCard label="Applied" value={stats.applied} />
                    <StatCard label="Interviewing" value={stats.interviewing} badge="ACTIVE" />
                    <StatCard label="Offers" value={stats.offers} />
                </div>

                {/* Main Panel */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-5">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:divide-x divide-gray-200">

                        {/* Weekly Chart */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h2 className="font-bold text-gray-900 text-sm">Weekly Engagement</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Job search activity over the last 7 days</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" />
                                    Applications
                                </div>
                            </div>
                            <div className="h-44 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weeklyData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.12} />
                                                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="applications" stroke="#1d4ed8" strokeWidth={2} fill="url(#grad)"
                                            dot={{ fill: '#1d4ed8', strokeWidth: 0, r: 3 }}
                                            activeDot={{ r: 5, fill: '#1d4ed8' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900 text-sm">Recent Activity</h2>
                                <button onClick={() => navigate('/activity')} className="text-xs text-blue-700 hover:underline font-semibold">View All</button>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map(item => {
                                    const style = ACTIVITY_STYLE[item.type];
                                    return (
                                        <div key={item.id} className="flex gap-3">
                                            {/* Circular icon matching Figma */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg} ${style.text}`}>
                                                <ActivityIcon type={item.type} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-xs font-bold text-gray-800 leading-tight">{item.title}</p>
                                                    <span className="text-[10px] text-gray-400 flex-shrink-0 font-semibold">{timeAgo(item.timestamp)}</span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                                                <span className={`inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                    {style.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions — equal cards, icon above label */}
                    <div className="border-t border-gray-200 grid grid-cols-3 divide-x divide-gray-200">
                        <button
                            onClick={() => navigate('/')}
                            className="flex flex-col items-start gap-3 px-4 sm:px-6 py-5 bg-blue-800 hover:bg-blue-900 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
                                <Search size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-white text-xs sm:text-sm">Browse Jobs</span>
                        </button>
                        <button
                            onClick={() => navigate('/saved')}
                            className="flex flex-col items-start gap-3 px-4 sm:px-6 py-5 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Bookmark size={16} className="text-gray-500" />
                            </div>
                            <span className="font-semibold text-gray-700 text-xs sm:text-sm">Saved Jobs</span>
                        </button>
                        <button
                            onClick={() => navigate('/tracker')}
                            className="flex flex-col items-start gap-3 px-4 sm:px-6 py-5 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <LayoutGrid size={16} className="text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-700 text-xs sm:text-sm">Open Tracker</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-6">
                <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                    <div className="flex gap-5">
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