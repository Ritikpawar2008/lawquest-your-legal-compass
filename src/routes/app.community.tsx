import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { MessageSquare, ThumbsUp, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/community")({
  head: () => ({
    meta: [
      { title: "Community · LawQuest" },
      { name: "description", content: "Discuss cases, share arguments and learn together with LawQuest's global community of law students and curious citizens." },
      { property: "og:title", content: "Community · LawQuest" },
      { property: "og:description", content: "Learn law with a community that argues with you, not at you." },
    ],
  }),
  component: CommunityPage,
});

const THREADS = [
  { title: "Best statutory citation in Consumer Rights cases?", author: "Meera Iyer", area: "Consumer Rights", replies: 24, likes: 87 },
  { title: "How would you rebut the 'waiver by assent' argument?", author: "Kabir Sethi", area: "Contracts", replies: 18, likes: 62 },
  { title: "PIL strategy — anyone tried Case #0410?", author: "Rohan Verma", area: "Constitutional", replies: 11, likes: 41 },
  { title: "Cyber Law weekly — data breach fact patterns", author: "Priya Nair", area: "Cyber", replies: 9, likes: 33 },
];

const EVENTS = [
  { date: "Fri · 7 PM IST", title: "Live moot: State v. Mehta", host: "Prof. R. Nanda" },
  { date: "Sat · 11 AM IST", title: "Study jam: Constitutional AMA", host: "Adv. S. Bhattacharya" },
];

function CommunityPage() {
  return (
    <AppShell
      title="Community"
      subtitle="Argue, question and learn out loud with law students, self-learners and mentors across the country."
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Threads */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Active discussions</h2>
            <button className="h-9 px-3 rounded-lg text-xs font-semibold text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
              New thread
            </button>
          </div>
          <ul className="mt-5 divide-y divide-border/60">
            {THREADS.map((t) => (
              <li key={t.title} className="py-4 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full grid place-items-center font-display font-bold text-xs bg-surface border border-border">
                    {t.author.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold group-hover:text-accent transition-colors">{t.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{t.author}</span>
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30">{t.area}</span>
                      <span className="inline-flex items-center gap-1"><MessageSquare className="size-3" /> {t.replies}</span>
                      <span className="inline-flex items-center gap-1"><ThumbsUp className="size-3" /> {t.likes}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Calendar className="size-3.5" /> UPCOMING
            </div>
            <ul className="mt-3 space-y-3">
              {EVENTS.map((e) => (
                <li key={e.title} className="p-3 rounded-xl border border-border">
                  <div className="text-[11px] font-mono text-accent">{e.date}</div>
                  <div className="mt-1 text-sm font-semibold">{e.title}</div>
                  <div className="text-[11px] text-muted-foreground">Hosted by {e.host}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Users className="size-3.5" /> YOUR CIRCLE
            </div>
            <div className="mt-4 flex -space-x-2">
              {["AK", "MI", "RV", "PN", "KS"].map((n, i) => (
                <div key={i} className="size-9 rounded-full grid place-items-center text-xs font-semibold bg-surface border-2 border-card">
                  {n}
                </div>
              ))}
              <div className="size-9 rounded-full grid place-items-center text-xs font-mono bg-accent/10 border-2 border-card text-accent">+12</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">17 peers studying Consumer Rights this week.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
