import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import {
  Stats, Features, CourtroomDemo, Academy, Gamification,
  Testimonials, Pricing, FAQ, CTA, Footer,
} from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LawQuest — Learn Law. Play Smart. Know Your Rights." },
      { name: "description", content: "LawQuest is an AI-powered legal literacy platform with courtroom simulations, adaptive quizzes and a legal assistant that explains your rights in plain language." },
      { property: "og:title", content: "LawQuest — AI-powered legal literacy" },
      { property: "og:description", content: "Cinematic courtroom simulations, adaptive quizzes and an AI assistant that turns dense law into durable knowledge." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <CourtroomDemo />
      <Academy />
      <Gamification />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
