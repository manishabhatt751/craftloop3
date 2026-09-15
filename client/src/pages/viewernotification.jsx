import { useState } from 'react'

function ViewerNotification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New course available',
      message: 'Complete UI UX Design is now available to start learning.',
      time: '10 minutes ago',
      type: 'course',
      read: false,
    },
    {
      id: 2,
      title: 'New community activity',
      message: 'Someone posted a new update in the CraftLoop community.',
      time: '1 hour ago',
      type: 'community',
      read: false,
    },
    {
      id: 3,
      title: 'Course progress',
      message: 'You are making great progress. Continue your learning journey.',
      time: '3 hours ago',
      type: 'learning',
      read: true,
    },
    {
      id: 4,
      title: 'Welcome to CraftLoop',
      message: 'Explore creators, projects and courses from your dashboard.',
      time: '1 day ago',
      type: 'welcome',
      read: true,
    },
  ])

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    )
  }

  const getIcon = (type) => {
    if (type === 'course') return '📚'
    if (type === 'community') return '👥'
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

        {notifications.map((item) => (

          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={`cursor-pointer rounded-3xl border p-5 transition hover:shadow-sm ${
              item.read
                ? 'border-purple-100 bg-white'
                : 'border-purple-200 bg-purple-50/60'
            }`}
          >

            <div className="flex gap-4">

              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                  item.read
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

                  {!item.read && (
                    <span className="rounded-full bg-purple-600 px-2.5 py-1 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}

                </div>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.message}
                </p>

                <p className="mt-3 text-xs font-medium text-gray-400">
                  {item.time}
                </p>

              </div>

            </div>

          </div>

        ))}

      </section>

    </div>
  )
}

export default ViewerNotification