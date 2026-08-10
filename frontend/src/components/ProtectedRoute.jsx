import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="px-6 py-16 text-center text-sm text-ink/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
