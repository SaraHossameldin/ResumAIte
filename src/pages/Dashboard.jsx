import { Link } from 'react-router-dom';

const STATS = [
  { value: '3', label: 'Resumes' },
  { value: '87%', label: 'ATS Score (avg)' },
  { value: '2', label: 'Collaborators' },
  { value: '12', label: 'AI Suggestions Used' },
];

const RESUMES = [
  { name: 'Software Engineer – Google', updated: '2 hours ago', status: 'complete', score: 92 },
  { name: 'Product Manager – Meta', updated: 'Yesterday', status: 'draft', score: 74 },
  { name: 'General Resume (Base)', updated: '3 days ago', status: 'complete', score: 88 },
];

export default function Dashboard() {
  return (
    <div className="ra-dashboard bg-cream">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <div className="ra-section-label">Dashboard</div>
            <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>Welcome back, Alex 👋</h2>
          </div>
          <Link to="/builder" className="btn-primary-ra">
            <i className="bi bi-plus-lg" /> New Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {STATS.map((s) => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="ra-stat-card">
                <div className="ra-stat-value">{s.value}</div>
                <div className="ra-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Resume list */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0" style={{ fontFamily: 'DM Serif Display, serif' }}>My Resumes</h5>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>3 of 3 (Free plan)</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {RESUMES.map((r) => (
                <div key={r.name} className="ra-resume-item">
                  <div className="ra-resume-thumb">
                    <i className="bi bi-file-text" />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Updated {r.updated}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: r.score >= 85 ? 'var(--sage)' : '#c9963a' }}>
                      ATS {r.score}%
                    </div>
                    <span className={`ra-badge-status ${r.status}`}>{r.status}</span>
                    <Link to="/builder" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '1rem' }}>
                      <i className="bi bi-pencil" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Panel */}
          <div className="col-lg-5">
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.1rem' }}>✨</span>
                <h5 className="mb-0" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem' }}>AI Suggestions</h5>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { tip: 'Replace "Responsible for" with a strong action verb like "Led" or "Drove".', resume: 'SE – Google' },
                  { tip: 'Add quantifiable outcomes: "increased conversion by 23%" is stronger than "improved performance".', resume: 'PM – Meta' },
                  { tip: 'Your skills section lacks cloud platforms — add AWS or GCP if applicable.', resume: 'General Resume' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,150,58,0.25)', borderRadius: 10, padding: '0.9rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {s.resume}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--ink)' }}>{s.tip}</p>
                  </div>
                ))}
              </div>
              <Link to="/builder" className="btn-primary-ra mt-3 w-100" style={{ justifyContent: 'center', fontSize: '0.88rem' }}>
                <i className="bi bi-magic" /> Open AI Builder
              </Link>
            </div>
          </div>
        </div>

        {/* Upgrade banner */}
        <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '2rem', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h5 style={{ color: 'var(--cream)', fontFamily: 'DM Serif Display, serif', marginBottom: '0.3rem' }}>You're on the Free plan</h5>
            <p style={{ color: 'rgba(250,248,244,0.55)', margin: 0, fontSize: '0.88rem' }}>Upgrade to Pro for unlimited resumes, full AI access, and more collaborators.</p>
          </div>
          <Link to="/signup" className="btn-primary-ra" style={{ flexShrink: 0 }}>
            <i className="bi bi-arrow-up-circle" /> Upgrade to Pro — $9/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
