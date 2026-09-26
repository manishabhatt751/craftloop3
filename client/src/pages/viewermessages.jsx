import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { getSocket } from '../services/socket'

function ViewerMessages() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const res = await api.getConversations()
        if (res && res.success && Array.isArray(res.data)) {
          const loaded = res.data.map((c) => ({
            id: c.partner._id,
            name: c.partner.name,
            username: `@${c.partner.email ? c.partner.email.split('@')[0] : 'user'}`,
            skill: c.partner.title || (c.partner.role === 'creator' ? 'Creator' : 'Viewer'),
            message: c.lastMessage,
            time: new Date(c.lastMessageTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            image: c.partner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.partner.name)}&background=7c3aed&color=fff`,
            online: true,
          }))
          setConversations(loaded)
        } else {
          setConversations([])
        }
      } catch (err) {
        console.error('Failed to load viewer conversations:', err)
        setConversations([])
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Socket.io real-time listener for updating conversation list
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = (newMsg) => {
      if (!newMsg) return

      const partnerObj = newMsg.sender
      const partnerId = (partnerObj?._id || partnerObj)?.toString()

      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id?.toString() === partnerId)
        const updatedTime = new Date(newMsg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        if (index >= 0) {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            message: newMsg.content,
            time: updatedTime,
          }
          return updated
        }

        return prev
      })
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [])

  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-semibold text-purple-600">
          MESSAGES
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Your Conversations
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Connect with creators and continue your conversations.
        </p>
      </section>


      <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white">

        <div className="border-b border-purple-100 p-6">

          <h2 className="text-lg font-bold text-gray-900">
            Conversations
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {conversations.length} conversations
          </p>

        </div>


        <div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold text-gray-700">No conversations yet</p>
              <p className="mt-1 text-sm text-gray-400">
                Explore creators and start a conversation from their profile or project.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() =>
                  navigate(`/viewermessages/${conversation.id}`)
                }
                className="flex w-full items-center gap-4 border-b border-gray-100 p-5 text-left transition hover:bg-[#faf9ff]"
              >
                <div className="relative">
                  <img
                    src={conversation.image}
                    alt={conversation.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      {conversation.name}
                    </h3>
                    <span className="shrink-0 text-xs text-gray-400">
                      {conversation.time}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-purple-600">
                    {conversation.username}
                  </p>

                  <p className="mt-2 truncate text-sm text-gray-500">
                    {conversation.message}
                  </p>
                </div>

                <span className="text-lg text-gray-300">
                  →
                </span>
              </button>
            ))
          )}
        </div>

      </section>

    </div>
  )
}

export default ViewerMessages