import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SavedProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const savedProjects =
      JSON.parse(localStorage.getItem('craftloop_saved_projects')) || []

    setProjects(savedProjects)
  }, [])

  const removeProject = (id) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== id
    )

    setProjects(updatedProjects)

    localStorage.setItem(
      'craftloop_saved_projects',
      JSON.stringify(updatedProjects)
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">
          SAVED
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Saved Projects
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Keep track of projects you want to explore later.
        </p>
      </section>

      {/* Empty State */}
      {projects.length === 0 ? (
        <section className="rounded-3xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
            ♡
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No Saved Projects
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Projects you save while exploring CraftLoop will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate('/viewerexplore')}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Explore Projects
          </button>

        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Image */}
              <div className="h-48 overflow-hidden bg-purple-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">

                <p className="text-xs font-semibold text-purple-600">
                  {project.category || 'Creative Project'}
                </p>

                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  {project.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  By {project.creator}
                </p>

                {project.description && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {project.description}
                  </p>
                )}

                <div className="mt-5 flex gap-3">

                  <button
                    type="button"
                    onClick={() => navigate('/viewerexplore')}
                    className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Explore
                  </button>

                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>
          ))}

        </section>
      )}

    </div>
  )
}

export default SavedProjects