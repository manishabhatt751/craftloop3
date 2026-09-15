import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ViewerExplore() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const items = [
    {
      id: 1,
      title: 'Alex Morgan',
      type: 'Creator',
      category: 'Design',
      description:
        'UI/UX designer helping businesses create modern and user-friendly digital experiences.',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 2,
      title: 'Modern Brand Flyer',
      type: 'Project',
      category: 'Graphic Design',
      description:
        'A creative branding and flyer design project created for a modern business.',
      image:
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 3,
      title: 'Complete UI UX Design',
      type: 'Course',
      category: 'Design',
      description:
        'Learn UI/UX design from fundamentals to practical design projects.',
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 4,
      title: 'Sarah Wilson',
      type: 'Creator',
      category: 'Development',
      description:
        'Full-stack developer creating websites and digital solutions for businesses.',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 5,
      title: 'Creative Portfolio Website',
      type: 'Project',
      category: 'Development',
      description:
        'A responsive portfolio website designed for a creative professional.',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 6,
      title: 'Digital Marketing Basics',
      type: 'Course',
      category: 'Marketing',
      description:
        'Understand digital marketing, SEO, social media and online promotion.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    },
  ]

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || item.category === category

    return matchesSearch && matchesCategory
  })

  const handleViewDetails = (item) => {
  if (item.type === 'Course') {
    navigate(`/viewercoursedetails/${item.id}`)
  }
}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Explore
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Discover creators, projects and courses on CraftLoop.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-100 bg-white p-5 shadow-sm md:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators, projects or courses..."
            className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="md:w-56">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          >
            <option value="All">All Categories</option>
            <option value="Design">Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden bg-purple-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {item.type}
                  </span>

                  <span className="text-xs font-medium text-gray-400">
                    {item.category}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-gray-900">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                {item.type === 'Course' ? (
                  <button
                    type="button"
                    onClick={() => handleViewDetails(item)}
                    className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    View Details
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl border border-purple-200 px-4 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Results */
        <div className="rounded-3xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
            🔍
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No results found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching for another creator, project or course.
          </p>
        </div>
      )}
    </div>
  )
}

export default ViewerExplore