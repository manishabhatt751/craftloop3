import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import PracticeModal from '../Components/PracticeModal'

function ViewerCourseDetails() {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [course, setCourse] = useState(null)
  const [practices, setPractices] = useState([])
  const [selectedPractice, setSelectedPractice] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!courseId) {
      setCourse(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Fetch course details
    api
      .getCourseById(courseId)
      .then((res) => {
        if (res && res.data) {
          const dbCourse = res.data
          const instructorName = dbCourse.instructor?.name || dbCourse.creator?.name || 'CraftLoop Creator'
          const rawLessonsList = Array.isArray(dbCourse.lessons) ? dbCourse.lessons : []
          setCourse({
            id: dbCourse._id,
            title: dbCourse.title,
            category: dbCourse.category || 'General',
            level: dbCourse.level || 'Beginner',
            creator: instructorName,
            lessonsCount: rawLessonsList.length,
            rawLessons: rawLessonsList,
            duration: 'Flexible',
            students: Array.isArray(dbCourse.enrolledStudents) ? dbCourse.enrolledStudents.length : 0,
            image:
              dbCourse.thumbnail ||
              'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
            description:
              dbCourse.description ||
              'Comprehensive practical course on CraftLoop.',
            learn: [
              `Master fundamental concepts in ${dbCourse.category || 'this subject'}`,
              'Build practical skills with step-by-step guidance',
              'Learn industry workflows and recommended tools',
              'Create portfolio-ready project outcomes',
            ],
          })
        } else {
          setCourse(null)
        }
      })
      .catch((err) => {
        console.error('Failed to load course details from MongoDB:', err)
        setCourse(null)
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Fetch practices for this course
    api
      .getPracticesByCourse(courseId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setPractices(res.data)
        }
      })
      .catch((err) => {
        console.warn('Practice fetch notice:', err.message || err)
      })
  }, [courseId])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-purple-100 bg-white p-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:150ms]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:300ms]" />
          <span className="ml-2 text-sm font-semibold text-purple-700">Loading course details...</span>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-xl font-bold text-purple-600">
          !
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Course Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The course you are looking for does not exist or has been removed.
        </p>

        <button
          type="button"
          onClick={() => navigate('/viewercourse')}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
        >
          Back to Courses
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/viewercourse')}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        ← Back to Courses
      </button>


      {/* Course Details */}
      <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">

        {/* Course Image */}
        <div className="h-64 overflow-hidden bg-purple-100">

          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />

        </div>


        <div className="p-8">

          {/* Category and Level */}
          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
              {course.category}
            </span>

            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
              {course.level}
            </span>

          </div>


          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {course.title}
          </h1>


          {/* Creator */}
          <p className="mt-2 text-sm font-semibold text-purple-600">
            By {course.creator}
          </p>


          {/* Description */}
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
            {course.description}
          </p>


          {/* Course Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Lessons
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.rawLessons?.length || course.lessonsCount || 0}
              </p>
            </div>


            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Duration
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.duration}
              </p>
            </div>


            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Students
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.students}
              </p>
            </div>

          </div>


          {/* What You Will Learn */}
          <div className="mt-8">

            <h2 className="text-xl font-bold text-gray-900">
              What You Will Learn
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              {course.learn.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600"
                >
                  ✓ {item}
                </div>
              ))}

            </div>

          </div>

          {/* Course Lessons & Practice Section */}
          <div className="mt-10 border-t border-purple-50 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Course Lessons & Practice
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Watch step-by-step lessons and complete practical challenges to build your portfolio.
                </p>
              </div>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                {course.rawLessons?.length || 0} Lessons
              </span>
            </div>

            {(!course.rawLessons || course.rawLessons.length === 0) ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                Lessons for this course will be available soon.
              </div>
            ) : (
              <div className="space-y-3">
                {course.rawLessons.map((les, idx) => {
                  const lessonNum = String(idx + 1).padStart(2, '0')
                  const matchedPractice = practices.find(
                    (p) =>
                      String(p.lessonId) === String(les._id || les.id) ||
                      p.lessonTitle?.trim().toLowerCase() === les.title?.trim().toLowerCase()
                  )

                  return (
                    <div
                      key={les._id || les.id || idx}
                      className="rounded-2xl border border-purple-100 bg-white p-5 transition hover:border-purple-300 hover:shadow-xs flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                          {lessonNum}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">
                            {les.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {les.duration || '10 min'}
                            {les.description ? ` • ${les.description.slice(0, 70)}...` : ''}
                          </p>
                          {matchedPractice && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50/70 px-2 py-0.5 rounded-md">
                                🎯 {matchedPractice.title}
                              </span>
                              {matchedPractice.userStatus && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  {matchedPractice.userStatus.replace('-', ' ')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={async () => {
                            const isMongoId = course.id && /^[0-9a-fA-F]{24}$/.test(String(course.id))
                            if (api.isAuthenticated() && isMongoId) {
                              try {
                                await api.enrollInCourse(course.id)
                              } catch (_) {}
                            }
                            navigate(`/watchlesson/${course.id}`)
                          }}
                          className="rounded-xl border border-purple-200 bg-purple-50/80 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition shadow-2xs"
                        >
                          Watch Lesson
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLesson(les)
                            setSelectedPractice(matchedPractice || null)
                            setIsPracticeModalOpen(true)
                          }}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 transition shadow-2xs"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Start Course */}
          <button
            type="button"
            onClick={async () => {
              const isMongoId = course.id && /^[0-9a-fA-F]{24}$/.test(String(course.id))
              if (api.isAuthenticated() && isMongoId) {
                try {
                  await api.enrollInCourse(course.id)
                } catch (err) {
                  // If already enrolled or status message, proceed smoothly
                  console.log('Enrollment note:', err.message || err)
                }
              }

              navigate(`/watchlesson/${course.id}`)
            }}
            className="mt-8 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700 shadow-md shadow-purple-200"
          >
            Start Course
          </button>

        </div>

      </section>

      {/* Practice Modal */}
      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        practiceId={selectedPractice?._id}
        initialPractice={selectedPractice}
        course={course}
        lesson={selectedLesson}
        onStatusUpdate={(pId, newStatus) => {
          setPractices((prev) =>
            prev.map((p) =>
              (p._id || p.id) === pId ? { ...p, userStatus: newStatus } : p
            )
          )
        }}
      />

    </div>
  )
}

export default ViewerCourseDetails