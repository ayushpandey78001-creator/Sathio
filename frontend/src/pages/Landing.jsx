import { Link } from "react-router-dom";
import SignalGraph from "../components/SignalGraph";

const USE_CASES = [
  { tag: "Hackathons", copy: "Assemble a team before the clock starts, not after." },
  { tag: "Startups", copy: "Find a co-founder who's missing the half of the stack you're not." },
  { tag: "Research", copy: "Pair up with someone whose curiosity runs parallel to yours." },
  { tag: "Side projects", copy: "The project you keep putting off needs one more pair of hands." },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-indigo">Early access · limited seats</p>
          <h1 className="mt-4 font-display text-balance text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            Find your missing teammate.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Somewhere on your campus is someone searching for exactly the skills you have.
            Sathio reads your skills and interests, scores your profile, and surfaces the
            people worth building with.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="rounded-full bg-indigo px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark"
            >
              Get early access
            </Link>
            <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink">
              I already have an account →
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
          <SignalGraph />
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y border-line bg-white/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-medium">Built for whatever you're building.</h2>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((u) => (
              <div key={u.tag} className="bg-paper p-6">
                <p className="font-mono text-xs uppercase tracking-wider text-sage">{u.tag}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{u.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-medium">How your signal gets found.</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs text-indigo">01 — Broadcast</p>
            <p className="mt-2 font-display text-lg">Add your skills</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              List what you're good at and what you're looking to build. It takes two minutes.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-indigo">02 — Score</p>
            <p className="mt-2 font-display text-lg">Get your rating</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              A completeness score makes strong profiles easy to trust and easy to find.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-indigo">03 — Tune in</p>
            <p className="mt-2 font-display text-lg">Discover matches</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              See people ranked by shared skills and interests, and send a connection request.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-medium">Only 40 seats left in this cohort.</h2>
          <Link
            to="/signup"
            className="mt-6 inline-block rounded-full bg-indigo px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-indigo-dark"
          >
            Join Sathio early access
          </Link>
        </div>
      </section>
    </div>
  );
}
