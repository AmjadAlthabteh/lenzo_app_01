import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lenso - Professional Content Collaboration Platform',
  description: 'Real-time collaboration with enterprise security, role-based access, and team management.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container-page pt-24 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center slide-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-semibold text-blue-900 mb-10 border border-white/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Live Collaboration Enabled
            </div>

            <h1 className="heading-1 text-white mb-8">
              Collaborate in Real-Time
              <br />
              <span className="text-blue-200">With Your Team</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Secure content platform with live editing, role-based permissions, and enterprise-grade security. Built for teams that value privacy and control.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 mb-16">
              <Link href="/register" className="btn btn-primary px-10 py-5 text-lg">
                Start Free Trial
              </Link>
              <Link href="/login" className="btn btn-ghost px-10 py-5 text-lg">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto glass rounded-2xl p-8 border border-white/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">256-bit</div>
                <div className="text-blue-200 text-sm font-medium">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Real-Time</div>
                <div className="text-blue-200 text-sm font-medium">Collaboration</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">4 Roles</div>
                <div className="text-blue-200 text-sm font-medium">Permission Levels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-page pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-white mb-5">
              Everything Teams Need
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Professional tools for secure content collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Live Presence"
              description="See who's online and actively editing. Real-time cursor tracking and instant updates across all team members."
            />
            <FeatureCard
              title="Two-Factor Auth"
              description="Secure your account with TOTP-based 2FA. Compatible with Google Authenticator, Authy, and all major apps."
            />
            <FeatureCard
              title="Role Management"
              description="Four permission levels: User, Moderator, Admin, Super Admin. Granular control over who can do what."
            />
            <FeatureCard
              title="Activity Logs"
              description="Complete audit trail of all actions. Track logins, changes, and access for compliance and security."
            />
            <FeatureCard
              title="Rate Limiting"
              description="Built-in protection against abuse. Intelligent rate limiting keeps your platform secure and responsive."
            />
            <FeatureCard
              title="Admin Dashboard"
              description="Comprehensive admin panel for user management, role assignment, and system monitoring."
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container-page pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="card p-10 scale-in">
            <div className="text-center mb-10">
              <h2 className="heading-2 text-gray-900 mb-4">
                See It In Action
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Try the live demo or create your own account to explore all features
              </p>
            </div>

            {/* Demo Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 mb-8 border-2 border-blue-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Demo Access</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Click "View Demo" to browse content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Create an account to upload and collaborate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enable 2FA in your dashboard for extra security</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                  <div className="space-y-3">
                    <div className="badge badge-primary text-sm">Secure Authentication</div>
                    <div className="badge badge-success text-sm ml-2">Live Updates</div>
                    <div className="badge badge-primary text-sm">Encrypted Storage</div>
                    <div className="badge badge-success text-sm ml-2">Team Management</div>
                    <div className="badge badge-primary text-sm">Activity Tracking</div>
                    <div className="badge badge-success text-sm ml-2">Admin Controls</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/feed" className="btn btn-primary px-8 py-4">
                View Demo Feed
              </Link>
              <Link href="/register" className="btn btn-secondary px-8 py-4">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container-page pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-white mb-5">
              Built For Real Teams
            </h2>
            <p className="text-xl text-blue-100">
              From startups to enterprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8 card-hover">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Content Teams</h3>
              <p className="text-muted leading-relaxed">
                Collaborate on content creation with live editing, version tracking, and approval workflows. Perfect for marketing teams and agencies.
              </p>
            </div>
            <div className="card p-8 card-hover">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remote Workspaces</h3>
              <p className="text-muted leading-relaxed">
                Work from anywhere with real-time presence, instant sync, and secure access controls. Keep distributed teams connected.
              </p>
            </div>
            <div className="card p-8 card-hover">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-muted leading-relaxed">
                Meet compliance requirements with comprehensive logging, 2FA, encryption, and role-based access controls.
              </p>
            </div>
            <div className="card p-8 card-hover">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Project Management</h3>
              <p className="text-muted leading-relaxed">
                Organize work by projects with granular permissions. Control exactly who can view, edit, and publish at every level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center border border-white/40">
            <h2 className="text-4xl font-bold text-white mb-5">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Create your account now and start collaborating with your team in minutes
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link href="/register" className="btn bg-white text-blue-900 hover:bg-blue-50 px-10 py-5 text-lg font-bold">
                Sign Up Free
              </Link>
              <Link href="/about" className="btn btn-ghost px-10 py-5 text-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-7 scale-in card-hover">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}
