import { motion } from "framer-motion";
import {
  Bot, Gavel, Brain, Trophy, GraduationCap, ShieldCheck,
  Sparkles, Users, BookOpen, Zap, Check, Star, ArrowRight, Scale,
} from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export function Stats() {
  const stats = [
    { v: "120K+", l: "Learners empowered" },
    { v: "450+", l: "Simulated cases" },
    { v: "98%", l: "Comprehension lift" },
    { v: "24 / 7", l: "AI legal assistant" },
  ];
  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="container-lq py-10 grid grid-cols-2 md:grid-cols-4 gap-y-6">
        {stats.map((s) => (
          <div key={s.l} className="text-center md:text-left">
            <div className="font-mono text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Bot, title: "AI Legal Assistant", desc: "Ask anything about your rights in plain English or Hindi. Cited, contextual, and always educational." },
  { icon: Gavel, title: "Courtroom Simulator", desc: "Argue live cases before an AI judge. Submit reasoning, hear objections, earn a verdict." },
  { icon: Brain, title: "Adaptive Quizzes", desc: "AI-generated questions that adjust to weak areas and reinforce lasting recall." },
  { icon: Trophy, title: "Gamified Progression", desc: "XP, coins, streaks, badges and certified milestones designed by learning scientists." },
  { icon: GraduationCap, title: "Structured Academy", desc: "Six pillars from Consumer Rights to Cyber Safety, taught by legal educators." },
  { icon: ShieldCheck, title: "Ethical by Design", desc: "Educational only. Transparent sources. Never a substitute for a licensed attorney." },
];

export function Features() {
  return (
    <section id="features" className="py-28">
      <div className="container-lq">
        <motion.div {...fade} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-accent">
            <Sparkles className="size-3.5" /> PLATFORM
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient">
            A complete legal literacy operating system.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Every surface engineered for depth, retention, and clarity — from
            first principles to real-world application.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fade}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-accent/40 transition-colors overflow-hidden"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="grid place-items-center size-11 rounded-xl bg-surface border border-border">
                <f.icon className="size-5 text-accent" />
              </div>
              <div className="mt-5 font-display font-semibold text-lg">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CourtroomDemo() {
  return (
    <section id="courtroom" className="py-28 border-t border-border/60">
      <div className="container-lq grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...fade}>
          <div className="inline-flex items-center gap-2 text-xs text-accent">
            <Gavel className="size-3.5" /> HERO FEATURE
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Step inside the courtroom.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Select a scenario. Review evidence and witness statements. Argue
            your case. Our AI judge evaluates your reasoning, legal grounding,
            and communication — then delivers a verdict.
          </p>
          <ul className="mt-8 space-y-3">
            {["Case brief with evidence & witness statements", "Real-time AI judge & opposing counsel", "Scored on reasoning, concepts & communication", "Earn XP, coins & achievements"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <Check className="size-4 text-accent mt-0.5" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade} className="relative">
          <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/70">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
              </div>
              <div className="text-xs text-muted-foreground font-mono">CASE #0421 · Consumer Rights</div>
              <div className="text-xs text-accent">In session</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-surface border border-border p-4">
                <div className="text-xs text-muted-foreground mb-1">AI JUDGE</div>
                <p className="text-sm">Counsel, please present your opening argument regarding the refund dispute under Section 2(1)(g) of the Consumer Protection Act.</p>
              </div>
              <div className="rounded-xl bg-accent/10 border border-accent/30 p-4">
                <div className="text-xs text-accent mb-1">YOU · DEFENSE</div>
                <p className="text-sm text-foreground/90">Your Honor, the retailer's return policy is void as it contradicts statutory rights under Section 17…</p>
              </div>
              <div className="rounded-xl bg-surface border border-border p-4">
                <div className="text-xs text-muted-foreground mb-1">OPPOSING COUNSEL</div>
                <p className="text-sm">Objection — the plaintiff waived those rights upon accepting the digital terms of sale.</p>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">Reasoning</span>
                  <div className="w-24 h-1 rounded bg-border overflow-hidden"><div className="h-full w-4/5" style={{ background: "var(--gradient-accent)" }} /></div>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs text-accent">Submit rebuttal <ArrowRight className="size-3" /></button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const modules = [
  { icon: Scale, title: "Constitution Basics", lessons: 24 },
  { icon: ShieldCheck, title: "Consumer Rights", lessons: 18 },
  { icon: Zap, title: "Cyber Safety", lessons: 21 },
  { icon: Users, title: "Employment Rights", lessons: 16 },
  { icon: BookOpen, title: "Traffic & Motor Law", lessons: 12 },
  { icon: Sparkles, title: "Digital Fraud Awareness", lessons: 14 },
];

export function Academy() {
  return (
    <section id="academy" className="py-28 border-t border-border/60">
      <div className="container-lq">
        <motion.div {...fade} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-accent">
            <GraduationCap className="size-3.5" /> ACADEMY
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient">
            Six pillars. One structured journey.
          </h2>
        </motion.div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div key={m.title} {...fade} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border bg-gradient-to-b from-card to-surface p-6 hover:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="grid place-items-center size-11 rounded-xl bg-accent/10 border border-accent/30">
                  <m.icon className="size-5 text-accent" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{m.lessons} lessons</span>
              </div>
              <div className="mt-6 font-display text-lg font-semibold">{m.title}</div>
              <div className="mt-4 h-1 rounded bg-border overflow-hidden">
                <div className="h-full" style={{ width: `${30 + i * 10}%`, background: "var(--gradient-accent)" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gamification() {
  return (
    <section className="py-28 border-t border-border/60">
      <div className="container-lq grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
        <motion.div {...fade} className="order-2 lg:order-1 grid grid-cols-2 gap-4">
          {[
            { l: "Current level", v: "Advocate II", icon: Trophy },
            { l: "Daily streak", v: "27 days", icon: Zap },
            { l: "Coins", v: "8,420", icon: Sparkles },
            { l: "Global rank", v: "#128", icon: Star },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <k.icon className="size-5 text-accent" />
              <div className="mt-6 text-xs text-muted-foreground uppercase tracking-wider">{k.l}</div>
              <div className="mt-1 font-mono text-2xl font-bold">{k.v}</div>
            </div>
          ))}
        </motion.div>
        <motion.div {...fade} className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 text-xs text-accent">
            <Trophy className="size-3.5" /> GAMIFICATION
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Progression that rewards <span className="text-copper">mastery.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            XP, streaks, coins, weekly challenges and verifiable certificates —
            engineered with learning scientists to reinforce durable recall.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const testimonials = [
  { q: "Finally a legal product that respects the user's intelligence. The courtroom mode is unreal.", a: "Ananya R.", r: "Law Student, NLSIU" },
  { q: "We onboard new paralegals with LawQuest before they touch a real file. Retention is measurably higher.", a: "Marcus L.", r: "Partner, Halden & Roe" },
  { q: "The AI assistant explained my tenancy rights better than three google rabbit holes.", a: "Priya S.", r: "Product Designer" },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-border/60">
      <div className="container-lq">
        <motion.h2 {...fade} className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient max-w-2xl">
          Trusted by students, professionals & firms.
        </motion.h2>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure key={i} {...fade} transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col">
              <div className="flex gap-0.5 text-accent mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="size-4 fill-current" />)}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">"{t.q}"</blockquote>
              <figcaption className="mt-6 pt-4 border-t border-border">
                <div className="text-sm font-semibold">{t.a}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const tiers = [
  { name: "Explorer", price: "Free", tagline: "For curious learners", features: ["3 courtroom cases / month", "Adaptive quiz engine", "Community leaderboards"], cta: "Start free" },
  { name: "Advocate", price: "$12", suffix: "/mo", tagline: "For serious students", features: ["Unlimited courtroom cases", "AI assistant · unlimited", "Certificates & badges", "Priority AI response"], cta: "Start 14-day trial", featured: true },
  { name: "Firm", price: "Custom", tagline: "For teams & institutions", features: ["Team dashboards & analytics", "Custom case libraries", "SSO & admin controls", "Dedicated success manager"], cta: "Contact sales" },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 border-t border-border/60">
      <div className="container-lq">
        <motion.div {...fade} className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs text-accent">PRICING</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient">
            Simple, honest pricing.
          </h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready to argue with the best.</p>
        </motion.div>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <motion.div key={t.name} {...fade} transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-7 flex flex-col ${t.featured ? "border-accent/50 bg-gradient-to-b from-accent/10 to-card shadow-[var(--shadow-glow)]" : "border-border bg-card"}`}>
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.tagline}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold">{t.price}</span>
                {t.suffix && <span className="text-muted-foreground text-sm">{t.suffix}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-accent mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-8 h-11 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 ${t.featured ? "text-accent-foreground" : "bg-foreground text-background"}`}
                style={t.featured ? { background: "var(--gradient-accent)" } : undefined}>
                {t.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "Is LawQuest a substitute for a lawyer?", a: "No. LawQuest is an educational platform. Our AI provides context, examples and general legal literacy — it never replaces personalized advice from a licensed attorney." },
  { q: "Which jurisdictions are supported?", a: "Our current content library focuses on Indian law with growing coverage of US federal law. Firm plans can add custom jurisdiction packs." },
  { q: "How does the AI courtroom evaluate arguments?", a: "Arguments are scored across three axes: legal reasoning, conceptual grounding and communication clarity. Each dimension is transparent in your report." },
  { q: "Can I use LawQuest for team training?", a: "Yes. The Firm plan includes team dashboards, analytics, SSO and a dedicated success manager for institutional rollouts." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-28 border-t border-border/60">
      <div className="container-lq grid lg:grid-cols-[1fr_1.4fr] gap-14">
        <motion.div {...fade}>
          <div className="inline-flex items-center gap-2 text-xs text-accent">FAQ</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-gradient">
            Questions, answered.
          </h2>
        </motion.div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <motion.details key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.05 }} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-display font-semibold text-lg">{f.q}</span>
                <span className="text-accent text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section id="get-started" className="py-28">
      <div className="container-lq">
        <motion.div {...fade} className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 md:p-16 text-center">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient max-w-3xl mx-auto">
            The law shouldn't be a mystery.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Join 120,000+ learners mastering their rights through play.
          </p>
          <a href="#" className="mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-accent)" }}>
            Begin your quest <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const groups = [
    { t: "Product", l: ["Features", "Courtroom", "Academy", "Pricing"] },
    { t: "Company", l: ["About", "Careers", "Press", "Contact"] },
    { t: "Legal", l: ["Privacy", "Terms", "Disclaimer", "Cookies"] },
  ];
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="container-lq py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center size-8 rounded-lg" style={{ background: "var(--gradient-accent)" }}>
              <Scale className="size-4 text-accent-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-lg">LAW<span className="text-copper">QUEST</span></span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            AI-powered legal literacy. Educational only — not a substitute for a licensed attorney.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.t}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{g.t}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {g.l.map((x) => <li key={x}><a href="#" className="hover:text-accent transition-colors">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="container-lq py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} LawQuest, Inc. All rights reserved.</div>
          <div>Learn law. Play smart. Know your rights.</div>
        </div>
      </div>
    </footer>
  );
}
