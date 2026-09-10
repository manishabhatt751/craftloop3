import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-[#faf9ff] text-gray-900 font-sans">

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-purple-100/80 bg-white/90 px-6 py-4 backdrop-blur-md md:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-md shadow-purple-200">
            ✦
          </div>
          <span className="text-2xl font-bold tracking-tight text-purple-700">
            Craft<span className="text-purple-400">Loop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <Link to="/community" className="transition hover:text-purple-600">
            Community
          </Link>
          <Link to="/create" className="transition hover:text-purple-600">
            Create
          </Link>
          <Link to="/ai-chat" className="transition hover:text-purple-600">
            AI Assistant
          </Link>
          <Link to="/helpsupport" className="transition hover:text-purple-600">
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Sign In
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700 active:scale-[0.98]"
          >
            Launch App →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-1.5 text-xs font-semibold text-purple-700 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-purple-600" />
            Empowering the Next Generation of Creators
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl sm:leading-[1.15]">
            Connect skills. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Discover talent.
            </span>{' '}
            <br className="hidden sm:inline" />
            Create opportunities.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            A creative ecosystem where designers, developers, and creators showcase projects,
            collaborate in real-time, leverage AI assistants, and grow their community together.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-2xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-200 transition hover:bg-purple-700 active:scale-95"
            >
              Get Started Free →
            </Link>

            <Link
              to="/community"
              className="rounded-2xl border border-purple-200 bg-white px-8 py-4 text-base font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50 active:scale-95"
            >
              Explore Community
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-xl shadow-purple-100/50 backdrop-blur">
            <div>
              <p className="text-2xl font-bold text-purple-700 sm:text-3xl">12k+</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">Active Creators</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700 sm:text-3xl">35k+</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">Projects Shared</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700 sm:text-3xl">99.4%</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">Collaboration Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-purple-100 bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Why CraftLoop
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to showcase and thrive
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Tools designed for modern creative collaboration.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900">Showcase Your Work</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Build polished portfolios for UI/UX, graphic design, branding, and development
                services with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
                🤖
              </div>
              <h3 className="text-xl font-bold text-gray-900">CraftLoop AI</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Receive instant creative brainstorming, design critique, course outlines, and
                personalized growth advice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900">Direct Messaging</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Connect directly with fellow creatives, exchange real-time feedback, and form
                high-impact collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-purple-100 bg-purple-700 px-6 py-16 text-center text-white md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to elevate your creative journey?</h2>
          <p className="mt-4 text-purple-200">
            Join thousands of creators who share, learn, and grow on CraftLoop every day.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-purple-700 shadow-lg transition hover:bg-purple-50 active:scale-95"
            >
              Open Dashboard Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white px-6 py-8 text-center text-xs text-gray-400">
        <p>© 2026 CraftLoop. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Home