import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <svg width="26" height="26" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="15" fill="#3634E0" />
        <circle cx="10" cy="12" r="3" fill="#F6F4EE" />
        <circle cx="22" cy="12" r="3" fill="#F6F4EE" />
        <circle cx="16" cy="22" r="3" fill="#F2A93B" />
        <line x1="10" y1="12" x2="16" y2="22" stroke="#F6F4EE" strokeWidth="1.5" />
        <line x1="22" y1="12" x2="16" y2="22" stroke="#F6F4EE" strokeWidth="1.5" />
        <line x1="10" y1="12" x2="22" y2="12" stroke="#F6F4EE" strokeWidth="1.5" />
      </svg>
      <span className="font-display text-xl font-medium tracking-tight">sathio</span>
    </Link>
  );
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? "text-ink" : "text-ink/50 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        {user ? (
          <nav className="flex items-center gap-6">
            <Link to="/discover" className={linkClass("/discover")}>Discover</Link>
            <Link to="/connections" className={linkClass("/connections")}>Connections</Link>
            <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
            >
              Log out
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink">Log in</Link>
            <Link
              to="/signup"
              className="rounded-full bg-indigo px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark"
            >
              Join early access
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
