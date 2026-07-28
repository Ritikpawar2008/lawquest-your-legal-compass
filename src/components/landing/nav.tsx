import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Link } from "@tanstack/react-router";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Courtroom", href: "/courtroom" },
  { label: "Academy", href: "/#academy" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70"
    >
      <div className="container-lq flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center size-8 rounded-lg bg-gradient-to-br from-accent to-accent-light shadow-[var(--shadow-glow)]">
            <Scale className="size-4 text-accent-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            LAW<span className="text-copper">QUEST</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            search={{ mode: "signin" }}
            className="hidden sm:inline-flex items-center h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
