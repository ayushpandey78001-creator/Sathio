import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/discover");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/60">Log in to see who's on your frequency.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
          <input
            required type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input" placeholder="you@college.edu"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/70">Password</span>
          <input
            required type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input" placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-indigo px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New here?{" "}
        <Link to="/signup" className="font-medium text-indigo hover:text-indigo-dark">Create an account</Link>
      </p>
    </div>
  );
}
