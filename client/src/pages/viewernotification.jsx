import { useState, useEffect } from 'react'
import api from '../services/api'

function ViewerNotification() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      if (api.isAuthenticated()) {
        const res = await api.getNotifications()
        if (res && res.success && Array.isArray(res.data)) {
          setNotifications(res.data)
        }
      }
    } catch (err) {
      console.error('Error loading viewer notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length

  const markAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, isRead: true }
            : item
        )
      )
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead()
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      )
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now'
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  const getIcon = (type) => {
    if (type === 'course') return '📚'
    if (type === 'community') return '👥'
    if (type === 'message') return '💬'
    if (type === 'learning') return '▶'
    return '✦'
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-semibold text-purple-600">
            NOTIFICATIONS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Stay updated with your CraftLoop activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-xl border border-purple-200 px-5 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Mark all as read
          </button>
        )}

      </section>

      {/* Notification Count */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
            🔔
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Your Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {unreadCount === 0
                ? 'You are all caught up.'
                : `You have ${unreadCount} unread notification${
                    unreadCount > 1 ? 's' : ''
                  }.`}
            </p>
          </div>

        </div>

      </section>

      {/* Notifications */}
      <section className="space-y-4">

        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
              🔔
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">No notifications yet</h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up with your updates.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const notifId = item._id || item.id
            return (
              <div
                key={notifId}
                onClick={() => markAsRead(notifId)}
                className={`cursor-pointer rounded-3xl border p-5 transition hover:shadow-sm ${
                  item.isRead
                    ? 'border-purple-100 bg-white'
                    : 'border-purple-200 bg-purple-50/60'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                      item.isRead
                        ? 'bg-gray-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900">
                        {item.title}
                      </h3>

                      {!item.isRead && (
                        <span className="rounded-full bg-purple-600 px-2.5 py-1 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {item.message}
                    </p>

                    <p className="mt-3 text-xs font-medium text-gray-400">
                      {formatTime(item.createdAt || item.time)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}

      </section>

    </div>
  )
}

export default ViewerNotification