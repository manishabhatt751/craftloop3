import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-[#faf9ff] text-gray-900 font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-purple-100/80 bg-white/90 px-6 py-4 backdrop-blur">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-md">
            C
          </div>

          <div>
            <h1 className="text-xl font-bold text-purple-700">
              CraftLoop
            </h1>

            <p className="text-[9px] font-semibold tracking-[0.25em] text-gray-400">
              CREATE • CONNECT • GROW
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <a
            href="#community"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-600"
          >
            Community
          </a>

          <a
            href="#create"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-600"
          >
            Create
          </a>

          <a
            href="#ai"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-600"
          >
            AI Assistant
          </a>

          <a
            href="#help"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-600"
          >
            Help
          </a>

          {/* Login */}
          <Link
            to="/login"
            className="rounded-xl border border-purple-200 px-5 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Login
          </Link>

        </nav>
      </header>


      {/* Main */}
      <main>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* Small Label */}
            <div className="mb-6 inline-flex rounded-full border border-purple-200 bg-purple-50 px-5 py-2 text-sm font-semibold text-purple-700">
              CREATE • CONNECT • GROW
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              Welcome to{' '}
              <span className="text-purple-600">
                CraftLoop
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              A creative platform where creators can showcase their skills,
              build projects and courses, while viewers discover skills,
              learn and connect.
            </p>

            {/* Role Question */}
            <p className="mt-8 text-sm font-semibold text-gray-500">
              Choose how you want to continue
            </p>


            {/* Role Buttons */}
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">

              {/* Creator */}
              <Link
                to="/login?role=creator"
                className="group rounded-2xl bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-purple-700"
              >
                <span className="block">
                  Start as Creator
                </span>

                <span className="mt-1 block text-xs font-medium text-purple-100">
                  Create • Showcase • Grow
                </span>
              </Link>


              {/* Viewer */}
              <Link
                to="/login?role=viewer"
                className="group rounded-2xl border-2 border-purple-200 bg-white px-8 py-4 text-base font-bold text-purple-700 shadow-sm transition hover:-translate-y-1 hover:border-purple-400 hover:bg-purple-50"
              >
                <span className="block">
                  Start as Viewer
                </span>

                <span className="mt-1 block text-xs font-medium text-purple-400">
                  Discover • Learn • Connect
                </span>
              </Link>

            </div>


            {/* Existing User */}
            <div className="mt-8 text-sm text-gray-500">

              Already have an account?{' '}

              <Link
                to="/login"
                className="font-bold text-purple-600 transition hover:text-purple-800"
              >
                Login
              </Link>

            </div>

          </div>
        </section>


        {/* Features Section */}
        <section className="border-y border-purple-100 bg-white px-6 py-20">

          <div className="mx-auto max-w-6xl">

            {/* Section Heading */}
            <div className="mb-12 text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-purple-600">
                Why CraftLoop?
              </p>

              <h3 className="mt-3 text-3xl font-bold text-gray-900">
                One platform for creativity and learning
              </h3>

            </div>


            {/* Feature Cards */}
            <div className="grid gap-6 md:grid-cols-3">


              {/* Create */}
              <div
                id="create"
                className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
                  ✦
                </div>

                <h4 className="text-xl font-bold">
                  Create
                </h4>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Creators can showcase projects, offer services and create
                  courses or tutorials.
                </p>

              </div>


              {/* Connect */}
              <div
                id="community"
                className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
                  ◎
                </div>

                <h4 className="text-xl font-bold">
                  Connect
                </h4>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Join the community, communicate with others and discover
                  creative talent.
                </p>

              </div>


              {/* Grow */}
              <div
                id="ai"
                className="rounded-3xl border border-purple-100 bg-[#faf9ff] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
                  ✨
                </div>

                <h4 className="text-xl font-bold">
                  Grow
                </h4>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Use learning resources and AI assistance to improve skills,
                  projects and creative growth.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* Bottom CTA */}
        <section
          id="help"
          className="px-6 py-20"
        >

          <div className="mx-auto max-w-4xl rounded-[2rem] bg-purple-600 px-8 py-14 text-center text-white shadow-xl shadow-purple-200">

            <h3 className="text-3xl font-bold md:text-4xl">
              Ready to join CraftLoop?
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-purple-100 md:text-base">
              Choose your role and start creating, learning and connecting.
            </p>


            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                to="/login?role=creator"
                className="rounded-xl bg-white px-7 py-3.5 font-bold text-purple-700 transition hover:bg-purple-50"
              >
                Start as Creator
              </Link>

              <Link
                to="/login?role=viewer"
                className="rounded-xl border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Start as Viewer
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 CraftLoop. All rights reserved.
          </p>

          <p className="font-medium text-purple-600">
            CREATE • CONNECT • GROW
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home