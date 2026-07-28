import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Gavel, Mic, Send, Paperclip, ShieldCheck, Scale,
  FileText, Users, Sparkles, Clock, Trophy, ChevronRight, Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/courtroom")({
  head: () => ({
    meta: [
      { title: "AI Courtroom · LawQuest" },
      { name: "description", content: "Step into the LawQuest AI courtroom. Argue live cases before an AI judge, respond to opposing counsel and earn a verdict on your reasoning." },
      { property: "og:title", content: "AI Courtroom · LawQuest" },
      { property: "og:description", content: "Argue live cases before an AI judge in a cinematic courtroom simulation." },
    ],
  }),
  component: CourtroomPage,
});

type Turn = {
  role: "judge" | "opposing" | "you" | "clerk";
  name: string;
  text: string;
};

const CASE = {
  id: "0421",
  title: "Ravi Kumar v. NexaMart Retail Pvt. Ltd.",
  matter: "Consumer Rights · Refund Refusal on Digital Purchase",
  jurisdiction: "Consumer Protection Act, 2019 · §2(1)(g), §17",
  bench: "Hon'ble AI Judge · District Consumer Disputes Redressal Commission",
  facts:
    "The plaintiff purchased a smart television via NexaMart's app. The unit failed within 48 hours. The retailer refused refund citing a 'no returns on electronics' clause buried in the digital terms of sale.",
  evidence: [
    { id: "EX-A", label: "Order invoice & delivery log", type: "Document" },
    { id: "EX-B", label: "Product failure video (48h post-delivery)", type: "Media" },
    { id: "EX-C", label: "NexaMart Terms of Sale (excerpt)", type: "Document" },
    { id: "EX-D", label: "Prior CDRC ruling — Sharma v. E-Bazaar (2022)", type: "Precedent" },
  ],
};

const INITIAL_TURNS: Turn[] = [
  {
    role: "clerk",
    name: "Court Clerk",
    text: "All rise. The District Consumer Commission is now in session. Case number 0421, Ravi Kumar versus NexaMart Retail Private Limited, refund dispute under the Consumer Protection Act.",
  },
  {
    role: "judge",
    name: "Hon'ble AI Judge",
    text: "Counsel for the plaintiff, you may present your opening argument. Please ground your submission in the applicable statutory provisions.",
  },
];

const SUGGESTED = [
  "Cite §2(1)(g) — deficiency in service",
  "Argue statutory rights override the retailer's clause",
  "Invoke Sharma v. E-Bazaar (2022) precedent",
];

