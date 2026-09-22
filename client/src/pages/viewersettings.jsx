import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function ViewerSettings() {
  const navigate = useNavigate()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [communityNotifications, setCommunityNotifications] = useState(true)
  const [courseNotifications, setCourseNotifications] = useState(true)

  const handleSave = () => {
    localStorage.setItem(
      'craftloop_viewer_settings',
      JSON.stringify({
        emailNotifications,
        communityNotifications,
        courseNotifications,
      })
    )

    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">
          SETTINGS
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Account Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your notification preferences and account settings.
        </p>
      </section>

      {/* Notifications */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Notification Preferences
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose which notifications you want to receive.
        </p>

        <div className="mt-6 divide-y divide-purple-50">

          {/* Email */}
          <div className="flex items-center justify-between gap-4 py-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Email Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Receive important CraftLoop updates by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEmailNotifications(!emailNotifications)
              }
              className={`relative h-7 w-12 rounded-full transition ${
                emailNotifications
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  emailNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Community */}
          <div className="flex items-center justify-between gap-4 py-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Community Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Get notified about new community activity.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCommunityNotifications(!communityNotifications)
              }
              className={`relative h-7 w-12 rounded-full transition ${
                communityNotifications
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  communityNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Courses */}
          <div className="flex items-center justify-between gap-4 py-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Course Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Get updates about courses and learning progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCourseNotifications(!courseNotifications)
              }
              className={`relative h-7 w-12 rounded-full transition ${
                courseNotifications
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  courseNotifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>
          </div>

        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Save Settings
        </button>

      </section>

      {/* Account Information */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Account Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl bg-[#faf9ff] p-5">
            <p className="text-xs font-semibold text-gray-400">
              ACCOUNT TYPE
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              Viewer
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf9ff] p-5">
            <p className="text-xs font-semibold text-gray-400">
              USERNAME
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              @viewer
            </p>
          </div>

        </div>

      </section>

      {/* Danger Zone */}
      <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-red-600">
          Account Actions
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Manage your account from this section.
        </p>

        <button
          type="button"
          onClick={() => {
            api.logout()
            navigate('/login')
          }}
          className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
        >
          Log Out
        </button>

      </section>

    </div>
  )
}

export default ViewerSettings