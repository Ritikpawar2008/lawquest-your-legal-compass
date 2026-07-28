import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Send, Sparkles, Scale, FileText, Shield, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/assistant")({
  head: () => ({
    meta: [
      { title: "AI Legal Assistant · LawQuest" },
      { name: "description", content: "Ask any legal question in plain language. Your LawQuest AI assistant explains rights, statutes and precedents on demand." },
      { property: "og:title", content: "AI Legal Assistant · LawQuest" },
      { property: "og:description", content: "Understand your rights in plain language." },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const PROMPTS = [
  { icon: Shield, label: "What are my rights if my landlord withholds my deposit?" },
  { icon: Scale, label: "Explain the difference between IPC §420 and §406 in plain English." },
  { icon: FileText, label: "Draft a legal notice for a delayed refund from an e-commerce site." },
  { icon: Zap, label: "Is my employer allowed to monitor my personal chats on work devices?" },
];

function AssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm your LawQuest counsel. Ask me anything — from tenant deposits and refund disputes to constitutional principles. I'll cite the statute, explain it plainly, and flag what a licensed attorney should confirm.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = async (text: string) => {
    const v = text.trim();
    if (!v) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: v }]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 900));
    setMsgs((m) => [
      ...m,
      {
        role: "assistant",
        text:
          "Short answer: yes, you likely have grounds to recover the deposit. Under most state Rent Control Acts, a landlord must return the security deposit within a defined window (typically 30 days) minus lawful deductions for damages beyond normal wear. Ask for an itemised deduction statement in writing; if refused, a written legal notice usually resolves it before any commission filing is needed.\n\n⚖️ This is general guidance, not a substitute for a licensed attorney in your jurisdiction.",
      },
    ]);
    setThinking(false);
  };

  return (
    <AppShell
      title="AI Legal Assistant"
      subtitle="Plain-language answers grounded in statute and precedent. Available 24/7 across practice areas."
    >
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <section className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`grid place-items-center size-9 rounded-xl shrink-0 ${
                    m.role === "user" ? "bg-surface border border-border" : "border border-accent/40"
                  }`}
                  style={m.role === "assistant" ? { background: "var(--gradient-accent)" } : undefined}
                >
                  {m.role === "assistant" ? <Sparkles className="size-4 text-accent-foreground" /> : <span className="text-xs font-semibold">You</span>}
                </div>
                <div className={`max-w-2xl ${m.role === "user" ? "text-right" : ""}`}>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                    {m.role === "user" ? "You" : "LawQuest AI"}
                  </div>
                  <div
                    className={`inline-block text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface border border-border text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="size-1.5 rounded-full bg-accent animate-pulse [animation-delay:120ms]" />
                <span className="size-1.5 rounded-full bg-accent animate-pulse [animation-delay:240ms]" />
                Researching statute & precedent…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-4 flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={2}
              placeholder="Ask about a law, right, statute or draft a notice…"
              className="flex-1 resize-none bg-surface border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="h-11 px-4 inline-flex items-center gap-1.5 rounded-xl text-sm font-semibold text-accent-foreground disabled:opacity-50 shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-accent)" }}
            >
              Send <Send className="size-4" />
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Try asking</div>
            <ul className="mt-3 space-y-2">
              {PROMPTS.map((p) => (
                <li key={p.label}>
                  <button
                    onClick={() => send(p.label)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-border hover:border-accent/40 hover:bg-surface/40 transition-colors"
                  >
                    <p.icon className="size-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground leading-snug">{p.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-accent/30 p-5" style={{ background: "var(--gradient-hero)" }}>
            <div className="text-xs uppercase tracking-widest text-accent">Disclaimer</div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              LawQuest AI provides legal information for educational purposes. It is not a substitute for advice from a licensed attorney in your jurisdiction.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
