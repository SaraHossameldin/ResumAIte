import { Link } from 'react-router-dom';

export default function PricingCard({ plan, price, period, features, featured, badge }) {
  return (
    <div className={`ra-pricing-card ${featured ? 'featured' : ''}`}>
      {badge && <span className="ra-pricing-badge">{badge}</span>}
      <div className="mb-1" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: featured ? 'rgba(250,248,244,0.5)' : 'var(--muted)' }}>
        {plan}
      </div>
      <div className="d-flex align-items-end gap-1 mb-1">
        <span className="ra-price-amount">${price}</span>
        <span className="ra-price-period mb-2">/ {period}</span>
      </div>
      <ul className="ra-pricing-list">
        {features.map((f, i) => (
          <li key={i}>
            <i className="bi bi-check2" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`btn w-100 ${featured ? 'btn-primary-ra' : ''}`}
        style={featured ? {} : { border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.75rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}
      >
        {price === 0 ? 'Start Free' : 'Get Started'}
      </Link>
    </div>
  );
}
