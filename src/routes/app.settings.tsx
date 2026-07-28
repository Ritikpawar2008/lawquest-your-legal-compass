import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { Bell, Globe, Lock, CreditCard, User } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · LawQuest" },
      { name: "description", content: "Manage your LawQuest profile, notifications, jurisdiction preferences, security and billing." },
      { property: "og:title", content: "Settings · LawQuest" },
      { property: "og:description", content: "Configure your LawQuest experience." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      subtitle="Configure your profile, jurisdiction, notifications and billing."
    >
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications" },
            { icon: Globe, label: "Jurisdiction & language" },
            { icon: Lock, label: "Security" },
            { icon: CreditCard, label: "Billing" },
          ].map((i) => (
            <button
              key={i.label}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-colors ${
                i.active ? "bg-accent/10 text-foreground border border-accent/30" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <i.icon className={`size-4 ${i.active ? "text-accent" : ""}`} /> {i.label}
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full grid place-items-center font-display font-bold text-xl text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
              AA
            </div>
            <div>
              <div className="font-display font-semibold text-lg">Ada Advocate</div>
              <div className="text-sm text-muted-foreground">ada@lawquest.io · Level 12 · Advocate</div>
            </div>
            <button className="ml-auto h-9 px-4 rounded-lg text-xs font-semibold border border-border bg-surface hover:bg-card">Change avatar</button>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <Field label="Full name" value="Ada Advocate" />
            <Field label="Email" value="ada@lawquest.io" type="email" />
            <Field label="Jurisdiction" value="India" />
            <Field label="Preferred language" value="English" />
            <Field label="Practice interest" value="Consumer & Constitutional" />
            <Field label="Timezone" value="Asia/Kolkata (GMT+5:30)" />
          </div>

          <div className="mt-8 border-t border-border pt-6 flex flex-wrap justify-end gap-2">
            <button className="h-10 px-4 rounded-xl text-sm font-medium bg-surface border border-border hover:bg-card">
              Cancel
            </button>
            <button className="h-10 px-4 rounded-xl text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-accent)" }}>
              Save changes
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="mt-1.5 w-full h-11 rounded-xl bg-surface border border-border px-4 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
