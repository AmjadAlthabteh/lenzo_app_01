export const runtime = 'nodejs'
import { realtime } from '@/lib/realtime'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (event: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }
      const off = realtime.on((data) => send({ type: 'event', data }))
      send({ type: 'ready' })
      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 15000)
      controller.enqueue(encoder.encode('retry: 5000\n\n'))
      controller.enqueue(encoder.encode('event: open\n'))
      controller.enqueue(encoder.encode('data: "ok"\n\n'))

      return () => {
        off()
        clearInterval(keepAlive)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

