import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const EDITABLE = [
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "jobTitle", label: "Job Title" }
];

export default function CoachReview() {
  const { id } = useParams();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState({});       // { field: newValue }
  const [note, setNote] = useState("");
  const [savedMsg, setSavedMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "history"

  useEffect(() => {
    apiFetch(`/api/resumes/${id}`)
      .then(r => {
        setResume(r);
        // Pre-fill edits with current values
        const init = {};
        EDITABLE.forEach(s => { init[s.key] = r[s.key] || ""; });
        setEdits(init);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    // Build diff — only fields that actually changed
    const changed = EDITABLE.filter(s => edits[s.key] !== (resume[s.key] || "")).map(s => ({
      field: s.key,
      label: s.label,
      oldValue: resume[s.key] || "",
      newValue: edits[s.key]
    }));

    if (changed.length === 0) {
      setSavedMsg({ type: "info", text: "No changes detected. Edit some fields first." });
      return;
    }

    setSaving(true);
    try {
      const data = await apiFetch(`/api/resumes/${id}/coach-edits`, {
        method: "POST",
        body: JSON.stringify({ edits: changed, note })
      });
      setResume(data.resume);
      // Refresh edits mirror
      const init = {};
      EDITABLE.forEach(s => { init[s.key] = data.resume[s.key] || ""; });
      setEdits(init);
      setNote("");
      setSavedMsg({ type: "success", text: `${changed.length} edit${changed.length > 1 ? "s" : ""} saved! ${resume.owner?.name || "The applicant"} has been notified.` });
      setTimeout(() => setSavedMsg(null), 5000);
    } catch (err) {
      setSavedMsg({ type: "error", text: err.message });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="ra-spinner-lg" />
    </div>
  );
  if (!resume) return <div style={{ padding: "3rem", textAlign: "center" }}>Resume not found or not shared with you.</div>;

  const historyEdits = resume.coachEdits || [];

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 62px)", padding: "2rem 0 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Back + Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/coach-dashboard" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: "0.75rem" }}>
            <i className="bi bi-arrow-left" /> Coach Dashboard
          </Link>
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "2rem", margin: "0 0 0.25rem" }}>
            {resume.title}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9rem" }}>
            <i className="bi bi-person me-1" />
            Applicant: <strong>{resume.owner?.name}</strong> · {resume.owner?.email}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--border)", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {[{ id: "edit", label: "Edit Resume", icon: "bi-pencil" }, { id: "history", label: `Edit History (${historyEdits.length})`, icon: "bi-clock-history" }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? "white" : "transparent",
              border: "none", borderRadius: 10, padding: "8px 18px",
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? "var(--ink)" : "var(--muted)",
              cursor: "pointer", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6,
              boxShadow: activeTab === t.id ? "var(--shadow)" : "none",
              transition: "all 0.2s"
            }}>
              <i className={`bi ${t.icon}`} />{t.label}
            </button>
          ))}
        </div>

        {/* ═══ EDIT TAB ═══ */}
        {activeTab === "edit" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem" }}>

            {/* Left: form */}
            <div>
              {savedMsg && (
                <div style={{
                  marginBottom: "1rem", padding: "0.9rem 1.2rem", borderRadius: 12,
                  background: savedMsg.type === "success" ? "var(--sage-pale)" : savedMsg.type === "info" ? "var(--gold-pale)" : "#fef2f2",
                  border: `1px solid ${savedMsg.type === "success" ? "var(--sage)" : savedMsg.type === "info" ? "var(--gold)" : "#fecaca"}`,
                  color: savedMsg.type === "success" ? "var(--sage)" : savedMsg.type === "info" ? "var(--gold)" : "#dc2626",
                  fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.6rem"
                }}>
                  <i className={`bi bi-${savedMsg.type === "success" ? "check-circle-fill" : savedMsg.type === "info" ? "info-circle-fill" : "exclamation-triangle-fill"}`} />
                  {savedMsg.text}
                </div>
              )}

              {EDITABLE.map(s => {
                const changed = edits[s.key] !== (resume[s.key] || "");
                return (
                  <div key={s.key} style={{
                    background: "white",
                    border: `${changed ? "2px solid var(--sage)" : "1px solid var(--border)"}`,
                    borderRadius: 14, padding: "1.25rem", marginBottom: "0.75rem",
                    transition: "border-color 0.2s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "1px", textTransform: "uppercase", color: changed ? "var(--sage)" : "var(--muted)" }}>
                        {s.label}
                        {changed && <span style={{ marginLeft: 8, background: "var(--sage)", color: "white", fontSize: "0.65rem", padding: "2px 7px", borderRadius: 100 }}>Changed</span>}
                      </div>
                    </div>
                    {s.key === "skills" || s.key === "jobTitle" ? (
                      <input
                        className="ra-input"
                        value={edits[s.key] || ""}
                        onChange={e => setEdits(p => ({ ...p, [s.key]: e.target.value }))}
                        placeholder={`Edit ${s.label.toLowerCase()}…`}
                      />
                    ) : (
                      <textarea
                        className="ra-input"
                        rows={s.key === "summary" ? 4 : s.key === "experience" ? 6 : 3}
                        value={edits[s.key] || ""}
                        onChange={e => setEdits(p => ({ ...p, [s.key]: e.target.value }))}
                        placeholder={`Edit ${s.label.toLowerCase()}…`}
                        style={{ resize: "vertical" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: actions panel */}
            <div>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: "1.5rem", position: "sticky", top: 80 }}>
                <h6 style={{ fontFamily: "DM Serif Display, serif", margin: "0 0 1rem", fontSize: "1.05rem" }}>
                  <i className="bi bi-chat-square-text me-2" style={{ color: "var(--sage)" }} />Coach Note
                </h6>
                <p style={{ color: "var(--muted)", fontSize: "0.83rem", marginBottom: "0.75rem" }}>
                  Add an optional note explaining your edits. The applicant will see this in their notification.
                </p>
                <textarea
                  className="ra-input"
                  rows={4}
                  placeholder="e.g. Strengthened your summary to lead with impact metrics. Also updated the skills section with more relevant keywords…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  style={{ resize: "vertical", marginBottom: "1rem" }}
                />

                <div style={{ background: "var(--sage-pale)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--sage)" }}>
                  <i className="bi bi-info-circle me-1" />
                  Changed fields will be highlighted in the applicant's builder so they can review exactly what you modified.
                </div>

                <button
                  onClick={handleSave}
                  className="btn-primary-ra"
                  style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }}
                  disabled={saving}
                >
                  {saving
                    ? <><span className="ra-spinner-sm" /> Saving &amp; Notifying…</>
                    : <><i className="bi bi-send" /> Save Edits &amp; Notify Applicant</>
                  }
                </button>

                {/* Applicant info */}
                <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.5rem" }}>Applicant</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{resume.owner?.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{resume.owner?.email}</div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                    Resume status: <span style={{ fontWeight: 600, color: resume.status === "complete" ? "var(--sage)" : "var(--gold)" }}>
                      {resume.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ HISTORY TAB ═══ */}
        {activeTab === "history" && (
          <div>
            {historyEdits.length === 0 ? (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
                <i className="bi bi-clock-history" style={{ fontSize: "3rem", color: "var(--muted)", marginBottom: "1rem", display: "block" }} />
                <h5 style={{ fontFamily: "DM Serif Display, serif" }}>No edits yet</h5>
                <p style={{ color: "var(--muted)" }}>Your edit history will appear here.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[...historyEdits].reverse().map((e, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ background: "var(--sage-pale)", color: "var(--sage)", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>
                          {e.label}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                          by {e.coachName}
                        </span>
                        {e.seenByApplicant
                          ? <span style={{ fontSize: "0.72rem", color: "var(--sage)", background: "var(--sage-pale)", padding: "2px 8px", borderRadius: 100 }}><i className="bi bi-check2-all me-1" />Seen</span>
                          : <span style={{ fontSize: "0.72rem", color: "var(--gold)", background: "var(--gold-pale)", padding: "2px 8px", borderRadius: 100 }}><i className="bi bi-clock me-1" />Not seen</span>
                        }
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{new Date(e.editedAt).toLocaleString()}</span>
                    </div>
                    {e.note && (
                      <div style={{ fontSize: "0.83rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.5rem" }}>
                        Note: "{e.note}"
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#dc2626", marginBottom: "0.25rem", textTransform: "uppercase" }}>Before</div>
                        <div style={{ fontSize: "0.8rem", background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, padding: "0.6rem 0.75rem", whiteSpace: "pre-wrap", color: "var(--ink)", minHeight: 40 }}>
                          {e.oldValue || <span style={{ color: "var(--muted)", fontStyle: "italic" }}>empty</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--sage)", marginBottom: "0.25rem", textTransform: "uppercase" }}>After</div>
                        <div style={{ fontSize: "0.8rem", background: "rgba(61,107,79,0.05)", border: "1px solid rgba(61,107,79,0.2)", borderRadius: 8, padding: "0.6rem 0.75rem", whiteSpace: "pre-wrap", color: "var(--ink)", minHeight: 40 }}>
                          {e.newValue || <span style={{ color: "var(--muted)", fontStyle: "italic" }}>empty</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
