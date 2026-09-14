import { useNavigate } from 'react-router-dom'

function ViewerCourseDetails() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">

      <button
        type="button"
        onClick={() => navigate('/viewercourse')}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        Back to Courses
      </button>

      <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white">

        <div className="h-64 overflow-hidden bg-purple-100">
          <img
            src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80"
            alt="Complete UI UX Design"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
              Design
            </span>

            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
              Beginner
            </span>

          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Complete UI UX Design
          </h1>

          <p className="mt-2 text-sm font-semibold text-purple-600">
            By Alex Morgan
          </p>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
            Learn the fundamentals of UI UX design and create modern digital
            experiences. This course covers important design concepts,
            user experience principles and practical design workflows.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Lessons
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                12
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Duration
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                4h 30m
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Students
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                240
              </p>
            </div>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-bold text-gray-900">
              What You Will Learn
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              <div className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600">
                Understand basic UI UX principles
              </div>

              <div className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600">
                Create user friendly interfaces
              </div>

              <div className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600">
                Learn design thinking concepts
              </div>

              <div className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600">
                Build practical design projects
              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate('/watchlesson')}
            className="mt-8 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
          >
            Start Course
          </button>

        </div>

      </section>

    </div>
  )
}

export default ViewerCourseDetails