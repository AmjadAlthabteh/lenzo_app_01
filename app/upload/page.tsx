"use client"
import { useState } from 'react'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiTags, setAiTags] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  async function handleAIGenerate() {
    setLoading(true)
    setError(null)
    setAiSummary(null)
    setAiTags(null)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${title}\n\n${story}`.trim() }),
      })
      if (!res.ok) throw new Error('AI request failed')
      const data = await res.json()
      setAiSummary(data.summary)
      setAiTags(data.tags)
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function importMedia() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/upload/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: mediaUrl }),
      })
      if (!res.ok) throw new Error('Failed to import media')
      const data = await res.json()
      setMediaUrl(data.url)
    } catch (e: any) {
      setError(e?.message ?? 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  async function uploadToS3() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const presign = await fetch('/api/upload/s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream' }),
      })
      if (!presign.ok) throw new Error('Failed to create upload URL')
      const { url, publicUrl } = await presign.json()
      const put = await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file })
      if (!put.ok) throw new Error('Failed to upload to S3')
      setMediaUrl(publicUrl)
    } catch (e: any) {
      setError(e?.message || 'S3 upload failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, story, mediaUrl, ai: { summary: aiSummary || undefined, tags: aiTags || undefined } }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to publish')
      }
      const data = await res.json()
      setTitle(''); setStory(''); setMediaUrl(''); setAiSummary(null); setAiTags(null)
      alert('Published! Check the feed.')
    } catch (err: any) {
      setError(err?.message || 'Failed to publish')
    }
  }

  return (
    <main className="container-page flex-1 py-10">
        <h1 className="text-2xl font-semibold mb-6">Share an experience</h1>
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md border px-3 py-2"
              placeholder="Short catchy title"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Story</span>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="rounded-md border px-3 py-2 min-h-[120px]"
              placeholder="What happened? What did it feel like?"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Media URL (temporary)</span>
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="rounded-md border px-3 py-2"
              placeholder="https://… (image or video)"
            />
          </label>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Or upload a file (S3)</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={loading || (!title && !story)}
              className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white font-medium hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Thinking…' : 'AI: summarize + tags'}
            </button>
            <button
              type="button"
              onClick={importMedia}
              disabled={loading || !mediaUrl.startsWith('http')}
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
            >
              Import media to Lenso
            </button>
            <button
              type="button"
              onClick={uploadToS3}
              disabled={loading || !file}
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
            >
              Upload to S3
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Publish
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {(aiSummary || aiTags) && (
            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold mb-2">AI suggestions</p>
              {aiSummary && <p className="text-gray-700 mb-2">{aiSummary}</p>}
              {aiTags && (
                <div className="flex flex-wrap gap-2">
                  {aiTags.map((t) => (
                    <span key={t} className="text-xs rounded-full bg-gray-100 px-2 py-1">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </main>
  )
}
