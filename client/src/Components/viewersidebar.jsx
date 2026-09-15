import { NavLink, useNavigate } from 'react-router-dom'

function ViewerSidebar() {
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', path: '/viewerhome', icon: '⌂' },
    { label: 'Explore', path: '/viewerexplore', icon: '⌕' },
    { label: 'Courses', path: '/viewercourse', icon: '▣' },
    { label: 'My Learning', path: '/mylearning', icon: '▶' },
    { label: 'Community', path: '/viewercommunity', icon: '◉' },
    { label: 'Messages', path: '/viewermessages', icon: '✉' },
    { label: 'AI Chat', path: '/viewerai-chat', icon: '✦' },
    { label: 'Profile', path: '/viewerprofile', icon: '👤' },
    {
      label: 'Notifications',
      path: '/viewernotification',
      icon: '🔔',
    },
    {
      label: 'Settings',
      path: '/viewersettings',
      icon: '⚙',
    },
    {
      label: 'Help & Support',
      path: '/viewerhelpsupport',
      icon: '?',
    },
    {
      label: 'Saved Projects',
      path: '/savedprojects',
      icon: '♡',
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('craftloop_user')
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-purple-100 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-purple-100 px-6">
        <button
          type="button"
          onClick={() => navigate('/viewerhome')}
          className="text-left"
        >
          <h1 className="text-2xl font-bold text-purple-600">
            CraftLoop
          </h1>

          <p className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-gray-400">
            CREATE • CONNECT • GROW
          </p>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`
            }
          >
            <span className="flex w-6 justify-center text-lg">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="border-t border-purple-100 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex w-6 justify-center text-lg">
            ↪
          </span>

          <span>Logout</span>
        </button>

      </div>

    </aside>
  )
}

export default ViewerSidebar