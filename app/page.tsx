import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <section className="relative container-page py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center fade-in">
          <div className="text-white z-10">
            <div className="inline-block px-4 py-2 rounded-full glass mb-6">
              <span className="text-sm font-semibold">✨ Experience the World Differently</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
              See Through
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                Someone Else's Eyes
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-100 leading-relaxed max-w-2xl">
              Share authentic moments, explore real experiences, and connect with stories from around the world.
              Powered by AI to help you capture and share what matters most.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/upload"
                className="group relative inline-flex items-center rounded-full bg-white px-8 py-4 text-purple-600 font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 pulse-glow"
              >
                <span className="relative z-10">Share Your Story</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center rounded-full glass px-8 py-4 text-white font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                Explore Feed
              </Link>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-200 mt-1">Stories Shared</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-200 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-200 mt-1">Countries</div>
              </div>
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="relative z-10 float">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                    alt="Mountain landscape"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-40 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=600&q=80"
                    alt="Desert adventure"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-40 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"
                    alt="Forest trail"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
                    alt="Beach sunset"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Glassmorphism */}
      <section className="container-page pb-20">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Powered by Innovation
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Experience the perfect blend of storytelling and technology
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon="🤖"
            title="AI-Powered Insights"
            desc="Intelligent summaries and smart tags generated instantly for every post you create."
            gradient="from-purple-500 to-pink-500"
          />
          <Feature
            icon="🛡️"
            title="Smart Moderation"
            desc="AI-driven content moderation ensures a safe and welcoming community for everyone."
            gradient="from-blue-500 to-cyan-500"
          />
          <Feature
            icon="⚡"
            title="Real-Time Updates"
            desc="See new stories appear instantly with live Server-Sent Events streaming."
            gradient="from-yellow-500 to-orange-500"
          />
          <Feature
            icon="🔐"
            title="Secure Authentication"
            desc="Quick sign-in with GitHub or Guest mode using NextAuth and Prisma."
            gradient="from-green-500 to-emerald-500"
          />
          <Feature
            icon="💾"
            title="Fast & Reliable"
            desc="Built on SQLite and Prisma for lightning-fast performance and data security."
            gradient="from-indigo-500 to-purple-500"
          />
          <Feature
            icon="☁️"
            title="Cloud Storage"
            desc="Seamless S3 integration with presigned URLs for secure media uploads."
            gradient="from-pink-500 to-rose-500"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container-page pb-20">
        <div className="glass rounded-3xl p-8 sm:p-12 fade-in">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Share Your Story in 4 Simple Steps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Step
              number="1"
              title="Create"
              desc="Write your title and story, add photos or videos to bring it to life"
            />
            <Step
              number="2"
              title="Enhance"
              desc="Let AI suggest the perfect summary and trending hashtags"
            />
            <Step
              number="3"
              title="Publish"
              desc="Our AI moderates and enriches your post automatically"
            />
            <Step
              number="4"
              title="Connect"
              desc="Watch your story appear instantly in the community feed"
            />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Creating Now
              <svg className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="container-page pb-20">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Discover Amazing Experiences
          </h2>
          <p className="text-xl text-gray-200">
            Real moments from real people around the world
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExperienceCard
            image="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&q=80"
            title="Northern Lights Adventure"
            author="Sarah M."
            tags={['Travel', 'Nature', 'Photography']}
          />
          <ExperienceCard
            image="https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=600&q=80"
            title="Street Food Journey"
            author="Michael R."
            tags={['Food', 'Culture', 'Urban']}
          />
          <ExperienceCard
            image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"
            title="Ocean Meditation"
            author="Emma L."
            tags={['Wellness', 'Ocean', 'Sunset']}
          />
        </div>
      </section>
    </div>
  )
}

function Feature({ icon, title, desc, gradient }: { icon: string; title: string; desc: string; gradient: string }) {
  return (
    <div className="group relative rounded-2xl glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-200 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-200 text-sm">{desc}</p>
    </div>
  )
}

function ExperienceCard({ image, title, author, tags }: { image: string; title: string; author: string; tags: string[] }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden glass hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-300 mb-3">by {author}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full glass text-xs text-white font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

