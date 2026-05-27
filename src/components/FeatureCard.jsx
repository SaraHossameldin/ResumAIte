export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="ra-feature-card">
      <div className="ra-feature-icon">
        <i className={`bi ${icon}`} />
      </div>
      <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>{title}</h5>
      <p className="text-muted-ra mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.65' }}>
        {description}
      </p>
    </div>
  );
}
