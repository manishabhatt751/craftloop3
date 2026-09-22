import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function SavedProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = async () => {
    try {
      setLoading(true)
      const res = await api.getSavedProjects()
      if (res && res.success && Array.isArray(res.data)) {
        setProjects(res.data)
      }
    } catch (err) {
      console.error('Failed to load saved projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  const removeProject = async (id) => {
    try {
      await api.unsaveProject(id)
      setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id))
    } catch (err) {
      console.error('Failed to remove saved project:', err)
    }
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

      {/* Loading State */}
      {loading ? (
        <section className="rounded-3xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading saved projects...</p>
        </section>
      ) : projects.length === 0 ? (
        /* Empty State */
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

          {projects.map((project) => {
            const projectId = project._id || project.id
            const creatorName = project.creator?.name || project.creator || 'Creator'
            const projectImg = project.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'

            return (
              <div
                key={projectId}
                className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Image */}
                <div className="h-48 overflow-hidden bg-purple-100">
                  <img
                    src={projectImg}
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
                    By {creatorName}
                  </p>

                  {project.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-500 line-clamp-2">
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
                      onClick={() => removeProject(projectId)}
                      className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </section>
      )}

    </div>
  )
}

export default SavedProjects