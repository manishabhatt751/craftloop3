import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CourseDetails() {
  const navigate = useNavigate()

  const savedCourses = JSON.parse(
    localStorage.getItem('craftloopCourses') || '[]'
  )

  const course =
    savedCourses.length > 0
      ? savedCourses[savedCourses.length - 1]
      : null

  const [lessons, setLessons] = useState(
    course?.lessons || []
  )

  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState(null)

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setLessonForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const saveLessons = (updatedLessons) => {
    setLessons(updatedLessons)

    const updatedCourses = savedCourses.map((item) =>
      item.id === course.id
        ? {
            ...item,
            lessons: updatedLessons,
          }
        : item
    )

    localStorage.setItem(
      'craftloopCourses',
      JSON.stringify(updatedCourses)
    )
  }

  const handleAddLesson = (e) => {
    e.preventDefault()

    if (!lessonForm.title || !lessonForm.description) {
      alert('Please enter the lesson title and description.')
      return
    }

    if (editingLessonId) {
      const updatedLessons = lessons.map((lesson) =>
        lesson.id === editingLessonId
          ? {
              ...lesson,
              ...lessonForm,
            }
          : lesson
      )

      saveLessons(updatedLessons)
      alert('Lesson updated successfully!')
    } else {
      const newLesson = {
        id: Date.now(),
        title: lessonForm.title,
        description: lessonForm.description,
        videoUrl: lessonForm.videoUrl,
        duration: lessonForm.duration,
      }

      saveLessons([
        ...lessons,
        newLesson,
      ])

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

    setEditingLessonId(lesson.id)
    setShowLessonForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDeleteLesson = (lessonId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this lesson?'
    )

    if (!confirmDelete) return

    const updatedLessons = lessons.filter(
      (lesson) => lesson.id !== lessonId
    )

    saveLessons(updatedLessons)
  }

  const handleMoveUp = (index) => {
    if (index === 0) return

    const updatedLessons = [...lessons]

    const currentLesson = updatedLessons[index]
    updatedLessons[index] = updatedLessons[index - 1]
    updatedLessons[index - 1] = currentLesson

    saveLessons(updatedLessons)
  }

  const handleMoveDown = (index) => {
    if (index === lessons.length - 1) return

    const updatedLessons = [...lessons]

    const currentLesson = updatedLessons[index]
    updatedLessons[index] = updatedLessons[index + 1]
    updatedLessons[index + 1] = currentLesson

    saveLessons(updatedLessons)
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

  if (!course) {
    return (
      <div className="min-h-screen bg-[#faf9ff] p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            🎓
          </div>

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

              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
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
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default CourseDetails