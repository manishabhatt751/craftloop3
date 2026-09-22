import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function MyLearning() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    if (api.isAuthenticated()) {
      api
        .getMyLearning()
        .then((res) => {
          if (!isMounted) return
          if (res && res.data && Array.isArray(res.data)) {
            const dbCourses = res.data
              .filter((enr) => enr && enr.course && typeof enr.course === 'object')
              .map((enr) => {
                const c = enr.course || {}
                const creatorName =
                  (c.creator && typeof c.creator === 'object' ? c.creator.name : c.creator) ||
                  'CraftLoop Creator'
                const lessonsCount = Array.isArray(c.lessons)
                  ? c.lessons.length
                  : typeof c.lessonsCount === 'number'
                  ? c.lessonsCount
                  : 0

                return {
                  id: c._id || enr._id,
                  title: c.title || 'Untitled Course',
                  creator: creatorName,
                  lessons: lessonsCount,
                  duration: c.duration || 'Flexible',
                  image:
                    c.thumbnail ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                  progress: typeof enr.progress === 'number' ? enr.progress : 0,
                  status: enr.status || 'in-progress',
                }
              })

            setCourses(dbCourses)
            setError(null)
          } else {
            setCourses([])
          }
        })
        .catch((err) => {
          console.error('Error fetching My Learning from backend:', err)
          if (isMounted) {
            setError('Unable to load your courses right now. Please try again.')
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Learning
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Continue your courses and track your learning progress.
        </p>
      </div>

      {/* Error State */}
      {error ? (
        <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
            ⚠️
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-purple-100 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:150ms]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:300ms]" />
            <span className="ml-2 text-sm font-semibold text-purple-700">Loading your courses...</span>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
            ▶
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No Courses Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            You have not started any courses yet. Explore available
            courses and start learning today.
          </p>

          <button
            type="button"
            onClick={() => navigate('/viewercourse')}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Browse Courses
          </button>

        </div>
      ) : (

        /* Course Cards */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {courses.map((course) => (

            <div
              key={course.id}
              className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Image */}
              <div className="h-44 overflow-hidden bg-purple-100">

                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />

              </div>

              {/* Content */}
              <div className="p-6">

                <p className="text-xs font-semibold text-purple-600">
                  By {course.creator}
                </p>

                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  {course.title}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  {course.lessons} lessons • {course.duration}
                </p>

                {/* Progress */}
                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-semibold text-gray-500">
                      Progress
                    </span>

                    <span className="text-xs font-bold text-purple-600">
                      {course.progress || 0}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-purple-100">

                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{
                        width: `${course.progress || 0}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/watchlesson/${course.id}`)
                  }
                  className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Continue Learning
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default MyLearning