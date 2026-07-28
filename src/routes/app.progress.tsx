import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Trophy, Flame, Star, Zap, Award, Target } from "lucide-react";

export const Route = createFileRoute("/app/progress")({
  head: () => ({
    meta: [
      { title: "Progress · LawQuest" },
      { name: "description", content: "Track your XP, streaks, badges and skill mastery across every legal domain in LawQuest." },
      { property: "og:title", content: "Progress · LawQuest" },
      { property: "og:description", content: "Your legal literacy journey, visualised." },
    ],
  }),
  component: ProgressPage,
});

const BADGES = [
  { icon: Trophy, name: "First Verdict", desc: "Won your first case", earned: true },
  { icon: Flame, name: "Iron Streak", desc: "14-day learning streak", earned: true },
  { icon: Star, name: "Cite the Bench", desc: "Used 10 precedents in argument", earned: true },
  { icon: Zap, name: "Rapid Counsel", desc: "Closed a case in under 8 min", earned: true },
  { icon: Award, name: "Constitutional Sage", desc: "Master 25 constitutional lessons", earned: false },
  { icon: Target, name: "Perfect Cross", desc: "Score 100 on communication", earned: false },
];

const SKILLS = [
  { label: "Legal reasoning", value: 78 },
  { label: "Conceptual grounding", value: 84 },
  { label: "Communication", value: 66 },
  { label: "Precedent citation", value: 54 },
  { label: "Statutory interpretation", value: 71 },
];

const LEADERBOARD = [
  { rank: 1, name: "Kabir Sethi", xp: "14,220", you: false },
  { rank: 2, name: "Meera Iyer", xp: "12,910", you: false },
  { rank: 3, name: "Ada Advocate", xp: "8,240", you: true },
  { rank: 4, name: "Rohan Verma", xp: "7,880", you: false },
  { rank: 5, name: "Priya Nair", xp: "6,540", you: false },
];

function ProgressPage() {
  return (
    <AppShell
      title="Your progress"
      subtitle="Every lesson, argument and quiz answer compounds into measurable legal literacy."
    >
      {/* Top: level card + skills */}
      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="rounded-2xl border border-accent/30 p-6" style={{ background: "var(--gradient-hero)" }}>
          <div className="text-xs uppercase tracking-widest text-accent">Level 12 · Advocate</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold">8,240</span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">1,760 XP to Level 13 · Senior Advocate</div>
          <div className="mt-4 h-2 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "82%", background: "var(--gradient-accent)" }} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card/60 border border-border p-3 text-center">
              <div className="font-mono text-2xl font-bold text-accent">27</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Day streak</div>
            </div>
            <div className="rounded-xl bg-card/60 border border-border p-3 text-center">
              <div className="font-mono text-2xl font-bold text-accent">#412</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Global rank</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Skill mastery</h2>
          <p className="mt-1 text-xs text-muted-foreground">Updated after every courtroom session and quiz.</p>
          <ul className="mt-6 space-y-4">
            {SKILLS.map((s) => (
              <li key={s.label}>
                <div className="flex justify-between text-sm"><span>{s.label}</span><span className="font-mono text-muted-foreground">{s.value}</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-surface overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: "var(--gradient-accent)" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Badges */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((b) => (
            <div key={b.name}
                 className={`rounded-2xl border p-5 text-center ${b.earned ? "border-accent/40 bg-card" : "border-border bg-card/40 opacity-50"}`}>
              <div className={`mx-auto grid place-items-center size-12 rounded-full border ${b.earned ? "border-accent/50 bg-accent/10" : "border-border bg-surface"}`}>
                <b.icon className={`size-5 ${b.earned ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <div className="mt-3 font-display font-semibold text-sm">{b.name}</div>
              <div className="mt-1 text-[11px] text-muted-foreground leading-snug">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Weekly leaderboard</h2>
        <ul className="mt-4 divide-y divide-border/60">
          {LEADERBOARD.map((r) => (
            <li key={r.rank} className={`flex items-center gap-4 py-3 px-2 rounded-lg ${r.you ? "bg-accent/5" : ""}`}>
              <span className="font-mono text-sm w-8 text-muted-foreground">#{r.rank}</span>
              <div className={`size-9 rounded-full grid place-items-center font-display font-bold text-sm ${r.you ? "text-accent-foreground" : "bg-surface border border-border"}`}
                   style={r.you ? { background: "var(--gradient-accent)" } : undefined}>
                {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 text-sm font-medium">
                {r.name} {r.you && <span className="text-xs text-accent ml-2">You</span>}
              </div>
              <div className="font-mono text-sm text-muted-foreground">{r.xp} XP</div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
