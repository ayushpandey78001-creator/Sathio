import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SignalGauge from "../components/SignalGauge";

export default function Connections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/connections");
      setConnections(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, accept) => {
    try {
      await api.put(`/connections/${id}/respond`, null, { params: { accept } });
      load();
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  if (!user || connections === null) {
    return <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-ink/50">Loading…</div>;
  }

  const pending = connections.filter((c) => c.status === "pending");
  const accepted = connections.filter((c) => c.status === "accepted");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-indigo">Connections</p>
      <h1 className="mt-2 font-display text-3xl font-medium">Your network</h1>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink/70">Pending ({pending.length})</h2>
        <div className="mt-3 space-y-3">
          {pending.length === 0 && <p className="text-sm text-ink/40">No pending requests.</p>}
          {pending.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-4">
                <SignalGauge value={c.other_user.rating_score} size={44} />
                <div>
                  <p className="font-display text-base font-medium">{c.other_user.name}</p>
                  <p className="text-xs text-ink/50">{c.other_user.college}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respond(c.id, true)}
                  className="rounded-full bg-indigo px-4 py-1.5 text-xs font-medium text-paper hover:bg-indigo-dark"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(c.id, false)}
                  className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink/60 hover:border-ink/40"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink/70">Connected ({accepted.length})</h2>
        <div className="mt-3 space-y-3">
          {accepted.length === 0 && <p className="text-sm text-ink/40">No connections yet — go discover some matches.</p>}
          {accepted.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-4">
                <SignalGauge value={c.other_user.rating_score} size={44} color="#0E9E8E" />
                <div>
                  <p className="font-display text-base font-medium">{c.other_user.name}</p>
                  <p className="text-xs text-ink/50">{c.other_user.bio}</p>
                </div>
              </div>
              {c.other_user.portfolio_url && (
                <a
                  href={c.other_user.portfolio_url} target="_blank" rel="noreferrer"
                  className="shrink-0 text-xs font-medium text-indigo hover:text-indigo-dark"
                >
                  View portfolio →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
