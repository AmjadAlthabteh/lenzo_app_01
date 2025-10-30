export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') return new Response('Bad request', { status: 400 })
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 })

    const resp = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'omni-moderation-latest', input: text }),
    })
    if (!resp.ok) return new Response('Moderation error', { status: 502 })
    const data = await resp.json()
    return Response.json(data)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), { status: 500 })
  }
}

