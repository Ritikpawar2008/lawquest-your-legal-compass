import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Scale, Mail, Lock, User, Sparkles, ShieldCheck, Gavel } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in · LawQuest" },
      { name: "description", content: "Sign in or create your LawQuest account to enter the AI courtroom, unlock adaptive quizzes and track your legal literacy journey." },
      { property: "og:title", content: "Sign in · LawQuest" },
      { property: "og:description", content: "Enter the AI courtroom and continue your legal literacy quest." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode = "signin", redirect } = Route.useSearch();
  const navigate = useNavigate();
  const isSignUp = mode === "signup";
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo-only: simulate auth then route into the app dashboard
    await new Promise((r) => setTimeout(r, 700));
    navigate({ to: redirect || "/app" });
  };

  return (
    <main className="relative min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Left: brand panel */}
      <section className="hidden lg:flex flex-col justify-between p-12 border-r border-border/60">
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <span className="grid place-items-center size-8 rounded-lg" style={{ background: "var(--gradient-accent)" }}>
            <Scale className="size-4 text-accent-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            LAW<span className="text-copper">QUEST</span>
          </span>
        </Link>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-accent" /> Welcome back, counselor
          </div>
          <h1 className="mt-6 font-display font-bold text-4xl xl:text-5xl leading-[1.05] tracking-tight text-gradient">
            Step back into the courtroom.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Your streak, XP and open cases are waiting. The AI judge is in session.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Gavel, t: "Resume Case #0421", s: "Consumer Rights vs. E-Retailer" },
              { icon: ShieldCheck, t: "27-day streak", s: "Keep the momentum alive" },
            ].map((x) => (
              <div key={x.t} className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="grid place-items-center size-11 rounded-xl bg-accent/10 border border-accent/30">
                  <x.icon className="size-5 text-accent" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">{x.t}</div>
                  <div className="text-xs text-muted-foreground">{x.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Educational platform · Not a substitute for a licensed attorney.
        </div>
      </section>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center size-8 rounded-lg" style={{ background: "var(--gradient-accent)" }}>
                <Scale className="size-4 text-accent-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-lg">LAW<span className="text-copper">QUEST</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border w-fit">
            <TabLink active={!isSignUp} to="/auth" search={{ mode: "signin" as const, redirect }}>Sign in</TabLink>
            <TabLink active={isSignUp} to="/auth" search={{ mode: "signup" as const, redirect }}>Create account</TabLink>
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
            {isSignUp ? "Start your quest." : "Welcome back."}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp
              ? "Create your account to enter the AI courtroom."
              : "Sign in to continue your legal literacy journey."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {isSignUp && (
              <Field icon={User} label="Full name" type="text" placeholder="Ada Advocate" required />
            )}
            <Field icon={Mail} label="Email" type="email" placeholder="you@example.com" required />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" required />

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="size-3.5 rounded border-border bg-surface accent-[oklch(0.7_0.09_55)]" />
                  Remember me
                </label>
                <a href="#" className="text-accent hover:text-accent-light">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] disabled:opacity-70"
              style={{ background: "var(--gradient-accent)" }}
            >
              {loading ? "Preparing your bench…" : isSignUp ? "Create account" : "Sign in"}
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton label="Google" />
              <SocialButton label="Apple" />
            </div>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            By continuing you agree to our <a href="#" className="text-foreground hover:text-accent">Terms</a> and <a href="#" className="text-foreground hover:text-accent">Privacy Policy</a>.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function TabLink({ active, to, search, children }: { active: boolean; to: string; search: any; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      search={search}
      className={`px-4 h-9 inline-flex items-center rounded-lg text-sm font-medium transition-colors ${
        active ? "bg-card text-foreground shadow-[var(--shadow-card)]" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function Field({
  icon: Icon,
  label,
  ...props
}: { icon: React.ComponentType<{ className?: string }>; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5 relative">
        <Icon className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          {...props}
          className="w-full h-11 rounded-xl bg-surface border border-border pl-10 pr-3 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="h-11 rounded-xl border border-border bg-surface hover:bg-card text-sm font-medium transition-colors"
    >
      {label}
    </button>
  );
}
