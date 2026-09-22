import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

function CourseDetails() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryCourseId = searchParams.get('courseId') || searchParams.get('id')

  const [courses, setCourses] = useState([])
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingLesson, setSavingLesson] = useState(false)
  const [error, setError] = useState(null)

  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState(null)

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
  })

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      let courseList = []

      if (api.isAuthenticated()) {
        try {
          const res = await api.getCourses({ mine: 'true' })
          if (res && res.success && Array.isArray(res.data)) {
            courseList = res.data
          }
        } catch (apiErr) {
          console.warn('Backend getCourses error, checking local fallback:', apiErr)
        }
      }

      if (courseList.length === 0) {
        const savedCourses = JSON.parse(
          localStorage.getItem('craftloopCourses') || '[]'
        )
        courseList = Array.isArray(savedCourses) ? savedCourses : []
      }

      setCourses(courseList)

      let selected = null
      if (queryCourseId) {
        selected = courseList.find(
          (c) => (c._id || c.id)?.toString() === queryCourseId.toString()
        )
      }

      if (!selected && courseList.length > 0) {
        selected = courseList[0]
      }

      setCourse(selected)
      setLessons(selected?.lessons || [])

      if (courseList.length > 0) {
        localStorage.setItem('craftloopCourses', JSON.stringify(courseList))
      }
    } catch (err) {
      console.error('Error fetching course data:', err)
      setError('Failed to load courses from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [queryCourseId])

  const handleChange = (e) => {
    const { name, value } = e.target

    setLessonForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const saveLessons = async (updatedLessons) => {
    setLessons(updatedLessons)

    if (!course) return

    const courseId = course._id || course.id
    const updatedCourse = {
      ...course,
      lessons: updatedLessons,
    }

    setCourse(updatedCourse)

    const updatedCourses = courses.map((item) =>
      (item._id || item.id) === courseId ? updatedCourse : item
    )
    setCourses(updatedCourses)
    localStorage.setItem('craftloopCourses', JSON.stringify(updatedCourses))

    if (api.isAuthenticated()) {
      try {
        setSavingLesson(true)
        const cleanLessons = updatedLessons.map((lesson, idx) => ({
          title: lesson.title || 'Lesson',
          description: lesson.description || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || '10 mins',
          order: lesson.order || idx + 1,
        }))

        const res = await api.updateCourse(courseId, {
          lessons: cleanLessons,
        })

        if (res && res.data && Array.isArray(res.data.lessons)) {
          setLessons(res.data.lessons)
          setCourse(res.data)
        }
      } catch (err) {
        console.error('Failed to sync lessons with backend:', err)
        alert('Notice: Lessons updated locally, but server sync failed.')
      } finally {
        setSavingLesson(false)
      }
    }
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()

    if (!lessonForm.title || !lessonForm.description) {
      alert('Please enter the lesson title and description.')
      return
    }

    if (editingLessonId) {
      const updatedLessons = lessons.map((lesson) =>
        (lesson._id || lesson.id) === editingLessonId
          ? {
              ...lesson,
              ...lessonForm,
            }
          : lesson
      )

      await saveLessons(updatedLessons)
      alert('Lesson updated successfully!')
    } else {
      const newLesson = {
        id: Date.now(),
        title: lessonForm.title,
        description: lessonForm.description,
        videoUrl: lessonForm.videoUrl,
        duration: lessonForm.duration || '10 mins',
        order: lessons.length + 1,
      }

      await saveLessons([...lessons, newLesson])
      alert('Lesson added successfully!')
    }

    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
    })

    setEditingLessonId(null)
    setShowLessonForm(false)
  }

  const handleEditLesson = (lesson) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '',
    })

    setEditingLessonId(lesson._id || lesson.id)
    setShowLessonForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDeleteLesson = async (lessonId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this lesson?'
    )

    if (!confirmDelete) return

    const updatedLessons = lessons.filter(
      (lesson) => (lesson._id || lesson.id) !== lessonId
    )

    await saveLessons(updatedLessons)
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return

    const updatedLessons = [...lessons]

    const currentLesson = updatedLessons[index]
    updatedLessons[index] = updatedLessons[index - 1]
    updatedLessons[index - 1] = currentLesson

    await saveLessons(updatedLessons)
  }

  const handleMoveDown = async (index) => {
    if (index === lessons.length - 1) return

    const updatedLessons = [...lessons]

    const currentLesson = updatedLessons[index]
    updatedLessons[index] = updatedLessons[index + 1]
    updatedLessons[index + 1] = currentLesson

    await saveLessons(updatedLessons)
  }

  const handleCancelLesson = () => {
    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
    })

    setEditingLessonId(null)
    setShowLessonForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9ff] p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-16 text-center shadow-sm">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading course details...
          </p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#faf9ff] p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🎓</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            No Course Found
          </h1>

          <p className="mt-2 text-gray-500">
            Create a course first to start adding lessons.
          </p>

          <button
            onClick={() => navigate('/create')}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Create Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] px-8 py-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <button
              onClick={() => navigate('/create')}
              className="mb-4 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              ← Back to Create
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Course Details
            </h1>

            <p className="mt-2 text-gray-500">
              Build and manage the lessons for your course.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingLessonId(null)
              setLessonForm({
                title: '',
                description: '',
                videoUrl: '',
                duration: '',
              })
              setShowLessonForm(true)
            }}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            + Add Lesson
          </button>

        </div>

        {/* COURSE SELECTOR IF MULTIPLE */}
        {courses.length > 1 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Select Course:</span>
              <select
                value={course?._id || course?.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const found = courses.find(
                    (c) => (c._id || c.id)?.toString() === selectedId.toString()
                  )
                  if (found) {
                    setCourse(found)
                    setLessons(found.lessons || [])
                  }
                }}
                className="rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm focus:border-purple-600 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title} ({Array.isArray(c.lessons) ? c.lessons.length : 0} lessons)
                  </option>
                ))}
              </select>
            </div>

            {savingLesson && (
              <span className="flex items-center gap-2 text-xs font-semibold text-purple-600 animate-pulse">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-600"></span>
                Saving lessons to database...
              </span>
            )}
          </div>
        )}

        {savingLesson && courses.length <= 1 && (
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-purple-600 animate-pulse">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-600"></span>
            Saving lessons to database...
          </div>
        )}

        {/* COURSE INFORMATION */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">

          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-purple-100 text-6xl">
              🎓
            </div>
          )}

          <div className="p-8">

            <div className="flex flex-wrap gap-3">

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {course.category}
              </span>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                {course.level}
              </span>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                {course.status}
              </span>

            </div>

            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              {course.title}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {course.description}
            </p>

            <div className="mt-6 flex gap-8 text-sm">

              <div>
                <p className="text-gray-400">
                  Lessons
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {lessons.length}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Level
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {course.level}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* LESSON FORM */}
        {showLessonForm && (
          <div className="mb-8 rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                  Course Content
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {editingLessonId
                    ? 'Edit Lesson'
                    : 'Add New Lesson'}
                </h2>
              </div>

              <button
                onClick={handleCancelLesson}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

            <form
              onSubmit={handleAddLesson}
              className="space-y-6"
            >

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Lesson Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={lessonForm.title}
                  onChange={handleChange}
                  placeholder="Example: Introduction to UI Design"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Lesson Description *
                </label>

                <textarea
                  name="description"
                  value={lessonForm.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Explain what students will learn in this lesson..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* VIDEO */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Video URL
                </label>

                <input
                  type="url"
                  name="videoUrl"
                  value={lessonForm.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Optional — add your YouTube or video link.
                </p>
              </div>

              {/* DURATION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={lessonForm.duration}
                  onChange={handleChange}
                  placeholder="Example: 15 minutes"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">

                <button
                  type="button"
                  onClick={handleCancelLesson}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  {editingLessonId
                    ? 'Update Lesson'
                    : 'Add Lesson'}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* LESSONS */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Course Lessons
            </h2>

            <p className="mt-1 text-gray-500">
              Organize the content your students will learn.
            </p>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-purple-100 bg-purple-50/50 p-10 text-center">

              <div className="text-4xl">
                📚
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                No lessons yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first lesson to start building this course.
              </p>

              <button
                onClick={() => setShowLessonForm(true)}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                + Add First Lesson
              </button>

            </div>
          ) : (
            <div className="space-y-4">

              {lessons.map((lesson, index) => {
                const lessonId = lesson._id || lesson.id || index
                return (
                  <div
                    key={lessonId}
                    className="rounded-2xl border border-gray-100 p-5 transition hover:border-purple-200 hover:bg-purple-50/30"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">
                          {index + 1}
                        </div>

                        <div>

                          <h3 className="font-bold text-gray-900">
                            {lesson.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-gray-500">
                            {lesson.description}
                          </p>

                          {lesson.duration && (
                            <p className="mt-2 text-xs font-semibold text-purple-600">
                              ⏱ {lesson.duration}
                            </p>
                          )}

                          {lesson.videoUrl && (
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-block text-sm font-semibold text-purple-600 hover:underline"
                            >
                              ▶ Watch Video
                            </a>
                          )}

                        </div>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↑
                        </button>

                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === lessons.length - 1}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↓
                        </button>

                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteLesson(lesson._id || lesson.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default CourseDetails