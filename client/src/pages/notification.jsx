import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Notification() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: '🎉',
      title: 'Your profile is getting attention',
      description: 'You received 12 new profile views.',
      time: '10 minutes ago',
      unread: true,
    },
    {
      id: 2,
      icon: '💬',
      title: 'New message',
      description: 'Alex wants to collaborate with you.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      icon: '⭐',
      title: 'New review received',
      description: 'You received a new creator review.',
      time: '3 hours ago',
      unread: true,
    },
    {
      id: 4,
      icon: '❤️',
      title: 'Your project was liked',
      description: 'Your Brand Identity Design project received 8 likes.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 5,
      icon: '👥',
      title: 'New follower',
      description: 'Maya Chen started following you.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 6,
      icon: '📚',
      title: 'Course recommendation',
      description: 'A new course matches your creative skills.',
      time: '2 days ago',
      unread: false,
    },
  ])

  const markAllRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    )
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length

  return (
    <div className="notification-page">

      <main className="notification-main">

        {/* Header */}
        <section className="notification-header">

          <div>
            <p className="notification-label">
              ACTIVITY CENTER
            </p>

            <h1>
              Your <span>Notifications</span>
            </h1>

            <p>
              Stay updated with messages, followers, reviews and activity.
            </p>
          </div>

          <button
            className="notification-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>

        </section>

        {/* Summary */}
        <section className="notification-summary">

          <div className="notification-summary-card">

            <div className="notification-summary-icon">
              🔔
            </div>

            <div>
              <p>Unread Notifications</p>
              <h2>{unreadCount}</h2>
            </div>

          </div>

          <button
            className="mark-all-btn"
            onClick={markAllRead}
          >
            ✓ Mark all as read
          </button>

        </section>

        {/* Notifications */}
        <section className="notification-card">

          <div className="notification-card-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Here is what's happening around your profile.
              </p>
            </div>

            <span>
              {notifications.length} notifications
            </span>

          </div>

          <div className="notification-list">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-item ${
                  notification.unread ? 'notification-unread' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >

                <div className="notification-item-icon">
                  {notification.icon}
                </div>

                <div className="notification-item-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {notification.unread && (
                      <span className="unread-dot" />
                    )}

                  </div>

                  <p>
                    {notification.description}
                  </p>

                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

                <button
                  className="notification-arrow"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification.id)
                  }}
                >
                  →
                </button>

              </div>

            ))}

          </div>

        </section>

        {/* Bottom Help */}
        <section className="notification-help">

          <div className="notification-help-icon">
            💡
          </div>

          <div>
            <h3>Want to control your notifications?</h3>

            <p>
              Manage your notification preferences from Account Settings.
            </p>
          </div>

          <button
            onClick={() => navigate('/account-settings')}
          >
            Notification Settings →
          </button>

        </section>

      </main>

    </div>
  )
}

export default Notification