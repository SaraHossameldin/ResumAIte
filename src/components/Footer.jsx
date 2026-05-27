export default function Footer() {
  return (
    <footer className="ra-footer">
      <div>
        <strong style={{ color: "var(--cream)" }}>Resum<span style={{ color: "var(--gold)" }}>AI</span>te</strong>
        {" · "}Built with React + Node.js + MongoDB
      </div>
      <div style={{ marginTop: "0.3rem", fontSize: "0.78rem" }}>
        Milestone 3 — Full-Stack Integration Demo
      </div>
    </footer>
  );
}
