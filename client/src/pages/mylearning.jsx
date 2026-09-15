import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyLearning() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const savedCourses =
      JSON.parse(localStorage.getItem('craftloop_learning')) || []

    setCourses(savedCourses)
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

      {/* Empty State */}
      {courses.length === 0 ? (
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