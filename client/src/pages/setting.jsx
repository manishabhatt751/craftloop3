import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Setting() {
  const navigate = useNavigate()

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(
      'craftloopAccountSettings',
      JSON.stringify({
        emailNotifications,
        profileVisibility,
      })
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] px-6 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-600">
              CREATOR SETTINGS
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your account preferences and privacy settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-fit rounded-xl border border-purple-100 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-purple-50"
          >
            ← Back to Profile
          </button>
        </div>

        <div className="space-y-6">

          {/* Account Information */}
          <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information connected to your CraftLoop account.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Account Type
                </label>

                <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
                  Creator Account
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Account Status
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  Active
                </div>
              </div>

            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Privacy
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Control how people can discover your creator profile.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <div>
                <h3 className="font-medium text-gray-800">
                  Public Profile
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Allow other users to discover your creator profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProfileVisibility(!profileVisibility)
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  profileVisibility
                    ? 'bg-purple-600'
                    : 'bg-gray-300'
                }`}
                aria-label="Toggle public profile"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    profileVisibility
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose whether you want to receive email notifications.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <div>
                <h3 className="font-medium text-gray-800">
                  Email Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive updates about messages, projects and activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEmailNotifications(!emailNotifications)
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  emailNotifications
                    ? 'bg-purple-600'
                    : 'bg-gray-300'
                }`}
                aria-label="Toggle email notifications"
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
          </section>

          {/* Password */}
          <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Password & Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep your CraftLoop account secure.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    'Password change will be connected to the backend later.'
                  )
                }
                className="rounded-xl border border-purple-200 px-5 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Save Changes */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5 sm:flex-row sm:items-center">
            <div>
              {saved ? (
                <p className="text-sm font-medium text-green-600">
                  ✓ Settings saved successfully.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Save your latest account preferences.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Setting