import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SignalGauge from "../components/SignalGauge";

const INTEREST_OPTIONS = [
  { id: "hackathons", label: "Hackathons" },
  { id: "startup", label: "Startup teams" },
  { id: "research", label: "Research" },
  { id: "side-project", label: "Side projects" },
];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [lookingFor, setLookingFor] = useState([]);
  const [skills, setSkills] = useState([]); // [{name, proficiency}]
  const [skillInput, setSkillInput] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setCollege(user.college || "");
      setPortfolioUrl(user.portfolio_url || "");
      setLookingFor(user.looking_for || []);
      setSkills(user.skills || []);
    }
  }, [user]);

  useEffect(() => {
    api.get("/users/skills/catalog").then((res) => setCatalog(res.data)).catch(() => {});
  }, []);

  const toggleInterest = (id) => {
    setLookingFor((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addSkill = (name) => {
    const clean = name.trim().toLowerCase();
    if (!clean || skills.some((s) => s.name === clean)) return;
    setSkills((prev) => [...prev, { name: clean, proficiency: 3 }]);
    setSkillInput("");
  };

  const removeSkill = (name) => setSkills((prev) => prev.filter((s) => s.name !== name));

  const setProficiency = (name, proficiency) => {
    setSkills((prev) => prev.map((s) => (s.name === name ? { ...s, proficiency } : s)));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.put("/users/me", {
        bio, college, portfolio_url: portfolioUrl, looking_for: lookingFor, skills,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-indigo">Your profile</p>
          <h1 className="mt-2 font-display text-3xl font-medium">{user.name}</h1>
        </div>
        <SignalGauge value={user.rating_score} label="Rating score" color="#3634E0" />
      </div>

      <form onSubmit={onSave} className="mt-10 space-y-8">
        <section>
          <h2 className="text-sm font-medium text-ink/70">About</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm text-ink/60">Bio</span>
              <textarea
                className="input min-h-[100px]" value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What are you building, and what kind of teammate are you looking for?"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-ink/60">College / affiliation</span>
              <input className="input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="MNNIT Allahabad" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-ink/60">Portfolio / GitHub / LinkedIn</span>
              <input className="input" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://github.com/you" />
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-ink/70">Looking for</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                type="button" key={opt.id} onClick={() => toggleInterest(opt.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  lookingFor.includes(opt.id)
                    ? "border-indigo bg-indigo text-paper"
                    : "border-line bg-white text-ink/70 hover:border-indigo/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-ink/70">Skills</h2>
          <p className="mt-1 text-xs text-ink/50">Add what you're strong in — this drives your matches.</p>
          <div className="mt-3 flex gap-2">
            <input
              className="input" value={skillInput} list="skill-catalog"
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
              placeholder="e.g. python, figma, product management"
            />
            <datalist id="skill-catalog">
              {catalog.map((s) => <option key={s.id} value={s.name} />)}
            </datalist>
            <button
              type="button" onClick={() => addSkill(skillInput)}
              className="shrink-0 rounded-xl border border-line bg-white px-4 text-sm font-medium hover:border-indigo/50"
            >
              Add
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {skills.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5">
                <span className="flex-1 text-sm font-medium capitalize">{s.name}</span>
                <input
                  type="range" min="1" max="5" value={s.proficiency}
                  onChange={(e) => setProficiency(s.name, Number(e.target.value))}
                  className="w-28 accent-indigo"
                />
                <span className="w-14 font-mono text-xs text-ink/50">
                  {["", "beginner", "learning", "solid", "strong", "expert"][s.proficiency]}
                </span>
                <button type="button" onClick={() => removeSkill(s.name)} className="text-ink/40 hover:text-red-600">✕</button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-ink/40">No skills added yet.</p>}
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            disabled={saving}
            className="rounded-full bg-indigo px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
          {saved && <span className="text-sm font-medium text-sage">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}
