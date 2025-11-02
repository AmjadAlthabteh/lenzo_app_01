type Props = {
  id: string
  user: string
  title: string
  description: string
  mediaUrl?: string
  tags?: string[]
}

export function FeedCard({ user, title, description, mediaUrl, tags = [] }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white">
      <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
        {mediaUrl ? (
          mediaUrl.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
            <video className="h-full w-full object-cover" src={mediaUrl} controls />
          ) : (
            // avoid next/image domain config by using img directly for now
            <img className="h-full w-full object-cover" src={mediaUrl} alt={title} />
          )
        ) : (
          <span>media preview</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>by {user}</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2 py-1">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
