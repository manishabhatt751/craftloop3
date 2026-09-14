import { useNavigate } from 'react-router-dom'

function WatchLesson() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">

      <button
        type="button"
        onClick={() => navigate('/viewercoursedetails')}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        Back to Course
      </button>

      <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white">

        <div className="aspect-video bg-gray-900">

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl text-white shadow-lg">
                Play
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                Course Video
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Introduction to UI UX Design
              </p>

            </div>

          </div>

        </div>

        <div className="p-8">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                LESSON 1
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Introduction to UI UX Design
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Complete UI UX Design
              </p>

            </div>

            <span className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
              1 of 12
            </span>

          </div>

          <div className="mt-8">

            <h2 className="text-lg font-bold text-gray-900">
              About This Lesson
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
              In this lesson, you will learn the basic concepts of UI and UX
              design and understand how designers create useful and engaging
              digital experiences.
            </p>

          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <button
                type="button"
                disabled
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-400"
              >
                Previous Lesson
              </button>

              <button
                type="button"
                onClick={() => navigate('/mylearning')}
                className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                Complete Lesson
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default WatchLesson