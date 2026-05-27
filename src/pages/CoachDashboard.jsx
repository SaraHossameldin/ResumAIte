import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export default function CoachDashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/resumes")
      .then(data => { setResumes(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="ra-spinner-lg" />
        <p style={{ color: "var(--muted)", marginTop: "1rem" }}>Loading shared resumes…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 62px)", padding: "2rem 0 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.3rem" }}>
            Coach Dashboard
          </div>
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "2.2rem", margin: 0 }}>
            Hello, {user.name.split(" ")[0]} 🏅
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.4rem", fontSize: "0.95rem" }}>
            Resumes applicants have shared with you for review and coaching.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "bi-file-earmark-person", value: resumes.length, label: "Assigned Resumes" },
            { icon: "bi-pencil-square", value: resumes.reduce((s, r) => s + (r.coachEdits?.length || 0), 0), label: "Total Edits Made" },
            { icon: "bi-clock-history", value: resumes.filter(r => r.hasUnreadCoachEdits).length, label: "Awaiting Applicant Read" }
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "center", gap: "1rem"
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--gold-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`bi ${s.icon}`} style={{ fontSize: "1.2rem", color: "var(--gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: "1.7rem", fontWeight: 800, fontFamily: "DM Serif Display, serif", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumes list */}
        {resumes.length === 0 ? (
          <div style={{
            background: "white", border: "2px dashed var(--border)", borderRadius: 20,
            padding: "4rem 2rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📭</div>
            <h3 style={{ fontFamily: "DM Serif Display, serif", marginBottom: "0.5rem" }}>No resumes shared yet</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: 400, margin: "0 auto" }}>
              Applicants share their resumes with you using your email address. Ask them to share a resume from their dashboard.
            </p>
            <div style={{ marginTop: "1.5rem", background: "var(--gold-pale)", border: "1px solid rgba(201,150,58,0.3)", borderRadius: 12, padding: "0.9rem 1.25rem", display: "inline-block", fontSize: "0.88rem" }}>
              Your coach email: <strong>{user.email}</strong>
            </div>
          </div>
        ) : (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h5 style={{ fontFamily: "DM Serif Display, serif", margin: 0 }}>Resumes Shared With You</h5>
            </div>
            {resumes.map((r, i) => (
              <div key={r._id} style={{
                padding: "1.1rem 1.5rem",
                borderBottom: i < resumes.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex", alignItems: "center", gap: "1rem",
                transition: "background 0.15s"
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "var(--gold-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <i className="bi bi-file-earmark-person" style={{ color: "var(--gold)", fontSize: "1.1rem" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    <i className="bi bi-person me-1" />
                    {r.owner?.name || "Applicant"} · {r.owner?.email}
                    <span style={{ marginLeft: "0.75rem" }}>
                      <i className="bi bi-pencil me-1" />{r.coachEdits?.length || 0} edits
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                  {r.hasUnreadCoachEdits && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "var(--gold-pale)", color: "var(--gold)" }}>
                      Awaiting read
                    </span>
                  )}
                  <Link to={`/coach-review/${r._id}`} className="btn-primary-ra" style={{ fontSize: "0.82rem", padding: "7px 14px" }}>
                    <i className="bi bi-pencil-square" /> Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
