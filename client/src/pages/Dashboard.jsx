import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (api.isAuthenticated()) {
      Promise.all([
        api.getProfile().catch(() => null),
        api.getProjects({ mine: 'true' }).catch(() => null),
        api.getCourses({ mine: 'true' }).catch(() => null),
      ]).then(([profRes, projRes, courseRes]) => {
        if (profRes && profRes.success && profRes.data) {
          setProfile(profRes.data)
        } else {
          const storedUser = JSON.parse(localStorage.getItem('craftloop_user') || 'null')
          setProfile(storedUser)
        }

        if (projRes && projRes.success && Array.isArray(projRes.data)) {
          setProjects(projRes.data)
        } else {
          setProjects([])
        }

        if (courseRes && courseRes.success && Array.isArray(courseRes.data)) {
          setCourses(courseRes.data)
        } else {
          setCourses([])
        }
      })
    } else {
      setProjects([])
      setCourses([])
    }
  }, [])

  const creatorName = profile?.name || 'Creator'

  const publishedProjects = projects.filter(
    (project) => project.status === 'Published'
  )

  const totalLessons = courses.reduce(
    (total, course) =>
      total + (Array.isArray(course.lessons) ? course.lessons.length : 0),
    0
  )

  const stats = [
    {
      title: 'Projects',
      value: projects.length,
      icon: '🎨',
      action: '/your-project',
    },
    {
      title: 'Courses',
      value: courses.length,
      icon: '🎓',
      action: '/create',
    },
    {
      title: 'Published',
      value: publishedProjects.length,
      icon: '✓',
      action: '/your-project',
    },
    {
      title: 'Lessons',
      value: totalLessons,
      icon: '📚',
      action: '/create',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf9ff] px-8 py-8">

      <div className="mx-auto max-w-7xl">

        {/* WELCOME */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-purple-600 to-purple-500 p-8 text-white shadow-lg">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-medium text-purple-100">
                CREATOR DASHBOARD
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Welcome back, {creatorName}!
              </h1>

              <p className="mt-2 max-w-xl text-purple-100">
                Manage your creative work, courses and creator
                profile from one place.
              </p>
            </div>

            <button
              onClick={() => navigate('/create')}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
            >
              + Create New
            </button>

          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <button
              key={stat.title}
              onClick={() => navigate(stat.action)}
              className="rounded-2xl border border-purple-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  {stat.icon}
                </div>

                <span className="text-sm text-gray-400">
                  View →
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>

            </button>
          ))}

        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-8">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-4">

            <button
              onClick={() => navigate('/create')}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="text-2xl">➕</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Create
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add a project, service or course.
              </p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="text-2xl">👤</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Profile
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your creator profile.
              </p>
            </button>

            <button
              onClick={() => navigate('/messages')}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="text-2xl">💬</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Messages
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Connect with your community.
              </p>
            </button>

            <button
              onClick={() => navigate('/share')}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="text-2xl">🔗</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Share Profile
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Share your CraftLoop profile.
              </p>
            </button>

          </div>
        </div>

        {/* RECENT PROJECTS + COURSES */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* PROJECTS */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Projects
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest creative work.
                </p>
              </div>

              <button
                onClick={() => navigate('/your-project')}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                View All →
              </button>

            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl bg-purple-50 p-6 text-center">

                <div className="text-3xl">
                  🎨
                </div>

                <p className="mt-2 font-semibold text-gray-800">
                  No projects yet
                </p>

                <button
                  onClick={() => navigate('/create')}
                  className="mt-3 text-sm font-semibold text-purple-600"
                >
                  Create your first project →
                </button>

              </div>
            ) : (
              <div className="space-y-4">

                {projects.slice(-3).reverse().map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                  >

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-100">

                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          🎨
                        </span>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-semibold text-gray-900">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {project.category}
                      </p>

                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {project.status}
                    </span>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* COURSES */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Courses
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Courses you are building.
                </p>
              </div>

              <button
                onClick={() => navigate('/create')}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Create →
              </button>

            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl bg-purple-50 p-6 text-center">

                <div className="text-3xl">
                  🎓
                </div>

                <p className="mt-2 font-semibold text-gray-800">
                  No courses yet
                </p>

                <button
                  onClick={() => navigate('/create')}
                  className="mt-3 text-sm font-semibold text-purple-600"
                >
                  Create your first course →
                </button>

              </div>
            ) : (
              <div className="space-y-4">

                {courses.slice(-3).reverse().map((course) => (
                  <button
                    key={course.id}
                    onClick={() => navigate('/course-details')}
                    className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/30"
                  >

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-100">

                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          🎓
                        </span>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-semibold text-gray-900">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {course.lessons?.length || 0} lessons • {course.level}
                      </p>

                    </div>

                    <span className="text-purple-600">
                      →
                    </span>

                  </button>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* CREATOR INSIGHTS */}
        <div className="mt-8 rounded-3xl border border-purple-100 bg-purple-50 p-7">

          <h2 className="text-xl font-bold text-gray-900">
            Creator Insights
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Small actions that can improve your creator presence.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-5">
              <div className="text-2xl">
                ✨
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                Complete your profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Keep your skills, profession and bio updated so
                visitors understand what you create.
              </p>

              <button
                onClick={() => navigate('/edit-profile')}
                className="mt-4 text-sm font-semibold text-purple-600"
              >
                Edit Profile →
              </button>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <div className="text-2xl">
                📚
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                Build your course
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add useful lessons and video resources to make
                your course valuable for learners.
              </p>

              <button
                onClick={() => navigate('/create')}
                className="mt-4 text-sm font-semibold text-purple-600"
              >
                Create Course →
              </button>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <div className="text-2xl">
                🚀
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                Showcase your work
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add projects and services to show visitors what
                you can offer.
              </p>

              <button
                onClick={() => navigate('/your-project')}
                className="mt-4 text-sm font-semibold text-purple-600"
              >
                View Projects →
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard