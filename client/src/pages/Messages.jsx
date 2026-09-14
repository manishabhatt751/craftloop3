import { useEffect, useMemo, useState } from 'react'

const defaultConversations = [
  {
    id: 1,
    name: 'Maya Creative',
    username: 'mayacreative',
    role: 'Graphic Designer',
    avatar: 'MC',
    lastMessage: 'Hey! I really liked your recent project.',
    time: '10:30 AM',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'them',
        text: 'Hey! I really liked your recent project.',
        time: '10:28 AM',
      },
      {
        id: 2,
        sender: 'me',
        text: 'Thank you! I really appreciate that.',
        time: '10:29 AM',
      },
      {
        id: 3,
        sender: 'them',
        text: 'Would love to collaborate sometime.',
        time: '10:30 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Arjun Sharma',
    username: 'arjuncreates',
    role: 'UI/UX Designer',
    avatar: 'AS',
    lastMessage: 'Can you share your project details?',
    time: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'them',
        text: 'Can you share your project details?',
        time: 'Yesterday',
      },
      {
        id: 2,
        sender: 'me',
        text: 'Sure, I will send them shortly.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 3,
    name: 'Sarah Studio',
    username: 'sarahstudio',
    role: 'Content Creator',
    avatar: 'SS',
    lastMessage: 'Thanks for the feedback!',
    time: 'Monday',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'me',
        text: 'Your latest content looks great!',
        time: 'Monday',
      },
      {
        id: 2,
        sender: 'them',
        text: 'Thanks for the feedback!',
        time: 'Monday',
      },
    ],
  },
]

function Messages() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem('craftloopMessages') || 'null'
    )

    if (Array.isArray(savedMessages) && savedMessages.length > 0) {
      setConversations(savedMessages)
      setSelectedId(savedMessages[0].id)
    } else {
      setConversations(defaultConversations)
      setSelectedId(defaultConversations[0].id)

      localStorage.setItem(
        'craftloopMessages',
        JSON.stringify(defaultConversations)
      )
    }
  }, [])

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  )

  const filteredConversations = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) return conversations

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(searchText) ||
        conversation.username.toLowerCase().includes(searchText) ||
        conversation.lastMessage.toLowerCase().includes(searchText)
    )
  }, [conversations, search])

  const saveConversations = (updatedConversations) => {
    setConversations(updatedConversations)

    localStorage.setItem(
      'craftloopMessages',
      JSON.stringify(updatedConversations)
    )
  }

  const selectConversation = (id) => {
    setSelectedId(id)

    const updatedConversations = conversations.map((conversation) =>
      conversation.id === id
        ? {
            ...conversation,
            unread: 0,
          }
        : conversation
    )

    saveConversations(updatedConversations)
  }

  const sendMessage = (e) => {
    e.preventDefault()

    if (!message.trim() || !selectedConversation) return

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const updatedConversations = conversations.map((conversation) =>
      conversation.id === selectedConversation.id
        ? {
            ...conversation,
            lastMessage: newMessage.text,
            time: 'Just now',
            messages: [...conversation.messages, newMessage],
          }
        : conversation
    )

    saveConversations(updatedConversations)
    setMessage('')
  }

  const startNewConversation = () => {
    const name = window.prompt('Enter the creator name:')

    if (!name || !name.trim()) return

    const cleanName = name.trim()

    const username = cleanName.toLowerCase().replace(/\s+/g, '')

    const newConversation = {
      id: Date.now(),
      name: cleanName,
      username,
      role: 'Creator',
      avatar: cleanName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      lastMessage: 'New conversation',
      time: 'Just now',
      unread: 0,
      messages: [],
    }

    const updatedConversations = [
      newConversation,
      ...conversations,
    ]

    saveConversations(updatedConversations)
    setSelectedId(newConversation.id)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#faf9ff] p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
          Creator Communication
        </p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Messages
            </h1>

            <p className="mt-1 text-gray-500">
              Connect and communicate with other creators.
            </p>
          </div>

          <button
            onClick={startNewConversation}
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
          >
            + New Message
          </button>
        </div>
      </div>

      {/* Messages Box */}
      <div className="flex h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        {/* Conversation List */}
        <div className="w-full border-r border-gray-100 md:w-80 lg:w-96">
          {/* Search */}
          <div className="border-b border-gray-100 p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white"
            />
          </div>

          {/* List */}
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold text-gray-700">
                  No conversations found
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Try another search.
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  className={`flex w-full items-center gap-3 border-b border-gray-50 p-4 text-left transition ${
                    selectedId === conversation.id
                      ? 'bg-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                      selectedId === conversation.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {conversation.avatar}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-gray-900">
                        {conversation.name}
                      </h3>

                      <span className="shrink-0 text-xs text-gray-400">
                        {conversation.time}
                      </span>
                    </div>

                    <p className="text-xs text-purple-600">
                      {conversation.role}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-gray-500">
                        {conversation.lastMessage}
                      </p>

                      {conversation.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden min-w-0 flex-1 md:flex md:flex-col">
          {!selectedConversation ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-3xl">
                💬
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                Select a conversation
              </h2>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Choose a creator from the left to start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                  {selectedConversation.avatar}
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedConversation.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    @{selectedConversation.username} •{' '}
                    {selectedConversation.role}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#fcfbff] p-6">
                {selectedConversation.messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl">👋</div>

                      <p className="mt-3 font-semibold text-gray-700">
                        Start the conversation
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Send your first message below.
                      </p>
                    </div>
                  </div>
                ) : (
                  selectedConversation.messages.map((item) => (
                    <div
                      key={item.id}
                      className={`flex ${
                        item.sender === 'me'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          item.sender === 'me'
                            ? 'items-end'
                            : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                            item.sender === 'me'
                              ? 'rounded-br-md bg-purple-600 text-white'
                              : 'rounded-bl-md bg-white text-gray-700 shadow-sm'
                          }`}
                        >
                          {item.text}
                        </div>

                        <p
                          className={`mt-1 text-[11px] text-gray-400 ${
                            item.sender === 'me'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={sendMessage}
                className="border-t border-gray-100 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-1 items-center justify-center p-6 text-center md:hidden">
          <div>
            <div className="text-4xl">💬</div>

            <h2 className="mt-4 text-xl font-bold">
              Messages
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Open CraftLoop on a wider screen to use the full chat interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages