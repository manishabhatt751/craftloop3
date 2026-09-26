import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function PracticeModal({
  isOpen,
  onClose,
  practiceId,
  initialPractice = null,
  course = null,
  lesson = null,
  onStatusUpdate = null,
}) {
  const navigate = useNavigate()
  const [practice, setPractice] = useState(initialPractice)
  const [loading, setLoading] = useState(!initialPractice && Boolean(practiceId))
  const [error, setError] = useState(null)

  // Start Practice loading
  const [starting, setStarting] = useState(false)

  // Submission Form State
  const [submissionType, setSubmissionType] = useState('link')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submissionTitle, setSubmissionTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [createPortfolioProject, setCreatePortfolioProject] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Community Share State
  const [showShareBox, setShowShareBox] = useState(false)
  const [shareCaption, setShareCaption] = useState('')
  const [sharing, setSharing] = useState(false)
  const [sharedSuccess, setSharedSuccess] = useState(false)

  // AI Assistant Drawer State
  const [aiOpen, setAiOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [aiError, setAiError] = useState(null)

  // Fetch practice data if not provided or to refresh status
  const fetchPractice = async (id) => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const res = await api.getPracticeById(id)
      if (res && res.data) {
        setPractice(res.data)
        if (res.data.submission) {
          setSubmissionTitle(res.data.submission.submissionTitle || '')
          setSubmissionUrl(res.data.submission.submissionUrl || '')
          setSubmissionType(res.data.submission.submissionType || 'link')
          setNotes(res.data.submission.notes || '')
        }
      }
    } catch (err) {
      console.error('Error fetching practice details:', err)
      setError('Could not load practice details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (practiceId) {
        fetchPractice(practiceId)
      } else if (initialPractice) {
        setPractice(initialPractice)
        if (initialPractice.submission) {
          setSubmissionTitle(initialPractice.submission.submissionTitle || '')
          setSubmissionUrl(initialPractice.submission.submissionUrl || '')
          setSubmissionType(initialPractice.submission.submissionType || 'link')
          setNotes(initialPractice.submission.notes || '')
        }
      }
      setSubmitSuccess(false)
      setSharedSuccess(false)
      setShowShareBox(false)
      setAiResponse(null)
    }
  }, [isOpen, practiceId, initialPractice])

  if (!isOpen) return null

  const currentStatus = practice?.userStatus || practice?.submission?.status || 'not-started'

  // Handle Start Practice
  const handleStartPractice = async () => {
    if (!practice?._id) return
    try {
      setStarting(true)
      const res = await api.startPractice(practice._id)
      if (res && res.data) {
        setPractice((prev) => ({
          ...prev,
          userStatus: 'in-progress',
          submission: res.data,
        }))
        if (onStatusUpdate) {
          onStatusUpdate(practice._id, 'in-progress')
        }
      }
    } catch (err) {
      console.error('Error starting practice:', err)
      alert(err.message || 'Failed to start practice. Please make sure you are logged in.')
    } finally {
      setStarting(false)
    }
  }

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit check (50MB for practice submissions)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50 MB limit.')
      return
    }

    try {
      setUploadingFile(true)
      const res = await api.uploadMedia(file, 'craftloop/practices')
      if (res && res.url) {
        setSubmissionUrl(res.url)
        if (!submissionTitle) {
          setSubmissionTitle(file.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        throw new Error(res?.message || 'File upload failed.')
      }
    } catch (err) {
      console.error('Failed to upload practice asset:', err)
      alert(err.message || 'File upload failed. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  // Handle Submit Practice
  const handleSubmitPractice = async (e) => {
    e.preventDefault()
    if (!practice?._id) return

    if (!submissionUrl.trim()) {
      alert('Please provide a file or project URL for your submission.')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        submissionType,
        submissionUrl: submissionUrl.trim(),
        submissionTitle: submissionTitle.trim() || practice.title,
        notes: notes.trim(),
        createPortfolioProject: practice.type === 'project' && createPortfolioProject,
      }

      const res = await api.submitPractice(practice._id, payload)
      if (res && res.data) {
        setPractice((prev) => ({
          ...prev,
          userStatus: res.data.status || 'completed',
          submission: res.data,
        }))
        setSubmitSuccess(true)
        if (onStatusUpdate) {
          onStatusUpdate(practice._id, res.data.status || 'completed')
        }
      }
    } catch (err) {
      console.error('Error submitting practice:', err)
      alert(err.message || 'Failed to submit practice.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Share to Community
  const handleShareToCommunity = async () => {
    if (!practice?._id) return
    try {
      setSharing(true)
      const res = await api.sharePracticeToCommunity(practice._id, {
        caption: shareCaption.trim(),
      })
      if (res && res.success) {
        setSharedSuccess(true)
        setShowShareBox(false)
      }
    } catch (err) {
      console.error('Failed to share to community:', err)
      alert(err.message || 'Failed to share to community.')
    } finally {
      setSharing(false)
    }
  }

  // Handle Ask CraftLoop AI
  const handleAskAI = async (customPrompt = null) => {
    const question = (customPrompt || aiQuery).trim()
    if (!question) return

    try {
      setAiLoading(true)
      setAiError(null)
      setAiOpen(true)
      setAiQuery(question)

      const fullPrompt = `Regarding the practice activity "${practice?.title}" for lesson "${practice?.lessonTitle || lesson?.title || ''}" in course "${course?.title || ''}": ${question}`
      const res = await api.sendAIChat(fullPrompt)
      if (res && res.reply) {
        setAiResponse(res.reply)
      } else if (res && res.message) {
        setAiResponse(res.message)
      } else {
        setAiResponse('CraftLoop AI is ready to help you practice this skill!')
      }
    } catch (err) {
      console.error('AI chat error:', err)
      setAiError('Could not reach CraftLoop AI. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'project':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span>🚀</span> Real-World Project
          </span>
        )
      case 'challenge':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <span>🏆</span> Skill Challenge (30–60 min)
          </span>
        )
      case 'quick':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
            <span>⚡</span> Quick Practice (5–15 min)
          </span>
        )
    }
  }

  const getDifficultyBadge = (diff) => {
    const color =
      diff === 'Advanced'
        ? 'bg-rose-50 text-rose-700'
        : diff === 'Intermediate'
        ? 'bg-blue-50 text-blue-700'
        : 'bg-emerald-50 text-emerald-700'
    return <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${color}`}>{diff || 'Beginner'}</span>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm transition-all">
      <div className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-purple-50 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/30 p-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-purple-600 px-2 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase">
                🎯 Practice System
              </span>
              {practice?.type && getTypeBadge(practice.type)}
              {practice?.difficulty && getDifficultyBadge(practice.difficulty)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{practice?.title || 'Practice Challenge'}</h2>
            <p className="text-xs font-medium text-gray-500">
              {course?.title ? `Course: ${course.title}` : ''}
              {practice?.lessonTitle || lesson?.title ? ` • Lesson: ${practice?.lessonTitle || lesson?.title}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="border-b border-purple-50 bg-purple-50/30 px-6 py-3">
          <div className="flex items-center justify-between text-xs font-medium">
            {[
              { key: 'not-started', label: '1. Discover' },
              { key: 'in-progress', label: '2. In Progress' },
              { key: 'submitted', label: '3. Submitted' },
              { key: 'completed', label: '4. Completed' },
            ].map((step, idx) => {
              const order = ['not-started', 'in-progress', 'submitted', 'completed']
              const currentIdx = order.indexOf(currentStatus)
              const stepIdx = order.indexOf(step.key)
              const isPast = currentIdx > stepIdx
              const isCurrent = currentIdx === stepIdx

              return (
                <div key={step.key} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`hidden sm:inline ${
                      isCurrent
                        ? 'font-bold text-purple-700'
                        : isPast
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < 3 && <div className="h-0.5 w-6 sm:w-12 bg-gray-200" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600" />
              <span className="ml-2 text-sm font-semibold text-purple-700">Loading challenge details...</span>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>
          ) : (
            <>
              {/* Challenge Overview & Skills */}
              <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-900">What you'll practice</h3>
                {Array.isArray(practice?.skills) && practice.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {practice.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-purple-200 bg-purple-50/60 px-3 py-1 text-xs font-semibold text-purple-700"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-2 text-sm text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-800">Challenge:</p>
                  <p className="mt-1">{practice?.description}</p>
                </div>
              </div>

              {/* Instructions */}
              {Array.isArray(practice?.instructions) && practice.instructions.length > 0 && (
                <div className="rounded-2xl border border-purple-50 bg-purple-50/30 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>📋</span> Step-by-Step Instructions
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    {practice.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple-200 text-xs font-bold text-purple-800">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Hints / Tips Expandable */}
              {Array.isArray(practice?.hints) && practice.hints.length > 0 && (
                <details className="group rounded-2xl border border-dashed border-purple-200 bg-white p-4">
                  <summary className="cursor-pointer text-xs font-bold text-purple-700 flex items-center justify-between">
                    <span>💡 Pro-Tips & Practice Hints ({practice.hints.length})</span>
                    <span className="text-purple-400 group-open:rotate-180 transition">▼</span>
                  </summary>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                    {practice.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </details>
              )}

              {/* AI Helper Accordion */}
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <div>
                      <h4 className="text-xs font-bold text-purple-900">CraftLoop AI Practice Assistant</h4>
                      <p className="text-[11px] text-gray-500">Get instant help, ideas, or simplified tasks</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiOpen(!aiOpen)}
                    className="rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                  >
                    {aiOpen ? 'Hide AI Helper' : 'Ask CraftLoop AI'}
                  </button>
                </div>

                {aiOpen && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-purple-100">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleAskAI("I don't know how to start this practice challenge.")}
                        className="rounded-lg bg-purple-100/70 px-2.5 py-1 text-purple-800 hover:bg-purple-200 transition font-medium"
                      >
                        💡 How do I start?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAskAI("Can you give me an easier version of this challenge?")}
                        className="rounded-lg bg-purple-100/70 px-2.5 py-1 text-purple-800 hover:bg-purple-200 transition font-medium"
                      >
                        🐣 Give me an easier version
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAskAI("What should I practice next after this?")}
                        className="rounded-lg bg-purple-100/70 px-2.5 py-1 text-purple-800 hover:bg-purple-200 transition font-medium"
                      >
                        🔥 What should I practice next?
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask anything about this practice..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                        className="flex-1 rounded-xl border border-purple-200 px-3 py-2 text-xs text-gray-800 focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={aiLoading}
                        onClick={() => handleAskAI()}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                      >
                        {aiLoading ? 'Thinking...' : 'Ask AI'}
                      </button>
                    </div>

                    {aiError && <p className="text-xs text-red-500">{aiError}</p>}

                    {aiResponse && (
                      <div className="rounded-xl border border-purple-100 bg-white p-3.5 text-xs text-gray-700 leading-relaxed space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-purple-700">
                          <span>✨</span> CraftLoop AI Response:
                        </div>
                        <div className="whitespace-pre-line">{aiResponse}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION AREA ACCORDING TO STATUS */}

              {/* Case 1: NOT STARTED */}
              {currentStatus === 'not-started' && (
                <div className="rounded-2xl border border-purple-100 bg-white p-6 text-center space-y-4 shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
                    🎯
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Ready to put your learning into practice?</h4>
                  <p className="mx-auto max-w-md text-xs text-gray-500">
                    Clicking Start Practice will track your progress in MongoDB. You can submit photos, links, or documents of your work when done.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={starting}
                      onClick={handleStartPractice}
                      className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700 disabled:opacity-50"
                    >
                      {starting ? 'Starting Practice...' : 'Start Practice'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAiOpen(true)
                        handleAskAI("I'm starting this practice challenge. Can you give me a quick roadmap?")
                      }}
                      className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition"
                    >
                      Ask CraftLoop AI
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: IN PROGRESS - SUBMISSION FORM */}
              {(currentStatus === 'in-progress' || currentStatus === 'submitted') && (
                <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>📤</span> Submit Your Practice Work
                    </h4>
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      In Progress
                    </span>
                  </div>

                  <form onSubmit={handleSubmitPractice} className="space-y-4">
                    {/* Submission Type Choice */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Submission Format
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'link', label: '🔗 Project Link' },
                          { id: 'image', label: '🖼️ Image / Photo' },
                          { id: 'document', label: '📄 Document / PDF' },
                          { id: 'video', label: '🎥 Video Demo' },
                        ].map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setSubmissionType(fmt.id)}
                            className={`rounded-xl border p-2.5 text-xs font-semibold transition ${
                              submissionType === fmt.id
                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                                : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-purple-50/30'
                            }`}
                          >
                            {fmt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Work Title */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Title of Your Work
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. My Typography Poster / Bridal Mehndi Pattern"
                        value={submissionTitle}
                        onChange={(e) => setSubmissionTitle(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    {/* File Upload or URL Input */}
                    {submissionType === 'link' ? (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Project Link / URL (Figma, GitHub, Drive, Canva, etc.)
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          required
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Upload File ({submissionType})
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept={
                              submissionType === 'image'
                                ? 'image/*'
                                : submissionType === 'video'
                                ? 'video/*'
                                : '.pdf,.doc,.docx,.txt'
                            }
                            onChange={handleFileUpload}
                            className="text-xs text-gray-500 file:mr-3 file:rounded-xl file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {uploadingFile && (
                            <span className="text-xs text-purple-600 font-semibold animate-pulse">
                              Uploading...
                            </span>
                          )}
                        </div>
                        {submissionUrl && (
                          <p className="mt-2 text-[11px] text-emerald-600 font-medium truncate">
                            ✓ Uploaded: {submissionUrl}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reflection / Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Learner Notes & Reflections
                      </label>
                      <textarea
                        rows={3}
                        placeholder="What did you learn? What was easy or challenging?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    {/* Real-World Project -> Portfolio Conversion */}
                    {practice.type === 'project' && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={createPortfolioProject}
                            onChange={(e) => setCreatePortfolioProject(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-emerald-900">
                              🌟 Convert into CraftLoop Portfolio Project
                            </p>
                            <p className="text-[11px] text-emerald-700 mt-0.5">
                              Publish this real-world project to your profile portfolio and showcase it to creators and peers.
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting || uploadingFile || !submissionUrl}
                        className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Practice'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Case 3: COMPLETED - CELEBRATION & SHARE IN COMMUNITY */}
              {currentStatus === 'completed' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                      🎉
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-emerald-950">Practice Challenge Completed!</h4>
                      <p className="text-xs text-emerald-800">
                        Awesome work! Your submission has been saved directly to MongoDB.
                      </p>
                    </div>
                  </div>

                  {/* Submission summary */}
                  {practice?.submission && (
                    <div className="rounded-xl border border-emerald-100 bg-white p-4 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">
                          {practice.submission.submissionTitle || 'Your Submission'}
                        </span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          {practice.submission.submissionType}
                        </span>
                      </div>
                      {practice.submission.submissionUrl && (
                        <a
                          href={practice.submission.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-purple-600 hover:underline break-all"
                        >
                          🔗 View Submitted Work: {practice.submission.submissionUrl}
                        </a>
                      )}
                      {practice.submission.notes && (
                        <p className="text-gray-600 italic">"{practice.submission.notes}"</p>
                      )}
                      {practice.submission.project && (
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              onClose()
                              navigate(`/project/${practice.submission.project}`)
                            }}
                            className="font-bold text-purple-700 hover:underline text-xs"
                          >
                            📁 View Portfolio Project Details →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Community Share CTA */}
                  {!showShareBox && !sharedSuccess && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-xs font-medium text-gray-700">
                        Get feedback from fellow learners and creators in the CraftLoop community:
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowShareBox(true)}
                        className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition"
                      >
                        📣 Share Your Work
                      </button>
                    </div>
                  )}

                  {showShareBox && !sharedSuccess && (
                    <div className="rounded-xl border border-purple-200 bg-white p-4 space-y-3">
                      <h5 className="text-xs font-bold text-gray-900">
                        Share to CraftLoop Community Feed
                      </h5>
                      <textarea
                        rows={2}
                        placeholder="Say something about what you learned or ask for feedback..."
                        value={shareCaption}
                        onChange={(e) => setShareCaption(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-purple-600 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowShareBox(false)}
                          className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={sharing}
                          onClick={handleShareToCommunity}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                          {sharing ? 'Sharing...' : 'Post to Community'}
                        </button>
                      </div>
                    </div>
                  )}

                  {sharedSuccess && (
                    <div className="rounded-xl bg-purple-50 p-3 text-xs font-semibold text-purple-700 flex items-center justify-between">
                      <span>✓ Shared to CraftLoop Community!</span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose()
                          navigate('/viewercommunity')
                        }}
                        className="underline"
                      >
                        View in Community Feed →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-purple-50 bg-gray-50/50 px-6 py-4">
          <span className="text-xs text-gray-400">
            CraftLoop Learning Journey • Discover → Learn → Practice → Create
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
