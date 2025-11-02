"use client";
import { FeedCard } from "@/components/FeedCard";
import useSWR from "swr";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FeedPage() {
  const { data, mutate } = useSWR("/api/posts", fetcher, { suspense: false });

  useEffect(() => {
    const ev = new EventSource("/api/rt/stream");
    ev.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg?.type === "event" && msg?.data?.type === "post.created") {
          mutate(async (curr: any) => [msg.data.post, ...(curr || [])], {
            revalidate: false,
          });
        }
      } catch {}
    };
    return () => ev.close();
  }, [mutate]);

  const posts = data || [];

  return (
    <main className="container-page flex-1 py-10">
      <h1 className="text-2xl font-semibold mb-6">Community Feed</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((item: any) => (
          <FeedCard
            key={item.id}
            id={item.id}
            user={item.user}
            title={item.title}
            description={item.summary || item.story}
            mediaUrl={item.mediaUrl}
            tags={item.tags}
          />
        ))}
      </div>
    </main>
  );
}
