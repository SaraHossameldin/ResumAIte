import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoachReview from "./pages/CoachReview";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "coach" ? "/coach-dashboard" : "/dashboard"} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={user ? <Navigate to={user.role === "coach" ? "/coach-dashboard" : "/dashboard"} replace /> : <Auth />} />
      <Route path="/dashboard" element={<PrivateRoute role="applicant"><ApplicantDashboard /></PrivateRoute>} />
      <Route path="/coach-dashboard" element={<PrivateRoute role="coach"><CoachDashboard /></PrivateRoute>} />
      <Route path="/builder" element={<PrivateRoute role="applicant"><ResumeBuilder /></PrivateRoute>} />
      <Route path="/builder/:id" element={<PrivateRoute role="applicant"><ResumeBuilder /></PrivateRoute>} />
      <Route path="/coach-review/:id" element={<PrivateRoute role="coach"><CoachReview /></PrivateRoute>} />
      <Route path="*" element={
        <div style={{ textAlign: "center", padding: "6rem 1rem", minHeight: "calc(100vh - 62px)" }}>
          <h2 style={{ fontFamily: "DM Serif Display, serif" }}>404 – Page not found</h2>
          <a href="/" className="btn-primary-ra" style={{ display: "inline-flex" }}>Go Home</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
