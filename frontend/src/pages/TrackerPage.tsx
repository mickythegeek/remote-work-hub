import { useState } from 'react';
import { Plus, X, Calendar, Info, CheckCircle2, XCircle } from 'lucide-react';

type Stage = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

interface Application {
  id: string;
  company: string;
  role: string;
  stage: Stage;
  date: string;
  note?: string;
  noteType?: 'info' | 'warning' | 'success' | 'danger';
}

const STAGES: Stage[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

const STAGE_STYLE: Record<Stage, { label: string; color: string; bg: string }> = {
  Applied: { label: 'APPLIED', color: 'var(--text-secondary)', bg: 'var(--bg-base)' },
  Interview: { label: 'INTERVIEW', color: 'var(--text-secondary)', bg: 'var(--bg-base)' },
  Offer: { label: 'OFFER', color: 'var(--text-secondary)', bg: 'var(--bg-base)' },
  Rejected: { label: 'REJECTED', color: 'var(--text-muted)', bg: 'var(--bg-base)' },
};

const DEMO: Application[] = [
  { id: '1', company: 'Stripe', role: 'Product Designer', stage: 'Applied', date: 'Oct 12, 2023', note: 'Waiting for response', noteType: 'info' },
  { id: '2', company: 'Airbnb', role: 'Senior UX Engineer', stage: 'Applied', date: 'Oct 10, 2023', note: 'Referred by Jane Doe', noteType: 'info' },
  { id: '3', company: "Sotheby's Digital", role: 'Lead Curator', stage: 'Interview', date: 'Oct 24, 2023', note: 'Interview tomorrow at 10AM', noteType: 'warning' },
  { id: '4', company: 'Linear', role: 'Visual Architect', stage: 'Interview', date: 'Oct 28, 2023', note: 'Round 2: Portfolio Review', noteType: 'info' },
  { id: '5', company: 'Figma', role: 'Design Principal', stage: 'Offer', date: 'Oct 20, 2023', note: 'Awaiting signature', noteType: 'success' },
  { id: '6', company: 'Apple', role: 'Interface Specialist', stage: 'Rejected', date: 'Oct 05, 2023', note: 'Position filled internally', noteType: 'danger' },
];

const NOTE_STYLE: Record<string, { bg: string; color: string; icon: JSX.Element }> = {
  info: { bg: '#EFF6FF', color: 'var(--accent-blue)', icon: <Info size={13} /> },
  warning: { bg: '#FFFBEB', color: '#92400E', icon: <Calendar size={13} /> },
  success: { bg: '#ECFDF5', color: '#065F46', icon: <CheckCircle2 size={13} /> },
  danger: { bg: '#FEF2F2', color: '#991B1B', icon: <XCircle size={13} /> },
};

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>(DEMO);
  const [addingTo, setAddingTo] = useState<Stage | null>(null);
  const [newCo, setNewCo] = useState('');
  const [newRole, setNewRole] = useState('');

  const total = apps.length;
  const remove = (id: string) => setApps(p => p.filter(a => a.id !== id));

  const add = (stage: Stage) => {
    if (!newCo || !newRole) return;
    setApps(p => [...p, { id: Date.now().toString(), company: newCo, role: newRole, stage, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]);
    setNewCo(''); setNewRole(''); setAddingTo(null);
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem' }}>Application Pipeline</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Managing {total} active opportunities across the globe.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAddingTo('Applied')} style={{ gap: 8 }}>
          <Plus size={18} /> Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--grid-gap)' }}>
        {STAGES.map(stage => {
          const stageApps = apps.filter(a => a.stage === stage);
          const isRejected = stage === 'Rejected';
          return (
            <div key={stage}>
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: isRejected ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                  {STAGE_STYLE[stage].label}
                </span>
                <span style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', padding: '1px 9px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {stageApps.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stageApps.map(app => (
                  <AppCard key={app.id} app={app} isRejected={isRejected} onRemove={() => remove(app.id)} />
                ))}

                {/* Add form / button */}
                {addingTo === stage ? (
                  <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input className="form-input" type="text" placeholder="Company" value={newCo} onChange={e => setNewCo(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.875rem' }} />
                    <input className="form-input" type="text" placeholder="Role" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.875rem' }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn--primary btn--sm" style={{ flex: 1 }} onClick={() => add(stage)}>Add</button>
                      <button className="btn btn--secondary btn--sm" onClick={() => setAddingTo(null)}><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(stage)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px 0', opacity: 0.7 }}
                  >
                    <Plus size={14} /> Add entry
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AppCard({ app, isRejected, onRemove }: { app: Application; isRejected: boolean; onRemove: () => void }) {
  const noteStyle = app.noteType ? NOTE_STYLE[app.noteType] : null;
  return (
    <div className="card" style={{ padding: 20, opacity: isRejected ? 0.7 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: isRejected ? 'var(--text-muted)' : 'var(--navy)', lineHeight: 1.3 }}>{app.role}</h4>
        <button onClick={onRemove} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1, marginLeft: 8 }}>···</button>
      </div>
      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: isRejected ? 'var(--text-muted)' : 'var(--text-primary)', marginBottom: 4 }}>{app.company}</p>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
        {app.stage === 'Applied' ? 'Applied' : app.stage === 'Interview' ? 'Interview' : app.stage === 'Offer' ? 'Received' : 'Rejected'} {app.date}
      </p>
      {noteStyle && app.note && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: noteStyle.bg, color: noteStyle.color, borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 500 }}>
          {noteStyle.icon} {app.note}
        </div>
      )}
    </div>
  );
}
