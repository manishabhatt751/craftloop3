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
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    likes: 24,
    comments: 2,
    liked: false,
    saved: false,
    commentsList: [
      {
        id: 101,
        author: 'Arjun Sharma',
        username: 'arjuncreates',
        time: '1 hour ago',
        text: 'The gradient transitions are super clean! What software did you use?',
      },
      {
        id: 102,
        author: 'Sarah Studio',
        username: 'sarahstudio',
        time: '30 mins ago',
        text: 'Love the purple and pastel tones. Great work!',
      },
    ],
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
    image: null,
    likes: 18,
    comments: 1,
    liked: false,
    saved: false,
    commentsList: [
      {
        id: 201,
        author: 'Maya Creative',
        username: 'mayacreative',
        time: '3 hours ago',
        text: '100% Figma for collaborative design systems!',
      },
    ],
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
    image: null,
    likes: 42,
    comments: 0,
    liked: false,
    saved: false,
    commentsList: [],
  },
]

// Safe local storage JSON getter
const safeGetJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null || item === undefined) return fallback
    const parsed = JSON.parse(item)
    return parsed !== null && parsed !== undefined ? parsed : fallback
  } catch (err) {
    console.warn(`[CraftLoop] Error reading ${key} from storage:`, err)
    return fallback
  }
}

function Community() {
  const navigate = useNavigate()

  // Main state
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showCreatePost, setShowCreatePost] = useState(false)

  // Current user & role state
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('craftloopRole') || 'creator'
  })

  const [creatorProfile, setCreatorProfile] = useState(() => {
    return (
      safeGetJSON('craftloopCreatorProfile', null) || {
        name: 'Alex Morgan',
        username: 'alexmorgan',
        profession: 'Creator',
      }
    )
  })

  // Form State
  const [postForm, setPostForm] = useState({
    content: '',
    category: 'Design',
    image: '',
  })
  const [imagePreview, setImagePreview] = useState('')

  // Expanded comments section map: { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})

  // On-screen Permission Modal State
  const [permissionModal, setPermissionModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'creator_role' | 'clipboard' | 'media' | 'denied'
  })

  // On-screen Delete Confirmation Dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    postId: null,
  })

  // On-screen Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
  })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3800)
  }

  // Load initial posts safely
  useEffect(() => {
    const savedPosts = safeGetJSON('craftloopCommunityPosts', null)
    if (Array.isArray(savedPosts)) {
      setPosts(savedPosts)
    } else {
      setPosts(defaultPosts)
      localStorage.setItem('craftloopCommunityPosts', JSON.stringify(defaultPosts))
    }

    // Check profile
    const profile = safeGetJSON('craftloopCreatorProfile', null)
    if (profile) {
      setCreatorProfile(profile)
    }
  }, [])

  const categories = ['All', 'Design', 'UI/UX', 'Content', 'Development', 'Business']

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory

      const searchText = search.toLowerCase().trim()
      if (!searchText) return matchesCategory

      const matchesSearch =
        (post.content && post.content.toLowerCase().includes(searchText)) ||
        (post.name && post.name.toLowerCase().includes(searchText)) ||
        (post.username && post.username.toLowerCase().includes(searchText)) ||
        (post.category && post.category.toLowerCase().includes(searchText))

      return matchesCategory && matchesSearch
    })
  }, [posts, search, activeCategory])

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts)
    try {
      localStorage.setItem('craftloopCommunityPosts', JSON.stringify(updatedPosts))
    } catch (err) {
      console.error('Failed to save posts to localStorage:', err)
      showToast('Storage quota exceeded. Some posts may not persist.', 'warning')
    }
  }

  // Safe initial generator to prevent undefined.toUpperCase() runtime crashes
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'CL'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'CL'
    return parts.map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  // Handle "+ Create Post" click with Permission Check
  const handleOpenCreatePost = () => {
    // If user is currently in viewer mode, show Permission Required dialog on screen
    if (userRole === 'viewer') {
      setPermissionModal({
        isOpen: true,
        title: 'Creator Permission Required',
        message:
          'Publishing community posts requires Creator permissions. You are currently in Viewer mode.',
        actionType: 'creator_role',
      })
      return
    }

    setShowCreatePost(true)
  }

  // Switch role to Creator directly from on-screen permission modal
  const handleGrantCreatorPermission = () => {
    localStorage.setItem('craftloopRole', 'creator')
    setUserRole('creator')
    setPermissionModal({ isOpen: false, title: '', message: '', actionType: null })
    setShowCreatePost(true)
    showToast('Creator permission granted! You can now publish posts.', 'success')
  }

  // Image file handler for post creation
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error')
      return
    }

    // Limit to 2MB for localStorage safety
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be under 2MB.', 'warning')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (result) {
        setImagePreview(result)
        setPostForm((prev) => ({ ...prev, image: result }))
      }
    }
    reader.onerror = () => {
      showToast('Error reading image file.', 'error')
    }
    reader.readAsDataURL(file)
  }

  // Handle Post Creation
  const handleCreatePost = (e) => {
    e.preventDefault()

    if (!postForm.content.trim()) {
      showToast('Please write something before publishing.', 'warning')
      return
    }

    // Verify creator permission
    if (userRole !== 'creator') {
      setPermissionModal({
        isOpen: true,
        title: 'Creator Permission Required',
        message: 'You need Creator permissions to publish. Please grant permission to continue.',
        actionType: 'creator_role',
      })
      return
    }

    const newPost = {
      id: Date.now(),
      name: creatorProfile?.name || 'Alex Morgan',
      username: creatorProfile?.username || 'alexmorgan',
      role: creatorProfile?.profession || 'Creator',
      category: postForm.category,
      time: 'Just now',
      content: postForm.content.trim(),
      image: postForm.image || null,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      commentsList: [],
    }

    savePosts([newPost, ...posts])

    setPostForm({
      content: '',
      category: 'Design',
      image: '',
    })
    setImagePreview('')
    setShowCreatePost(false)
    showToast('Post published successfully!', 'success')
  }

  // Toggle Like
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

  // Toggle Save
  const toggleSave = (id) => {
    const updatedPosts = posts.map((post) => {
      if (post.id !== id) return post
      const newSaved = !post.saved
      if (newSaved) {
        showToast('Post saved to your collection!', 'success')
      }
      return {
        ...post,
        saved: newSaved,
      }
    })
    savePosts(updatedPosts)
  }

  // Share with clipboard permission handling
  const handleShare = async (post) => {
    const shareText = `${post.content}\n\n— ${post.name} on CraftLoop`
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.name}'s CraftLoop Post`,
          text: shareText,
          url: shareUrl,
        })
        showToast('Post shared successfully!', 'success')
        return
      } catch (err) {
        if (err.name === 'AbortError') return
        console.warn('Navigator share error, falling back to clipboard:', err)
      }
    }

    // Try Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        showToast('Post link and content copied to clipboard!', 'success')
      } catch (err) {
        // Clipboard permission denied or blocked
        console.error('Clipboard permission error:', err)
        setPermissionModal({
          isOpen: true,
          title: 'Clipboard Permission Required',
          message:
            'Your browser requires permission to copy to the clipboard. Please enable clipboard access in your browser site settings.',
          actionType: 'clipboard',
        })
      }
    } else {
      // Fallback for non-secure contexts
      try {
        const textarea = document.createElement('textarea')
        textarea.value = `${shareText}\n${shareUrl}`
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        showToast('Post link copied to clipboard!', 'success')
      } catch {
        setPermissionModal({
          isOpen: true,
          title: 'Clipboard Access Restricted',
          message: 'Unable to access clipboard. Please copy post content manually.',
          actionType: 'denied',
        })
      }
    }
  }

  // Toggle comments drawer
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Submit comment
  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim()
    if (!text) {
      showToast('Please type a comment first.', 'warning')
      return
    }

    const currentAuthor =
      userRole === 'creator'
        ? creatorProfile?.name || 'Alex Morgan'
        : 'Viewer User'

    const currentUsername =
      userRole === 'creator'
        ? creatorProfile?.username || 'alexmorgan'
        : 'viewer'

    const newComment = {
      id: Date.now(),
      author: currentAuthor,
      username: currentUsername,
      time: 'Just now',
      text,
    }

    const updatedPosts = posts.map((p) => {
      if (p.id !== postId) return p
      const updatedList = [...(p.commentsList || []), newComment]
      return {
        ...p,
        comments: updatedList.length,
        commentsList: updatedList,
      }
    })

    savePosts(updatedPosts)
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
    showToast('Comment added!', 'success')
  }

  // Delete Post Permission Verification
  const requestDeletePost = (post) => {
    const isOwn =
      post.username === creatorProfile?.username ||
      (userRole === 'creator' && post.username === 'alexmorgan')

    if (!isOwn) {
      setPermissionModal({
        isOpen: true,
        title: 'Delete Permission Denied',
        message:
          'You do not have permission to delete this post. Only the original author has permission to remove their post.',
        actionType: 'denied',
      })
      return
    }

    // Open on-screen confirmation modal
    setDeleteDialog({
      isOpen: true,
      postId: post.id,
    })
  }

  const confirmDeletePost = () => {
    if (!deleteDialog.postId) return
    const updated = posts.filter((p) => p.id !== deleteDialog.postId)
    savePosts(updated)
    setDeleteDialog({ isOpen: false, postId: null })
    showToast('Post deleted successfully.', 'info')
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] px-6 py-8 text-gray-900">
      {/* On-screen Toast Notification */}
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

      {/* On-screen Permission Modal */}
      {permissionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center gap-3 text-purple-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                {permissionModal.actionType === 'creator_role' && '🛡️'}
                {permissionModal.actionType === 'clipboard' && '📋'}
                {permissionModal.actionType === 'media' && '📷'}
                {permissionModal.actionType === 'denied' && '🚫'}
              </div>
              <div>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-700">
                  Permission Notice
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  {permissionModal.title}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {permissionModal.message}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setPermissionModal({
                    isOpen: false,
                    title: '',
                    message: '',
                    actionType: null,
                  })
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>

              {permissionModal.actionType === 'creator_role' && (
                <button
                  type="button"
                  onClick={handleGrantCreatorPermission}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 hover:bg-purple-700"
                >
                  Grant Creator Permission
                </button>
              )}

              {permissionModal.actionType === 'clipboard' && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.permissions?.query?.({ name: 'clipboard-write' })
                    setPermissionModal({
                      isOpen: false,
                      title: '',
                      message: '',
                      actionType: null,
                    })
                    showToast('Please allow clipboard access if prompted by your browser.', 'info')
                  }}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Request Permission
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* On-screen Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl">
                🗑️
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Post
                </h3>
                <p className="text-xs text-gray-500">
                  Action requires author authorization
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Are you sure you want to permanently delete this post? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, postId: null })}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeletePost}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
              Creator Community
            </p>

            {/* Current Active Permission Role Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                userRole === 'creator'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  userRole === 'creator' ? 'bg-green-600' : 'bg-amber-600'
                }`}
              />
              {userRole === 'creator' ? 'Creator Mode (Full Access)' : 'Viewer Mode (Read Only)'}
            </span>
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Connect with Creators
          </h1>

          <p className="mt-2 text-gray-500">
            Share ideas, discover creative projects, leave comments, and collaborate together.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role toggle for testing permissions */}
          <button
            type="button"
            onClick={() => {
              const newRole = userRole === 'creator' ? 'viewer' : 'creator'
              setUserRole(newRole)
              localStorage.setItem('craftloopRole', newRole)
              showToast(
                `Switched to ${newRole === 'creator' ? 'Creator (Posting Allowed)' : 'Viewer (Permission Checked)'} mode.`,
                'info'
              )
            }}
            className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-xs font-semibold text-purple-700 transition hover:bg-purple-50"
            title="Toggle user role to preview permission prompts"
          >
            Switch to {userRole === 'creator' ? 'Viewer Mode' : 'Creator Mode'}
          </button>

          <button
            id="create-post-btn"
            onClick={handleOpenCreatePost}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 active:scale-95"
          >
            + Create Post
          </button>
        </div>
      </div>

      {/* Search + Categories */}
      <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <div className="relative mb-5">
          <input
            id="community-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search community posts by keyword, author, or category..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* Feed Column */}
        <div className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-purple-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl">
                🔎
              </div>

              <h2 className="text-xl font-bold text-gray-900">No posts found</h2>

              <p className="mt-2 text-gray-500">
                Try another search keyword or select another category filter.
              </p>

              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
                className="mt-4 rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isOwnPost =
                post.username === creatorProfile?.username ||
                (userRole === 'creator' && post.username === 'alexmorgan')

              const isCommentsOpen = Boolean(expandedComments[post.id])
              const postComments = post.commentsList || []

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 font-bold text-purple-700 shadow-inner">
                        {getInitials(post.name)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{post.name}</h3>
                          {isOwnPost && (
                            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                              You
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500">
                          @{post.username} • {post.role}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          {post.time}
                        </p>
                      </div>
                    </div>

                    {isOwnPost ? (
                      <button
                        onClick={() => requestDeletePost(post)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        title="Delete your post"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => requestDeletePost(post)}
                        className="rounded-lg px-3 py-1.5 text-xs text-gray-300 transition hover:text-gray-500"
                        title="Delete requires author permission"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Category Tag */}
                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-gray-700">
                    {post.content}
                  </p>

                  {/* Optional Image */}
                  {post.image && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-purple-50 bg-gray-50">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="max-h-96 w-full object-cover transition hover:scale-[1.01]"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        post.liked
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{post.liked ? '♥' : '♡'}</span>
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        isCommentsOpen
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>💬</span>
                      <span>{post.comments || postComments.length} Comments</span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                    >
                      <span>↗</span>
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => toggleSave(post.id)}
                      className={`ml-auto flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        post.saved
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{post.saved ? '★' : '☆'}</span>
                      <span>{post.saved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  {/* On-screen Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-5 border-t border-purple-50 pt-5 animate-in fade-in duration-150">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Discussion ({postComments.length})
                      </h4>

                      {/* Add comment input */}
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id)
                          }}
                          placeholder="Write a constructive comment..."
                          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white"
                        />

                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-95"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Comments list */}
                      <div className="mt-4 space-y-3">
                        {postComments.length === 0 ? (
                          <p className="text-xs italic text-gray-400">
                            No comments yet. Be the first to share your thoughts!
                          </p>
                        ) : (
                          postComments.map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-2xl bg-purple-50/60 p-4 transition hover:bg-purple-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-purple-900">
                                    {comment.author}
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    @{comment.username}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-400">
                                  {comment.time}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-gray-700">
                                {comment.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </article>
              )
            })
          )}
        </div>

        {/* Right Sidebar Column */}
        <aside className="space-y-5">
          {/* Community Stats */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Community Stats</h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-purple-50 p-4">
                <p className="text-2xl font-bold text-purple-700">{posts.length}</p>
                <p className="mt-1 text-xs text-gray-500">Live Posts</p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <p className="text-2xl font-bold text-purple-700">120+</p>
                <p className="mt-1 text-xs text-gray-500">Active Creators</p>
              </div>
            </div>

            {/* Permission status card */}
            <div className="mt-4 rounded-2xl border border-purple-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Your Permissions
              </p>
              <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> View community feed
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Leave comments
                </p>
                <p className="flex items-center gap-2">
                  {userRole === 'creator' ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-amber-500">⚠</span>
                  )}
                  <span>
                    Publish new posts{' '}
                    {userRole !== 'creator' && '(Requires Creator Permission)'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-xl shadow-purple-200">
            <h2 className="text-lg font-bold">Community Guidelines</h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-purple-100">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Be respectful to other creators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Share meaningful ideas and original work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Give constructive, helpful feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Keep the community creative and positive.</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Quick Links</h2>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                My Profile →
              </button>

              <button
                onClick={() => navigate('/your-project')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                My Projects →
              </button>

              <button
                onClick={() => navigate('/create')}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                Create Course or Project →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* On-Screen Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                  Authorized as {creatorProfile?.name || 'Creator'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Create a Community Post
                </h2>
                <p className="text-xs text-gray-500">
                  Share your design updates, ask questions, or showcase ideas.
                </p>
              </div>

              <button
                onClick={() => setShowCreatePost(false)}
                className="rounded-xl p-2 text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              {/* Category selector */}
              <div className="mb-4">
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white"
                >
                  {categories
                    .filter((category) => category !== 'All')
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              {/* Content textarea */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Post Content
                </label>

                <textarea
                  value={postForm.content}
                  onChange={(e) =>
                    setPostForm({
                      ...postForm,
                      content: e.target.value,
                    })
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="What are you working on? Ask for feedback, share tips, or inspire other creators..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {postForm.content.length}/1000
                </p>
              </div>

              {/* Image attachment / Media Permission */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Attach Image (Optional)
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100/60">
                    <span>📷</span>
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  <span className="text-center text-xs text-gray-400 sm:text-left">
                    or enter image URL:
                  </span>

                  <input
                    type="url"
                    value={postForm.image}
                    onChange={(e) => {
                      setPostForm({ ...postForm, image: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs outline-none focus:border-purple-400 focus:bg-white"
                  />
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="relative mt-3 inline-block overflow-hidden rounded-xl border border-purple-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-28 w-44 object-cover"
                      onError={() => {
                        showToast('Invalid image URL.', 'error')
                        setImagePreview('')
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setPostForm((prev) => ({ ...prev, image: '' }))
                      }}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Modal footer actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePost(false)
                    setImagePreview('')
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 active:scale-95"
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