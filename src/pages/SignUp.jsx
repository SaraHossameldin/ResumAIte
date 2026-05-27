import { useState } from 'react';
import { Link } from 'react-router-dom';

const ROLES = ['Student', 'Career Coach', 'University Career Centre', 'Other'];

function validate(fields, tab) {
  const errors = {};
  if (tab === 'signup') {
    if (!fields.name.trim()) errors.name = 'Full name is required.';
    else if (fields.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

    if (!fields.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';

    if (!fields.password) errors.password = 'Password is required.';
    else if (fields.password.length < 8) errors.password = 'Password must be at least 8 characters.';

    if (!fields.confirm) errors.confirm = 'Please confirm your password.';
    else if (fields.confirm !== fields.password) errors.confirm = 'Passwords do not match.';

    if (!fields.role) errors.role = 'Please select your role.';
  } else {
    if (!fields.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
    if (!fields.password) errors.password = 'Password is required.';
  }
  return errors;
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#e05252', '#e0a052', '#c9963a', 'var(--sage)'];

  return (
    <div className="mt-2">
      <div className="d-flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i <= score ? colors[score] : 'var(--border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontSize: '0.75rem', color: colors[score], fontWeight: 600 }}>
          {labels[score]}
        </div>
      )}
    </div>
  );
}

export default function SignUp() {
  const [tab, setTab] = useState('signup');
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [fields, setFields] = useState({
    name: '', email: '', password: '', confirm: '', role: '', terms: false,
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(fields, tab);
    if (tab === 'signup' && !fields.terms) errs.terms = 'You must accept the terms.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const handleTabChange = (t) => {
    setTab(t);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="ra-form-page bg-cream">
      <div className="container">
        <div className="ra-form-card">
          {/* Tabs */}
          <div className="ra-tabs">
            <button className={`ra-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => handleTabChange('signup')}>
              Create Account
            </button>
            <button className={`ra-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => handleTabChange('login')}>
              Sign In
            </button>
          </div>

          {submitted ? (
            <div>
              <div className="ra-success-banner">
                <i className="bi bi-check-circle-fill fs-5" />
                {tab === 'signup' ? 'Account created! Welcome to ResumAIte.' : 'Signed in successfully!'}
              </div>
              <p className="text-muted-ra mb-3" style={{ fontSize: '0.9rem' }}>
                {tab === 'signup'
                  ? "Your free account is ready. Start building your first resume in seconds."
                  : "Welcome back. Head to your dashboard to continue where you left off."}
              </p>
              <Link to="/dashboard" className="btn-primary-ra">
                <i className="bi bi-grid" /> Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <h2 className="ra-form-title">{tab === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
              <p className="ra-form-sub">
                {tab === 'signup'
                  ? 'Free forever. No credit card required.'
                  : 'Sign in to continue building.'}
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {tab === 'signup' && (
                  <div className="mb-3">
                    <label className="ra-label">Full Name</label>
                    <input
                      className={`ra-input ${errors.name ? 'error' : ''}`}
                      type="text"
                      placeholder="Alex Johnson"
                      value={fields.name}
                      onChange={set('name')}
                    />
                    {errors.name && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errors.name}</div>}
                  </div>
                )}

                <div className="mb-3">
                  <label className="ra-label">Email Address</label>
                  <input
                    className={`ra-input ${errors.email ? 'error' : ''}`}
                    type="email"
                    placeholder="alex@university.edu"
                    value={fields.email}
                    onChange={set('email')}
                  />
                  {errors.email && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="ra-label">Password</label>
                  <div className="position-relative">
                    <input
                      className={`ra-input ${errors.password ? 'error' : ''}`}
                      type={showPass ? 'text' : 'password'}
                      placeholder={tab === 'signup' ? 'At least 8 characters' : 'Your password'}
                      value={fields.password}
                      onChange={set('password')}
                      style={{ paddingRight: '3rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0 }}
                    >
                      <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
                    </button>
                  </div>
                  {tab === 'signup' && <PasswordStrength password={fields.password} />}
                  {errors.password && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errors.password}</div>}
                </div>

                {tab === 'signup' && (
                  <>
                    <div className="mb-3">
                      <label className="ra-label">Confirm Password</label>
                      <input
                        className={`ra-input ${errors.confirm ? 'error' : ''}`}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        value={fields.confirm}
                        onChange={set('confirm')}
                      />
                      {errors.confirm && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errors.confirm}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="ra-label">I am a…</label>
                      <select
                        className={`ra-input ${errors.role ? 'error' : ''}`}
                        value={fields.role}
                        onChange={set('role')}
                      >
                        <option value="">Select your role</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors.role && <div className="ra-error-msg"><i className="bi bi-exclamation-circle me-1" />{errors.role}</div>}
                    </div>

                    <div className="ra-divider" />

                    <div className="mb-4">
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={fields.terms}
                          onChange={set('terms')}
                          style={{ marginTop: '3px', accentColor: 'var(--sage)' }}
                        />
                        <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                          I agree to ResumAIte's{' '}
                          <span style={{ color: 'var(--sage)', fontWeight: 600 }}>Terms of Service</span>
                          {' '}and{' '}
                          <span style={{ color: 'var(--sage)', fontWeight: 600 }}>Privacy Policy</span>
                        </span>
                      </label>
                      {errors.terms && <div className="ra-error-msg mt-1"><i className="bi bi-exclamation-circle me-1" />{errors.terms}</div>}
                    </div>
                  </>
                )}

                <button type="submit" className="btn-primary-ra w-100" style={{ justifyContent: 'center' }}>
                  {tab === 'signup' ? (
                    <><i className="bi bi-rocket-takeoff" /> Create Free Account</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right" /> Sign In</>
                  )}
                </button>

                {tab === 'login' && (
                  <p className="text-center mt-3 mb-0" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--sage)', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
