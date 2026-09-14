import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Notification() {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Your profile is getting attention',
      message: 'More creators are viewing your profile.',
      time: '10 minutes ago',
      type: 'profile',
      read: false,
    },
    {
      id: 2,
      title: 'New message',
      message: 'You received a new message from Maya Creative.',
      time: '1 hour ago',
      type: 'message',
      read: false,
    },
    {
      id: 3,
      title: 'New review',
      message: 'Someone left feedback on your project.',
      time: 'Yesterday',
      type: 'review',
      read: true,
    },
  ])

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    )
  }

  const getIcon = (type) => {
    if (type === 'profile') return '👤'
    if (type === 'message') return '💬'
    if (type === 'review') return '⭐'
    return '🔔'
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#faf9ff] p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
            Creator Updates
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-gray-500">
            Stay updated with activity on your CraftLoop account.
          </p>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
        >
          ← Back to Profile
        </button>
      </div>

      {/* Notification Card */}
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        {/* Top */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? 's' : ''
                  }`
                : 'You are all caught up'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications */}
        {notifications.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl">
              🔔
            </div>

            <h2 className="mt-4 text-xl font-bold">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You don't have any notifications right now.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 border-b border-gray-100 p-5 transition last:border-b-0 ${
                  notification.read
                    ? 'bg-white'
                    : 'bg-purple-50/50'
                }`}
              >
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-purple-600" />
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                        >
                          Mark read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification