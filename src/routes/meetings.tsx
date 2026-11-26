import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AiResult, PageHeader, useAi } from "@/components/AiResult";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [
    { title: "Meeting Notes Summarizer — Bloom AI" },
    { name: "description", content: "Turn messy meeting notes into key points, decisions and action items." },
    { property: "og:title", content: "Meeting Notes Summarizer — Bloom AI" },
    { property: "og:description", content: "Turn messy meeting notes into key points, decisions and action items." },
  ] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const ai = useAi("meeting");
  const [notes, setNotes] = useState("");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Meeting Summarizer" subtitle="Paste your notes — get decisions, owners and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-5 rounded-3xl border bg-card p-5" onSubmit={(e) => { e.preventDefault(); void ai.run(notes); }}>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea id="notes" rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw notes or a transcript here…" />
          </div>
          <Button type="submit" disabled={!notes.trim() || ai.loading} className="w-full rounded-full bg-bloom-primary">
            <Sparkles /> {ai.loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </form>
        <AiResult ai={ai} onRegenerate={() => void ai.run(notes)} emptyHint="Your structured summary will appear here." />
      </div>
    </div>
  );
}
