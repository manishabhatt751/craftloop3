import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function TopBar() {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-purple-100 bg-white/95 px-8 backdrop-blur">

      <div className="flex h-full items-center justify-between gap-6">

        {/* Search */}
        <div className="flex max-w-2xl flex-1 items-center rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">

          <span className="mr-3 text-lg text-purple-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Find a skill, creator or project..."
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />

        </div>

        {/* Right Actions */}
        <div className="relative flex items-center gap-3">

          {/* Notifications */}
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setProfileOpen(false)
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-purple-100 bg-white text-lg transition hover:bg-purple-50"
            aria-label="Notifications"
          >
            🔔

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-600" />
          </button>

          {/* Notification Popup */}
          {notificationsOpen && (
            <div className="absolute right-16 top-14 w-80 rounded-2xl border border-purple-100 bg-white p-4 shadow-xl">

              <div className="mb-4 flex items-center justify-between">

                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>

                <button
                  type="button"
                  className="text-xs text-purple-600"
                >
                  Mark all read
                </button>

              </div>

              <div className="space-y-3">

                <div className="rounded-xl bg-purple-50 p-3">
                  <p className="text-sm font-medium text-gray-700">
                    🎉 Your profile is getting attention
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    You received 12 new profile views.
                  </p>
                </div>

                <div className="rounded-xl p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-700">
                    💬 New message
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Someone wants to collaborate with you.
                  </p>
                </div>

                <div className="rounded-xl p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-700">
                    ⭐ New review
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    You received a new creator review.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Profile Button */}
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-purple-50"
          >

            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="Profile"
              className="h-11 w-11 rounded-full border-2 border-purple-100 object-cover"
            />

            <div className="hidden text-left md:block">

              <p className="text-sm font-semibold text-gray-800">
                Creator
              </p>

              <p className="text-xs text-gray-400">
                @creator
              </p>

            </div>

            <span className="text-xs text-gray-400">
              ▾
            </span>

          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-16 w-72 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">

              {/* Profile Header */}
              <div className="flex items-center gap-3 border-b border-purple-100 bg-purple-50 p-4">

                <img
                  src="https://i.pravatar.cc/100?img=47"
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div>

                  <p className="font-semibold text-gray-800">
                    Creator
                  </p>

                  <p className="text-xs text-gray-400">
                    @creator
                  </p>

                </div>

              </div>

              {/* Main Profile Options */}
              <div className="p-2">

                {/* Skill Profile */}
                <NavLink
                  to="/skill-profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  👤
                  <span>Skill Profile</span>
                </NavLink>

                {/* Balance */}
                <NavLink
                  to="/balance"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  💰
                  <span>Balance</span>
                </NavLink>

                {/* Your Project */}
                <NavLink
                  to="/your-project"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  📁
                  <span>Your Project</span>
                </NavLink>

                {/* Share */}
                <NavLink
                  to="/share"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  🔗
                  <span>Share</span>
                </NavLink>

              </div>

              {/* Account */}
              <div className="border-t border-purple-100 p-2">

                {/* Edit Profile */}
                <NavLink
                  to="/edit-profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  ✏️
                  <span>Edit Profile</span>
                </NavLink>

                {/* Account Settings */}
                <NavLink
                  to="/edit-profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  ⚙️
                  <span>Account Settings</span>
                </NavLink>

                {/* Notification */}
                <NavLink
                  to="/notification"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  🔔
                  <span>Notification</span>
                </NavLink>

                {/* Help and Support */}
                <NavLink
                  to="/helpsupport"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                >
                  ❓
                  <span>Help and Support</span>
                </NavLink>

              </div>

              {/* Logout */}
              <div className="border-t border-purple-100 p-2">

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/login')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  🚪
                  <span>Logout</span>
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}

export default TopBar