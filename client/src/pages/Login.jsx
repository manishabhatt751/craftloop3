import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [role, setRole] = useState(
    new URLSearchParams(window.location.search).get('role') === 'viewer'
      ? 'viewer'
      : 'creator'
  )

  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    setLoading(true)

    try {
      let res
      if (isSignUp) {
        res = await api.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        })
      } else {
        res = await api.login(email.trim().toLowerCase(), password)
      }

      if (res && res.token) {
        // Store JWT token under the canonical project keys
        api.setAuth(res.token, res.user)

        const finalRole = res.user?.role || role
        if (finalRole === 'creator') {
          navigate('/dashboard')
        } else {
          navigate('/viewerhome')
        }
      } else {
        setError('Authentication failed. No token received.')
      }
    } catch (err) {
      console.error('Login error:', err)
      const msg = err.data?.message || err.message || 'Authentication failed. Please check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-xl font-bold text-white shadow-lg shadow-purple-200">
              ✦
            </div>

            <span className="text-3xl font-bold tracking-tight text-purple-700">
              Craft<span className="text-purple-400">Loop</span>
            </span>
          </button>

          <p className="mt-3 text-sm text-gray-500">
            CREATE • CONNECT • GROW
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-100/50">

          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {isSignUp ? 'Join CraftLoop to create, connect, and grow' : 'Sign in to continue to CraftLoop'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">

            <p className="mb-3 text-sm font-semibold text-gray-700">
              Continue as
            </p>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setRole('creator')
                  setError('')
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  role === 'creator'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'border-purple-100 bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                Creator
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('viewer')
                  setError('')
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  role === 'viewer'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'border-purple-100 bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                Viewer
              </button>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>

            {/* Name (for Sign Up) */}
            {isSignUp && (
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 pr-16 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? isSignUp ? 'Creating account...' : 'Signing in...'
                : isSignUp
                  ? `Create ${role === 'creator' ? 'Creator' : 'Viewer'} Account →`
                  : `Sign in as ${role === 'creator' ? 'Creator' : 'Viewer'} →`}
            </button>

          </form>

          {/* Signup / Signin Toggle */}
          <div className="mt-7 border-t border-purple-100 pt-6 text-center">

            <p className="text-sm text-gray-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>

            <div className="mt-3 flex justify-center gap-3">

              {isSignUp ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false)
                    setError('')
                  }}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                >
                  Sign in instead
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('creator')
                      setIsSignUp(true)
                      setError('')
                    }}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Sign up for Creator
                  </button>

                  <span className="text-gray-300">|</span>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('viewer')
                      setIsSignUp(true)
                      setError('')
                    }}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Sign up for Viewer
                  </button>
                </>
              )}

            </div>
          </div>

        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-gray-500 transition hover:text-purple-600"
          >
            ← Back to Home
          </button>
        </div>

      </div>

    </div>
  )
}

export default Login