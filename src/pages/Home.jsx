import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import PricingCard from '../components/PricingCard';

const FEATURES = [
  { icon: 'bi-people-fill', title: 'Real-Time Collaboration', description: 'Edit together with career coaches, peers, or mentors simultaneously — see live cursors and changes just like Google Docs.' },
  { icon: 'bi-stars', title: 'AI-Powered Suggestions', description: 'Our AI panel rewrites bullet points, suggests keywords, and explains every improvement so you learn, not just copy.' },
  { icon: 'bi-layout-split', title: 'Split-Screen Live Preview', description: 'The editor and rendered resume sit side-by-side so every change is reflected instantly — no guessing what it looks like.' },
  { icon: 'bi-clock-history', title: 'Version History', description: 'Browse, compare, and restore any previous draft. Never lose work, and confidently experiment with different styles.' },
  { icon: 'bi-filetype-pdf', title: 'ATS-Friendly Export', description: 'Export polished, ATS-optimized PDFs or DOCX files with one click — ready before your application deadline tonight.' },
  { icon: 'bi-shield-check', title: 'Privacy-First', description: 'Your resume data is encrypted and never sold. Collaborators only see what you explicitly invite them to view.' },
];

const PLANS = [
  {
    plan: 'Free',
    price: 0,
    period: 'forever',
    features: ['1 resume', 'Basic AI suggestions', 'PDF export', '1 collaborator'],
  },
  {
    plan: 'Pro',
    price: 9,
    period: 'month',
    featured: true,
    badge: 'Most Popular',
    features: ['Unlimited resumes', 'Full AI panel', 'PDF + DOCX export', 'Up to 5 collaborators', 'Version history'],
  },
  {
    plan: 'Institution',
    price: 29,
    period: 'month',
    features: ['Everything in Pro', 'Unlimited collaborators', 'Admin dashboard', 'Bulk student reviews', 'Priority support'],
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="ra-hero">
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="ra-hero-eyebrow">
                <i className="bi bi-stars" /> AI-Powered · Collaborative
              </div>
              <h1>
                Build resumes <em>together,</em> land jobs faster.
              </h1>
              <p className="ra-hero-sub">
                ResumAIte is the only resume builder where you and your career coach edit side-by-side in real time — with AI suggestions that explain themselves.
              </p>
              <div className="ra-hero-actions">
                <Link to="/signup" className="btn-primary-ra">
                  <i className="bi bi-rocket-takeoff" /> Start Building Free
                </Link>
                <Link to="/builder" className="btn-ghost-ra">
                  <i className="bi bi-play-circle" /> See it live
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="ra-hero-visual">
                <div className="ra-resume-card">
                  <div className="ra-skeleton title" />
                  <div className="ra-skeleton short" />
                  <div style={{ height: 20 }} />
                  <div className="ra-skeleton" />
                  <div className="ra-skeleton medium" />
                  <div className="ra-skeleton" />
                  <div style={{ height: 16 }} />
                  <div className="ra-skeleton medium" />
                  <div className="ra-skeleton" />
                  <div className="ra-skeleton short" />
                  <div style={{ height: 16 }} />
                  <div className="ra-skeleton" />
                  <div className="ra-skeleton medium" />
                </div>
                <div className="ra-ai-bubble">
                  Try: "Led" instead of "Responsible for" — stronger action verb
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="ra-section bg-cream">
        <div className="container">
          <div className="text-center mb-5">
            <div className="ra-section-label">Features</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
              Everything your resume deserves
            </h2>
            <p className="text-muted-ra mx-auto" style={{ maxWidth: 500, fontSize: '1rem' }}>
              Built for students, coaches, and universities who need more than a template.
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="ra-section" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="ra-section-label" style={{ color: 'var(--gold)' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: 'var(--cream)' }}>
              Simple, honest pricing
            </h2>
            <p style={{ color: 'rgba(250,248,244,0.55)', maxWidth: 440, margin: '0 auto', fontSize: '1rem' }}>
              Start free, upgrade when you need more. No contracts, cancel anytime.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {PLANS.map((p) => (
              <div key={p.plan} className="col-md-6 col-lg-4">
                <PricingCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
