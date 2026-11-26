import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PROMPTS = {
  email: `You are Bloom AI, an expert workplace writing assistant. Write one complete professional email based on the user's instructions in the requested tone (Formal, Friendly or Persuasive). Start with "Subject: ..." on the first line, then a blank line, then the email body with greeting and sign-off. Use only facts the user provided; use [placeholders] for missing names or details. Plain text only, no markdown.`,
  meeting: `You are Bloom AI, a meeting notes analyst. Summarize the user's raw meeting notes into this plain-text structure:
SUMMARY
(2-3 sentences)

KEY POINTS
- ...

DECISIONS
- ...

ACTION ITEMS
- [Task] — Owner: [name or "Unassigned"] — Deadline: [date or "Not specified"]

Only use information present in the notes. Never invent owners or dates. No markdown symbols besides dashes.`,
  planner: `You are Bloom AI, a realistic productivity planner. From the user's tasks, priorities and deadlines, build a practical schedule for the requested period (daily or weekly). Order by priority and deadline, use time blocks (e.g. 09:00–10:30), include short breaks, and do not overload the day. Plain text format:
OVERVIEW
(1-2 sentences)

SCHEDULE
[Day/Time block] — [Task] (Priority)

TIPS
- ...
No markdown symbols besides dashes.`,
} as const;

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ feature: z.enum(["email", "meeting", "planner"]), prompt: z.string().min(1).max(20000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "AI is not configured." };
    try {
      const { generateWithGateway } = await import("@/server/ai-gateway.server");
      const text = await generateWithGateway(apiKey, PROMPTS[data.feature], data.prompt);
      if (!text.trim()) return { ok: false as const, error: "The AI returned an empty response." };
      return { ok: true as const, text: text.trim() };
    } catch (e) {
      const err = e as { statusCode?: number; message?: string };
      const s = err.statusCode;
      const msg =
        s === 429 ? "Too many requests — please wait a moment and try again."
        : s === 402 ? "AI credits are used up. Please add credits to continue."
        : s === 403 ? "AI access is not available for this workspace right now."
        : err.message || "Something went wrong generating a response.";
      return { ok: false as const, error: msg };
    }
  });
