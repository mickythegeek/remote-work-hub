import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ActivityType } from '../api/jobs';
import { DUMMY_DASHBOARD } from '../data/dummy';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
}

// ─── Extended dummy activity data ─────────────────────────────────────────────
const ALL_ACTIVITY: ActivityItem[] = [
    ...DUMMY_DASHBOARD.recentActivity,
    {
        id: '5',
        type: 'APPLIED',
        title: 'Application Submitted',
        description: 'Your application to Stripe was successfully delivered.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    },
    {
        id: '6',
        type: 'INTERVIEW',
        title: 'Interview Scheduled',
        description: 'Notion has scheduled a product design interview for next Tuesday at 2PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    },
    {
        id: '7',
        type: 'REJECTED',
        title: 'Application Update',
        description: 'Shopify has decided to move forward with other candidates.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
        id: '8',
        type: 'OFFER',
        title: 'Offer Received',
        description: 'Vercel has extended an official offer. Please review the terms.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
        id: '9',
        type: 'APPLIED',
        title: 'Application Submitted',
        description: 'Your application to Loom was successfully delivered.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    },
    {
        id: '10',
        type: 'INTERVIEW',
        title: 'Technical Round Invite',
        description: 'Retool has invited you for a system design technical interview.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const FILTERS: { label: string; value: ActivityType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Interviews', value: 'INTERVIEW' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Offers', value: 'OFFER' },
    { label: 'Rejected', value: 'REJECTED' },
];

const ACTIVITY_STYLE: Record<ActivityType, { bg: string; text: string; label: string }> = {
    INTERVIEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'INTERVIEW' },
    APPLIED: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'APPLIED' },
    OFFER: { bg: 'bg-green-100', text: 'text-green-700', label: 'OFFER' },
    REJECTED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'REJECTED' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getDateGroup(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.floor(diff / 3_600_000);
    if (hrs < 24) return 'Today';
    if (hrs < 48) return 'Yesterday';
    return 'Earlier';
}

function groupByDate(items: ActivityItem[]): Record<string, ActivityItem[]> {
    const groups: Record<string, ActivityItem[]> = {};
    for (const item of items) {
        const group = getDateGroup(item.timestamp);
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
    }
    return groups;
}

// ─── Activity Icon ────────────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: ActivityType }) {
    if (type === 'INTERVIEW') return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
    if (type === 'APPLIED') return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M8 2v9M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
    if (type === 'OFFER') return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────
function ActivityRow({ item }: { item: ActivityItem }) {
    const style = ACTIVITY_STYLE[item.type];
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
            {/* Circular icon */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg} ${style.text}`}>
                <ActivityIcon type={item.type} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 font-medium whitespace-nowrap">
                        {formatTime(item.timestamp)}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${style.bg} ${style.text}`}>
                    {style.label}
                </span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ActivityPage() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<ActivityType | 'ALL'>('ALL');

    const filtered = activeFilter === 'ALL'
        ? ALL_ACTIVITY
        : ALL_ACTIVITY.filter(a => a.type === activeFilter);

    const grouped = groupByDate(filtered);
    const groupOrder = ['Today', 'Yesterday', 'Earlier'];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Activity Feed</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Your complete job search history</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setActiveFilter(f.value)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${activeFilter === f.value
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-200 hover:text-blue-700'
                                }`}
                        >
                            {f.label}
                            {f.value !== 'ALL' && (
                                <span className={`ml-1.5 text-[10px] font-bold ${activeFilter === f.value ? 'opacity-70' : 'text-gray-400'}`}>
                                    {ALL_ACTIVITY.filter(a => a.type === f.value).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Activity Groups */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center shadow-sm">
                        <p className="text-gray-300 text-4xl mb-3">📭</p>
                        <p className="text-gray-500 font-medium text-sm">No activity found</p>
                        <p className="text-gray-400 text-xs mt-1">Try a different filter</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupOrder.map(group => {
                            const items = grouped[group];
                            if (!items?.length) return null;
                            return (
                                <div key={group}>
                                    {/* Date label */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {group}
                                        </span>
                                        <div className="flex-1 h-px bg-gray-100" />
                                        <span className="text-xs text-gray-300">{items.length}</span>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5">
                                        {items.map(item => (
                                            <ActivityRow key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Load more — placeholder for when API is connected */}
                {filtered.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="text-sm text-gray-400 hover:text-blue-700 font-medium transition-colors">
                            Load more activity
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-6 mt-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                    <span className="font-semibold text-gray-500">The Digital Curator</span>
                    <div className="flex flex-wrap justify-center gap-4">
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