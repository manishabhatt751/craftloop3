import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const defaultPosts = [
  {
    id: 1,
    name: 'Maya Creative',
    username: 'mayacreative',
    role: 'Graphic Designer',
    category: 'Design',
    time: '2 hours ago',
    content:
      'Just finished a new branding project! I would love to hear your thoughts on the color combination and overall visual direction.',
    likes: 24,
    comments: 6,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    name: 'Arjun Sharma',
    username: 'arjuncreates',
    role: 'UI/UX Designer',
    category: 'UI/UX',
    time: '5 hours ago',
    content:
      'What is one design tool you cannot work without? For me, Figma has completely changed the way I build interfaces.',
    likes: 18,
    comments: 4,
    liked: false,
    saved: false,
  },
  {
    id: 3,
    name: 'Sarah Studio',
    username: 'sarahstudio',
    role: 'Content Creator',
    category: 'Content',
    time: 'Yesterday',
    content:
      'Small reminder for every creator: consistency matters more than perfection. Keep creating, keep learning and keep sharing.',
    likes: 42,
    comments: 9,
    liked: false,
    saved: false,
  },
]

function Community() {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showCreatePost, setShowCreatePost] = useState(false)

  const [postForm, setPostForm] = useState({
    content: '',
    category: 'Design',
  })

  useEffect(() => {
    const savedPosts = JSON.parse(
      localStorage.getItem('craftloopCommunityPosts') || 'null'
    )

    if (Array.isArray(savedPosts) && savedPosts.length > 0) {
      setPosts(savedPosts)
    } else {
      setPosts(defaultPosts)
      localStorage.setItem(
        'craftloopCommunityPosts',
        JSON.stringify(defaultPosts)
      )
    }
  }, [])

  const categories = ['All', 'Design', 'UI/UX', 'Content', 'Development', 'Business']

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory

      const searchText = search.toLowerCase()

      const matchesSearch =
        !searchText ||
        post.content.toLowerCase().includes(searchText) ||
        post.name.toLowerCase().includes(searchText) ||
        post.username.toLowerCase().includes(searchText) ||
        post.category.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [posts, search, activeCategory])

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts)
    localStorage.setItem(
      'craftloopCommunityPosts',
      JSON.stringify(updatedPosts)
    )
  }

  const handleCreatePost = (e) => {
    e.preventDefault()

    if (!postForm.content.trim()) {
      alert('Please write something before posting.')
      return
    }

    const savedProfile = JSON.parse(
      localStorage.getItem('craftloopCreatorProfile') || 'null'
    )

    const newPost = {
      id: Date.now(),
      name: savedProfile?.name || 'Alex Morgan',
      username: savedProfile?.username || 'alexmorgan',
      role: savedProfile?.profession || 'Creator',
      category: postForm.category,
      time: 'Just now',
      content: postForm.content.trim(),
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
    }

    savePosts([newPost, ...posts])

    setPostForm({
      content: '',
      category: 'Design',
    })

    setShowCreatePost(false)

    alert('Post created successfully!')
  }

  const toggleLike = (id) => {
    const updatedPosts = posts.map((post) => {
      if (post.id !== id) return post

      return {
        ...post,
        liked: !post.liked,
        likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
      }
    })

    savePosts(updatedPosts)
  }

  const toggleSave = (id) => {
    const updatedPosts = posts.map((post) => {
      if (post.id !== id) return post

      return {
        ...post,
        saved: !post.saved,
      }
    })

    savePosts(updatedPosts)
  }

  const handleShare = async (post) => {
    const shareText = `${post.content}\n\n— ${post.name} on CraftLoop`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CraftLoop Community',
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        alert('Post copied to clipboard!')
      }
    } catch {
      // User cancelled the share dialog.
    }
  }

  const handleComment = (post) => {
    alert(
      `Comments for "${post.name}" will be connected in the Messages/Community backend phase.`
    )
  }

  const handleDeletePost = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    )

    if (!confirmDelete) return

    const updatedPosts = posts.filter((post) => post.id !== id)
    savePosts(updatedPosts)
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] px-6 py-8 text-gray-900">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
            Creator Community
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Connect with Creators
          </h1>

          <p className="mt-2 text-gray-500">
            Share ideas, discover creators and grow together.
          </p>
        </div>

        <button
          onClick={() => setShowCreatePost(true)}
          className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
        >
          + Create Post
        </button>
      </div>

      {/* Search + Categories */}
      <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <div className="relative mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search community posts..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 outline-none transition focus:border-purple-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* Feed */}
        <div className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-purple-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl">
                🔎
              </div>

              <h2 className="text-xl font-bold">No posts found</h2>

              <p className="mt-2 text-gray-500">
                Try another search or category.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const savedProfile = JSON.parse(
                localStorage.getItem('craftloopCreatorProfile') || 'null'
              )

              const isOwnPost =
                savedProfile?.username &&
                post.username === savedProfile.username

              return (
                <article
                  key={post.id}
                  className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* User */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                        {getInitials(post.name)}
                      </div>

                      <div>
                        <h3 className="font-bold">{post.name}</h3>

                        <p className="text-sm text-gray-500">
                          @{post.username} • {post.role}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {post.time}
                        </p>
                      </div>
                    </div>

                    {isOwnPost && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mt-5">
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-5 whitespace-pre-wrap leading-7 text-gray-700">
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        post.liked
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {post.liked ? '♥' : '♡'} {post.likes}
                    </button>

                    <button
                      onClick={() => handleComment(post)}
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      💬 {post.comments}
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      ↗ Share
                    </button>

                    <button
                      onClick={() => toggleSave(post.id)}
                      className={`ml-auto rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        post.saved
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {post.saved ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {/* Right Panel */}
        <aside className="space-y-5">
          {/* Community Stats */}
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Community</h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-2xl font-bold text-purple-700">
                  {posts.length}
                </p>
                <p className="mt-1 text-xs text-gray-500">Posts</p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-2xl font-bold text-purple-700">120+</p>
                <p className="mt-1 text-xs text-gray-500">Creators</p>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg">
            <h2 className="text-lg font-bold">Community Guidelines</h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-purple-100">
              <li>✓ Be respectful to other creators.</li>
              <li>✓ Share useful and meaningful ideas.</li>
              <li>✓ Give constructive feedback.</li>
              <li>✓ Keep the community creative and positive.</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Quick Links</h2>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                My Profile →
              </button>

              <button
                onClick={() => navigate('/your-project')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                My Projects →
              </button>

              <button
                onClick={() => navigate('/create')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                Create Something →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create a Post</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Share something with the CraftLoop community.
                </p>
              </div>

              <button
                onClick={() => setShowCreatePost(false)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                value={postForm.category}
                onChange={(e) =>
                  setPostForm({
                    ...postForm,
                    category: e.target.value,
                  })
                }
                className="mb-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-purple-400 focus:bg-white"
              >
                {categories
                  .filter((category) => category !== 'All')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Your Post
              </label>

              <textarea
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({
                    ...postForm,
                    content: e.target.value,
                  })
                }
                rows="7"
                maxLength="1000"
                placeholder="Share an idea, ask a question, show your work..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-purple-400 focus:bg-white"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {postForm.content.length}/1000
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Community