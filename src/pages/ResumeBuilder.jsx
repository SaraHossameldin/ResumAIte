import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

const SECTIONS = [
  { key: "summary", label: "Summary", placeholder: "Brief professional summary…", type: "textarea", rows: 4 },
  { key: "experience", label: "Experience", placeholder: "Software Engineer at Acme Corp · 2022–Present\n• Led a team of 5 engineers\n• Built scalable APIs serving 1M+ users", type: "textarea", rows: 6 },
  { key: "education", label: "Education", placeholder: "B.Sc. Computer Science · Cairo University · 2022", type: "textarea", rows: 3 },
  { key: "skills", label: "Skills", placeholder: "React, Node.js, Python, PostgreSQL, Docker…", type: "input" }
];

function CoachHighlight({ edits, field }) {
  const fieldEdits = edits.filter(e => e.field === field && !e.seenByApplicant);
  if (!fieldEdits.length) return null;
  return (
    <div style={{
      background: "rgba(201,150,58,0.1)", border: "1.5px solid var(--gold)", borderRadius: 10,
      padding: "0.85rem 1rem", marginBottom: "0.75rem", animation: "pulse-gold 2s ease-in-out infinite"
    }}>
      {fieldEdits.map((e, i) => (
        <div key={i} style={{ marginBottom: i < fieldEdits.length - 1 ? "0.75rem" : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <i className="bi bi-stars" style={{ color: "var(--gold)", fontSize: "0.9rem" }} />
            <span style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--gold)" }}>
              Coach {e.coachName} suggested:
            </span>
          </div>
          {e.note && (
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.35rem" }}>
              "{e.note}"
            </div>
          )}
          {e.oldValue && (
            <div style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "#dc2626", background: "rgba(220,38,38,0.06)", padding: "1px 4px", borderRadius: 4 }}>
                — {e.oldValue.slice(0, 120)}{e.oldValue.length > 120 ? "…" : ""}
              </span>
            </div>
          )}
          <div style={{ fontSize: "0.8rem" }}>
            <span style={{ color: "var(--sage)", background: "rgba(61,107,79,0.06)", padding: "1px 4px", borderRadius: 4 }}>
              + {e.newValue.slice(0, 120)}{e.newValue.length > 120 ? "…" : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewSection({ label, content }) {
  if (!content) return null;
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{content}</div>
    </div>
  );
}

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({
    title: "", fullName: "", email: "", phone: "", location: "", jobTitle: "",
    summary: "", experience: "", education: "", skills: "", status: "draft"
  });
  const [coachEdits, setCoachEdits] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [markingRead, setMarkingRead] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/resumes/${id}`)
      .then(r => {
        setForm({
          title: r.title || "",
          fullName: r.fullName || "",
          email: r.email || "",
          phone: r.phone || "",
          location: r.location || "",
          jobTitle: r.jobTitle || "",
          summary: r.summary || "",
          experience: r.experience || "",
          education: r.education || "",
          skills: r.skills || "",
          status: r.status || "draft"
        });
        setCoachEdits(r.coachEdits || []);
        setHasUnread(r.hasUnreadCoachEdits || false);
      })
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setSaveMsg(null);
  };

  const save = async (quiet = false) => {
    if (!form.title || !form.fullName) {
      setSaveMsg({ type: "error", text: "Title and full name are required." });
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const data = await apiFetch("/api/resumes", { method: "POST", body: JSON.stringify(form) });
        navigate(`/builder/${data.resume._id}`, { replace: true });
      } else {
        await apiFetch(`/api/resumes/${id}`, { method: "PUT", body: JSON.stringify(form) });
      }
      if (!quiet) setSaveMsg({ type: "success", text: "Saved!" });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      setSaveMsg({ type: "error", text: err.message });
    } finally { setSaving(false); }
  };

  const markSeen = async () => {
    if (!id || !hasUnread) return;
    setMarkingRead(true);
    try {
      const data = await apiFetch(`/api/resumes/${id}/mark-seen`, { method: "POST" });
      setCoachEdits(data.resume?.coachEdits || []);
      setHasUnread(false);
    } catch (err) { console.error(err); }
    finally { setMarkingRead(false); }
  };

  const unreadEdits = coachEdits.filter(e => !e.seenByApplicant);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="ra-spinner-lg" />
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--cream)" }}>
      {/* Top bar */}
      <div style={{
        background: "white", borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1.5rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
        position: "sticky", top: 62, zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/dashboard" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4 }}>
            <i className="bi bi-arrow-left" /> Dashboard
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.05rem" }}>
            {isNew ? "New Resume" : form.title || "Resume Builder"}
          </span>
          {hasUnread && (
            <span style={{
              background: "var(--gold)", color: "white", fontSize: "0.7rem",
              fontWeight: 700, padding: "3px 10px", borderRadius: 100, display: "flex",
              alignItems: "center", gap: 4
            }}>
              <i className="bi bi-stars" /> {unreadEdits.length} coach edit{unreadEdits.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {saveMsg && (
            <span style={{ fontSize: "0.82rem", color: saveMsg.type === "success" ? "var(--sage)" : "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
              <i className={`bi bi-${saveMsg.type === "success" ? "check2-circle" : "exclamation-circle"}`} />
              {saveMsg.text}
            </span>
          )}
          <select
            value={form.status}
            onChange={set("status")}
            style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: "0.82rem", cursor: "pointer", background: "white" }}
          >
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
          </select>
          <button onClick={() => save()} className="btn-primary-ra" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }} disabled={saving}>
            {saving ? <><span className="ra-spinner-sm" /> Saving…</> : <><i className="bi bi-floppy" /> Save</>}
          </button>
        </div>
      </div>

      {/* Coach edits banner */}
      {hasUnread && (
        <div style={{
          background: "linear-gradient(135deg, #c9963a 0%, #e0b860 100%)",
          padding: "0.9rem 1.5rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <i className="bi bi-stars" style={{ color: "white", fontSize: "1.2rem" }} />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                Your coach left {unreadEdits.length} edit{unreadEdits.length !== 1 ? "s" : ""}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
                Highlighted sections show the coach's suggestions. Review them below.
              </div>
            </div>
          </div>
          <button
            onClick={markSeen}
            disabled={markingRead}
            style={{
              background: "white", color: "var(--gold)", border: "none", borderRadius: 10,
              padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            {markingRead ? "Marking…" : <><i className="bi bi-check2-all" /> Mark All as Read</>}
          </button>
        </div>
      )}

      {/* Editor + Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 170px)" }} className="builder-grid">

        {/* Left: Editor */}
        <div style={{ borderRight: "1px solid var(--border)", overflowY: "auto", padding: "2rem" }}>
          <h6 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1rem", marginBottom: "1.5rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="bi bi-pencil-square" /> Editor
          </h6>

          {/* Personal Info */}
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--sage)", marginBottom: "1rem" }}>Personal Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { key: "fullName", label: "Full Name *", placeholder: "Alex Johnson", col: "span 2" },
                { key: "title", label: "Resume Title *", placeholder: "Software Engineer – Google", col: "span 2" },
                { key: "jobTitle", label: "Job Title", placeholder: "Senior Software Engineer", col: "span 2" },
                { key: "email", label: "Email", placeholder: "alex@email.com", col: "" },
                { key: "phone", label: "Phone", placeholder: "+20 10 1234 5678", col: "" },
                { key: "location", label: "Location", placeholder: "Cairo, Egypt", col: "span 2" },
              ].map(({ key, label, placeholder, col }) => (
                <div key={key} style={{ gridColumn: col || "auto" }}>
                  <label className="ra-label">{label}</label>
                  <input className="ra-input" placeholder={placeholder} value={form[key]} onChange={set(key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic sections */}
          {SECTIONS.map(s => (
            <div key={s.key} style={{
              background: "white",
              border: `${unreadEdits.some(e => e.field === s.key) ? "2px solid var(--gold)" : "1px solid var(--border)"}`,
              borderRadius: 14, padding: "1.5rem", marginBottom: "1rem",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxShadow: unreadEdits.some(e => e.field === s.key) ? "0 0 0 4px rgba(201,150,58,0.12)" : "none"
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
                {s.label}
                {unreadEdits.some(e => e.field === s.key) && (
                  <span style={{ background: "var(--gold)", color: "white", fontSize: "0.65rem", padding: "2px 8px", borderRadius: 100 }}>
                    Coach edited ✨
                  </span>
                )}
              </div>
              <CoachHighlight edits={coachEdits} field={s.key} />
              {s.type === "textarea" ? (
                <textarea
                  className="ra-input"
                  rows={s.rows}
                  placeholder={s.placeholder}
                  value={form[s.key]}
                  onChange={set(s.key)}
                  style={{ resize: "vertical" }}
                />
              ) : (
                <input className="ra-input" placeholder={s.placeholder} value={form[s.key]} onChange={set(s.key)} />
              )}
            </div>
          ))}

          <button onClick={() => save()} className="btn-primary-ra" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }} disabled={saving}>
            {saving ? "Saving…" : <><i className="bi bi-floppy" /> Save Resume</>}
          </button>
        </div>

        {/* Right: Live Preview */}
        <div style={{ overflowY: "auto", padding: "2rem", background: "#f0ede8" }}>
          <h6 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1rem", marginBottom: "1.25rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="bi bi-eye" /> Live Preview
          </h6>
          <div style={{
            background: "white", borderRadius: 12, padding: "2.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)", minHeight: 600,
            fontFamily: "Georgia, serif"
          }}>
            {form.fullName ? (
              <>
                <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.8rem", margin: "0 0 0.15rem", letterSpacing: "-0.5px" }}>{form.fullName}</h3>
                  {form.jobTitle && <div style={{ color: "var(--sage)", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", fontWeight: 500 }}>{form.jobTitle}</div>}
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.4rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {form.email && <span><i className="bi bi-envelope me-1" />{form.email}</span>}
                    {form.phone && <span><i className="bi bi-telephone me-1" />{form.phone}</span>}
                    {form.location && <span><i className="bi bi-geo-alt me-1" />{form.location}</span>}
                  </div>
                </div>
                <PreviewSection label="Summary" content={form.summary} />
                <PreviewSection label="Experience" content={form.experience} />
                <PreviewSection label="Education" content={form.education} />
                {form.skills && (
                  <div>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.5rem" }}>Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {form.skills.split(",").map((s, i) => s.trim() && (
                        <span key={i} style={{ background: "var(--sage-pale)", color: "var(--sage)", fontSize: "0.78rem", padding: "3px 10px", borderRadius: 100, fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: "var(--muted)", textAlign: "center" }}>
                <i className="bi bi-file-person" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.35 }} />
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem" }}>Start typing to see your resume here</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .builder-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,150,58,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(201,150,58,0); }
        }
      `}</style>
    </div>
  );
}
