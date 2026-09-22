import { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import AIRecommendationView from '../Components/AIRecommendationView'

const starterMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hi! I am CraftLoop AI. Tell me what you want to learn or build (e.g. "I want to learn video editing", "Which creator is best for UI/UX?", or "I want a designer for a flyer") and I will find real CraftLoop creators, courses, and skills from our database.',
    time: 'Now',
  },
]

const formatAIChatError = (err) => {
  if (!err) return 'Something went wrong. Please try again.'
  const status = err.status || (err.response && err.response.status)

  if (status === 401) {
    return 'Please log in to CraftLoop to use AI.'
  }
  if (status === 400) {
    return err.data?.message || err.message || 'Invalid request format. Please provide a valid message.'
  }
  if (status === 502 || status === 503) {
    return 'CraftLoop AI service is temporarily unavailable. Please try again shortly.'
  }
  if (status >= 500) {
    return 'Something went wrong on the server. Please try again.'
  }
  if (
    err.name === 'TypeError' ||
    (err.message &&
      (err.message.includes('fetch') ||
        err.message.includes('Network') ||
        err.message.includes('Failed to fetch')))
  ) {
    return 'Unable to connect to CraftLoop server.'
  }
  return err.message || 'Unable to connect to CraftLoop AI assistant. Please try again.'
}

function ViewerAIChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastUserMessage, setLastUserMessage] = useState('')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('craftloopViewerAIChat') || 'null')
    if (Array.isArray(saved) && saved.length > 0) {
      setMessages(saved)
    } else {
      setMessages(starterMessages)
      localStorage.setItem('craftloopViewerAIChat', JSON.stringify(starterMessages))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const saveMessages = (updated) => {
    setMessages(updated)
    localStorage.setItem('craftloopViewerAIChat', JSON.stringify(updated))
  }

  const handleSendPrompt = async (promptToSend) => {
    const clean = (typeof promptToSend === 'string' ? promptToSend : message).trim()
    if (!clean || isTyping) return

    setErrorMessage('')
    setLastUserMessage(clean)

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: clean,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const updatedMessages = [...messages, userMessage]
    saveMessages(updatedMessages)
    setMessage('')
    setIsTyping(true)

    // Check token authentication
    if (!api.isAuthenticated()) {
      const errorText = 'Please log in to CraftLoop to use AI.'
      setErrorMessage(errorText)
      const errorAiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        isError: true,
        text: errorText,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      saveMessages([...updatedMessages, errorAiMessage])
      setIsTyping(false)
      return
    }

    try {
      // Both manual questions and suggested questions use the exact same sendAIChat API call with JWT
      const response = await api.sendAIChat(clean)

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.message || 'Here are the recommendations based on your request.',
        recommendation: response.intent ? response : null,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      saveMessages([...updatedMessages, aiMessage])
    } catch (err) {
      console.error('Viewer AI Chat error:', err)
      const errorText = formatAIChatError(err)
      setErrorMessage(errorText)

      const errorAiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        isError: true,
        text: errorText,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      saveMessages([...updatedMessages, errorAiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendPrompt(message)
    }
  }

  const clearChat = () => {
    const confirmClear = window.confirm('Are you sure you want to clear your AI chat history?')
    if (!confirmClear) return

    localStorage.removeItem('craftloopViewerAIChat')
    setMessages(starterMessages)
    setErrorMessage('')
    localStorage.setItem('craftloopViewerAIChat', JSON.stringify(starterMessages))
  }

  const suggestions = [
    'I want to learn video editing',
    'Which creator is best for graphic design?',
    'I want to create a YouTube video but don\'t know editing',
    'Find courses for beginner web development',
    'I need a designer for a flyer',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Recommendation Assistant
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Ask CraftLoop AI for personalized recommendations on creators, courses, projects and skills.
          </p>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="self-start sm:self-auto rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-2xs transition hover:bg-gray-50"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex min-h-[680px] flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
        {/* Chat Top Banner */}
        <div className="flex items-center gap-4 border-b border-purple-100 bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-xs">
            ✨
          </div>

          <div>
            <h2 className="font-bold text-white text-base">
              CraftLoop AI Assistant
            </h2>
            <p className="text-xs text-purple-100">
              Live Database Recommendations • Verified Creators • Real Courses
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse" />
            <span className="text-xs text-purple-100 font-medium">Online</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-[#faf9ff] p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[92%] gap-3 ${
                    item.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      item.sender === 'user'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : item.isError
                        ? 'bg-red-100 text-red-600'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.sender === 'user' ? 'You' : item.isError ? '!' : 'AI'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`rounded-2xl px-5 py-3.5 text-sm leading-6 ${
                        item.sender === 'user'
                          ? 'rounded-tr-md bg-purple-600 text-white shadow-xs'
                          : item.isError
                          ? 'rounded-tl-md border border-red-200 bg-red-50 text-red-700'
                          : 'rounded-tl-md border border-purple-100 bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{item.text}</p>

                      {item.recommendation && (
                        <AIRecommendationView
                          recommendation={item.recommendation}
                          onSelectPrompt={handleSendPrompt}
                          isViewer={true}
                        />
                      )}

                      {item.isError && lastUserMessage && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => handleSendPrompt(lastUserMessage)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                          >
                            Retry Request
                          </button>
                        </div>
                      )}
                    </div>

                    <p
                      className={`mt-1 text-[11px] text-gray-400 ${
                        item.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  AI
                </div>

                <div className="rounded-2xl rounded-tl-md border border-purple-100 bg-white px-5 py-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-purple-700 font-medium">
                      Finding matching CraftLoop creators and courses...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions Bar */}
        <div className="border-t border-purple-50 bg-white px-6 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Suggested Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSendPrompt(item)}
                disabled={isTyping}
                className="rounded-full border border-purple-100 bg-purple-50/70 px-3.5 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 hover:border-purple-200 disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-purple-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask CraftLoop AI for creators, courses, skills, or project ideas..."
              className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="button"
              onClick={() => handleSendPrompt(message)}
              disabled={!message.trim() || isTyping}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewerAIChat