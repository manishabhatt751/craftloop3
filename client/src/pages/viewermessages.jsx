import { useState } from 'react'

function ViewerMessages() {
  const [selectedMessage, setSelectedMessage] = useState(1)

  const conversations = [
    {
      id: 1,
      name: 'Alex Morgan',
      username: '@alexdesigns',
      message: 'Thanks for checking out my course.',
      time: '10:30 AM',
      unread: 2,
      image: 'https://i.pravatar.cc/100?img=11',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      username: '@sarahcreates',
      message: 'I can help you with the design project.',
      time: 'Yesterday',
      unread: 0,
      image: 'https://i.pravatar.cc/100?img=12',
    },
    {
      id: 3,
      name: 'Daniel Smith',
      username: '@danielcodes',
      message: 'Let me know if you have any questions.',
      time: 'Monday',
      unread: 1,
      image: 'https://i.pravatar.cc/100?img=13',
    },
  ]

  const activeConversation =
    conversations.find((item) => item.id === selectedMessage) ||
    conversations[0]

  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-semibold text-purple-600">
          MESSAGES
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Your Messages
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Connect with creators, ask questions and continue your
          conversations.
        </p>
      </section>

      <section className="grid min-h-[560px] overflow-hidden rounded-2xl border border-purple-100 bg-white lg:grid-cols-[320px_1fr]">

        <div className="border-b border-purple-100 lg:border-b-0 lg:border-r">

          <div className="border-b border-purple-100 p-5">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="divide-y divide-gray-100">

            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedMessage(conversation.id)}
                className={`flex w-full items-center gap-3 p-5 text-left transition ${
                  selectedMessage === conversation.id
                    ? 'bg-purple-50'
                    : 'hover:bg-gray-50'
                }`}
              >

                <img
                  src={conversation.image}
                  alt={conversation.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
                />

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <p className="truncate text-sm font-bold text-gray-900">
                      {conversation.name}
                    </p>

                    <span className="shrink-0 text-[11px] text-gray-400">
                      {conversation.time}
                    </span>

                  </div>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {conversation.message}
                  </p>

                </div>

                {conversation.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1.5 text-[10px] font-bold text-white">
                    {conversation.unread}
                  </span>
                )}

              </button>
            ))}

          </div>

        </div>

        <div className="flex flex-col">

          <div className="flex items-center justify-between border-b border-purple-100 p-5">

            <div className="flex items-center gap-3">

              <img
                src={activeConversation.image}
                alt={activeConversation.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
              />

              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  {activeConversation.name}
                </h2>

                <p className="text-xs text-gray-400">
                  {activeConversation.username}
                </p>
              </div>

            </div>

            <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
              Online
            </span>

          </div>

          <div className="flex-1 space-y-5 bg-[#faf9ff] p-6">

            <div className="flex justify-start">
              <div className="max-w-md rounded-2xl rounded-tl-none bg-white p-4 shadow-sm">
                <p className="text-sm leading-6 text-gray-600">
                  Hi. Thanks for connecting with me on CraftLoop.
                </p>
                <p className="mt-2 text-[10px] text-gray-400">
                  10:25 AM
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-md rounded-2xl rounded-tr-none bg-purple-600 p-4">
                <p className="text-sm leading-6 text-white">
                  Hi. I really liked your course and wanted to know more
                  about the design process.
                </p>
                <p className="mt-2 text-right text-[10px] text-purple-200">
                  10:28 AM
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-md rounded-2xl rounded-tl-none bg-white p-4 shadow-sm">
                <p className="text-sm leading-6 text-gray-600">
                  {activeConversation.message}
                </p>
                <p className="mt-2 text-[10px] text-gray-400">
                  10:30 AM
                </p>
              </div>
            </div>

          </div>

          <div className="border-t border-purple-100 bg-white p-5">

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="Write a message..."
                className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="button"
                className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default ViewerMessages