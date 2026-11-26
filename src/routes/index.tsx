import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, NotebookPen, CalendarCheck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bloom AI — Your AI workplace assistant" },
    { name: "description", content: "Write emails, summarize meetings and plan your week with Bloom AI." },
    { property: "og:title", content: "Bloom AI — Your AI workplace assistant" },
    { property: "og:description", content: "Write emails, summarize meetings and plan your week with Bloom AI." },
  ] }),
  component: Dashboard,
});

const FEATURES = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Turn quick notes into polished emails in a formal, friendly or persuasive tone.", cta: "Write an email" },
  { to: "/meetings", icon: NotebookPen, title: "Meeting Summarizer", desc: "Paste raw notes and get key points, decisions, owners and deadlines.", cta: "Summarize notes" },
  { to: "/planner", icon: CalendarCheck, title: "AI Task Planner", desc: "Share your tasks and deadlines to get a realistic daily or weekly plan.", cta: "Plan my day" },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] bg-bloom p-8 md:p-12 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-widest text-accent-foreground">Welcome back</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          Let's make today calm, clear & <em className="text-primary">beautifully</em> productive.
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft transition hover:-translate-y-0.5">
              <f.icon className="size-4 text-primary" /> {f.cta}
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Link key={f.to} to={f.to} className="group flex flex-col rounded-3xl border bg-card p-6 transition hover:shadow-soft">
            <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><f.icon className="size-5" /></span>
            <h2 className="mt-4 font-display text-xl">{f.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Bloom AI drafts content using a live AI model. Outputs may contain mistakes — always review before using them at work.
      </p>
    </div>
  );
}
