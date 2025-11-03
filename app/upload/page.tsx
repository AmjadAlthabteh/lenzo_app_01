"use client"
import { useState } from 'react'
import Image from 'next/image'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiTags, setAiTags] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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
      setPreviewUrl(publicUrl)
    } catch (e: any) {
      setError(e?.message || 'S3 upload failed')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
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
    <main className="min-h-screen py-16">
      <div className="container-page">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Share Your Story
          </h1>
          <p className="text-xl text-gray-200">
            Create and share your experiences with the world
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 sm:p-12 space-y-6">
            {/* Preview Section */}
            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="relative h-64 sm:h-96">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-white mb-2 block">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
                  placeholder="Give your story a catchy title..."
                  required
                />
              </label>
            </div>

            {/* Story Textarea */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-white mb-2 block">
                  Your Story
                </span>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all min-h-[160px]"
                  placeholder="What happened? What did it feel like? Share the details..."
                  required
                />
              </label>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <span className="text-sm font-semibold text-white block">
                Add Media
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="relative">
                  <label className="block cursor-pointer">
                    <div className="glass rounded-xl p-6 border-2 border-dashed border-white/30 hover:border-purple-400 transition-all text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-200" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-200">
                        {file ? file.name : 'Click to upload file'}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">PNG, JPG, MP4 up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*"
                    />
                  </label>
                  {file && (
                    <button
                      type="button"
                      onClick={uploadToS3}
                      disabled={loading}
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : 'Upload to Cloud'}
                    </button>
                  )}
                </div>

                {/* URL Import */}
                <div>
                  <input
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
                    placeholder="Or paste media URL..."
                  />
                  <button
                    type="button"
                    onClick={importMedia}
                    disabled={loading || !mediaUrl.startsWith('http')}
                    className="mt-2 w-full rounded-xl glass border-2 border-white/30 px-4 py-2 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Import from URL
                  </button>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            {(aiSummary || aiTags) && (
              <div className="glass rounded-2xl p-6 border-2 border-purple-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🤖</span>
                  <p className="text-sm font-semibold text-white">AI Suggestions</p>
                </div>
                {aiSummary && (
                  <p className="text-gray-200 mb-3 leading-relaxed">{aiSummary}</p>
                )}
                {aiTags && aiTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {aiTags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full glass text-sm text-white font-medium border border-white/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="glass rounded-xl p-4 border-2 border-red-400/50 bg-red-500/10">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={loading || (!title && !story)}
                className="flex-1 min-w-[200px] rounded-xl glass border-2 border-white/30 px-6 py-3 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '✨ Thinking...' : '✨ Generate AI Summary'}
              </button>
              <button
                type="submit"
                disabled={loading || !title || !story}
                className="flex-1 min-w-[200px] rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-bold shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                🚀 Publish Story
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
