import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiResult, PageHeader, useAi } from "@/components/AiResult";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [
    { title: "AI Task Planner — Bloom AI" },
    { name: "description", content: "Build a realistic daily or weekly schedule from your tasks and deadlines." },
    { property: "og:title", content: "AI Task Planner — Bloom AI" },
    { property: "og:description", content: "Build a realistic daily or weekly schedule from your tasks and deadlines." },
  ] }),
  component: PlannerPage,
});

type Task = { id: number; name: string; priority: string; deadline: string; hours: string };
let nextId = 1;
const blank = (): Task => ({ id: nextId++, name: "", priority: "Medium", deadline: "", hours: "" });

function PlannerPage() {
  const ai = useAi("planner");
  const [period, setPeriod] = useState("Daily");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [tasks, setTasks] = useState<Task[]>(() => [blank()]);
  const valid = tasks.filter((t) => t.name.trim());
  const update = (id: number, patch: Partial<Task>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const prompt = () =>
    `Plan type: ${period}\nWorking hours: ${start}–${end}\nToday: ${new Date().toDateString()}\nTasks:\n` +
    valid.map((t) => `- ${t.name} | Priority: ${t.priority} | Deadline: ${t.deadline || "none"} | Estimated hours: ${t.hours || "unknown"}`).join("\n");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="AI Task Planner" subtitle="Add your tasks — Bloom builds a realistic schedule." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-5 rounded-3xl border bg-card p-5" onSubmit={(e) => { e.preventDefault(); void ai.run(prompt()); }}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <ToggleGroup type="single" value={period} onValueChange={(v) => v && setPeriod(v)}>
                {["Daily", "Weekly"].map((p) => <ToggleGroupItem key={p} value={p} className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">{p}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
            <div className="space-y-2"><Label htmlFor="s">Start</Label><Input id="s" type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="e">End</Label><Input id="e" type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            <Label>Tasks</Label>
            {tasks.map((t, i) => (
              <div key={t.id} className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-3 sm:grid-cols-[1fr_110px_140px_70px_auto]">
                <Input aria-label={`Task ${i + 1}`} className="col-span-2 sm:col-span-1 bg-card" placeholder="Task name" value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} />
                <Select value={t.priority} onValueChange={(v) => update(t.id, { priority: v })}>
                  <SelectTrigger aria-label="Priority" className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>{["High", "Medium", "Low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Input aria-label="Deadline" type="date" className="bg-card" value={t.deadline} onChange={(e) => update(t.id, { deadline: e.target.value })} />
                <Input aria-label="Hours" type="number" min="0" step="0.5" placeholder="hrs" className="bg-card" value={t.hours} onChange={(e) => update(t.id, { hours: e.target.value })} />
                <Button type="button" size="icon" variant="ghost" aria-label="Remove task" disabled={tasks.length === 1} onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))}><X /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="rounded-full" onClick={() => setTasks((ts) => [...ts, blank()])}><Plus /> Add task</Button>
          </div>
          <Button type="submit" disabled={!valid.length || ai.loading} className="w-full rounded-full bg-bloom-primary">
            <Sparkles /> {ai.loading ? "Planning…" : "Generate schedule"}
          </Button>
        </form>
        <AiResult ai={ai} onRegenerate={() => void ai.run(prompt())} emptyHint="Your schedule will appear here." />
      </div>
    </div>
  );
}
