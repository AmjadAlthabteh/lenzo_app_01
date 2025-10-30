export const runtime = 'nodejs'
import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(req: Request) {
  const { url } = await req.json()
  try {
    if (!url || typeof url !== 'string') return new Response('Bad request', { status: 400 })
    const r = await fetch(url)
    if (!r.ok) return new Response('Failed to fetch remote', { status: 400 })
    const arrayBuf = await r.arrayBuffer()
    const buf = Buffer.from(arrayBuf)
    const ext = (() => {
      const u = new URL(url)
      const m = u.pathname.match(/\.(\w{2,5})$/)
      return m ? `.${m[1].toLowerCase()}` : ''
    })()
    const fileName = `${randomUUID()}${ext}`
    const dir = join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, fileName), buf)
    const publicUrl = `/uploads/${fileName}`
    return Response.json({ url: publicUrl })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Upload failed' }), { status: 500 })
  }
}

