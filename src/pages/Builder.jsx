import { useState } from 'react';

const SUGGESTIONS = [
  { field: 'summary', text: 'Start with a strong role title, e.g. "Results-driven Software Engineer with 3 years…"' },
  { field: 'experience', text: 'Use the STAR format: Situation, Task, Action, Result for each bullet.' },
  { field: 'skills', text: 'Add in-demand keywords: React, Node.js, Docker, REST APIs.' },
];

export default function Builder() {
  const [form, setForm] = useState({
    name: '', title: '', email: '', phone: '', location: '',
    summary: '', experience: '', education: '', skills: '',
  });
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  return (
    <div style={{ minHeight: 'calc(100vh - 62px)', background: 'var(--cream)' }}>
      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem' }}>Resume Builder</span>
          <span style={{ background: 'var(--sage-pale)', color: 'var(--sage)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.5px' }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {saved && (
            <span style={{ fontSize: '0.82rem', color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <i className="bi bi-check2-circle" /> Saved
            </span>
          )}
          <button onClick={handleSave} className="btn-primary-ra" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
            <i className="bi bi-floppy" /> Save Draft
          </button>
          <button className="btn-ghost-ra" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', color: 'var(--ink)', borderColor: 'var(--border)' }}>
            <i className="bi bi-download" /> Export PDF
          </button>
        </div>
      </div>

      {/* Editor + Preview split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 120px)', gap: 0 }} className="builder-grid">
        {/* Left: Editor */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '2rem' }}>
          <h6 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--muted)' }}>
            <i className="bi bi-pencil-square me-2" />Editor
          </h6>

          {/* Personal Info */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '1rem' }}>Personal Info</div>
            <div className="row g-3">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Alex Johnson', col: 12 },
                { key: 'title', label: 'Job Title', placeholder: 'Software Engineer', col: 12 },
                { key: 'email', label: 'Email', placeholder: 'alex@email.com', col: 6 },
                { key: 'phone', label: 'Phone', placeholder: '+1 555 0100', col: 6 },
                { key: 'location', label: 'Location', placeholder: 'San Francisco, CA', col: 12 },
              ].map(({ key, label, placeholder, col }) => (
                <div key={key} className={`col-${col}`}>
                  <label className="ra-label">{label}</label>
                  <input className="ra-input" placeholder={placeholder} value={form[key]} onChange={set(key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sage)' }}>Summary</div>
              <button onClick={() => setActiveSuggestion(activeSuggestion === 'summary' ? null : 'summary')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ✨ AI Tip
              </button>
            </div>
            {activeSuggestion === 'summary' && (
              <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,150,58,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.83rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                {SUGGESTIONS.find(s => s.field === 'summary')?.text}
              </div>
            )}
            <textarea className="ra-input" rows={4} placeholder="Brief professional summary…" value={form.summary} onChange={set('summary')} style={{ resize: 'vertical' }} />
          </div>

          {/* Experience */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sage)' }}>Experience</div>
              <button onClick={() => setActiveSuggestion(activeSuggestion === 'experience' ? null : 'experience')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ✨ AI Tip
              </button>
            </div>
            {activeSuggestion === 'experience' && (
              <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,150,58,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.83rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                {SUGGESTIONS.find(s => s.field === 'experience')?.text}
              </div>
            )}
            <textarea className="ra-input" rows={5} placeholder="Job title, Company · Date range&#10;• Bullet point achievements…" value={form.experience} onChange={set('experience')} style={{ resize: 'vertical' }} />
          </div>

          {/* Education + Skills */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.75rem' }}>Education</div>
            <textarea className="ra-input" rows={3} placeholder="Degree, University · Graduation Year" value={form.education} onChange={set('education')} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sage)' }}>Skills</div>
              <button onClick={() => setActiveSuggestion(activeSuggestion === 'skills' ? null : 'skills')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ✨ AI Tip
              </button>
            </div>
            {activeSuggestion === 'skills' && (
              <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,150,58,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.83rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                {SUGGESTIONS.find(s => s.field === 'skills')?.text}
              </div>
            )}
            <input className="ra-input" placeholder="React, Node.js, Python, Docker…" value={form.skills} onChange={set('skills')} />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div style={{ overflowY: 'auto', padding: '2rem', background: '#f0ede8' }}>
          <h6 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--muted)' }}>
            <i className="bi bi-eye me-2" />Live Preview
          </h6>
          <div style={{ background: 'white', borderRadius: 12, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', minHeight: 700, fontFamily: 'Georgia, serif' }}>
            {form.name ? (
              <>
                <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '-0.5px' }}>{form.name}</h3>
                  {form.title && <div style={{ color: 'var(--sage)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 500 }}>{form.title}</div>}
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {form.email && <span><i className="bi bi-envelope me-1" />{form.email}</span>}
                    {form.phone && <span><i className="bi bi-telephone me-1" />{form.phone}</span>}
                    {form.location && <span><i className="bi bi-geo-alt me-1" />{form.location}</span>}
                  </div>
                </div>
                {form.summary && <Section label="Summary" content={form.summary} />}
                {form.experience && <Section label="Experience" content={form.experience} />}
                {form.education && <Section label="Education" content={form.education} />}
                {form.skills && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.5rem' }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {form.skills.split(',').map((s, i) => s.trim() && (
                        <span key={i} style={{ background: 'var(--sage-pale)', color: 'var(--sage)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: 100, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--muted)', textAlign: 'center' }}>
                <i className="bi bi-file-person" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }} />
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>Start typing to see your resume here</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .builder-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ label, content }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  );
}
