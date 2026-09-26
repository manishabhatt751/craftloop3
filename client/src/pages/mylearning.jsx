import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PracticeModal from '../Components/PracticeModal'

function MyLearning() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [practices, setPractices] = useState([])
  const [completedProjects, setCompletedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Practice Modal State
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [selectedPractice, setSelectedPractice] = useState(null)

  const fetchData = async () => {
    if (!api.isAuthenticated()) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 1. Fetch Enrolled Courses
      const enrRes = await api.getMyLearning()
      let enrolledCoursesList = []
      if (enrRes && enrRes.data && Array.isArray(enrRes.data)) {
        enrolledCoursesList = enrRes.data
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
              courseId: c._id,
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
      }
      setCourses(enrolledCoursesList)

      // 2. Fetch User's Practice Progress from MongoDB
      const practiceRes = await api.getMyPractices()
      let userPractices = []
      if (practiceRes && practiceRes.data && Array.isArray(practiceRes.data)) {
        userPractices = practiceRes.data
      }

      // If user is enrolled in courses, also load course practices to suggest any not-started challenges
      const enrolledCourseIds = enrolledCoursesList.map((c) => c.courseId).filter(Boolean)
      let allCoursePractices = []
      for (const cId of enrolledCourseIds.slice(0, 5)) {
        try {
          const cpRes = await api.getPracticesByCourse(cId)
          if (cpRes && cpRes.data && Array.isArray(cpRes.data)) {
            allCoursePractices.push(...cpRes.data)
          }
        } catch (_) {}
      }

      // Merge user practice progress with available course practices
      const mergedPracticesMap = new Map()

      // Add started / submitted / completed practices
      userPractices.forEach((pItem) => {
        const pObj = pItem.practice || pItem
        const pId = String(pObj._id || pObj.id)
        mergedPracticesMap.set(pId, {
          ...pObj,
          _id: pId,
          userStatus: pItem.status || 'in-progress',
          submission: pItem,
        })
      })

      // Add unstarted course practices
      allCoursePractices.forEach((cp) => {
        const cpId = String(cp._id || cp.id)
        if (!mergedPracticesMap.has(cpId)) {
          mergedPracticesMap.set(cpId, {
            ...cp,
            _id: cpId,
            userStatus: cp.userStatus || 'not-started',
          })
        }
      })

      setPractices(Array.from(mergedPracticesMap.values()))

      // 3. Fetch User's Published/Created Projects (Completed Projects)
      try {
        const projRes = await api.getProjects({ mine: 'true' })
        if (projRes && projRes.data && Array.isArray(projRes.data)) {
          setCompletedProjects(projRes.data)
        }
      } catch (_) {}

    } catch (err) {
      console.error('Error loading My Learning data:', err)
      setError('Unable to load your learning journey right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePracticeStatusUpdate = (pId, newStatus) => {
    setPractices((prev) =>
      prev.map((p) =>
        (p._id || p.id) === pId ? { ...p, userStatus: newStatus } : p
      )
    )
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Learning
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Continue your courses, complete hands-on practice challenges, and showcase your projects.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
            ⚠️
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-purple-100 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:150ms]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600 [animation-delay:300ms]" />
            <span className="ml-2 text-sm font-semibold text-purple-700">Loading your learning space...</span>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* SECTION 1: CONTINUE LEARNING */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Continue Learning
              </h2>
              <button
                type="button"
                onClick={() => navigate('/viewercourse')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Browse All Courses →
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-3xl border border-purple-100 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
                  📚
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">No Courses Yet</h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
                  You have not enrolled in any courses yet. Discover our courses and start learning.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/viewercourse')}
                  className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="h-40 overflow-hidden bg-purple-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-semibold text-purple-600">
                        By {course.creator}
                      </p>
                      <h3 className="mt-1.5 text-base font-bold text-gray-900 truncate">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {course.lessons} lessons • {course.duration}
                      </p>

                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-purple-600">{course.progress || 0}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-purple-100">
                          <div
                            className="h-full rounded-full bg-purple-600 transition-all duration-300"
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/watchlesson/${course.id}`)}
                        className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700 shadow-sm"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: 🎯 PRACTICE SYSTEM */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700">
                  🎯
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Practice Challenges
                  </h2>
                  <p className="text-xs text-gray-500">
                    Apply skills from your lessons with hands-on activities and real-world projects.
                  </p>
                </div>
              </div>
            </div>

            {practices.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/40 p-8 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  No practice challenges active yet.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Watch course lessons to unlock practice challenges and skill milestones!
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-purple-100 bg-white overflow-hidden shadow-sm">
                <div className="divide-y divide-purple-50">
                  {practices.map((practiceItem) => {
                    const status = practiceItem.userStatus || 'not-started'
                    const courseTitle =
                      practiceItem.course?.title || practiceItem.courseTitle || 'CraftLoop Course'

                    const typeBadge =
                      practiceItem.type === 'project' ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          🚀 Project
                        </span>
                      ) : practiceItem.type === 'challenge' ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                          🏆 Challenge
                        </span>
                      ) : (
                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                          ⚡ Quick
                        </span>
                      )

                    const statusBadge =
                      status === 'completed' ? (
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          ✓ Completed
                        </span>
                      ) : status === 'submitted' ? (
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          Submitted
                        </span>
                      ) : status === 'in-progress' ? (
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          In Progress
                        </span>
                      ) : (
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                          Not Started
                        </span>
                      )

                    return (
                      <div
                        key={practiceItem._id || practiceItem.id}
                        className="p-5 transition hover:bg-purple-50/20 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            {typeBadge}
                            <span className="text-xs text-gray-500 font-medium">
                              Course: {courseTitle}
                              {practiceItem.lessonTitle ? ` • ${practiceItem.lessonTitle}` : ''}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-gray-900">
                            {practiceItem.title}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {practiceItem.description}
                          </p>

                          {Array.isArray(practiceItem.skills) && practiceItem.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {practiceItem.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {statusBadge}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPractice(practiceItem)
                              setPracticeModalOpen(true)
                            }}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                              status === 'in-progress'
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : status === 'completed' || status === 'submitted'
                                ? 'border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            {status === 'in-progress'
                              ? 'Continue'
                              : status === 'submitted' || status === 'completed'
                              ? 'Submit / View'
                              : 'Start'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3: COMPLETED PROJECTS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Completed Projects
                </h2>
                <p className="text-xs text-gray-500">
                  Showcase projects created through real-world challenges and course practice.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/savedprojects')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                View Saved Projects →
              </button>
            </div>

            {completedProjects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-500">
                No portfolio projects completed yet. Complete a Real-World Project challenge to turn your practice into a showcase project!
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {completedProjects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="h-36 overflow-hidden bg-purple-100">
                      <img
                        src={
                          project.coverImage ||
                          project.images?.[0] ||
                          'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {project.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {project.description || 'CraftLoop Portfolio Project'}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-purple-600">
                        <span>View Project →</span>
                        <span className="text-gray-400">
                          {project.likes?.length || 0} Likes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Practice Modal */}
      <PracticeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        practiceId={selectedPractice?._id}
        initialPractice={selectedPractice}
        course={selectedPractice?.course}
        lesson={selectedPractice?.lessonTitle ? { title: selectedPractice.lessonTitle } : null}
        onStatusUpdate={handlePracticeStatusUpdate}
      />
    </div>
  )
}

export default MyLearning