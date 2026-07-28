import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Gavel, BookOpen, Brain, MessageSquare, Trophy,
  Users, Settings, Scale, Bell, Search, Sparkles, LogOut, Menu, X, Briefcase,
} from "lucide-react";
import { useState, type ReactNode, type ComponentType } from "react";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }>; badge?: string };

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Practice",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/cases", label: "Cases", icon: Briefcase, badge: "12" },
      { to: "/courtroom", label: "Courtroom", icon: Gavel },
      { to: "/app/assistant", label: "AI Assistant", icon: MessageSquare },
    ],
  },
  {
    section: "Learn",
    items: [
      { to: "/app/academy", label: "Academy", icon: BookOpen },
      { to: "/app/quizzes", label: "Quizzes", icon: Brain, badge: "New" },
    ],
  },
  {
    section: "You",
    items: [
      { to: "/app/progress", label: "Progress", icon: Trophy },
      { to: "/app/community", label: "Community", icon: Users },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 border-r border-border/60 bg-surface/70 backdrop-blur-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-5 flex items-center justify-between border-b border-border/60">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center size-8 rounded-lg" style={{ background: "var(--gradient-accent)" }}>
                <Scale className="size-4 text-accent-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-base tracking-tight">
                LAW<span className="text-copper">QUEST</span>
              </span>
            </Link>
            <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(false)} aria-label="Close">
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {NAV.map((group) => (
              <div key={group.section}>
                <div className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-mono">
                  {group.section}
                </div>
                <ul className="mt-2 space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-colors ${
                            active
                              ? "bg-accent/10 text-foreground border border-accent/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-card"
                          }`}
                        >
                          <Icon className={`size-4 ${active ? "text-accent" : ""}`} />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Streak card */}
          <div className="p-4 border-t border-border/60">
            <div className="rounded-xl p-4 border border-accent/30" style={{ background: "var(--gradient-hero)" }}>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Sparkles className="size-3.5" /> DAILY STREAK
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-bold">27</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                Argue one case today to keep the streak alive.
              </p>
            </div>
            <Link
              to="/auth"
              search={{ mode: "signin" as const }}
              className="mt-3 flex items-center gap-2 px-3 h-9 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <LogOut className="size-3.5" /> Sign out
            </Link>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border/60 bg-background/70 backdrop-blur-xl sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-8">
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>

          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search cases, statutes, precedents…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex-1 sm:flex-none" />

          <button className="relative size-10 grid place-items-center rounded-xl border border-border bg-surface hover:bg-card">
            <Bell className="size-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-border">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium leading-tight">Ada Advocate</div>
              <div className="text-[11px] text-muted-foreground">Level 12 · Advocate</div>
            </div>
            <div
              className="size-9 rounded-full grid place-items-center font-display font-bold text-sm text-accent-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              AA
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
