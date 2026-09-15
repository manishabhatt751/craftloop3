import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ViewerCourses() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const courses = [
    {
      id: 1,
      title: 'Complete UI UX Design',
      category: 'Design',
      level: 'Beginner',
      creator: 'Alex Morgan',
      lessons: 12,
      duration: '4h 30m',
      students: 240,
      description:
        'Learn the fundamentals of UI UX design and create modern digital experiences.',
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Graphic Design with Canva',
      category: 'Design',
      level: 'Beginner',
      creator: 'Sarah Wilson',
      lessons: 10,
      duration: '3h 20m',
      students: 180,
      description:
        'Learn how to create professional graphics, social media designs and presentations.',
      image:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'React for Beginners',
      category: 'Development',
      level: 'Beginner',
      creator: 'Daniel Smith',
      lessons: 15,
      duration: '5h 10m',
      students: 320,
      description:
        'Start building interactive websites using React and modern JavaScript.',
      image:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'Content Writing Masterclass',
      category: 'Content',
      level: 'Intermediate',
      creator: 'Emma Johnson',
      lessons: 8,
      duration: '2h 45m',
      students: 145,
      description:
        'Learn content writing, storytelling and techniques for creating engaging content.',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'Digital Marketing Basics',
      category: 'Business',
      level: 'Beginner',
      creator: 'Ryan Taylor',
      lessons: 11,
      duration: '3h 50m',
      students: 210,
      description:
        'Understand digital marketing, branding, social media and online growth strategies.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Figma Prototyping',
      category: 'UX',
      level: 'Intermediate',
      creator: 'Olivia Brown',
      lessons: 9,
      duration: '3h 15m',
      students: 165,
      description:
        'Create professional prototypes and improve your UX workflow using Figma.',
      image:
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80',
    },
  ]

  const categories = [
    'All',
    'Design',
    'UX',
    'Development',
    'Content',
    'Business',
  ]

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        category === 'All' || course.category === category

      const searchText = search.toLowerCase()

      const matchesSearch =
        course.title.toLowerCase().includes(searchText) ||
        course.creator.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [search, category])

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">
          COURSES
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Learn New Skills
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Explore courses created by talented creators and learn practical
          skills at your own pace.
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, creators or skills"
            className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] py-3 pl-20 pr-4 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          />
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
            <p className="text-sm font-semibold text-purple-600">
              LEARNING
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Explore Courses
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredCourses.length} courses
          </p>

        </div>


        {/* No Results */}
        {filteredCourses.length === 0 ? (

          <div className="mt-5 rounded-2xl border border-purple-100 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-sm font-bold text-purple-600">
              Search
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('')
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


                  <p className="mt-3 text-sm leading-6 text-gray-500">
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