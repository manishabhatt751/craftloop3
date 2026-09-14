import { useState } from 'react'

function ViewerCommunity() {
  const [likedPosts, setLikedPosts] = useState([])

  const posts = [
    {
      id: 1,
      name: 'Alex Morgan',
      username: '@alexdesigns',
      role: 'UI UX Designer',
      time: '2h ago',
      content:
        'Just finished designing a new mobile app interface. What do you think about the overall layout?',
      likes: 24,
      comments: 8,
      image:
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      username: '@sarahcreates',
      role: 'Graphic Designer',
      time: '5h ago',
      content:
        'Sharing some design inspiration today. Simple layouts can create really strong visual experiences.',
      likes: 36,
      comments: 12,
      image:
        'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 3,
      name: 'Daniel Smith',
      username: '@danielcodes',
      role: 'Web Developer',
      time: '1d ago',
      content:
        'Learning React has been a great experience. Building projects is definitely the best way to improve.',
      likes: 18,
      comments: 5,
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    },
  ]

  const toggleLike = (id) => {
    setLikedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    )
  }

  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-semibold text-purple-600">
          COMMUNITY
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Connect With Creators
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Discover ideas, projects and conversations from the CraftLoop
          community.
        </p>
      </section>

      <section className="rounded-2xl border border-purple-100 bg-white p-6">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="Viewer"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
          />

          <button
            type="button"
            className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-5 py-3 text-left text-sm text-gray-400 transition hover:border-purple-300"
          >
            Share something with the community...
          </button>

        </div>

      </section>

      <section className="space-y-5">

        {posts.map((post) => {
          const isLiked = likedPosts.includes(post.id)

          return (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-purple-100 bg-white"
            >

              <div className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <img
                      src={`https://i.pravatar.cc/100?img=${post.id + 10}`}
                      alt={post.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
                    />

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {post.name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {post.username} · {post.role} · {post.time}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-gray-400 hover:bg-purple-50 hover:text-purple-600"
                  >
                    More
                  </button>

                </div>

                <p className="mt-5 text-sm leading-7 text-gray-600">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mt-5 overflow-hidden rounded-2xl bg-purple-50">
                    <img
                      src={post.image}
                      alt="Community post"
                      className="max-h-96 w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-b border-gray-100 pb-4">

                  <span className="text-xs text-gray-400">
                    {post.likes + (isLiked ? 1 : 0)} likes
                  </span>

                  <span className="text-xs text-gray-400">
                    {post.comments} comments
                  </span>

                </div>

                <div className="mt-3 flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isLiked
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </button>

                  <button
                    type="button"
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    Comment
                  </button>

                  <button
                    type="button"
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    Share
                  </button>

                </div>

              </div>

            </article>
          )
        })}

      </section>

    </div>
  )
}

export default ViewerCommunity