export const runtime = "edge";

type Out = {
  summary: string;
  tags: string[];
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
      });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server missing OPENAI_API_KEY" }),
        { status: 500 }
      );
    }

    const prompt = `You are helping users post short experiences. Given the text, produce a concise, vivid 1-2 sentence summary (max 240 chars) and 5 short lowercase hashtags. Respond ONLY as compact JSON with keys summary and tags.\n\nTEXT:\n${text}`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You respond with strict JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(
        JSON.stringify({ error: "OpenAI error", detail: err }),
        { status: 500 }
      );
    }

    const data = await resp.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Empty response from model" }),
        { status: 500 }
      );
    }

    let parsed: Out | null = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback: attempt to extract JSON substring
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!parsed || !parsed.summary || !Array.isArray(parsed.tags)) {
      return new Response(
        JSON.stringify({ error: "Bad JSON from model", raw: content }),
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "Unknown error" }),
      { status: 500 }
    );
  }
}
