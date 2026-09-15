import { useState } from 'react'

function ViewerAIChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hi! I am CraftLoop AI. How can I help you today?',
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Thanks for your message. I am here to help you explore creators, projects and learning opportunities on CraftLoop.',
        },
      ])
    }, 500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="min-h-[calc(100vh-10rem)]">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Chat
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Ask CraftLoop AI for help with creators, projects and learning.
        </p>
      </div>

      <div className="flex min-h-[650px] flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">

        <div className="flex items-center gap-4 border-b border-purple-100 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl text-purple-700">
            AI
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              CraftLoop AI
            </h2>

            <p className="text-xs text-green-600">
              Online
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-[#faf9ff] p-6">

          {messages.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xl rounded-2xl px-5 py-3 text-sm leading-6 ${
                  item.sender === 'user'
                    ? 'rounded-br-md bg-purple-600 text-white'
                    : 'rounded-bl-md border border-purple-100 bg-white text-gray-700 shadow-sm'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

        </div>

        <div className="border-t border-purple-100 bg-white p-5">

          <div className="flex items-center gap-3">

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CraftLoop AI something..."
              className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="button"
              onClick={handleSend}
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ViewerAIChat