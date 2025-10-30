import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: { include: { tag: true } } },
    take: 50,
  })
  return Response.json(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      story: p.story,
      summary: p.summary,
      mediaUrl: p.mediaUrl,
      user: p.author?.name || 'Someone',
      tags: p.tags.map((t) => `#${t.tag.name}`),
      createdAt: p.createdAt,
    }))
  )
}

