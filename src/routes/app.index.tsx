import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { motion } from "framer-motion";
import {
  Gavel, BookOpen, Brain, TrendingUp, Flame, Award,
  ArrowRight, Clock, ChevronRight, Sparkles, Target,
} from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · LawQuest" },
      { name: "description", content: "Your LawQuest dashboard: active cases, learning progress, daily quests and adaptive recommendations." },
      { property: "og:title", content: "Dashboard · LawQuest" },
      { property: "og:description", content: "Continue your legal literacy journey." },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { label: "XP earned", value: "8,240", delta: "+320 today", icon: TrendingUp },
  { label: "Streak", value: "27d", delta: "Personal best", icon: Flame },
  { label: "Cases won", value: "18 / 24", delta: "75% verdict rate", icon: Gavel },
  { label: "Rank", value: "#412", delta: "↑ 18 this week", icon: Award },
];

const QUESTS = [
  { title: "Argue Case #0421", detail: "Consumer Rights · 12 min", reward: "+280 XP", to: "/courtroom", icon: Gavel },
  { title: "Complete Contracts Module 4", detail: "Void agreements & remedies", reward: "+120 XP", to: "/app/academy", icon: BookOpen },
  { title: "Ace 5 quiz questions", detail: "Constitutional law · adaptive", reward: "+90 XP", to: "/app/quizzes", icon: Brain },
];

const CONTINUE = [
  { case: "Ravi Kumar v. NexaMart", chapter: "Rebuttal · Statutory rights", progress: 62, to: "/courtroom" },
  { case: "IPC §420 — Fraud fundamentals", chapter: "Lesson 3 of 6", progress: 45, to: "/app/academy" },
  { case: "Constitutional law weekly quiz", chapter: "Question 3 of 10", progress: 30, to: "/app/quizzes" },
];

function DashboardPage() {
  return (
    <AppShell
      title="Welcome back, Ada."
      subtitle="Your bench is set. You have 3 quests waiting and one case ready for closing arguments."
      actions={
        <Link
          to="/courtroom"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-accent)" }}
        >
          <Gavel className="size-4" /> Enter courtroom
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</span>
              <s.icon className="size-4 text-accent" />
            </div>
            <div className="mt-3 font-mono text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Continue */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Continue where you left off</h2>
            <Link to="/app/cases" className="text-xs text-accent hover:text-accent-light inline-flex items-center gap-1">
              View all <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-border/60">
            {CONTINUE.map((c) => (
              <li key={c.case}>
                <Link to={c.to} className="group flex items-center gap-4 py-4 hover:bg-surface/50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="grid place-items-center size-11 rounded-xl bg-surface border border-border">
                    <Clock className="size-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.case}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.chapter}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: "var(--gradient-accent)" }} />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{c.progress}%</span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Daily quests */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-accent" />
            <h2 className="font-display text-lg font-semibold">Daily quests</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Reset in 6h 42m</p>
          <ul className="mt-5 space-y-3">
            {QUESTS.map((q) => (
              <li key={q.title}>
                <Link to={q.to} className="group flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/40 transition-colors">
                  <div className="grid place-items-center size-9 rounded-lg bg-accent/10 border border-accent/30">
                    <q.icon className="size-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{q.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{q.detail}</div>
                  </div>
                  <span className="font-mono text-[11px] text-accent">{q.reward}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* AI insight */}
      <section className="mt-6 rounded-2xl border border-accent/30 p-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-start gap-4">
          <div className="grid place-items-center size-11 rounded-xl bg-accent/15 border border-accent/40">
            <Sparkles className="size-5 text-accent" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-accent">AI coach insight</div>
            <p className="mt-1 text-sm text-foreground leading-relaxed max-w-2xl">
              Your reasoning score is up <span className="text-accent font-semibold">14%</span> this week, but citation strength lags.
              Try the <Link to="/app/academy" className="underline decoration-accent/50 hover:text-accent">Precedent Mastery</Link> module —
              3 short lessons should close the gap before your next hearing.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
