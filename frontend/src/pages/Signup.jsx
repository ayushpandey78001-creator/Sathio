import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/api";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/profile");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-indigo">Early access</p>
      <h1 className="mt-3 font-display text-3xl font-medium">Create your account</h1>
      <p className="mt-2 text-sm text-ink/60">Two minutes, then you're on the map.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label="Full name">
          <input
            required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input" placeholder="Ridham Sharma"
          />
        </Field>
        <Field label="Email">
          <input
            required type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input" placeholder="you@college.edu"
          />
        </Field>
        <Field label="Password">
          <input
            required type="password" minLength={6} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input" placeholder="At least 6 characters"
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-indigo px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo hover:text-indigo-dark">Log in</Link>
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
