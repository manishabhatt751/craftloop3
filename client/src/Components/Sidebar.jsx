import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItems = [
    {
      name: 'Home',
      icon: '🏠',
      path: '/dashboard',
    },
    {
      name: 'Community',
      icon: '👥',
      path: '/community',
    },
    {
      name: 'Create',
      icon: '＋',
      path: '/create',
    },
    {
      name: 'AI Chat',
      icon: '🤖',
      path: '/ai-chat',
    },
    {
      name: 'Messages',
      icon: '💬',
      path: '/messages',
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-purple-100 bg-white px-5 py-6">

      {/* Logo */}
      <div className="mb-10 px-3">
        <h1 className="text-2xl font-bold tracking-tight text-purple-700">
          Craft<span className="text-purple-400">Loop</span>
        </h1>

        <p className="mt-1 text-xs text-gray-400">
          Create. Connect. Grow.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`
            }
          >
            <span className="flex h-8 w-8 items-center justify-center text-lg">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom sidebar section */}
      <div className="border-t border-purple-100 pt-5">

        <div className="rounded-2xl bg-purple-50 p-4">
          <p className="text-xs font-semibold text-purple-700">
            ✨ Grow your skills
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Discover creators, collaborate and improve your profile.
          </p>

          <button className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-800">
            Explore →
          </button>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar