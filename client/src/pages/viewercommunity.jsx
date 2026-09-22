import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return String(dateStr)
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const safeGetJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null || item === undefined) return fallback
    const parsed = JSON.parse(item)
    return parsed !== null && parsed !== undefined ? parsed : fallback
  } catch (err) {
    return fallback
  }
}

function ViewerCommunity() {
  const [post, setPost] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentText, setCommentText] = useState({})
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const currentUser = useMemo(() => safeGetJSON('craftloop_user', null), [])
  const currentUserId = currentUser?._id || currentUser?.id

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3800)
  }

  const normalizePost = (p) => {
    const authorObj = typeof p.author === 'object' && p.author !== null ? p.author : null
    const authorName = p.authorName || authorObj?.name || 'Community Member'
    const authorUsername = authorObj?.email
      ? `@${authorObj.email.split('@')[0]}`
      : `@${authorName.toLowerCase().replace(/\s+/g, '')}`
    const likesArr = Array.isArray(p.likes) ? p.likes : []
    const isLiked = currentUserId
      ? likesArr.some((id) => (id?._id || id)?.toString() === currentUserId?.toString())
      : false

    return {
      id: p._id || p.id,
      _id: p._id || p.id,
      name: authorName,
      username: authorUsername,
      text: p.content,
      image: p.image || null,
      time: formatTimeAgo(p.createdAt),
      likes: likesArr.length,
      liked: isLiked,
      comments: (p.comments || []).map((c) => ({
        id: c._id || c.id || Math.random().toString(),
        name:
          c.authorName ||
          (typeof c.author === 'object' ? c.author?.name : 'Community Member') ||
          'Community Member',
        text: c.text,
        time: formatTimeAgo(c.createdAt),
      })),
    }
  }

  // Load live posts from MongoDB Atlas
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.getCommunityPosts()
      if (res && res.success && Array.isArray(res.data)) {
        setPosts(res.data.map(normalizePost))
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('Error fetching viewer community posts:', err)
      setError('Unable to load live community posts from server.')
      showToast('Failed to load posts from server.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Create Post via API
  const handlePost = async () => {
    if (!post.trim()) {
      showToast('Please enter something to share.', 'warning')
      return
    }

    if (!api.isAuthenticated()) {
      showToast('Please log in to share a post.', 'warning')
      return
    }

    try {
      const res = await api.createCommunityPost({
        content: post.trim(),
        category: 'Discussion',
        tags: ['Discussion'],
      })

      if (res && res.success && res.data) {
        setPosts((prev) => [normalizePost(res.data), ...prev])
        setPost('')
        showToast('Post published successfully to MongoDB Atlas!', 'success')
      }
    } catch (err) {
      console.error('Error creating viewer community post:', err)
      showToast(err.message || 'Error publishing post.', 'error')
    }
  }

  // Like / Unlike via API
  const handleLike = async (postId) => {
    if (!api.isAuthenticated()) {
      showToast('Please log in to like posts.', 'warning')
      return
    }

    try {
      const res = await api.likeCommunityPost(postId)
      if (res && res.success) {
        setPosts((prev) =>
          prev.map((item) => {
            if (item.id !== postId && item._id !== postId) return item
            return {
              ...item,
              liked: res.liked !== undefined ? res.liked : !item.liked,
              likes:
                res.likesCount !== undefined
                  ? res.likesCount
                  : item.liked
                  ? Math.max(0, item.likes - 1)
                  : item.likes + 1,
            }
          })
        )
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      showToast(err.message || 'Error updating like.', 'error')
    }
  }

  // Add Comment via API
  const handleComment = async (postId) => {
    const text = (commentText[postId] || '').trim()
    if (!text) {
      showToast('Please type a comment first.', 'warning')
      return
    }

    if (!api.isAuthenticated()) {
      showToast('Please log in to comment.', 'warning')
      return
    }

    try {
      const res = await api.commentCommunityPost(postId, text)
      if (res && res.success && res.data) {
        const updatedPost = normalizePost(res.data)
        setPosts((prev) =>
          prev.map((item) => (item.id === postId || item._id === postId ? updatedPost : item))
        )
        setCommentText((prev) => ({
          ...prev,
          [postId]: '',
        }))
        showToast('Comment added!', 'success')
      }
    } catch (err) {
      console.error('Error adding comment:', err)
      showToast(err.message || 'Error adding comment.', 'error')
    }
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
        showToast('Post shared successfully!', 'success')
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${item.text} - ${window.location.href}`)
        showToast('Post link copied to clipboard!', 'success')
      } catch {
        showToast('Unable to copy the post link.', 'error')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-4 text-sm font-medium text-white shadow-2xl transition-all animate-bounce">
          <span className="text-lg">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">COMMUNITY</p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">Community</h1>

        <p className="mt-2 text-sm text-gray-500">
          Connect with creators, viewers and creative learners.
        </p>
      </section>

      {/* Create Post */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Share something</h2>

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
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-95"
          >
            Post
          </button>
        </div>
      </section>

      {/* Posts */}
      <section className="space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-gray-600">
              Loading community discussions from MongoDB Atlas...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-700"
            >
              Retry Loading
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
            <p className="text-base font-semibold text-gray-700">No community posts yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to start a discussion or share an update!
            </p>
          </div>
        ) : (
          posts.map((item) => {
            const currentPostId = item.id || item._id
            return (
              <div
                key={currentPostId}
                className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* User Information */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700 shadow-inner">
                    {item.name ? item.name.slice(0, 2).toUpperCase() : 'CL'}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>

                    <p className="text-xs text-purple-600">{item.username}</p>
                  </div>

                  <span className="ml-auto text-xs text-gray-400">{item.time}</span>
                </div>

                {/* Post Content */}
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                  {item.text}
                </p>

                {/* Optional Image */}
                {item.image && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-purple-50 bg-gray-50">
                    <img
                      src={item.image}
                      alt="Post media"
                      className="max-h-96 w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex gap-6 border-t border-purple-50 pt-4">
                  <button
                    type="button"
                    onClick={() => handleLike(currentPostId)}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                      item.liked ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'
                    }`}
                  >
                    <span>{item.liked ? '♥' : '♡'}</span>
                    <span>{item.likes > 0 ? item.likes : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => document.getElementById(`comment-${currentPostId}`)?.focus()}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-purple-600"
                  >
                    <span>💬</span>
                    <span>{item.comments?.length ? `${item.comments.length} Comments` : 'Comment'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-purple-600"
                  >
                    <span>↗</span>
                    <span>Share</span>
                  </button>
                </div>

                {/* Comment Box */}
                <div className="mt-4 border-t border-purple-50 pt-4">
                  <div className="flex gap-3">
                    <input
                      id={`comment-${currentPostId}`}
                      type="text"
                      value={commentText[currentPostId] || ''}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [currentPostId]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(currentPostId)
                        }
                      }}
                      placeholder="Write a comment..."
                      className="flex-1 rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() => handleComment(currentPostId)}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-95"
                    >
                      Send
                    </button>
                  </div>

                  {/* Comments */}
                  {item.comments?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {item.comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl bg-[#faf9ff] p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-purple-600">{comment.name}</p>
                            {comment.time && (
                              <span className="text-[10px] text-gray-400">{comment.time}</span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </section>
    </div>
  )
}

export default ViewerCommunity