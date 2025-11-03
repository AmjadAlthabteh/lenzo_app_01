"use client";
import { FeedCard } from "@/components/FeedCard";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FeedPage() {
  const { data, mutate } = useSWR("/api/posts", fetcher, { suspense: false });
  const [newPostsCount, setNewPostsCount] = useState(0);

  useEffect(() => {
    const ev = new EventSource("/api/rt/stream");
    ev.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg?.type === "event" && msg?.data?.type === "post.created") {
          mutate(async (curr: any) => [msg.data.post, ...(curr || [])], {
            revalidate: false,
          });
          setNewPostsCount(prev => prev + 1);
          setTimeout(() => setNewPostsCount(0), 3000);
        }
      } catch {}
    };
    return () => ev.close();
  }, [mutate]);

  const posts = data || [];

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Community Feed
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover stories and experiences from around the world
          </p>

          {/* New Posts Indicator */}
          {newPostsCount > 0 && (
            <div className="inline-block glass rounded-full px-6 py-2 border-2 border-green-400/50 bg-green-500/20 animate-pulse">
              <span className="text-white font-semibold">
                ✨ {newPostsCount} new {newPostsCount === 1 ? 'story' : 'stories'} added!
              </span>
            </div>
          )}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">📖</div>
              <h2 className="text-3xl font-bold text-white mb-4">No Stories Yet</h2>
              <p className="text-gray-200 mb-8">
                Be the first to share an experience with the community!
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-white font-bold shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                <span>Share Your Story</span>
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Feed Grid */}
        {posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-in">
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
        )}
      </div>
    </main>
  );
}
