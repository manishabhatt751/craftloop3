import { useState } from 'react'

function Messages() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [message, setMessage] = useState('')

  const conversations = [
    {
      name: 'Alex Morgan',
      role: 'UI/UX Designer',
      avatar: 'AM',
      message: 'Hey! I loved your latest project.',
      time: '10:42 AM',
      unread: 2,
    },
    {
      name: 'Sarah Williams',
      role: 'Graphic Designer',
      avatar: 'SW',
      message: 'Can you share the project details?',
      time: 'Yesterday',
      unread: 1,
    },
    {
      name: 'Ryan Lee',
      role: 'Illustrator',
      avatar: 'RL',
      message: 'Thanks for your feedback!',
      time: 'Yesterday',
      unread: 0,
    },
    {
      name: 'Maya Chen',
      role: 'Product Designer',
      avatar: 'MC',
      message: 'Let’s collaborate on this.',
      time: 'Monday',
      unread: 0,
    },
  ]

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'them',
      text: 'Hey! I loved your latest project. The visual style looks really clean.',
      time: '10:35 AM',
    },
    {
      sender: 'me',
      text: 'Thank you! I really appreciate that 😊',
      time: '10:37 AM',
    },
    {
      sender: 'them',
      text: 'Are you working on anything new right now?',
      time: '10:39 AM',
    },
    {
      sender: 'me',
      text: 'Yes! I’m currently working on a new creative project for CraftLoop.',
      time: '10:41 AM',
    },
    {
      sender: 'them',
      text: 'That sounds interesting! I’d love to see it when it’s ready.',
      time: '10:42 AM',
    },
  ])

  const sendMessage = () => {
    if (!message.trim()) return

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg = {
      sender: 'me',
      text: message.trim(),
      time: timeString,
    }

    setChatMessages((prev) => [...prev, userMsg])
    setMessage('')

    // Optional simulated polite response from the collaborator
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'them',
          text: 'Great point! Let me review the details and get right back to you.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  return (
    <div className="messages-page">
      <div className="messages-main">

        {/* Header */}
        <div className="messages-header">
          <div>
            <p className="messages-label">CONNECT</p>
            <h1>Messages</h1>
            <p>Stay connected with creators and collaborators.</p>
          </div>

          <button className="new-message-btn">
            + New Message
          </button>
        </div>

        {/* Messages Layout */}
        <div className="messages-container">

          {/* Conversation List */}
          <div className="conversation-panel">

            <div className="conversation-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search conversations..."
              />
            </div>

            <div className="conversation-title">
              <span>Recent</span>
              <span>{conversations.length}</span>
            </div>

            <div className="conversation-list">

              {conversations.map((chat, index) => (
                <button
                  key={chat.name}
                  className={`conversation-item ${
                    selectedChat === index ? 'selected-chat' : ''
                  }`}
                  onClick={() => setSelectedChat(index)}
                >

                  <div className="conversation-avatar">
                    {chat.avatar}
                  </div>

                  <div className="conversation-info">
                    <div className="conversation-name-row">
                      <h3>{chat.name}</h3>
                      <span>{chat.time}</span>
                    </div>

                    <p>{chat.message}</p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="unread-count">
                      {chat.unread}
                    </div>
                  )}

                </button>
              ))}

            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-panel">

            {/* Chat Header */}
            <div className="chat-header">

              <div className="chat-user-avatar">
                {conversations[selectedChat].avatar}
              </div>

              <div>
                <h2>{conversations[selectedChat].name}</h2>
                <p>
                  <span className="chat-online-dot"></span>
                  {conversations[selectedChat].role}
                </p>
              </div>

              <button className="chat-more-btn">
                ⋮
              </button>

            </div>

            {/* Messages */}
            <div className="chat-body">

              <div className="chat-date">
                <span>Today</span>
              </div>

              {chatMessages.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-row ${
                    chat.sender === 'me'
                      ? 'my-chat'
                      : 'their-chat'
                  }`}
                >
                  <div className="chat-bubble">
                    <p>{chat.text}</p>
                    <span>{chat.time}</span>
                  </div>
                </div>
              ))}

            </div>

            {/* Message Input */}
            <div className="message-input-area">

              <button className="message-action-btn">
                ＋
              </button>

              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }}
              />

              <button className="emoji-btn">
                ☺
              </button>

              <button
                className="message-send-btn"
                onClick={sendMessage}
              >
                ➤
              </button>

            </div>

          </div>
        </div>

        {/* Bottom Info */}
        <div className="messages-info">

          <div>
            <span>💬</span>
            <div>
              <h4>Build connections</h4>
              <p>Connect with creators and collaborate on new ideas.</p>
            </div>
          </div>

          <div>
            <span>🤝</span>
            <div>
              <h4>Collaborate</h4>
              <p>Discuss projects, services and creative opportunities.</p>
            </div>
          </div>

          <div>
            <span>✨</span>
            <div>
              <h4>Grow together</h4>
              <p>Share feedback and help each other improve.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Messages