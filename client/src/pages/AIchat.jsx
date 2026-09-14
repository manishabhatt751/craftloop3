import { useEffect, useRef, useState } from 'react'

const starterMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hi! I’m CraftLoop AI. I can help you with ideas, projects, courses, branding, content and creator growth. What would you like to work on?',
    time: 'Now',
  },
]

function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    const savedChat = JSON.parse(
      localStorage.getItem('craftloopAIChat') || 'null'
    )

    if (Array.isArray(savedChat) && savedChat.length > 0) {
      setMessages(savedChat)
    } else {
      setMessages(starterMessages)

      localStorage.setItem(
        'craftloopAIChat',
        JSON.stringify(starterMessages)
      )
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages)

    localStorage.setItem(
      'craftloopAIChat',
      JSON.stringify(updatedMessages)
    )
  }

  const generateReply = (question) => {
    const text = question.toLowerCase()

    if (
      text.includes('project') ||
      text.includes('service')
    ) {
      return 'For a strong project or service, start with a clear title, choose the right category, explain the problem you solve, mention your skills and show your best work. Keep the description simple and focused on the value you provide.'
    }

    if (
      text.includes('course') ||
      text.includes('tutorial') ||
      text.includes('lesson')
    ) {
      return 'A good course should have a clear learning goal. Break it into small lessons, explain one concept at a time and use practical examples. You can also add a short project at the end so learners can apply what they learned.'
    }

    if (
      text.includes('profile') ||
      text.includes('bio')
    ) {
      return 'Make your creator profile clear and professional. Use a short bio that explains what you do, highlight your strongest skills and showcase projects that represent your best work.'
    }

    if (
      text.includes('design') ||
      text.includes('ui') ||
      text.includes('ux')
    ) {
      return 'For design work, focus on hierarchy, spacing, typography, consistency and usability. Before adding more elements, make sure the main action or message is immediately clear to the user.'
    }

    if (
      text.includes('marketing') ||
      text.includes('business') ||
      text.includes('client')
    ) {
      return 'A strong creator business starts with a clear niche and a clear offer. Show potential clients what you can do, who you can help and what result they can expect.'
    }

    if (
      text.includes('content') ||
      text.includes('social') ||
      text.includes('instagram')
    ) {
      return 'For creator content, try a simple structure: hook, useful information and a clear ending. Consistency is important, but quality and relevance should come first.'
    }

    if (
      text.includes('idea') ||
      text.includes('creative')
    ) {
      return 'Try combining two things you already know. For example, take one skill you have and apply it to a different audience or problem. That often creates interesting project ideas.'
    }

    if (
      text.includes('hello') ||
      text.includes('hi') ||
      text.includes('hey')
    ) {
      return 'Hey! Great to have you here. Tell me what you’re creating and I’ll help you plan the next step.'
    }

    return 'That’s a great question. Start by defining your goal, break it into smaller steps and focus on one step at a time. If you tell me more about your project, I can help you create a practical plan.'
  }

  const sendMessage = (e) => {
    e.preventDefault()

    const cleanInput = input.trim()

    if (!cleanInput || isTyping) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: cleanInput,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const updatedMessages = [...messages, userMessage]

    saveMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateReply(cleanInput),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      saveMessages([...updatedMessages, aiMessage])
      setIsTyping(false)
    }, 800)
  }

  const useSuggestion = (suggestion) => {
    setInput(suggestion)
  }

  const clearChat = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your AI chat?'
    )

    if (!confirmClear) return

    localStorage.removeItem('craftloopAIChat')
    setMessages(starterMessages)

    localStorage.setItem(
      'craftloopAIChat',
      JSON.stringify(starterMessages)
    )
  }

  const suggestions = [
    'Give me a project idea',
    'How can I improve my profile?',
    'Help me create a course',
    'Give me content ideas',
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#faf9ff] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
            CraftLoop Assistant
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            AI Chat
          </h1>

          <p className="mt-1 text-gray-500">
            Get ideas and guidance for your creator journey.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Clear Chat
        </button>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        {/* AI Header */}
        <div className="flex items-center gap-4 border-b border-purple-100 bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl">
            ✨
          </div>

          <div>
            <h2 className="font-bold">CraftLoop AI</h2>
            <p className="text-sm text-purple-100">
              Creator Assistant • Always ready to help
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
            <span className="text-sm text-purple-100">
              Online
            </span>
          </div>
        </div>

        {/* Chat */}
        <div className="h-[55vh] min-h-[420px] overflow-y-auto bg-[#fcfbff] p-5 sm:p-7">
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-3 ${
                    message.sender === 'user'
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      message.sender === 'user'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {message.sender === 'user' ? 'You' : 'AI'}
                  </div>

                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.sender === 'user'
                          ? 'rounded-tr-md bg-purple-600 text-white'
                          : 'rounded-tl-md bg-white text-gray-700 shadow-sm'
                      }`}
                    >
                      {message.text}
                    </div>

                    <p
                      className={`mt-1 text-[11px] text-gray-400 ${
                        message.sender === 'user'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  AI
                </div>

                <div className="rounded-2xl rounded-tl-md bg-white px-5 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Try asking
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => useSuggestion(suggestion)}
                className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="border-t border-gray-100 bg-white p-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CraftLoop AI anything..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-400 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Disclaimer */}
      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-gray-400">
        CraftLoop AI is currently a frontend demonstration. Real AI/API
        integration can be connected later.
      </p>
    </div>
  )
}

export default AIChat