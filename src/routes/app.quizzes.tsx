import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Brain, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/quizzes")({
  head: () => ({
    meta: [
      { title: "Adaptive Quizzes · LawQuest" },
      { name: "description", content: "Adaptive quizzes that adjust difficulty to your reasoning level and target concepts you keep missing." },
      { property: "og:title", content: "Adaptive Quizzes · LawQuest" },
      { property: "og:description", content: "Sharpen your legal reasoning question by question." },
    ],
  }),
  component: QuizzesPage,
});

const QUESTION = {
  n: 3,
  total: 10,
  area: "Consumer Rights",
  difficulty: "Medium",
  prompt: "A seller's terms of sale include a 'no returns on electronics' clause. A product fails within 48 hours. Under the Consumer Protection Act, 2019, which statement is most accurate?",
  options: [
    { id: "a", text: "The clause is binding; the consumer waived their rights at checkout." },
    { id: "b", text: "The clause cannot override statutory rights under §2(1)(g) — deficiency in service." },
    { id: "c", text: "The clause is valid only if the product is over ₹50,000." },
    { id: "d", text: "The consumer must first arbitrate before filing a complaint." },
  ],
  correct: "b",
  rationale: "Statutory consumer rights, including protection against 'deficiency in service' under §2(1)(g), cannot be contracted away through boilerplate clauses buried in digital terms.",
};

function QuizzesPage() {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;
  const correct = picked === QUESTION.correct;

  return (
    <AppShell
      title="Adaptive quizzes"
      subtitle="Your quiz engine adapts in real time — targets gaps, retires mastered concepts, keeps you in flow."
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between text-xs">
            <div className="inline-flex items-center gap-2 text-accent">
              <Brain className="size-3.5" /> ADAPTIVE · {QUESTION.area}
            </div>
            <div className="font-mono text-muted-foreground">Q{QUESTION.n} / {QUESTION.total}</div>
          </div>

          {/* Progress */}
          <div className="mt-3 h-1.5 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(QUESTION.n / QUESTION.total) * 100}%`, background: "var(--gradient-accent)" }} />
          </div>

          <h2 className="mt-6 font-display text-xl sm:text-2xl font-semibold leading-snug">{QUESTION.prompt}</h2>

          <ul className="mt-6 space-y-3">
            {QUESTION.options.map((o) => {
              const isPicked = picked === o.id;
              const isCorrect = revealed && o.id === QUESTION.correct;
              const isWrong = revealed && isPicked && !correct;
              return (
                <li key={o.id}>
                  <button
                    onClick={() => !revealed && setPicked(o.id)}
                    disabled={revealed}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      isCorrect ? "border-success/60 bg-success/5"
                      : isWrong ? "border-destructive/60 bg-destructive/5"
                      : isPicked ? "border-accent/60 bg-accent/5"
                      : "border-border hover:border-accent/40 hover:bg-surface/40"
                    }`}
                  >
                    <span className="font-mono text-xs size-7 grid place-items-center rounded-lg bg-surface border border-border uppercase">{o.id}</span>
                    <span className="flex-1 text-sm">{o.text}</span>
                    {isCorrect && <CheckCircle2 className="size-5 text-success" />}
                    {isWrong && <XCircle className="size-5 text-destructive" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {revealed && (
            <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <div className="flex items-center gap-2 text-xs text-accent">
                <Sparkles className="size-3.5" /> {correct ? "Correct · +90 XP" : "Not quite"}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{QUESTION.rationale}</p>
              <button
                onClick={() => setPicked(null)}
                className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-accent-foreground"
                style={{ background: "var(--gradient-accent)" }}
              >
                Next question <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Session</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Stat label="Correct" value="7" tone="success" />
              <Stat label="Streak" value="4" tone="accent" />
              <Stat label="XP" value="540" tone="accent" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Focus areas</div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { l: "Consumer rights", v: 82 },
                { l: "Precedent citation", v: 54 },
                { l: "Statutory interpretation", v: 68 },
              ].map((f) => (
                <li key={f.l}>
                  <div className="flex justify-between text-xs"><span>{f.l}</span><span className="font-mono text-muted-foreground">{f.v}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-surface overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f.v}%`, background: "var(--gradient-accent)" }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "success" | "accent" }) {
  const color = tone === "success" ? "text-success" : "text-accent";
  return (
    <div className="rounded-xl bg-surface border border-border p-3 text-center">
      <div className={`font-mono text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
