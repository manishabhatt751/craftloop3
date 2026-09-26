import { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import AIRecommendationView from '../Components/AIRecommendationView'

const starterMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hi! I’m CraftLoop AI. Tell me your creative or learning goal (e.g. "I want to learn video editing", "Find a graphic designer for a flyer", or "Learn React") and I will recommend real creators, courses, and skills from CraftLoop.',
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

function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('Finding relevant CraftLoop resources...')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastUserMessage, setLastUserMessage] = useState('')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    const savedChat = JSON.parse(
      localStorage.getItem('craftloopAIChat') || 'null'
    )

    if (Array.isArray(savedChat) && savedChat.length > 0) {
      setMessages(savedChat)
    } else {
      setMessages(starterMessages)
      localStorage.setItem('craftloopAIChat', JSON.stringify(starterMessages))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages)
    localStorage.setItem('craftloopAIChat', JSON.stringify(updatedMessages))
  }

  const handleSendPrompt = async (textToSend) => {
    const cleanInput = (typeof textToSend === 'string' ? textToSend : input).trim()
    if (!cleanInput || isTyping) return

    setErrorMessage('')
    setLastUserMessage(cleanInput)

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
    setLoadingPhase('Finding relevant CraftLoop resources...')

    // Update loading text smoothly to accurately represent backend phases
    const phaseTimer = setTimeout(() => {
      setLoadingPhase('Generating your personalized recommendation...')
    }, 1100)

    // Check token authentication
    if (!api.isAuthenticated()) {
      clearTimeout(phaseTimer)
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
      const response = await api.sendAIChat(cleanInput)

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
      console.error('AI Chat Error:', err)
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
      clearTimeout(phaseTimer)
      setIsTyping(false)
      setLoadingPhase('Finding relevant CraftLoop resources...')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendPrompt(input)
  }

  const useSuggestion = (suggestion) => {
    handleSendPrompt(suggestion)
  }

  const clearChat = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your AI chat history?'
    )
    if (!confirmClear) return

    localStorage.removeItem('craftloopAIChat')
    setMessages(starterMessages)
    setErrorMessage('')
    localStorage.setItem('craftloopAIChat', JSON.stringify(starterMessages))
  }

  const suggestions = [
    'I want to learn video editing',
    'Which creator is best for learning graphic design?',
    'I want to create a YouTube video but don\'t know editing',
    'Find courses for beginner UI/UX design',
    'I want a designer for a flyer',
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
            AI Recommendation Assistant
          </h1>
          <p className="mt-1 text-gray-500">
            Intelligent recommendations for real CraftLoop creators, courses, projects, and skills.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-xs transition hover:bg-gray-50"
        >
          Clear Chat
        </button>
      </div>

      {/* Main Chat Window */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        {/* AI Header */}
        <div className="flex items-center gap-4 border-b border-purple-100 bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-inner">
            ✨
          </div>

          <div>
            <h2 className="font-bold text-base text-white">CraftLoop Smart Assistant</h2>
            <p className="text-xs text-purple-100">
              Real Database Recommendations • Creators • Courses • Skills
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse" />
            <span className="text-xs text-purple-100 font-medium">
              Active Database Sync
            </span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="h-[60vh] min-h-[460px] overflow-y-auto bg-[#fcfbff] p-5 sm:p-7">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[92%] gap-3.5 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : message.isError
                        ? 'bg-red-100 text-red-600'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {message.sender === 'user' ? 'You' : message.isError ? '!' : 'AI'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`rounded-2xl px-5 py-3.5 text-sm leading-6 ${
                        message.sender === 'user'
                          ? 'rounded-tr-md bg-purple-600 text-white shadow-xs'
                          : message.isError
                          ? 'rounded-tl-md border border-red-200 bg-red-50 text-red-700'
                          : 'rounded-tl-md border border-purple-50 bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>

                      {/* Structured Recommendations Card Section */}
                      {message.recommendation && (
                        <AIRecommendationView
                          recommendation={message.recommendation}
                          onSelectPrompt={useSuggestion}
                          isViewer={false}
                        />
                      )}

                      {/* Inline Retry Button for Error Messages */}
                      {message.isError && lastUserMessage && (
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
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.time}
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

                <div className="rounded-2xl rounded-tl-md border border-purple-50 bg-white px-5 py-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-purple-700 font-medium">
                      {loadingPhase}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions Bar */}
        <div className="border-t border-purple-50 bg-white px-5 py-3.5">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Try asking
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => useSuggestion(suggestion)}
                disabled={isTyping}
                className="rounded-full border border-purple-100 bg-purple-50/70 px-3.5 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 hover:border-purple-200 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-purple-100 bg-white p-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CraftLoop AI for creators, courses, skills, or project ideas..."
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-xs transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 text-sm"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grounding Notice */}
      <p className="mx-auto mt-3.5 max-w-5xl text-center text-xs text-gray-400">
        Recommendations are retrieved directly from verified CraftLoop MongoDB creators, published courses, and projects.
      </p>
    </div>
  )
}

export default AIChat