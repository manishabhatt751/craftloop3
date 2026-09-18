import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { getSocket } from '../services/socket'

function ViewerMessageChat() {
  const navigate = useNavigate()
  const { userId } = useParams()

  const fallbackUsers = {
    1: {
      name: 'Alex Morgan',
      username: '@alexmorgan',
      skill: 'UI UX Designer',
      image: 'https://i.pravatar.cc/100?img=11',
      messages: [
        {
          id: 1,
          sender: 'creator',
          text: 'Hi. Thanks for checking out my project.',
          time: '10:25 AM',
        },
        {
          id: 2,
          sender: 'viewer',
          text: 'Your project looks really interesting.',
          time: '10:28 AM',
        },
        {
          id: 3,
          sender: 'creator',
          text: 'Thanks for checking out my project.',
          time: '10:30 AM',
        },
      ],
    },

    2: {
      name: 'Sarah Wilson',
      username: '@sarahwilson',
      skill: 'Graphic Designer',
      image: 'https://i.pravatar.cc/100?img=12',
      messages: [
        {
          id: 1,
          sender: 'creator',
          text: 'Hello. Are you interested in the course?',
          time: 'Yesterday',
        },
        {
          id: 2,
          sender: 'viewer',
          text: 'Yes. I would like to know more about it.',
          time: 'Yesterday',
        },
        {
          id: 3,
          sender: 'creator',
          text: 'I can share more details about the course.',
          time: 'Yesterday',
        },
      ],
    },

    3: {
      name: 'Daniel Smith',
      username: '@danielsmith',
      skill: 'Web Developer',
      image: 'https://i.pravatar.cc/100?img=13',
      messages: [
        {
          id: 1,
          sender: 'viewer',
          text: 'Hi Daniel. I have a question about your project.',
          time: 'Monday',
        },
        {
          id: 2,
          sender: 'creator',
          text: 'Sure. What would you like to know?',
          time: 'Monday',
        },
        {
          id: 3,
          sender: 'creator',
          text: 'Let me know if you need any help.',
          time: 'Monday',
        },
      ],
    },
  }

  const [partner, setPartner] = useState(fallbackUsers[userId] || null)
  const [messages, setMessages] = useState(fallbackUsers[userId]?.messages || [])
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const me = await api.getMe().catch(() => null)
        if (me && me.user) {
          setCurrentUserId(me.user._id)
        }

        if (userId && typeof userId === 'string' && userId.length === 24) {
          const res = await api.getConversation(userId).catch(() => null)
          if (res && res.success && Array.isArray(res.data)) {
            const myId = me?.user?._id
            const mapped = res.data.map((m) => {
              const isMe = m.sender && (m.sender._id === myId || m.sender === myId)
              return {
                id: m._id,
                sender: isMe ? 'viewer' : 'creator',
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            })
            setMessages(mapped)

            // Extract partner info from first message
            const firstMsg = res.data[0]
            if (firstMsg) {
              const other = (firstMsg.sender?._id === myId || firstMsg.sender === myId)
                ? (firstMsg.recipient || firstMsg.receiver)
                : firstMsg.sender
              if (other && typeof other === 'object') {
                setPartner({
                  name: other.name,
                  username: `@${other.email ? other.email.split('@')[0] : 'user'}`,
                  skill: other.title || (other.role === 'creator' ? 'Creator' : 'Viewer'),
                  image: other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=7c3aed&color=fff`,
                })
              }
            }

            api.markConversationAsRead(userId).catch(() => null)
          }
        }
      } catch (err) {
        console.error('Failed to load chat data from backend:', err)
      }
    }

    loadData()
  }, [userId])

  // Socket.io real-time listener
  useEffect(() => {
    const socket = getSocket()
    if (!socket || !userId) return

    const handleNewMessage = (newMsg) => {
      if (!newMsg) return

      const senderId = (newMsg.sender?._id || newMsg.sender)?.toString()
      const myId = currentUserId?.toString()
      const isFromPartner = senderId === userId.toString()
      const isFromMe = myId && senderId === myId

      if (isFromPartner || isFromMe) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg._id)) {
            return prev
          }
          return [
            ...prev,
            {
              id: newMsg._id,
              sender: isFromMe ? 'viewer' : 'creator',
              text: newMsg.content,
              time: new Date(newMsg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]
        })

        if (isFromPartner) {
          api.markConversationAsRead(userId).catch(() => null)
        }
      }
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [userId, currentUserId])

  const user = partner || fallbackUsers[userId]

  if (!user) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Conversation not found
        </h1>

        <button
          type="button"
          onClick={() => navigate('/viewermessages')}
          className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white"
        >
          Back to Messages
        </button>
      </div>
    )
  }

  const allMessages = messages

  const sendMessage = async () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    if (userId && typeof userId === 'string' && userId.length === 24) {
      try {
        const res = await api.sendMessage(userId, trimmedMessage)
        if (res && res.success) {
          setMessages((current) => [
            ...current,
            {
              id: res.data._id,
              sender: 'viewer',
              text: res.data.content,
              time: new Date(res.data.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ])
          setMessage('')
          return
        }
      } catch (err) {
        console.error('Failed to send message:', err)
      }
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'viewer',
        text: trimmedMessage,
        time: 'Just now',
      },
    ])

    setMessage('')
  }

  return (
    <div className="space-y-6">

      <button
        type="button"
        onClick={() => navigate('/viewermessages')}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        Back to Messages
      </button>


      <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white">

        <div className="flex items-center gap-4 border-b border-purple-100 p-6">

          <img
            src={user.image}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="text-sm text-purple-600">
              {user.username}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {user.skill}
            </p>
          </div>

        </div>


        <div className="min-h-[500px] space-y-4 bg-[#faf9ff] p-6">

          {allMessages.map((item) => {

            const isViewer = item.sender === 'viewer'

            return (
              <div
                key={item.id}
                className={`flex ${
                  isViewer ? 'justify-end' : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isViewer
                      ? 'rounded-br-md bg-purple-600 text-white'
                      : 'rounded-bl-md bg-white text-gray-700 shadow-sm'
                  }`}
                >

                  <p className="text-sm leading-6">
                    {item.text}
                  </p>

                  <p
                    className={`mt-1 text-[10px] ${
                      isViewer
                        ? 'text-purple-200'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.time}
                  </p>

                </div>

              </div>
            )
          })}

        </div>


        <div className="border-t border-purple-100 bg-white p-5">

          <div className="flex gap-3">

            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessage()
                }
              }}
              placeholder={`Message ${user.name}...`}
              className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="button"
              onClick={sendMessage}
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Send
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default ViewerMessageChat