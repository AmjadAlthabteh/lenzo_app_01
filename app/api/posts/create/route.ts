import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { realtime } from '@/lib/realtime'
import { z } from 'zod'
import { runPostPipeline } from '@/lib/aiTaskManager'

export const runtime = 'nodejs'

const Body = z.object({
  title: z.string().min(1).max(120),
  story: z.string().min(1).max(2000),
  mediaUrl: z.string().url().optional(),
  ai: z
    .object({
      summary: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })
  const json = await req.json()
  const parsed = Body.safeParse(json)
  if (!parsed.success) return new Response('Invalid body', { status: 400 })

  const { title, story, mediaUrl, ai } = parsed.data

  // AI Task Manager pipeline (MUST run before saving)
  let processed
  try {
    processed = await runPostPipeline({ title, story, mediaUrl, ai })
  } catch (e: any) {
    const message = e?.code === 'MODERATION_FLAGGED' ? 'Content flagged by moderation' : (e?.message || 'AI pipeline failed')
    return new Response(message, { status: 400 })
  }

  const post = await prisma.post.create({
    data: {
      title: processed.title,
      story: processed.story,
      mediaUrl: processed.mediaUrl,
      summary: processed.summary,
      authorId: session.user.id,
      tags: processed.tags && processed.tags.length
        ? {
            create: processed.tags.map((t) => ({
              tag: {
                connectOrCreate: { where: { name: t.replace(/^#/, '') }, create: { name: t.replace(/^#/, '') } },
              },
            })),
          }
        : undefined,
    },
    include: { author: true, tags: { include: { tag: true } } },
  })

  const payload = {
    id: post.id,
    title: post.title,
    story: post.story,
    summary: post.summary || undefined,
    mediaUrl: post.mediaUrl || undefined,
    user: post.author?.name || 'Someone',
    tags: post.tags.map((t) => `#${t.tag.name}`),
    createdAt: post.createdAt,
  }
  realtime.emit({ type: 'post.created', post: payload })

  return Response.json(payload)
}
