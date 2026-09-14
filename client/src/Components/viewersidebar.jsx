import { NavLink } from 'react-router-dom'

function ViewerSidebar() {
  const navItems = [
    { label: 'Home', path: '/viewerhome', icon: '⌂' },
    { label: 'Explore', path: '/viewerexplore', icon: '⌕' },
    { label: 'Courses', path: '/viewercourse', icon: '▣' },
    { label: 'My Learning', path: '/mylearning', icon: '◉' },
    { label: 'Community', path: '/viewercommunity', icon: '◎' },
    { label: 'Messages', path: '/viewermessages', icon: '✉' },
    { label: 'AI Chat', path: '/viewerai-chat', icon: '✦' },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-purple-100 bg-white">

      <div className="flex h-20 items-center border-b border-purple-100 px-6">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-md">
            C
          </div>

          <div>
            <h1 className="text-xl font-bold text-purple-700">
              CraftLoop
            </h1>

            <p className="text-[8px] font-semibold tracking-[0.22em] text-gray-400">
              CREATE • CONNECT • GROW
            </p>
          </div>

        </div>
      </div>

      <div className="px-6 pb-3 pt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Viewer
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4">

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-100'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-lg">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-purple-100 p-4">

        <div className="rounded-2xl bg-purple-50 p-4">

          <p className="text-sm font-bold text-purple-700">
            Explore. Learn. Connect.
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Discover creators and build your skills with CraftLoop.
          </p>

        </div>

      </div>

    </aside>
  )
}

export default ViewerSidebar