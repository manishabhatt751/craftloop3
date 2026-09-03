import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [role, setRole] = useState('creator')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    // Temporary frontend login
    // Real backend authentication will be connected later.
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      {/* Top Logo */}
      <header className="absolute left-0 top-0 w-full px-6 py-6 md:px-10">
        <Link
          to="/"
          className="inline-flex items-center text-2xl font-bold tracking-tight text-purple-700"
        >
          Craft<span className="text-purple-400">Loop</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex min-h-screen items-center justify-center px-5 py-24">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-2xl shadow-purple-100 md:grid-cols-2">

          {/* Left Branding */}
          <section className="relative hidden overflow-hidden bg-purple-700 p-10 text-white md:flex md:flex-col md:justify-between">

            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500 opacity-40" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-500 opacity-30" />

            <div className="relative z-10">

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                ✦
              </div>

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-purple-200">
                Welcome to CraftLoop
              </p>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Connect skills.
                <br />
                Discover talent.
                <br />
                Create opportunities.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-purple-100">
                A creative space where creators can showcase their skills,
                connect with people, manage projects and grow together.
              </p>

            </div>

            <div className="relative z-10">

              <div className="mb-6 grid grid-cols-3 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xl font-bold">01</p>
                  <p className="mt-1 text-xs text-purple-200">
                    Create
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xl font-bold">02</p>
                  <p className="mt-1 text-xs text-purple-200">
                    Connect
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xl font-bold">03</p>
                  <p className="mt-1 text-xs text-purple-200">
                    Grow
                  </p>
                </div>

              </div>

              <p className="text-xs text-purple-200">
                Your creative journey starts here.
              </p>

            </div>

          </section>

          {/* Login Form */}
          <section className="flex items-center justify-center p-7 sm:p-10 lg:p-14">

            <div className="w-full max-w-md">

              {/* Mobile heading */}
              <div className="mb-8 md:hidden">
                <p className="text-sm font-medium text-purple-600">
                  Welcome to CraftLoop
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  Let's get started
                </h1>
              </div>

              {/* Desktop heading */}
              <div className="mb-8 hidden md:block">
                <p className="text-sm font-medium text-purple-600">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  Sign in to CraftLoop
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Continue your creative journey.
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-7">

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Continue as
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                      role === 'creator'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="mb-2 text-xl">
                      ✦
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        role === 'creator'
                          ? 'text-purple-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Creator
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Create & showcase
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('viewer')}
                    className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                      role === 'viewer'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="mb-2 text-xl">
                      ◉
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        role === 'viewer'
                          ? 'text-purple-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Viewer
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Discover & connect
                    </p>
                  </button>

                </div>

              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-purple-600"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />

                  <span className="text-xs text-gray-500">
                    Remember me
                  </span>
                </label>

                {/* Login */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 active:scale-[0.99]"
                >
                  Sign in as {role === 'creator' ? 'Creator' : 'Viewer'}
                </button>

              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Signup */}
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="font-semibold text-purple-600 hover:text-purple-800"
                >
                  Create account
                </button>
              </p>

              {/* Back */}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-xs font-medium text-gray-400 hover:text-purple-600"
                >
                  ← Back to CraftLoop
                </Link>
              </div>

            </div>

          </section>

        </div>

      </main>
    </div>
  )
}

export default Login