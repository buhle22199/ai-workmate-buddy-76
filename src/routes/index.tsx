import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, MessageSquare, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewsWidget } from "@/components/reviews-widget";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const features = [
  {
    to: "/email-generator" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in Formal, Friendly, or Persuasive tones — signed by U. Dunywa.",
  },
  {
    to: "/meeting-summarizer" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn long notes into a summary with action items, decisions, and deadlines.",
  },
  {
    to: "/chatbot" as const,
    icon: MessageSquare,
    title: "AI Workplace Chatbot",
    desc: "A strict workplace assistant that cites its references on every reply.",
  },
];

function Dashboard() {
  return (
    <div className="bg-hero-glow">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" /> No sign-in. No data stored.
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Work smarter with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A modern workplace productivity assistant that drafts emails, summarizes meetings, and
            answers work questions — with references.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
              <Link to="/email-generator">
                Start with Email <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/chatbot">Chat with AI</Link>
            </Button>
          </div>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition hover:border-primary/50 hover:shadow-glow">
                <CardHeader>
                  <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    <span>{f.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Privacy-first", desc: "No accounts, no data retention." },
            { icon: Zap, title: "Fast drafts", desc: "Structured prompts, instant results." },
            { icon: Sparkles, title: "Editable outputs", desc: "Refine every AI response inline." },
          ].map((s) => (
            <Card key={s.title}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <ReviewsWidget compact />
        </section>
      </div>
    </div>
  );
}
