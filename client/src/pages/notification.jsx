import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Notification() {
  const navigate = useNavigate()
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
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length

  const markAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id)
      setNotifications((current) =>
        current.map((notification) =>
          (notification._id || notification.id) === id
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Error marking notification read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead()
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      )
    } catch (err) {
      console.error('Error marking all notifications read:', err)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id)
      setNotifications((current) =>
        current.filter((notification) => (notification._id || notification.id) !== id)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
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
    if (type === 'community') return '👥'
    if (type === 'message') return '💬'
    if (type === 'course') return '📚'
    if (type === 'project') return '📁'
    if (type === 'wallet') return '💰'
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
            {notifications.map((notification) => {
              const notifId = notification._id || notification.id
              return (
                <div
                  key={notifId}
                  className={`flex gap-4 border-b border-gray-100 p-5 transition last:border-b-0 ${
                    notification.isRead
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

                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-purple-600" />
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {formatTime(notification.createdAt || notification.time)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notifId)}
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                          >
                            Mark read
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notifId)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification