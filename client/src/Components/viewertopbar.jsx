import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function ViewerTopbar() {
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-purple-100 bg-white/95 px-8 backdrop-blur">

      {/* Search */}
      <div className="relative w-full max-w-xl">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Find a skill, creator or project..."
          className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
        />

      </div>


      {/* Right Side */}
      <div className="ml-6 flex items-center gap-4">

        {/* Notification */}
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setNotificationsOpen(!notificationsOpen)
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-purple-100 bg-white text-lg transition hover:bg-purple-50"
          >
            🔔

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-purple-600 ring-2 ring-white" />
          </button>


          {notificationsOpen && (
            <div className="absolute right-0 top-14 w-80 rounded-2xl border border-purple-100 bg-white p-4 shadow-xl">

              <div className="flex items-center justify-between">

                <h3 className="font-bold text-gray-900">
                  Notifications
                </h3>

                <button className="text-xs font-semibold text-purple-600">
                  Mark all read
                </button>

              </div>

              <div className="mt-4 space-y-3">

                <div className="rounded-xl bg-purple-50 p-3">
                  <p className="text-sm font-semibold text-gray-800">
                    New course available
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    A creator you may like published a new course.
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Welcome to CraftLoop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Start exploring creators and courses.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>


        {/* Profile */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-purple-50"
          >

            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="Viewer profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-100"
            />

            <div className="hidden text-left sm:block">

              <p className="text-sm font-bold text-gray-800">
                Viewer
              </p>

              <p className="text-xs text-gray-400">
                @viewer
              </p>

            </div>

            <span className="text-xs text-gray-400">
              ▾
            </span>

          </button>


          {profileOpen && (
            <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-purple-100 bg-white py-2 shadow-xl">

              <NavLink
                to="/viewer/profile"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                Profile
              </NavLink>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="block w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}

export default ViewerTopbar