import { useState } from 'react'

function AIChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hi! I'm your CraftLoop AI Assistant 👋 How can I help you today?",
    },
  ])

  const suggestions = [
    'How can I improve my skills?',
    'What designs are trending?',
    'How can I grow my profile?',
    'Help me manage my time',
  ]

  const sendMessage = (text = message) => {
    if (!text.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: text,
      },
      {
        type: 'ai',
        text: "That's a great question! I'll help you find the best approach for your creative journey. 🚀",
      },
    ])

    setMessage('')
  }

  return (
    <div className="ai-page">
      <div className="ai-main">

        {/* Header */}
        <div className="ai-header">
          <div>
            <p className="ai-label">CRAFTLOOP AI</p>
            <h1>AI Assistant 🤖</h1>
            <p>
              Get creative ideas, improve your skills and grow your profile.
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="ai-chat-card">

          <div className="ai-chat-header">
            <div className="ai-avatar">✦</div>

            <div>
              <h3>CraftLoop Assistant</h3>
              <span>
                <span className="online-dot"></span>
                Online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.type === 'user' ? 'user-message' : 'ai-message'
                }`}
              >
                {msg.type === 'ai' && (
                  <div className="mini-ai-avatar">✦</div>
                )}

                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

          </div>

          {/* Suggestions */}
          <div className="ai-suggestions">
            <p>Try asking</p>

            <div className="suggestion-list">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="ai-input-area">
            <input
              type="text"
              placeholder="Ask anything about your creative journey..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
            />

            <button
              className="ai-send-btn"
              onClick={() => sendMessage()}
            >
              ➤
            </button>
          </div>

        </div>

        {/* Bottom Tips */}
        <div className="ai-tips">

          <div className="ai-tip">
            <span>💡</span>
            <div>
              <h4>Improve your skills</h4>
              <p>Get personalized ideas to become a better creator.</p>
            </div>
          </div>

          <div className="ai-tip">
            <span>🎨</span>
            <div>
              <h4>Discover design ideas</h4>
              <p>Explore creative directions for your next project.</p>
            </div>
          </div>

          <div className="ai-tip">
            <span>🚀</span>
            <div>
              <h4>Grow your profile</h4>
              <p>Learn how to make your profile more attractive.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AIChat