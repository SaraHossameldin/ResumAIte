import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const dashLink = user?.role === "coach" ? "/coach-dashboard" : "/dashboard";

  return (
    <nav style={{
      background: "var(--ink)", position: "sticky", top: 0, zIndex: 1000,
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 62
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            fontFamily: "DM Serif Display, serif", fontSize: "1.5rem",
            color: "var(--cream)", letterSpacing: "-0.5px"
          }}>
            Resum<span style={{ color: "var(--gold)" }}>AI</span>te
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <>
              {/* Role badge */}
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                background: user.role === "coach" ? "rgba(201,150,58,0.2)" : "rgba(61,107,79,0.25)",
                color: user.role === "coach" ? "var(--gold)" : "var(--sage-light)",
                textTransform: "uppercase", letterSpacing: "0.8px"
              }}>
                {user.role === "coach" ? "🏅 Coach" : "🎓 Applicant"}
              </span>
              <span style={{ color: "rgba(250,248,244,0.55)", fontSize: "0.88rem" }}>{user.name}</span>
              <NavLink to={dashLink} style={({ isActive }) => ({
                color: isActive ? "var(--gold)" : "rgba(250,248,244,0.7)",
                textDecoration: "none", fontSize: "0.9rem", fontWeight: 500
              })}>
                Dashboard
              </NavLink>
              {user.role === "applicant" && (
                <NavLink to="/builder" style={({ isActive }) => ({
                  color: isActive ? "var(--gold)" : "rgba(250,248,244,0.7)",
                  textDecoration: "none", fontSize: "0.9rem", fontWeight: 500
                })}>
                  Builder
                </NavLink>
              )}
              <button onClick={handleLogout} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(250,248,244,0.7)", borderRadius: 8, padding: "6px 14px",
                cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s"
              }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" end style={({ isActive }) => ({
                color: isActive ? "var(--cream)" : "rgba(250,248,244,0.65)",
                textDecoration: "none", fontSize: "0.9rem", fontWeight: 500
              })}>
                Home
              </NavLink>
              <Link to="/auth" style={{
                background: "var(--sage)", color: "white", borderRadius: 8,
                padding: "7px 18px", fontSize: "0.88rem", fontWeight: 600,
                textDecoration: "none", transition: "background 0.2s"
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
