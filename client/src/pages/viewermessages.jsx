import { useNavigate } from 'react-router-dom'

function ViewerMessages() {
  const navigate = useNavigate()

  const conversations = [
    {
      id: 1,
      name: 'Alex Morgan',
      username: '@alexmorgan',
      skill: 'UI UX Designer',
      message: 'Thanks for checking out my project.',
      time: '10:30 AM',
      image: 'https://i.pravatar.cc/100?img=11',
      online: true,
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      username: '@sarahwilson',
      skill: 'Graphic Designer',
      message: 'I can share more details about the course.',
      time: 'Yesterday',
      image: 'https://i.pravatar.cc/100?img=12',
      online: false,
    },
    {
      id: 3,
      name: 'Daniel Smith',
      username: '@danielsmith',
      skill: 'Web Developer',
      message: 'Let me know if you need any help.',
      time: 'Monday',
      image: 'https://i.pravatar.cc/100?img=13',
      online: true,
    },
  ]

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

          {conversations.map((conversation) => (
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
          ))}

        </div>

      </section>

    </div>
  )
}

export default ViewerMessages