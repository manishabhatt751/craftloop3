import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'



function getCourseFallbackImage(category = '') {
  const cat = String(category).toLowerCase()
  if (cat.includes('video')) {
    return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  }
  if (cat.includes('graphic') || cat.includes('design')) {
    return 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'
  }
  if (cat.includes('ux') || cat.includes('ui')) {
    return 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
  }
  if (cat.includes('web') || cat.includes('dev') || cat.includes('code') || cat.includes('react')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  }
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
}

function ViewerCourses() {
  const navigate = useNavigate()

  // State Management
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCourses, setFilteredCourses] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Backward compatibility alias for any consumer referencing `search`
  const search = searchTerm
  const setSearch = setSearchTerm

  // Fetch real courses from CraftLoop backend
  useEffect(() => {
    setLoading(true)
    setError(null)

    api
      .getCourses()
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          const dynamicCourses = res.data.map((c) => ({
            id: c._id,
            title: c.title || 'Untitled Course',
            category: c.category || 'Development',
            level: c.level || 'Beginner',
            creator: c.instructor?.name || c.creator?.name || 'CraftLoop Creator',
            lessons: Array.isArray(c.lessons) ? c.lessons.length : 0,
            lessonsList: Array.isArray(c.lessons) ? c.lessons : [],
            duration: `${Array.isArray(c.lessons) ? c.lessons.length * 15 : 45}m`,
            students: Array.isArray(c.enrolledStudents) ? c.enrolledStudents.length : 0,
            description: c.description || 'Practical learning course on CraftLoop.',
            tags: Array.isArray(c.tags) ? c.tags : [],
            skills: Array.isArray(c.skills) ? c.skills : [],
            image: c.thumbnail || getCourseFallbackImage(c.category),
          }))

          setCourses(dynamicCourses)
        } else {
          setCourses([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch courses from backend:', err)
        setError('Unable to load courses from MongoDB Atlas. Please try again.')
        setCourses([])
        setLoading(false)
      })
  }, [])

  const categories = [
    'All',
    'Design',
    'UX',
    'Development',
    'Content',
    'Business',
  ]

  // Immediate, case-insensitive client-side filtering combining search and category
  useEffect(() => {
    const term = (searchTerm || '').trim().toLowerCase()

    const results = courses.filter((course) => {
      // 1. Category Matching
      const courseCat = (course.category || '').toLowerCase()
      const selCat = category.toLowerCase()

      let matchesCategory = category === 'All' || courseCat === selCat

      if (!matchesCategory && category !== 'All') {
        if (selCat === 'design') {
          matchesCategory = courseCat.includes('design') || courseCat.includes('graphic')
        } else if (selCat === 'ux') {
          matchesCategory = courseCat.includes('ux') || courseCat.includes('ui')
        } else if (selCat === 'development') {
          matchesCategory = courseCat.includes('development') || courseCat.includes('web') || courseCat.includes('code')
        } else if (selCat === 'content') {
          matchesCategory = courseCat.includes('content') || courseCat.includes('video') || courseCat.includes('writing')
        } else if (selCat === 'business') {
          matchesCategory = courseCat.includes('business') || courseCat.includes('marketing')
        }
      }

      // 2. Search Matching (title, description, category, creator, level, tags, skills, lessons)
      if (!term) {
        return matchesCategory
      }

      const title = (course.title || '').toLowerCase()
      const description = (course.description || '').toLowerCase()
      const creator = (course.creator || '').toLowerCase()
      const level = (course.level || '').toLowerCase()
      const tags = Array.isArray(course.tags) ? course.tags.map((t) => String(t).toLowerCase()) : []
      const skills = Array.isArray(course.skills) ? course.skills.map((s) => String(s).toLowerCase()) : []
      const lessons = Array.isArray(course.lessonsList) ? course.lessonsList.map((l) => (l.title || '').toLowerCase()) : []

      const matchesSearch =
        title.includes(term) ||
        description.includes(term) ||
        courseCat.includes(term) ||
        creator.includes(term) ||
        level.includes(term) ||
        tags.some((t) => t.includes(term)) ||
        skills.some((s) => s.includes(term)) ||
        lessons.some((l) => l.includes(term))

      return matchesCategory && matchesSearch
    })

    setFilteredCourses(results)
  }, [courses, searchTerm, category])

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">COURSES</p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Learn New Skills
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Explore courses created by talented creators and learn practical skills
          at your own pace.
        </p>
      </section>

      {/* Search and Categories */}
      <section className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            Search
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses, creators or skills"
            className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] py-3 pl-20 pr-10 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-100'
                  : 'bg-purple-50 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Course Section */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">LEARNING</p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Explore Courses
            </h2>
          </div>

          {!loading && (
            <p className="text-sm text-gray-500">
              {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="mt-8 flex justify-center py-12">
            <div className="flex items-center gap-3 text-sm text-purple-600 font-medium">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
              Loading courses...
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          /* No Results */
          <div className="mt-5 rounded-2xl border border-purple-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-sm font-bold text-purple-600">
              Search
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? `No courses matching "${searchTerm}". Try another keyword or clear filters.`
                : 'Try another search or choose a different category.'}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setCategory('All')
              }}
              className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Course Cards */
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-2xl border border-purple-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden bg-purple-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm">
                    {course.category}
                  </span>
                </div>

                {/* Course Information */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {course.level}
                    </span>

                    <span className="text-xs text-gray-400">
                      {course.students} students
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-purple-600">
                    By {course.creator}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-500 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Details */}
                  <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                      {course.lessons} Lessons
                    </span>

                    <span className="text-xs text-gray-500">
                      {course.duration}
                    </span>
                  </div>

                  {/* View Course */}
                  <button
                    type="button"
                    onClick={() => navigate(`/viewercoursedetails/${course.id}`)}
                    className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ViewerCourses