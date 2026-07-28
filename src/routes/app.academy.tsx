import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { BookOpen, PlayCircle, Lock, CheckCircle2, Scale, Shield, FileText, Zap } from "lucide-react";

export const Route = createFileRoute("/app/academy")({
  head: () => ({
    meta: [
      { title: "Academy · LawQuest" },
      { name: "description", content: "Structured legal literacy tracks — constitutional, criminal, consumer, cyber and contract law taught in bite-sized lessons." },
      { property: "og:title", content: "Academy · LawQuest" },
      { property: "og:description", content: "Bite-sized legal literacy tracks." },
    ],
  }),
  component: AcademyPage,
});

const TRACKS = [
  { icon: Scale, title: "Constitutional Fundamentals", lessons: 24, done: 18, color: "text-accent" },
  { icon: Shield, title: "Consumer Rights in India", lessons: 16, done: 12, color: "text-success" },
  { icon: FileText, title: "Contracts & Agreements", lessons: 20, done: 9, color: "text-warning" },
  { icon: Zap, title: "Cyber Law Essentials", lessons: 14, done: 3, color: "text-accent" },
];

const LESSONS = [
  { n: 1, title: "What is a contract?", duration: "6 min", status: "done" as const },
  { n: 2, title: "Essential elements — offer & acceptance", duration: "8 min", status: "done" as const },
  { n: 3, title: "Consideration and its exceptions", duration: "10 min", status: "done" as const },
  { n: 4, title: "Void, voidable and unenforceable agreements", duration: "12 min", status: "active" as const },
  { n: 5, title: "Breach and remedies", duration: "14 min", status: "locked" as const },
  { n: 6, title: "Case workshop — Balfour v. Balfour", duration: "18 min", status: "locked" as const },
];

function AcademyPage() {
  return (
    <AppShell
      title="Academy"
      subtitle="Adaptive tracks that turn dense law into durable knowledge. Every lesson feeds your courtroom performance."
    >
      {/* Tracks */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACKS.map((t) => {
          const pct = Math.round((t.done / t.lessons) * 100);
          return (
            <div key={t.title} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors">
              <div className="grid place-items-center size-11 rounded-xl bg-accent/10 border border-accent/30">
                <t.icon className={`size-5 ${t.color}`} />
              </div>
              <div className="mt-4 font-display font-semibold text-sm leading-snug">{t.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t.done} / {t.lessons} lessons</div>
              <div className="mt-3 h-1.5 rounded-full bg-surface overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-accent)" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Current track */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs text-accent">
            <BookOpen className="size-3.5" /> CURRENT TRACK
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold">Contracts & Agreements</h2>
          <p className="mt-1 text-sm text-muted-foreground">Master the Indian Contract Act, 1872 through worked examples and mini-cases.</p>

          <ul className="mt-6 space-y-2">
            {LESSONS.map((l) => (
              <li key={l.n}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                    l.status === "active" ? "border-accent/40 bg-accent/5" : "border-border hover:bg-surface/50"
                  }`}>
                <div className="grid place-items-center size-9 rounded-lg bg-surface border border-border">
                  {l.status === "done" ? <CheckCircle2 className="size-4 text-success" />
                   : l.status === "active" ? <PlayCircle className="size-4 text-accent" />
                   : <Lock className="size-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    <span className="font-mono text-xs text-muted-foreground mr-2">L{l.n}</span>
                    {l.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{l.duration}</div>
                </div>
                {l.status === "active" && (
                  <button className="h-8 px-3 rounded-lg text-xs font-semibold text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
                    Resume
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Recommended</div>
          <h3 className="mt-2 font-display text-lg font-semibold">Precedent Mastery</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Three short lessons on citing case law persuasively. Your coach flagged this as your highest-leverage upgrade.
          </p>
          <button className="mt-4 w-full h-10 rounded-xl text-sm font-semibold border border-accent/40 text-accent hover:bg-accent/10">
            Start track
          </button>
        </aside>
      </div>
    </AppShell>
  );
}
