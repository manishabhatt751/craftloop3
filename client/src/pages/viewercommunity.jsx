import { useEffect, useState } from 'react'

function ViewerCommunity() {
  const [post, setPost] = useState('')
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [commentText, setCommentText] = useState({})
  const [comments, setComments] = useState({})

  // Load saved posts
  useEffect(() => {
    const savedPosts =
      JSON.parse(localStorage.getItem('craftloop_community_posts')) || []

    if (savedPosts.length > 0) {
      setPosts(savedPosts)
    } else {
      setPosts([
        {
          id: 1,
          name: 'Alex Morgan',
          username: '@alexmorgan',
          text: 'Just completed my first UI/UX project on CraftLoop!',
          time: '2 hours ago',
        },
        {
          id: 2,
          name: 'Sarah Wilson',
          username: '@sarahwilson',
          text: 'Looking for creative people interested in design and marketing.',
          time: '5 hours ago',
        },
        {
          id: 3,
          name: 'Daniel Smith',
          username: '@danielsmith',
          text: 'React is becoming much easier after practicing every day.',
          time: '1 day ago',
        },
      ])
    }

    const savedComments =
      JSON.parse(localStorage.getItem('craftloop_community_comments')) || []

    setComments(savedComments)

    const savedLikes =
      JSON.parse(localStorage.getItem('craftloop_community_likes')) || []

    setLikedPosts(savedLikes)
  }, [])

  // Save posts
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem(
        'craftloop_community_posts',
        JSON.stringify(posts)
      )
    }
  }, [posts])

  // Save comments
  useEffect(() => {
    localStorage.setItem(
      'craftloop_community_comments',
      JSON.stringify(comments)
    )
  }, [comments])

  // Save likes
  useEffect(() => {
    localStorage.setItem(
      'craftloop_community_likes',
      JSON.stringify(likedPosts)
    )
  }, [likedPosts])

  // Create Post
  const handlePost = () => {
    if (!post.trim()) return

    const newPost = {
      id: Date.now(),
      name: 'Viewer',
      username: '@viewer',
      text: post.trim(),
      time: 'Just now',
    }

    setPosts((prev) => [newPost, ...prev])
    setPost('')
  }

  // Like / Unlike
  const handleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  // Add Comment
  const handleComment = (postId) => {
    const text = commentText[postId]

    if (!text || !text.trim()) return

    const newComment = {
      id: Date.now(),
      name: 'Viewer',
      text: text.trim(),
    }

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }))

    setCommentText((prev) => ({
      ...prev,
      [postId]: '',
    }))
  }

  // Share Post
  const handleShare = async (item) => {
    const shareData = {
      title: `${item.name}'s CraftLoop Post`,
      text: item.text,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        console.log('Share cancelled')
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${item.text} - ${window.location.href}`
        )

        alert('Post link copied!')
      } catch {
        alert('Unable to copy the post link.')
      }
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">
          COMMUNITY
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Community
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Connect with creators, viewers and creative learners.
        </p>
      </section>

      {/* Create Post */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-gray-900">
          Share something
        </h2>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Share your thoughts, ideas or achievements..."
          rows="4"
          className="mt-4 w-full resize-none rounded-2xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
        />

        <div className="mt-4 flex justify-end">

          <button
            type="button"
            onClick={handlePost}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Post
          </button>

        </div>

      </section>

      {/* Posts */}
      <section className="space-y-5">

        {posts.map((item) => (

          <div
            key={item.id}
            className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm"
          >

            {/* User Information */}
            <div className="flex items-center gap-4">

              <img
                src={`https://i.pravatar.cc/100?u=${item.id}`}
                alt={item.name}
                className="h-12 w-12 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-xs text-purple-600">
                  {item.username}
                </p>

              </div>

              <span className="ml-auto text-xs text-gray-400">
                {item.time}
              </span>

            </div>

            {/* Post Content */}
            <p className="mt-5 text-sm leading-7 text-gray-600">
              {item.text}
            </p>

            {/* Actions */}
            <div className="mt-5 flex gap-6 border-t border-purple-50 pt-4">

              <button
                type="button"
                onClick={() => handleLike(item.id)}
                className={`text-sm font-semibold transition ${
                  likedPosts.includes(item.id)
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-purple-600'
                }`}
              >
                {likedPosts.includes(item.id)
                  ? '♥ Liked'
                  : '♡ Like'}
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(`comment-${item.id}`)
                    ?.focus()
                }
                className="text-sm font-semibold text-gray-500 hover:text-purple-600"
              >
                Comment
              </button>

              <button
                type="button"
                onClick={() => handleShare(item)}
                className="text-sm font-semibold text-gray-500 hover:text-purple-600"
              >
                Share
              </button>

            </div>

            {/* Comment Box */}
            <div className="mt-4 border-t border-purple-50 pt-4">

              <div className="flex gap-3">

                <input
                  id={`comment-${item.id}`}
                  type="text"
                  value={commentText[item.id] || ''}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(item.id)
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={() => handleComment(item.id)}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Send
                </button>

              </div>

              {/* Comments */}
              {comments[item.id]?.length > 0 && (
                <div className="mt-4 space-y-3">

                  {comments[item.id].map((comment) => (

                    <div
                      key={comment.id}
                      className="rounded-xl bg-[#faf9ff] p-4"
                    >

                      <p className="text-xs font-bold text-purple-600">
                        {comment.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {comment.text}
                      </p>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </div>

        ))}

      </section>

    </div>
  )
}

export default ViewerCommunity