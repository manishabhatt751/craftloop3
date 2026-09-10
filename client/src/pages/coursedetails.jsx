import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CourseDetails() {
  const navigate = useNavigate()

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Graphic Design',
      duration: '08:30',
    },
    {
      id: 2,
      title: 'Design Principles',
      duration: '12:45',
    },
  ])

  const [showLessonForm, setShowLessonForm] = useState(false)

  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDescription, setLessonDescription] = useState('')
  const [lessonDuration, setLessonDuration] = useState('')

  const addLesson = (e) => {
    e.preventDefault()

    if (!lessonTitle.trim()) {
      alert('Please enter a lesson title.')
      return
    }

    const newLesson = {
      id: lessons.length + 1,
      title: lessonTitle,
      duration: lessonDuration || '00:00',
    }

    setLessons([...lessons, newLesson])

    setLessonTitle('')
    setLessonDescription('')
    setLessonDuration('')
    setShowLessonForm(false)
  }

  return (
    <div className="course-details-page">

      <main className="course-details-main">

        {/* Back */}
        <button
          type="button"
          className="course-back-button"
          onClick={() => navigate('/create')}
        >
          ← Back to Create
        </button>

        {/* Header */}
        <section className="course-details-header">

          <div className="course-thumbnail">
            <div className="course-thumbnail-placeholder">
              🎨
            </div>
          </div>

          <div className="course-header-content">

            <span className="course-status">
              Draft
            </span>

            <h1>
              Graphic Design Basics
            </h1>

            <p>
              Learn the fundamentals of graphic design,
              visual communication, and creative thinking.
            </p>

            <div className="course-meta">
              <span>🎨 Graphic Design</span>
              <span>📊 Beginner</span>
              <span>⏱ 2 Hours</span>
            </div>

          </div>

        </section>

        {/* Course Information */}
        <section className="course-info-card">

          <div className="section-heading">
            <div>
              <h2>Course Information</h2>
              <p>Basic information about your course.</p>
            </div>
          </div>

          <div className="course-info-grid">

            <div>
              <span>Category</span>
              <strong>Graphic Design</strong>
            </div>

            <div>
              <span>Level</span>
              <strong>Beginner</strong>
            </div>

            <div>
              <span>Course Type</span>
              <strong>Course</strong>
            </div>

            <div>
              <span>Duration</span>
              <strong>2 Hours</strong>
            </div>

          </div>

          <div className="course-description">
            <span>Description</span>

            <p>
              This course introduces beginners to the basic
              principles of graphic design and helps them
              develop a strong creative foundation.
            </p>
          </div>

        </section>

        {/* Lessons */}
        <section className="lessons-card">

          <div className="section-heading">

            <div>
              <h2>Course Lessons</h2>

              <p>
                Add videos and lessons to your course.
              </p>
            </div>

            <button
              type="button"
              className="add-lesson-button"
              onClick={() => setShowLessonForm(!showLessonForm)}
            >
              + Add Lesson
            </button>

          </div>

          {/* Add Lesson Form */}
          {showLessonForm && (
            <form
              className="lesson-form"
              onSubmit={addLesson}
            >

              <h3>Add Lesson</h3>

              <label>
                Lesson Title
              </label>

              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Enter lesson title"
              />

              <label>
                Lesson Description
              </label>

              <textarea
                value={lessonDescription}
                onChange={(e) =>
                  setLessonDescription(e.target.value)
                }
                placeholder="Describe what students will learn..."
                rows="4"
              />

              <label>
                Upload Video
              </label>

              <input
                type="file"
                accept="video/*"
              />

              <label>
                Lesson Duration
              </label>

              <input
                type="text"
                value={lessonDuration}
                onChange={(e) =>
                  setLessonDuration(e.target.value)
                }
                placeholder="Example: 10:30"
              />

              <div className="lesson-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowLessonForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-lesson-button"
                >
                  Save Lesson
                </button>

              </div>

            </form>
          )}

          {/* Lesson List */}
          <div className="lesson-list">

            {lessons.map((lesson, index) => (

              <div
                className="lesson-item"
                key={lesson.id}
              >

                <div className="lesson-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="lesson-icon">
                  ▶
                </div>

                <div className="lesson-content">

                  <h3>
                    {lesson.title}
                  </h3>

                  <span>
                    Video Lesson
                  </span>

                </div>

                <div className="lesson-duration">
                  {lesson.duration}
                </div>

                <button
                  type="button"
                  className="lesson-menu"
                >
                  ⋮
                </button>

              </div>

            ))}

          </div>

        </section>

        {/* Publish */}
        <section className="publish-course-card">

          <div>
            <h2>Ready to publish?</h2>

            <p>
              Add your lessons and publish your course
              when everything is ready.
            </p>
          </div>

          <button
            type="button"
            className="publish-course-button"
            onClick={() => alert('Course publishing will be connected to the backend later.')}
          >
            Publish Course
          </button>

        </section>

      </main>

    </div>
  )
}

export default CourseDetails