import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AiResult, PageHeader, useAi } from "@/components/AiResult";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [
    { title: "Smart Email Generator — Bloom AI" },
    { name: "description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
    { property: "og:title", content: "Smart Email Generator — Bloom AI" },
    { property: "og:description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
  ] }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const ai = useAi("email");
  const [tone, setTone] = useState<string>("Formal");
  const [recipient, setRecipient] = useState("");
  const [brief, setBrief] = useState("");
  const prompt = () => `Tone: ${tone}\nRecipient: ${recipient || "Not specified"}\nInstructions: ${brief}`;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Smart Email Generator" subtitle="Describe what you need — Bloom writes it for you." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-5 rounded-3xl border bg-card p-5" onSubmit={(e) => { e.preventDefault(); void ai.run(prompt()); }}>
          <div className="space-y-2">
            <Label>Tone</Label>
            <ToggleGroup type="single" value={tone} onValueChange={(v) => v && setTone(v)} className="justify-start">
              {TONES.map((t) => <ToggleGroupItem key={t} value={t} className="rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">{t}</ToggleGroupItem>)}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rcpt">Recipient (optional)</Label>
            <Input id="rcpt" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, Head of Marketing" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brief">What should the email say?</Label>
            <Textarea id="brief" rows={8} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="e.g. Ask to move Friday's review to Monday because the design files aren't ready yet." />
          </div>
          <Button type="submit" disabled={!brief.trim() || ai.loading} className="w-full rounded-full bg-bloom-primary">
            <Sparkles /> {ai.loading ? "Writing…" : "Generate email"}
          </Button>
        </form>
        <AiResult ai={ai} onRegenerate={() => void ai.run(prompt())} emptyHint="Your email draft will appear here." />
      </div>
    </div>
  );
}
