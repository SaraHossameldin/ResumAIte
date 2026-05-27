import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e05252", "#e0a052", "#c9963a", "var(--sage)"];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i <= score ? colors[score] : "var(--border)",
            transition: "background 0.3s"
          }} />
        ))}
      </div>
      {score > 0 && <div style={{ fontSize: "0.73rem", color: colors[score], fontWeight: 600 }}>{labels[score]}</div>}
    </div>
  );
}

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // "login" | "signup" | "forgot" | "reset"
  const [view, setView] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "error"|"success", msg }
  const [resetToken, setResetToken] = useState("");

  const [f, setF] = useState({
    name: "", email: "", password: "", confirm: "",
    role: "", terms: false, forgotEmail: "", resetToken: "", newPassword: ""
  });
  const [errs, setErrs] = useState({});

  const set = k => e => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF(p => ({ ...p, [k]: v }));
    setErrs(p => ({ ...p, [k]: null }));
    setToast(null);
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    if (type === "success") setTimeout(() => setToast(null), 5000);
  };

  // ── SIGN UP ─────────────────────────────────────
  const handleSignup = async e => {
    e.preventDefault();
    const e2 = {};
    if (!f.name.trim() || f.name.trim().length < 2) e2.name = "Full name required (min 2 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e2.email = "Valid email required";
    if (f.password.length < 8) e2.password = "At least 8 characters";
    if (f.confirm !== f.password) e2.confirm = "Passwords do not match";
    if (!f.role) e2.role = "Please pick a role";
    if (!f.terms) e2.terms = "You must accept the terms";
    if (Object.keys(e2).length) { setErrs(e2); return; }

    setLoading(true);
    try {
      const data = await register(f.name.trim(), f.email.trim(), f.password, f.role);
      navigate(data.user.role === "coach" ? "/coach-dashboard" : "/dashboard");
    } catch (err) {
      if (err.data?.existingAccount) {
        showToast("error", err.message);
        setTimeout(() => setView("login"), 1500);
      } else {
        showToast("error", err.message || "Registration failed");
      }
    } finally { setLoading(false); }
  };

  // ── LOG IN ──────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault();
    const e2 = {};
    if (!f.email.trim()) e2.email = "Email required";
    if (!f.password) e2.password = "Password required";
    if (Object.keys(e2).length) { setErrs(e2); return; }

    setLoading(true);
    try {
      const data = await login(f.email.trim(), f.password);
      navigate(data.user.role === "coach" ? "/coach-dashboard" : "/dashboard");
    } catch (err) {
      showToast("error", err.message || "Login failed");
    } finally { setLoading(false); }
  };

  // ── FORGOT PASSWORD ─────────────────────────────
  const handleForgot = async e => {
    e.preventDefault();
    if (!f.forgotEmail.trim()) { setErrs({ forgotEmail: "Email required" }); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: f.forgotEmail.trim() })
      });
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setF(p => ({ ...p, resetToken: data.resetToken }));
        showToast("success", "Token generated! Copy it below to reset your password.");
      } else {
        showToast("success", data.message);
      }
    } catch (err) {
      showToast("error", err.message || "Failed");
    } finally { setLoading(false); }
  };

  // ── RESET PASSWORD ──────────────────────────────
  const handleReset = async e => {
    e.preventDefault();
    const e2 = {};
    if (!f.resetToken.trim()) e2.resetToken = "Token required";
    if (f.newPassword.length < 8) e2.newPassword = "At least 8 characters";
    if (Object.keys(e2).length) { setErrs(e2); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: f.resetToken.trim(), newPassword: f.newPassword })
      });
      showToast("success", data.message + " Redirecting to login...");
      setTimeout(() => { setView("login"); setResetToken(""); }, 2000);
    } catch (err) {
      showToast("error", err.message || "Reset failed");
    } finally { setLoading(false); }
  };

  const inp = (key, type = "text", placeholder = "") => (
    <input
      className={`ra-input${errs[key] ? " error" : ""}`}
      type={type}
      placeholder={placeholder}
      value={f[key]}
      onChange={set(key)}
      style={type === "password" ? { paddingRight: "3rem" } : {}}
    />
  );

  return (
    <div className="ra-form-page bg-cream">
      <div className="container" style={{ maxWidth: 480, paddingTop: "3rem", paddingBottom: "3rem" }}>

        {/* ── TOAST ─────────────────────────── */}
        {toast && (
          <div style={{
            marginBottom: "1.25rem", padding: "0.9rem 1.2rem", borderRadius: 12, fontSize: "0.875rem",
            background: toast.type === "success" ? "var(--sage-pale)" : "#fef2f2",
            border: `1px solid ${toast.type === "success" ? "var(--sage)" : "#fecaca"}`,
            color: toast.type === "success" ? "var(--sage)" : "#dc2626",
            display: "flex", alignItems: "flex-start", gap: "0.6rem"
          }}>
            <i className={`bi bi-${toast.type === "success" ? "check-circle-fill" : "exclamation-triangle-fill"}`} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              {toast.msg}
              {toast.type === "error" && toast.msg?.includes("already exists") && (
                <button onClick={() => { setView("login"); setToast(null); }} style={{
                  marginLeft: 8, background: "var(--sage)", color: "white", border: "none",
                  borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: "0.8rem"
                }}>
                  Switch to Login →
                </button>
              )}
            </div>
          </div>
        )}

        <div className="ra-form-card">

          {/* ══════════════ LOGIN / SIGNUP ═══════════════ */}
          {(view === "login" || view === "signup") && (
            <>
              <div className="ra-tabs">
                <button className={`ra-tab${view === "signup" ? " active" : ""}`} onClick={() => { setView("signup"); setErrs({}); setToast(null); }}>Create Account</button>
                <button className={`ra-tab${view === "login" ? " active" : ""}`} onClick={() => { setView("login"); setErrs({}); setToast(null); }}>Sign In</button>
              </div>

              {view === "signup" ? (
                <>
                  <h2 className="ra-form-title">Create your account</h2>
                  <p className="ra-form-sub">Free forever · No credit card required</p>
                  <form onSubmit={handleSignup} noValidate>
                    {/* Name */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="ra-label">Full Name</label>
                      {inp("name", "text", "Alex Johnson")}
                      {errs.name && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.name}</div>}
                    </div>
                    {/* Email */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="ra-label">Email Address</label>
                      {inp("email", "email", "alex@university.edu")}
                      {errs.email && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.email}</div>}
                    </div>
                    {/* Password */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="ra-label">Password</label>
                      <div style={{ position: "relative" }}>
                        {inp("password", showPass ? "text" : "password", "At least 8 characters")}
                        <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                          <i className={`bi bi-eye${showPass ? "-slash" : ""}`} />
                        </button>
                      </div>
                      <PasswordStrength password={f.password} />
                      {errs.password && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.password}</div>}
                    </div>
                    {/* Confirm */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="ra-label">Confirm Password</label>
                      {inp("confirm", showPass ? "text" : "password", "Repeat your password")}
                      {errs.confirm && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.confirm}</div>}
                    </div>
                    {/* Role picker */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <label className="ra-label">I am a…</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                        {[
                          { value: "applicant", icon: "🎓", title: "Applicant", desc: "Build & manage my resumes" },
                          { value: "coach", icon: "🏅", title: "Coach", desc: "Review & coach applicants" }
                        ].map(r => (
                          <label key={r.value} style={{
                            border: `2px solid ${f.role === r.value ? "var(--sage)" : "var(--border)"}`,
                            borderRadius: 12, padding: "1rem 0.75rem", cursor: "pointer", textAlign: "center",
                            background: f.role === r.value ? "var(--sage-pale)" : "white",
                            transition: "all 0.2s"
                          }}>
                            <input type="radio" name="role" value={r.value} checked={f.role === r.value} onChange={set("role")} style={{ display: "none" }} />
                            <div style={{ fontSize: "1.6rem", marginBottom: "0.3rem" }}>{r.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: f.role === r.value ? "var(--sage)" : "var(--ink)" }}>{r.title}</div>
                            <div style={{ fontSize: "0.73rem", color: "var(--muted)", marginTop: "0.15rem" }}>{r.desc}</div>
                          </label>
                        ))}
                      </div>
                      {errs.role && <div className="ra-error-msg mt-1"><i className="bi bi-exclamation-circle me-1" />{errs.role}</div>}
                    </div>
                    {/* Terms */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={f.terms} onChange={set("terms")} style={{ marginTop: 3, accentColor: "var(--sage)" }} />
                        <span style={{ fontSize: "0.83rem", color: "var(--muted)" }}>
                          I agree to ResumAIte's <span style={{ color: "var(--sage)", fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: "var(--sage)", fontWeight: 600 }}>Privacy Policy</span>
                        </span>
                      </label>
                      {errs.terms && <div className="ra-error-msg mt-1"><i className="bi bi-exclamation-circle me-1" />{errs.terms}</div>}
                    </div>
                    <button type="submit" className="btn-primary-ra" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                      {loading ? <><span className="ra-spinner-sm" /> Creating…</> : <><i className="bi bi-rocket-takeoff" /> Create Free Account</>}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="ra-form-title">Welcome back</h2>
                  <p className="ra-form-sub">Sign in to continue building.</p>
                  <form onSubmit={handleLogin} noValidate>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="ra-label">Email Address</label>
                      {inp("email", "email", "alex@university.edu")}
                      {errs.email && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.email}</div>}
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                      <label className="ra-label" style={{ display: "flex", justifyContent: "space-between" }}>
                        Password
                        <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "var(--sage)", fontSize: "0.82rem", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                          Forgot password?
                        </button>
                      </label>
                      <div style={{ position: "relative" }}>
                        {inp("password", showPass ? "text" : "password", "Your password")}
                        <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                          <i className={`bi bi-eye${showPass ? "-slash" : ""}`} />
                        </button>
                      </div>
                      {errs.password && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.password}</div>}
                    </div>
                    <button type="submit" className="btn-primary-ra" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                      {loading ? <><span className="ra-spinner-sm" /> Signing in…</> : <><i className="bi bi-box-arrow-in-right" /> Sign In</>}
                    </button>
                  </form>
                </>
              )}
            </>
          )}

          {/* ══════════════ FORGOT PASSWORD ══════════════ */}
          {view === "forgot" && (
            <>
              <button onClick={() => setView("login")} style={{ background: "none", border: "none", color: "var(--sage)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <i className="bi bi-arrow-left" /> Back to Sign In
              </button>
              <h2 className="ra-form-title">Forgot Password</h2>
              <p className="ra-form-sub">Enter your email and we'll generate a reset token.</p>
              <form onSubmit={handleForgot} noValidate>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="ra-label">Your Email Address</label>
                  <input className={`ra-input${errs.forgotEmail ? " error" : ""}`} type="email" placeholder="your@email.com" value={f.forgotEmail} onChange={set("forgotEmail")} />
                  {errs.forgotEmail && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.forgotEmail}</div>}
                </div>
                {resetToken && (
                  <div style={{
                    background: "var(--gold-pale)", border: "1px solid var(--gold)", borderRadius: 10,
                    padding: "1rem", marginBottom: "1rem"
                  }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 700, marginBottom: "0.3rem" }}>
                      🔑 Your Reset Token (demo mode):
                    </div>
                    <code style={{ fontSize: "0.8rem", wordBreak: "break-all", color: "var(--ink)" }}>{resetToken}</code>
                    <button type="button" onClick={() => { navigator.clipboard.writeText(resetToken); }} style={{ display: "block", marginTop: "0.5rem", background: "var(--gold)", color: "white", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: "0.78rem" }}>
                      Copy Token
                    </button>
                  </div>
                )}
                <button type="submit" className="btn-primary-ra" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                  {loading ? "Generating…" : "Get Reset Token"}
                </button>
                {resetToken && (
                  <button type="button" onClick={() => setView("reset")} className="btn-ghost-ra" style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem" }}>
                    I have a token — Reset my password →
                  </button>
                )}
              </form>
            </>
          )}

          {/* ══════════════ RESET PASSWORD ═══════════════ */}
          {view === "reset" && (
            <>
              <button onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "var(--sage)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <i className="bi bi-arrow-left" /> Back
              </button>
              <h2 className="ra-form-title">Reset Password</h2>
              <p className="ra-form-sub">Paste your reset token and choose a new password.</p>
              <form onSubmit={handleReset} noValidate>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="ra-label">Reset Token</label>
                  <input className={`ra-input${errs.resetToken ? " error" : ""}`} type="text" placeholder="Paste token here…" value={f.resetToken} onChange={set("resetToken")} />
                  {errs.resetToken && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.resetToken}</div>}
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="ra-label">New Password</label>
                  <input className={`ra-input${errs.newPassword ? " error" : ""}`} type="password" placeholder="At least 8 characters" value={f.newPassword} onChange={set("newPassword")} />
                  <PasswordStrength password={f.newPassword} />
                  {errs.newPassword && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errs.newPassword}</div>}
                </div>
                <button type="submit" className="btn-primary-ra" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                  {loading ? "Resetting…" : <><i className="bi bi-lock" /> Reset Password</>}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
