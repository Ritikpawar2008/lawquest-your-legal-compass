import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Gavel } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-workspace.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="container-lq pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground"
            >
              <Sparkles className="size-3.5 text-accent" />
              AI-powered legal literacy · Now in public beta
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
            >
              <span className="text-gradient">Learn law.</span>
              <br />
              Play smart. <span className="text-copper">Know your rights.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              LAWQUEST turns dense legal knowledge into cinematic courtroom
              simulations, adaptive quizzes, and an AI assistant that explains
              your rights in plain language.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="group inline-flex items-center gap-2 h-12 px-5 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-accent)" }}
              >
                Start learning free
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/courtroom"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl glass text-sm font-medium hover:bg-card/70 transition-colors"
              >
                <Play className="size-4 text-accent" />
                Enter the courtroom
              </Link>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-accent" /> Educational · Not legal advice
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Gavel className="size-4 text-accent" /> Built with legal scholars
              </div>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative aspect-square w-full max-w-[560px] justify-self-center lg:justify-self-end"
    >
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.09 55 / 0.35), transparent 60%)" }}
      />
      <div className="relative size-full rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)]">
        <img
          src={heroImg}
          alt="Premium legal workspace with balance scale, gavel and AI hologram"
          className="size-full object-cover"
          width={1280}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -left-4 top-10 glass rounded-2xl p-4 w-56 shadow-[var(--shadow-card)]"
        style={{ animation: "float 6s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          AI Judge · Live
        </div>
        <div className="mt-2 font-display text-sm font-semibold">Case #0421</div>
        <div className="text-xs text-muted-foreground mt-1">
          Consumer Rights vs. E-Retailer
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full w-3/4 rounded-full" style={{ background: "var(--gradient-accent)" }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -right-2 bottom-8 glass rounded-2xl p-4 w-52 shadow-[var(--shadow-card)]"
        style={{ animation: "float 7s ease-in-out infinite reverse" }}
      >
        <div className="text-xs text-muted-foreground">XP earned today</div>
        <div className="mt-1 font-mono text-2xl font-bold text-copper">+1,240</div>
        <div className="mt-2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i < 4 ? "bg-accent" : "bg-border"}`} />
          ))}
        </div>
      </motion.div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </motion.div>
  );
}
