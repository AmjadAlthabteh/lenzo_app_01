import { z } from "zod";

const InSchema = z.object({
  title: z.string().min(1).max(120),
  story: z.string().min(1).max(5000),
  mediaUrl: z.string().url().optional(),
  // Optional pre-supplied AI results from client
  ai: z
    .object({
      summary: z.string().max(300).optional(),
      tags: z.array(z.string()).max(10).optional(),
    })
    .optional(),
});

export type AITaskInput = z.infer<typeof InSchema>;

export type AITaskOutput = {
  title: string;
  story: string;
  mediaUrl?: string;
  summary: string;
  tags: string[];
};

function normalizeWhitespace(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function normalizeTags(tags: string[]) {
  const dedup = new Set<string>();
  for (const t of tags) {
    const norm = t.toLowerCase().trim().replace(/^#+/, "");
    if (!norm) continue;
    dedup.add(`#${norm}`);
  }
  return Array.from(dedup).slice(0, 5);
}

async function moderate(text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { flagged: false };
  const resp = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
  });
  if (!resp.ok) return { flagged: false };
  const data = await resp.json();
  const flagged = Boolean(data?.results?.[0]?.flagged);
  return { flagged };
}

async function summarizeAndTag(text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback when no key is set
    const fallback = text.slice(0, 220);
    return { summary: fallback, tags: [] as string[] };
  }
  const prompt = `You help users post short experiences. Return strict JSON with keys summary (<=240 chars) and tags (<=5 lowercase hashtags).\nTEXT: ${text}`;
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });
  if (!r.ok) {
    const fallback = text.slice(0, 220);
    return { summary: fallback, tags: [] as string[] };
  }
  const data = await r.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return { summary: text.slice(0, 220), tags: [] };
  try {
    const parsed = JSON.parse(content);
    const summary = normalizeWhitespace(
      String(parsed.summary || "").slice(0, 240)
    );
    const tags = Array.isArray(parsed.tags) ? normalizeTags(parsed.tags) : [];
    return { summary, tags };
  } catch {
    return { summary: text.slice(0, 220), tags: [] };
  }
}

export async function runPostPipeline(
  input: AITaskInput
): Promise<AITaskOutput> {
  const parsed = InSchema.parse({
    ...input,
    title: normalizeWhitespace(input.title),
    story: normalizeWhitespace(input.story),
  });

  const combinedText = `${parsed.title}\n${parsed.story}`;

  const { flagged } = await moderate(combinedText);
  if (flagged) {
    const err = new Error("Content flagged by moderation");
    (err as any).code = "MODERATION_FLAGGED";
    throw err;
  }

  let summary = parsed.ai?.summary
    ? normalizeWhitespace(parsed.ai.summary).slice(0, 240)
    : "";
  let tags = parsed.ai?.tags ? normalizeTags(parsed.ai.tags) : [];

  if (!summary || tags.length === 0) {
    const s = await summarizeAndTag(combinedText);
    summary = summary || s.summary;
    tags = tags.length ? tags : s.tags;
  }

  return {
    title: parsed.title,
    story: parsed.story,
    mediaUrl: parsed.mediaUrl,
    summary,
    tags,
  };
}
