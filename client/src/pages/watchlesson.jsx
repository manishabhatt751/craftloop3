import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import PracticeModal from '../Components/PracticeModal'

// Helper to determine video MIME type
function getVideoMimeType(url = '') {
  const clean = url.split('?')[0].toLowerCase()
  if (clean.endsWith('.webm')) return 'video/webm'
  if (clean.endsWith('.ogg') || clean.endsWith('.ogv')) return 'video/ogg'
  if (clean.endsWith('.mov')) return 'video/quicktime'
  if (clean.endsWith('.mkv')) return 'video/x-matroska'
  return 'video/mp4'
}

// Helper to check if URL is YouTube and get embed URL
function getYouTubeEmbedUrl(url = '') {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return null
}

function WatchLesson() {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessonIndexes, setCompletedLessonIndexes] = useState([])
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackError, setPlaybackError] = useState(false)

  // Practice System States
  const [lessonPractice, setLessonPractice] = useState(null)
  const [coursePractices, setCoursePractices] = useState([])
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [activePracticeModalItem, setActivePracticeModalItem] = useState(null)
  const [practiceLoading, setPracticeLoading] = useState(false)

  // 1. Fetch real course and user enrollment from MongoDB Atlas
  useEffect(() => {
    let isMounted = true
    setPlaybackError(false)

    const isMongoId = courseId && /^[0-9a-fA-F]{24}$/.test(String(courseId))

    const fetchCourseAndEnrollment = async () => {
      try {
        setIsLoading(true)

        if (!courseId) {
          if (isMounted) {
            setCourse(null)
            setIsLoading(false)
          }
          return
        }

        const res = await api.getCourseById(courseId)
        if (!isMounted) return

        if (res && res.data) {
          const dbCourse = res.data
          const rawLessons = Array.isArray(dbCourse.lessons) ? dbCourse.lessons : []

          setCourse({
            id: dbCourse._id,
            title: dbCourse.title,
            lessons: rawLessons,
          })
        } else {
          setCourse(null)
        }

        // Fetch user enrollment progress from backend
        if (api.isAuthenticated() && isMongoId) {
          let enrData = null
          try {
            const enrRes = await api.getMyEnrollment(courseId)
            if (enrRes && enrRes.data) {
              enrData = enrRes.data
            }
          } catch (enrErr) {
            // Auto-enroll if 404
            if (enrErr.status === 404) {
              try {
                const autoEnr = await api.enrollInCourse(courseId)
                if (autoEnr && autoEnr.data) {
                  enrData = autoEnr.data
                }
              } catch (_) {}
            }
          }

          if (isMounted && enrData) {
            if (Array.isArray(enrData.completedLessonIndexes)) {
              setCompletedLessonIndexes(enrData.completedLessonIndexes)
            }
            if (typeof enrData.progress === 'number') {
              setProgress(enrData.progress)
            }
            if (
              typeof enrData.lastAccessedLesson === 'number' &&
              enrData.lastAccessedLesson >= 0
            ) {
              setCurrentLesson(enrData.lastAccessedLesson)
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course or enrollment:', err)
        if (isMounted) setCourse(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchCourseAndEnrollment()

    return () => {
      isMounted = false
    }
  }, [courseId])

  // Reset playback error whenever current lesson changes
  useEffect(() => {
    setPlaybackError(false)
  }, [currentLesson])

  // 1b. Fetch all practices for this course and the active lesson
  useEffect(() => {
    let isMounted = true
    const currentLessonItem = course?.lessons?.[currentLesson]
    const lessonId = currentLessonItem?._id || currentLessonItem?.id
    const effectiveCourseId = course?.id || courseId

    if (!effectiveCourseId) return

    setPracticeLoading(true)

    // Load full course practices for playlist badges
    api
      .getPracticesByCourse(effectiveCourseId)
      .then((res) => {
        if (!isMounted) return
        if (res && res.data && Array.isArray(res.data)) {
          setCoursePractices(res.data)
        }
      })
      .catch((err) => {
        console.warn('Course practices load notice:', err.message || err)
      })

    // Load practice specific to the active lesson
    if (lessonId) {
      api
        .getPracticesByLesson(lessonId, { courseId: effectiveCourseId })
        .then((res) => {
          if (!isMounted) return
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setLessonPractice(res.data[0])
          } else {
            setLessonPractice(null)
          }
        })
        .catch((err) => {
          console.warn('Lesson practice load notice:', err.message || err)
          if (isMounted) setLessonPractice(null)
        })
        .finally(() => {
          if (isMounted) setPracticeLoading(false)
        })
    } else {
      setLessonPractice(null)
      setPracticeLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [course, currentLesson, courseId])

  const handlePracticeStatusUpdate = (practiceId, newStatus) => {
    setLessonPractice((prev) => (prev ? { ...prev, userStatus: newStatus } : prev))
    setCoursePractices((prev) =>
      prev.map((p) =>
        (p._id || p.id) === practiceId ? { ...p, userStatus: newStatus } : p
      )
    )
  }

  // 2. Save progress to backend MongoDB Atlas
  const saveProgressToBackend = async (lessonIndex, markCompleted = true) => {
    const isMongoId = courseId && /^[0-9a-fA-F]{24}$/.test(String(courseId))
    const totalLessons = course?.lessons?.length || 1

    let nextCompleted = [...completedLessonIndexes]
    if (markCompleted && !nextCompleted.includes(lessonIndex)) {
      nextCompleted.push(lessonIndex)
      setCompletedLessonIndexes(nextCompleted)
    }

    const calculatedProgress = Math.min(
      100,
      Math.round((nextCompleted.length / totalLessons) * 100)
    )
    setProgress(calculatedProgress)

    if (api.isAuthenticated() && isMongoId) {
      try {
        const currentLessonItem = course?.lessons?.[lessonIndex]
        const lessonId = currentLessonItem?._id || currentLessonItem?.id
        const payload = {
          lessonIndex,
          progress: calculatedProgress,
        }
        if (lessonId && /^[0-9a-fA-F]{24}$/.test(String(lessonId))) {
          payload.lessonId = lessonId
        }

        const res = await api.updateLessonProgress(courseId, payload)
        if (res && res.data) {
          if (Array.isArray(res.data.completedLessonIndexes)) {
            setCompletedLessonIndexes(res.data.completedLessonIndexes)
          }
          if (typeof res.data.progress === 'number') {
            setProgress(res.data.progress)
          }
        }
      } catch (err) {
        console.warn('Backend progress sync notice:', err.message || err)
      }
    }
  }

  const handleNext = async () => {
    await saveProgressToBackend(currentLesson, true)

    if (course && currentLesson < course.lessons.length - 1) {
      const nextIdx = currentLesson + 1
      setCurrentLesson(nextIdx)
      if (api.isAuthenticated() && courseId && /^[0-9a-fA-F]{24}$/.test(String(courseId))) {
        api.updateLessonProgress(courseId, { lessonIndex: nextIdx }).catch(() => {})
      }
    } else {
      navigate('/mylearning')
    }
  }

  const handlePrevious = () => {
    if (currentLesson > 0) {
      const prevIdx = currentLesson - 1
      setCurrentLesson(prevIdx)
      if (api.isAuthenticated() && courseId && /^[0-9a-fA-F]{24}$/.test(String(courseId))) {
        api.updateLessonProgress(courseId, { lessonIndex: prevIdx }).catch(() => {})
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-purple-100 bg-white p-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:150ms]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:300ms]" />
          <span className="ml-2 text-sm font-semibold text-purple-700">Loading lesson...</span>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
          !
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">Course Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">
          Unable to load this course from MongoDB Atlas or it does not exist.
        </p>
        <button
          type="button"
          onClick={() => navigate('/viewercourse')}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          ← Back to Courses
        </button>
      </div>
    )
  }

  if (!Array.isArray(course.lessons) || course.lessons.length === 0) {
    return (
      <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
          📚
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">No Lessons Available Yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          The creator has not published lessons for "{course.title}" yet.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/viewercoursedetails/${courseId}`)}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          ← Back to Course Details
        </button>
      </div>
    )
  }

  const lesson = course.lessons[currentLesson] || course.lessons[0]
  const videoUrl = (lesson.videoUrl || '').trim()
  const ytEmbedUrl = getYouTubeEmbedUrl(videoUrl)
  const videoMime = getVideoMimeType(videoUrl)

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(`/viewercoursedetails/${courseId}`)}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        ← Back to Course
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Lesson Player */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-purple-100 bg-black shadow-sm">
            <div className="flex aspect-video w-full items-center justify-center bg-black">
              {playbackError ? (
                <div className="p-8 text-center text-white">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-3xl text-red-400">
                    ⚠️
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">Unable to play this video</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Please check the video format or try again.
                  </p>
                  {videoUrl && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-white/20"
                    >
                      Open Video Directly ↗
                    </a>
                  )}
                </div>
              ) : !videoUrl ? (
                <div className="p-8 text-center text-white">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/40 text-3xl text-purple-400">
                    🎬
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{lesson.title}</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    No video uploaded for this lesson yet.
                  </p>
                  {lesson.duration && (
                    <p className="mt-2 text-xs text-purple-300">Duration: {lesson.duration}</p>
                  )}
                </div>
              ) : ytEmbedUrl ? (
                <iframe
                  key={ytEmbedUrl}
                  src={ytEmbedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  key={videoUrl}
                  controls
                  preload="metadata"
                  playsInline
                  crossOrigin="anonymous"
                  className="h-full w-full object-contain"
                  onError={() => setPlaybackError(true)}
                  onEnded={() => saveProgressToBackend(currentLesson, true)}
                >
                  <source src={videoUrl} type={videoMime} />
                  Your browser does not support HTML5 video playback.
                </video>
              )}
            </div>
          </div>

          {/* Lesson Details Card */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-purple-600">
                  Lesson {currentLesson + 1} of {course.lessons.length}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
              </div>

              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  completedLessonIndexes.includes(currentLesson) || progress >= 100
                    ? 'bg-green-50 text-green-600'
                    : 'bg-purple-50 text-purple-600'
                }`}
              >
                {completedLessonIndexes.includes(currentLesson) || progress >= 100
                  ? 'Completed'
                  : 'In Progress'}
              </span>
            </div>

            {lesson.description && (
              <p className="mt-5 text-sm leading-7 text-gray-500">
                {lesson.description}
              </p>
            )}

            {/* Course Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Course Progress</span>
                <span className="text-xs font-bold text-purple-600">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentLesson === 0}
                className="rounded-xl border border-purple-100 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                {currentLesson === course.lessons.length - 1 ? 'Finish Course' : 'Next Lesson →'}
              </button>
            </div>
          </div>

          {/* Lesson Completed Practice Banner */}
          {completedLessonIndexes.includes(currentLesson) && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white text-lg font-bold shadow-sm">
                  ✓
                </span>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">✅ Lesson Completed</h3>
                  <p className="text-xs text-emerald-700">Ready to put your newly learned skill into practice?</p>
                </div>
              </div>
              {lessonPractice ? (
                <button
                  type="button"
                  onClick={() => {
                    setActivePracticeModalItem(lessonPractice)
                    setPracticeModalOpen(true)
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
                >
                  Practice This Skill →
                </button>
              ) : (
                <span className="text-xs font-medium text-emerald-800 italic">
                  Practice activity coming soon.
                </span>
              )}
            </div>
          )}

          {/* 🎯 Practice This Skill Section */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    🎯 Practice This Skill
                  </span>
                  {lessonPractice && (
                    <span className="rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                      {lessonPractice.type === 'project'
                        ? '🚀 Real-World Project'
                        : lessonPractice.type === 'challenge'
                        ? '🏆 Skill Challenge'
                        : '⚡ Quick Practice'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Course: <span className="font-semibold text-gray-800">{course.title}</span> • Lesson: <span className="font-semibold text-gray-800">{lesson.title}</span>
                </p>
              </div>

              {lessonPractice?.userStatus && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 capitalize">
                  {lessonPractice.userStatus.replace('-', ' ')}
                </span>
              )}
            </div>

            {practiceLoading ? (
              <div className="flex items-center justify-center py-6 text-xs text-purple-600 font-semibold gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple-600" />
                Loading practice challenge...
              </div>
            ) : lessonPractice ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {lessonPractice.title}
                  </h4>
                  <blockquote className="mt-2 rounded-2xl border-l-4 border-purple-600 bg-purple-50/50 p-4 text-xs italic text-gray-700 leading-relaxed">
                    <span className="font-bold not-italic text-purple-900 block mb-1">Practice Challenge</span>
                    {lessonPractice.description}
                  </blockquote>
                </div>

                {Array.isArray(lessonPractice.skills) && lessonPractice.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {lessonPractice.skills.map((s, i) => (
                      <span key={i} className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePracticeModalItem(lessonPractice)
                      setPracticeModalOpen(true)
                    }}
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition"
                  >
                    {lessonPractice.userStatus === 'in-progress'
                      ? 'Continue Practice'
                      : lessonPractice.userStatus === 'completed' || lessonPractice.userStatus === 'submitted'
                      ? 'View Practice Submission'
                      : 'Start Practice'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePracticeModalItem(lessonPractice)
                      setPracticeModalOpen(true)
                    }}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                  >
                    Ask CraftLoop AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">
                Practice activity coming soon.
              </div>
            )}
          </div>
        </div>

        {/* Course Playlist Sidebar */}
        <div className="h-fit overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
          <div className="border-b border-purple-100 p-5">
            <h2 className="font-bold text-gray-900">{course.title}</h2>
            <p className="mt-1 text-xs text-gray-500">{course.lessons.length} Lessons</p>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {course.lessons.map((item, index) => {
              const matchedPractice = coursePractices.find(
                (p) =>
                  String(p.lessonId) === String(item._id || item.id) ||
                  p.lessonTitle?.trim().toLowerCase() === item.title?.trim().toLowerCase()
              )

              return (
                <div
                  key={item._id || item.id || index}
                  className={`border-b border-purple-50 p-4 transition ${
                    index === currentLesson ? 'bg-purple-50/70' : 'hover:bg-purple-50/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLesson(index)
                      if (api.isAuthenticated() && courseId && /^[0-9a-fA-F]{24}$/.test(String(courseId))) {
                        api.updateLessonProgress(courseId, { lessonIndex: index }).catch(() => {})
                      }
                    }}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        index === currentLesson
                          ? 'bg-purple-600 text-white'
                          : completedLessonIndexes.includes(index)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {completedLessonIndexes.includes(index) ? '✓' : index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          index === currentLesson ? 'text-purple-700' : 'text-gray-800'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {item.duration || '10 min'}
                        {item.videoUrl && ' • 🎬 Video'}
                      </p>
                    </div>
                  </button>

                  {/* Quick practice trigger for lesson */}
                  {matchedPractice && (
                    <div className="mt-2.5 pl-12 flex items-center justify-between">
                      <span className="text-[11px] text-purple-600 font-medium truncate max-w-[150px]">
                        🎯 {matchedPractice.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActivePracticeModalItem(matchedPractice)
                          setPracticeModalOpen(true)
                        }}
                        className="rounded-lg border border-purple-200 bg-white px-2 py-0.5 text-[11px] font-bold text-purple-700 hover:bg-purple-100 transition shadow-xs"
                      >
                        Practice
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Practice Activity Modal */}
      <PracticeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        practiceId={activePracticeModalItem?._id || lessonPractice?._id}
        initialPractice={activePracticeModalItem || lessonPractice}
        course={course}
        lesson={lesson}
        onStatusUpdate={handlePracticeStatusUpdate}
      />
    </div>
  )
}

export default WatchLesson