import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

function NotificationBell({ count, notifications, onMarkAllSeen }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "relative", background: count > 0 ? "var(--gold)" : "white",
          border: `1px solid ${count > 0 ? "var(--gold)" : "var(--border)"}`,
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          color: count > 0 ? "white" : "var(--ink)", transition: "all 0.2s"
        }}
      >
        <i className="bi bi-bell-fill" />
        {count > 0 && (
          <span style={{
            background: "white", color: "var(--gold)", borderRadius: 100,
            fontSize: "0.72rem", fontWeight: 800, minWidth: 18, textAlign: "center",
            padding: "0 4px"
          }}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)", width: 360,
            background: "white", border: "1px solid var(--border)", borderRadius: 16,
            boxShadow: "var(--shadow-lg)", zIndex: 100, overflow: "hidden"
          }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                <i className="bi bi-bell me-2" />Notifications
              </span>
              {count > 0 && (
                <button onClick={() => { onMarkAllSeen(); setOpen(false); }} style={{
                  background: "none", border: "none", color: "var(--sage)", fontSize: "0.8rem",
                  cursor: "pointer", fontWeight: 600
                }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>
                  <i className="bi bi-check2-all" style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }} />
                  All caught up!
                </div>
              ) : notifications.map((n, i) => (
                <Link
                  key={i}
                  to={`/builder/${n.resumeId}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block", padding: "0.9rem 1.25rem",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none", color: "var(--ink)",
                    background: "var(--sage-pale)", transition: "background 0.15s"
                  }}
                >
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, background: "var(--sage)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <i className="bi bi-pencil-square" style={{ color: "white", fontSize: "0.9rem" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.15rem" }}>
                        {n.coachName} edited your resume
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                        <span style={{ fontWeight: 600, color: "var(--sage)" }}>{n.resumeTitle}</span>
                        {" · "}{n.fieldLabel} section
                      </div>
                      {n.note && <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2, fontStyle: "italic" }}>"{n.note}"</div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ShareModal({ resume, onClose, onShared }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleShare = async () => {
    if (!email.trim()) { setMsg({ type: "error", text: "Coach email is required" }); return; }
    setLoading(true);
    try {
      await apiFetch(`/api/resumes/${resume._id}/share`, {
        method: "POST",
        body: JSON.stringify({ coachEmail: email.trim() })
      });
      setMsg({ type: "success", text: "Shared successfully! The coach can now review this resume." });
      setTimeout(() => { onShared(); onClose(); }, 1800);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(13,13,13,0.55)",
      backdropFilter: "blur(4px)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 440,
        boxShadow: "var(--shadow-lg)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <h4 style={{ fontFamily: "DM Serif Display, serif", margin: 0 }}>Share with Coach</h4>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
              Sharing: <strong>{resume.title}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}>✕</button>
        </div>

        {msg && (
          <div style={{
            background: msg.type === "success" ? "var(--sage-pale)" : "#fef2f2",
            border: `1px solid ${msg.type === "success" ? "var(--sage)" : "#fecaca"}`,
            color: msg.type === "success" ? "var(--sage)" : "#dc2626",
            borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem"
          }}>
            {msg.text}
          </div>
        )}

        <label className="ra-label">Coach's Email Address</label>
        <input
          className="ra-input"
          type="email"
          placeholder="coach@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleShare()}
          style={{ marginBottom: "1rem" }}
        />

        {resume.sharedWithCoaches?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.4rem" }}>
              Currently shared with:
            </div>
            {resume.sharedWithCoaches.map((s, i) => (
              <div key={i} style={{ fontSize: "0.83rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                <i className="bi bi-person-check-fill" style={{ color: "var(--sage)" }} />
                {s.coachName}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleShare} className="btn-primary-ra" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
            {loading ? "Sharing…" : <><i className="bi bi-share" /> Share</>}
          </button>
          <button onClick={onClose} style={{
            flex: 1, background: "white", border: "1px solid var(--border)",
            borderRadius: 10, padding: "0.6rem", cursor: "pointer", fontSize: "0.9rem"
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareTarget, setShareTarget] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    try {
      const [rData, nData] = await Promise.all([
        apiFetch("/api/resumes"),
        apiFetch("/api/resumes/notifications")
      ]);
      setResumes(rData);
      setNotifications(nData.notifications || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markAllSeen = async () => {
    const unreadResumes = resumes.filter(r => r.hasUnreadCoachEdits);
    await Promise.all(unreadResumes.map(r => apiFetch(`/api/resumes/${r._id}/mark-seen`, { method: "POST" })));
    load();
  };

  const deleteResume = async id => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await apiFetch(`/api/resumes/${id}`, { method: "DELETE" });
      load();
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="ra-spinner-lg" />
        <p style={{ color: "var(--muted)", marginTop: "1rem" }}>Loading your dashboard…</p>
      </div>
    </div>
  );

  const totalEdits = notifications.length;
  const avgAts = resumes.length ? Math.round(resumes.reduce((s, r) => s + (r.atsScore || 0), 0) / resumes.length) : 0;

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 62px)", padding: "2rem 0 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.3rem" }}>
              Applicant Dashboard
            </div>
            <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "2.2rem", margin: 0 }}>
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <NotificationBell count={totalEdits} notifications={notifications} onMarkAllSeen={markAllSeen} />
            <Link to="/builder" className="btn-primary-ra">
              <i className="bi bi-plus-lg" /> New Resume
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "bi-file-earmark-text", value: resumes.length, label: "My Resumes", color: "var(--sage)" },
            { icon: "bi-graph-up-arrow", value: avgAts ? `${avgAts}%` : "—", label: "Avg ATS Score", color: "var(--gold)" },
            { icon: "bi-people", value: resumes.reduce((s, r) => s + (r.sharedWithCoaches?.length || 0), 0), label: "Coach Connections", color: "var(--sage)" },
            { icon: "bi-bell", value: totalEdits, label: "Unread Edits", color: totalEdits > 0 ? "var(--gold)" : "var(--muted)", alert: totalEdits > 0 }
          ].map((s, i) => (
            <div key={i} style={{
              background: s.alert ? "var(--gold-pale)" : "white",
              border: `1px solid ${s.alert ? "rgba(201,150,58,0.4)" : "var(--border)"}`,
              borderRadius: 16, padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "center", gap: "1rem"
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: s.alert ? "var(--gold)" : "var(--sage-pale)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className={`bi ${s.icon}`} style={{ fontSize: "1.2rem", color: s.alert ? "white" : s.color }} />
              </div>
              <div>
                <div style={{ fontSize: "1.7rem", fontWeight: 800, fontFamily: "DM Serif Display, serif", lineHeight: 1.1, color: s.alert ? "var(--gold)" : "var(--ink)" }}>{s.value}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumes grid */}
        {resumes.length === 0 ? (
          <div style={{
            background: "white", border: "2px dashed var(--border)", borderRadius: 20,
            padding: "4rem 2rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📄</div>
            <h3 style={{ fontFamily: "DM Serif Display, serif", marginBottom: "0.5rem" }}>No resumes yet</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Create your first resume to get started.
            </p>
            <Link to="/builder" className="btn-primary-ra">
              <i className="bi bi-plus-lg" /> Create Your First Resume
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {resumes.map(r => (
              <div key={r._id} style={{
                background: "white",
                border: r.hasUnreadCoachEdits ? "2px solid var(--gold)" : "1px solid var(--border)",
                borderRadius: 18, overflow: "hidden", transition: "all 0.2s",
                boxShadow: r.hasUnreadCoachEdits ? "0 0 0 4px rgba(201,150,58,0.12)" : "var(--shadow)"
              }}>
                {r.hasUnreadCoachEdits && (
                  <div style={{
                    background: "var(--gold)", color: "white", padding: "0.4rem 1rem",
                    fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6
                  }}>
                    <i className="bi bi-stars" />
                    Coach left feedback — open to review
                  </div>
                )}
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, background: "var(--sage-pale)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <i className="bi bi-file-earmark-person" style={{ color: "var(--sage)", fontSize: "1.2rem" }} />
                    </div>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      background: r.status === "complete" ? "var(--sage-pale)" : "var(--gold-pale)",
                      color: r.status === "complete" ? "var(--sage)" : "var(--gold)",
                      textTransform: "uppercase"
                    }}>
                      {r.status}
                    </span>
                  </div>
                  <h5 style={{ fontFamily: "DM Serif Display, serif", marginBottom: "0.25rem", fontSize: "1.05rem" }}>{r.title}</h5>
                  <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "0 0 0.75rem" }}>
                    {r.fullName} · Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </p>
                  {r.sharedWithCoaches?.length > 0 && (
                    <div style={{ marginBottom: "0.75rem", display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {r.sharedWithCoaches.map((s, i) => (
                        <span key={i} style={{
                          fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: 100,
                          background: "var(--sage-pale)", color: "var(--sage)"
                        }}>
                          <i className="bi bi-person-check me-1" />{s.coachName}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link to={`/builder/${r._id}`} className="btn-primary-ra" style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "7px 12px" }}>
                      <i className="bi bi-pencil" /> {r.hasUnreadCoachEdits ? "Review Feedback" : "Edit"}
                    </Link>
                    <button
                      onClick={() => setShareTarget(r)}
                      title="Share with coach"
                      style={{
                        background: "var(--sage-pale)", border: "none", borderRadius: 10,
                        padding: "7px 12px", cursor: "pointer", color: "var(--sage)", fontSize: "0.85rem"
                      }}
                    >
                      <i className="bi bi-share" />
                    </button>
                    <button
                      onClick={() => deleteResume(r._id)}
                      disabled={deleting === r._id}
                      style={{
                        background: "#fef2f2", border: "none", borderRadius: 10,
                        padding: "7px 12px", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem"
                      }}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {shareTarget && (
        <ShareModal
          resume={shareTarget}
          onClose={() => setShareTarget(null)}
          onShared={() => { setShareTarget(null); load(); }}
        />
      )}
    </div>
  );
}
