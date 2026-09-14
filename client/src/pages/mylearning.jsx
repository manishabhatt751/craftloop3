import { useNavigate } from 'react-router-dom'

function MyLearning() {
  const navigate = useNavigate()

  const courses = [
    {
      id: 1,
      title: 'Complete UI UX Design',
      creator: 'Alex Morgan',
      progress: 25,
      completedLessons: 3,
      totalLessons: 12,
      duration: '4h 30m',
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Graphic Design with Canva',
      creator: 'Sarah Wilson',
      progress: 60,
      completedLessons: 6,
      totalLessons: 10,
      duration: '3h 20m',
      image:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-semibold text-purple-600">
          MY LEARNING
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Continue Learning
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Continue your courses and keep making progress toward your learning
          goals.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">

        {courses.map((course) => (
          <div
            key={course.id}
            className="overflow-hidden rounded-2xl border border-purple-100 bg-white transition hover:shadow-lg"
          >

            <div className="h-48 overflow-hidden bg-purple-100">
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">

              <h2 className="text-xl font-bold text-gray-900">
                {course.title}
              </h2>

              <p className="mt-2 text-sm font-semibold text-purple-600">
                By {course.creator}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {course.completedLessons} of {course.totalLessons} lessons
                </span>

                <span className="text-sm font-bold text-purple-600">
                  {course.progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {course.duration}
                </span>

                <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                  In Progress
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/watchlesson')}
                className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                Continue Course
              </button>

            </div>

          </div>
        ))}

      </section>

      <section className="rounded-2xl border border-purple-100 bg-white p-6">

        <h2 className="text-xl font-bold text-gray-900">
          Your Learning Progress
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-purple-50 p-5">
            <p className="text-xs font-semibold text-gray-400">
              Courses Started
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              2
            </p>
          </div>

          <div className="rounded-2xl bg-purple-50 p-5">
            <p className="text-xs font-semibold text-gray-400">
              Lessons Completed
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              9
            </p>
          </div>

          <div className="rounded-2xl bg-purple-50 p-5">
            <p className="text-xs font-semibold text-gray-400">
              Learning Hours
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              4h 15m
            </p>
          </div>

        </div>

      </section>

    </div>
  )
}

export default MyLearning