function CourtroomPage() {
  const [turns, setTurns] = useState<Turn[]>(INITIAL_TURNS);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [score, setScore] = useState({ reasoning: 62, concepts: 71, communication: 58 });
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value) return;
    setDraft("");
    setTurns((t) => [...t, { role: "you", name: "You · Counsel for Plaintiff", text: value }]);
    setThinking(true);

    // Simulated adversary + judge response
    await new Promise((r) => setTimeout(r, 900));
    setTurns((t) => [
      ...t,
      {
        role: "opposing",
        name: "Opposing Counsel · NexaMart",
        text: "Objection, Your Honor. The plaintiff assented to the terms of sale, including the electronics no-returns clause, at checkout. Assent constitutes waiver.",
      },
    ]);
    await new Promise((r) => setTimeout(r, 900));
    setTurns((t) => [
      ...t,
      {
        role: "judge",
        name: "Hon'ble AI Judge",
        text: "Noted. Counsel for plaintiff, address whether a contractual clause may waive statutory consumer rights under §17. Cite authority.",
      },
    ]);
    setThinking(false);
    setScore((s) => ({
      reasoning: Math.min(100, s.reasoning + 4),
      concepts: Math.min(100, s.concepts + 3),
      communication: Math.min(100, s.communication + 5),
    }));
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-surface/60 backdrop-blur-xl">
        <div className="container-lq h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4" /> Exit courtroom
            </Link>
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">In session</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-mono text-foreground">CASE #{CASE.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="hidden sm:flex items-center gap-1.5"><Clock className="size-3.5" /> <span className="font-mono">{mm}:{ss}</span></div>
            <div className="hidden sm:flex items-center gap-1.5"><Trophy className="size-3.5 text-accent" /> <span className="font-mono">+280 XP</span></div>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-destructive/15 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
              Rest case
            </button>
          </div>
        </div>
      </header>

      {/* Body: 3-column */}
      <div className="container-lq flex-1 grid lg:grid-cols-[280px_1fr_320px] gap-6 py-6">
        {/* Left: Case brief */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto pr-1">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <FileText className="size-3.5" /> CASE BRIEF
            </div>
            <div className="mt-3 font-display text-lg font-semibold leading-snug">{CASE.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{CASE.matter}</div>
            <div className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">Bench</div>
            <div className="mt-1 text-sm">{CASE.bench}</div>
            <div className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">Jurisdiction</div>
            <div className="mt-1 text-sm">{CASE.jurisdiction}</div>
            <div className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">Facts</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{CASE.facts}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Paperclip className="size-3.5" /> EVIDENCE ON RECORD
            </div>
            <ul className="mt-3 space-y-2">
              {CASE.evidence.map((e) => (
                <li key={e.id} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface transition-colors cursor-pointer">
                  <div className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/30 rounded px-1.5 py-0.5">{e.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{e.label}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{e.type}</div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center: Courtroom stage + transcript + composer */}
        <section className="flex flex-col gap-4 min-w-0">
          <CourtroomStage speaking={turns[turns.length - 1]?.role} />

          <div
            ref={scrollRef}
            className="flex-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col min-h-[320px] max-h-[46vh] lg:max-h-none"
          >
            <div className="flex items-center justify-between px-5 h-11 border-b border-border bg-surface/70">
              <div className="text-xs font-mono text-muted-foreground">LIVE TRANSCRIPT</div>
              <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
                <Volume2 className="size-3.5" /> Read aloud
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence initial={false}>
                {turns.map((t, i) => (
                  <TurnBubble key={i} turn={t} />
                ))}
              </AnimatePresence>
              {thinking && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="size-1.5 rounded-full bg-accent animate-pulse [animation-delay:120ms]" />
                  <span className="size-1.5 rounded-full bg-accent animate-pulse [animation-delay:240ms]" />
                  Opposing counsel is responding…
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
            className="rounded-2xl border border-border bg-card p-3"
          >
            <div className="flex flex-wrap gap-1.5 px-1 pb-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraft(s)}
                  className="text-xs px-2.5 h-7 rounded-full border border-border bg-surface hover:border-accent/40 hover:text-foreground text-muted-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(draft);
                  }
                }}
                rows={2}
                placeholder="Address the bench. Cite statute, precedent, and reasoning."
                className="flex-1 resize-none bg-surface border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
              />
              <button type="button" className="size-11 grid place-items-center rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground" aria-label="Voice">
                <Mic className="size-4" />
              </button>
              <button
                type="submit"
                disabled={!draft.trim() || thinking}
                className="h-11 px-4 inline-flex items-center gap-1.5 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] disabled:opacity-50"
                style={{ background: "var(--gradient-accent)" }}
              >
                Submit <Send className="size-4" />
              </button>
            </div>
          </form>
        </section>

        {/* Right: Live scoring + participants */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto pr-1">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Sparkles className="size-3.5" /> LIVE EVALUATION
            </div>
            <div className="mt-4 space-y-4">
              <ScoreBar label="Legal reasoning" value={score.reasoning} />
              <ScoreBar label="Conceptual grounding" value={score.concepts} />
              <ScoreBar label="Communication" value={score.communication} />
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Judge's note</div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Strong statutory anchoring so far. Precedent citation will lift your reasoning score materially.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Users className="size-3.5" /> PARTICIPANTS
            </div>
            <ul className="mt-4 space-y-3">
              {[
                { name: "Hon'ble AI Judge", role: "Presiding", icon: Gavel },
                { name: "You", role: "Counsel · Plaintiff", icon: ShieldCheck },
                { name: "Nexa Counsel AI", role: "Defense", icon: Scale },
                { name: "Court Clerk", role: "Record", icon: FileText },
              ].map((p) => (
                <li key={p.name} className="flex items-center gap-3">
                  <div className="grid place-items-center size-9 rounded-lg bg-surface border border-border">
                    <p.icon className="size-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CourtroomStage({ speaking }: { speaking?: Turn["role"] }) {
  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-b from-[oklch(0.22_0.03_260)] to-[oklch(0.14_0.03_260)] overflow-hidden shadow-[var(--shadow-card)]">
      <div aria-hidden className="absolute inset-0 opacity-40" style={{
        background: "radial-gradient(ellipse at 50% 10%, oklch(0.7 0.09 55 / 0.35), transparent 60%)",
      }} />
      <div aria-hidden className="absolute inset-0 grid-lines opacity-20" />

      {/* Wood paneling */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24" style={{
        background:
          "repeating-linear-gradient(90deg, oklch(0.28 0.05 55) 0 40px, oklch(0.24 0.05 55) 40px 80px)",
        opacity: 0.35,
      }} />

      <div className="relative p-6 sm:p-8">
        {/* Seal */}
        <div className="flex flex-col items-center">
          <div className="grid place-items-center size-16 rounded-full border-2 border-accent/50 bg-accent/10 shadow-[var(--shadow-glow)]">
            <Scale className="size-7 text-accent" />
          </div>
          <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Ordo Ex Lege</div>
        </div>

        {/* Bench */}
        <div className="mt-6 relative">
          <div className="mx-auto max-w-md h-3 rounded-t-md bg-[oklch(0.32_0.05_55)]/60" />
          <div className="mx-auto max-w-sm rounded-2xl border border-accent/30 bg-[oklch(0.2_0.03_260)]/80 backdrop-blur px-5 py-4 text-center">
            <Participant name="AI Judge" role="Presiding" icon={Gavel} active={speaking === "judge" || speaking === "clerk"} tone="judge" big />
          </div>
        </div>

        {/* Counsel tables */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto">
          <CounselTable label="Plaintiff · You" active={speaking === "you"} tone="you" />
          <CounselTable label="Defense · NexaMart" active={speaking === "opposing"} tone="opposing" />
        </div>

        {/* Gallery dots */}
        <div className="mt-8 flex justify-center gap-1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="size-1.5 rounded-full bg-foreground/20" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Participant({
  name, role, icon: Icon, active, tone, big,
}: {
  name: string; role: string; icon: React.ComponentType<{ className?: string }>;
  active?: boolean; tone: "judge" | "you" | "opposing"; big?: boolean;
}) {
  const ring = tone === "judge" ? "ring-accent/60" : tone === "you" ? "ring-success/60" : "ring-destructive/50";
  return (
    <div className="flex flex-col items-center">
      <div className={`relative grid place-items-center rounded-full bg-surface border border-border ${big ? "size-16" : "size-12"} ${active ? `ring-2 ${ring}` : ""}`}>
        <Icon className={`${big ? "size-6" : "size-5"} text-accent`} />
        {active && (
          <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-success ring-2 ring-background animate-pulse" />
        )}
      </div>
      <div className={`mt-2 font-display font-semibold ${big ? "text-sm" : "text-xs"}`}>{name}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{role}</div>
    </div>
  );
}

function CounselTable({ label, active, tone }: { label: string; active?: boolean; tone: "you" | "opposing" }) {
  const Icon = tone === "you" ? ShieldCheck : Scale;
  return (
    <div className={`relative rounded-xl border ${active ? "border-accent/50" : "border-border"} bg-[oklch(0.22_0.03_260)]/60 backdrop-blur px-4 py-4 flex items-center gap-3 transition-colors`}>
      <div className={`grid place-items-center size-10 rounded-lg ${tone === "you" ? "bg-success/15" : "bg-destructive/10"}`}>
        <Icon className={`size-5 ${tone === "you" ? "text-success" : "text-destructive"}`} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {active ? "Speaking" : "At the bar"}
        </div>
      </div>
      {active && <span className="ml-auto size-2 rounded-full bg-success animate-pulse" />}
    </div>
  );
}

function TurnBubble({ turn }: { turn: Turn }) {
  const styles: Record<Turn["role"], { label: string; wrap: string; body: string }> = {
    judge:    { label: "text-accent",      wrap: "bg-accent/5 border-accent/20",           body: "text-foreground" },
    opposing: { label: "text-destructive", wrap: "bg-destructive/5 border-destructive/20", body: "text-foreground/90" },
    you:      { label: "text-success",     wrap: "bg-success/10 border-success/25",        body: "text-foreground" },
    clerk:    { label: "text-muted-foreground", wrap: "bg-surface border-border",           body: "text-muted-foreground italic" },
  };
  const s = styles[turn.role];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border p-4 ${s.wrap}`}
    >
      <div className={`text-[10px] uppercase tracking-widest ${s.label}`}>{turn.name}</div>
      <p className={`mt-1.5 text-sm leading-relaxed ${s.body}`}>{turn.text}</p>
    </motion.div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6 }}
          className="h-full"
          style={{ background: "var(--gradient-accent)" }}
        />
      </div>
    </div>
  );
}
