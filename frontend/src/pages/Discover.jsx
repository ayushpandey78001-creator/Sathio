import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../lib/api";
import SignalGauge from "../components/SignalGauge";

export default function Discover() {
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState({});

  const load = async () => {
    try {
      const res = await api.get("/matches");
      setMatches(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const connect = async (userId) => {
    setRequested((prev) => ({ ...prev, [userId]: "sending" }));
    try {
      await api.post(`/connections/request/${userId}`);
      setRequested((prev) => ({ ...prev, [userId]: "sent" }));
    } catch (err) {
      setRequested((prev) => ({ ...prev, [userId]: null }));
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-indigo">Discover</p>
      <h1 className="mt-2 font-display text-3xl font-medium">People on your frequency</h1>
      <p className="mt-2 text-sm text-ink/60">Ranked by shared skills and shared interests.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {matches === null && !error && (
        <p className="mt-10 text-sm text-ink/50">Tuning in…</p>
      )}

      {matches && matches.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="font-display text-lg">No matches yet.</p>
          <p className="mt-2 text-sm text-ink/60">
            Add a few more skills to your profile, or check back once more people join.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {matches?.map((m) => (
          <div key={m.user.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-xl font-medium">{m.user.name}</h3>
                  {m.user.college && <span className="text-sm text-ink/50">{m.user.college}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{m.user.bio || "No bio yet."}</p>

                {m.shared_skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.shared_skills.map((s) => (
                      <span key={s} className="rounded-full bg-sage/10 px-2.5 py-1 font-mono text-[11px] text-sage">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {m.shared_interests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.shared_interests.map((s) => (
                      <span key={s} className="rounded-full bg-amber/10 px-2.5 py-1 font-mono text-[11px] text-amber">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-center gap-3">
                <SignalGauge value={m.match_score} color="#F2A93B" />
                <button
                  onClick={() => connect(m.user.id)}
                  disabled={requested[m.user.id] === "sent" || requested[m.user.id] === "sending"}
                  className="whitespace-nowrap rounded-full border border-indigo px-4 py-1.5 text-sm font-medium text-indigo transition-colors hover:bg-indigo hover:text-paper disabled:opacity-50"
                >
                  {requested[m.user.id] === "sent" ? "Requested ✓" : requested[m.user.id] === "sending" ? "Sending…" : "Connect"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
