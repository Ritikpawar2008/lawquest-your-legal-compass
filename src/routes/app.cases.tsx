import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Gavel, Filter, Plus, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/cases")({
  head: () => ({
    meta: [
      { title: "Cases · LawQuest" },
      { name: "description", content: "Browse and continue simulated cases across consumer, criminal, constitutional and cyber law." },
      { property: "og:title", content: "Cases · LawQuest" },
      { property: "og:description", content: "The LawQuest case library." },
    ],
  }),
  component: CasesPage,
});

type Case = {
  id: string; title: string; area: string; difficulty: "Easy" | "Medium" | "Hard";
  status: "Active" | "New" | "Won" | "Lost"; xp: number; duration: string;
};

const CASES: Case[] = [
  { id: "0421", title: "Ravi Kumar v. NexaMart Retail Pvt. Ltd.", area: "Consumer Rights", difficulty: "Medium", status: "Active", xp: 280, duration: "12 min" },
  { id: "0418", title: "State v. Mehta — §420 IPC", area: "Criminal Law", difficulty: "Hard", status: "New", xp: 420, duration: "22 min" },
  { id: "0416", title: "Ananya Sharma v. TechCorp — Data breach", area: "Cyber Law", difficulty: "Hard", status: "New", xp: 500, duration: "25 min" },
  { id: "0410", title: "Public Interest Litigation — Air quality", area: "Constitutional", difficulty: "Medium", status: "Won", xp: 360, duration: "18 min" },
  { id: "0402", title: "Landlord–Tenant dispute · Delhi Rent Act", area: "Property", difficulty: "Easy", status: "Won", xp: 180, duration: "10 min" },
  { id: "0398", title: "Trademark infringement — LuxeCo", area: "IP Law", difficulty: "Medium", status: "Lost", xp: 240, duration: "16 min" },
];

const FILTERS = ["All", "Active", "New", "Won", "Lost"] as const;

function CasesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = filter === "All" ? CASES : CASES.filter((c) => c.status === filter);

  return (
    <AppShell
      title="Case library"
      subtitle="Argue simulated cases across practice areas. Every case earns XP, sharpens reasoning and unlocks new precedents."
      actions={
        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-accent)" }}>
          <Plus className="size-4" /> Generate custom case
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 h-8 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? "bg-card text-foreground shadow-[var(--shadow-card)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="ml-auto inline-flex items-center gap-2 h-9 px-3 rounded-lg text-xs bg-surface border border-border text-muted-foreground hover:text-foreground">
          <Filter className="size-3.5" /> Filter
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className="group rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/30 rounded px-1.5 py-0.5">
                #{c.id}
              </span>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 font-display font-semibold text-base leading-snug">{c.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.area}</div>

            <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {c.duration}</span>
              <span className="inline-flex items-center gap-1"><TrendingUp className="size-3 text-accent" /> +{c.xp} XP</span>
              <span className={`ml-auto ${c.difficulty === "Hard" ? "text-destructive" : c.difficulty === "Medium" ? "text-warning" : "text-success"}`}>
                {c.difficulty}
              </span>
            </div>

            <Link
              to="/courtroom"
              className="mt-5 inline-flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
            >
              <Gavel className="size-4" /> {c.status === "Active" ? "Resume" : "Open case"}
            </Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: Case["status"] }) {
  const map = {
    Active: "bg-accent/15 text-accent border-accent/30",
    New: "bg-success/10 text-success border-success/30",
    Won: "bg-success/10 text-success border-success/30",
    Lost: "bg-destructive/10 text-destructive border-destructive/30",
  } as const;
  return <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${map[status]}`}>{status}</span>;
}
