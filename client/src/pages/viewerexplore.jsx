import { useMemo, useState } from 'react'

function ViewerExplore() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const creators = [
    {
      id: 1,
      name: 'Alex Morgan',
      username: '@alexmorgan',
      profession: 'UI UX Designer',
      category: 'Design',
      skills: 'Figma, Branding, UI UX',
      projects: 12,
      courses: 4,
      image: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      username: '@sarahwilson',
      profession: 'Graphic Designer',
      category: 'Design',
      skills: 'Photoshop, Illustrator, Canva',
      projects: 18,
      courses: 6,
      image: 'https://i.pravatar.cc/150?img=32',
    },
    {
      id: 3,
      name: 'Daniel Smith',
      username: '@danielsmith',
      profession: 'Web Developer',
      category: 'Development',
      skills: 'React, JavaScript, Node',
      projects: 15,
      courses: 5,
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 4,
      name: 'Emma Johnson',
      username: '@emmajohnson',
      profession: 'Content Creator',
      category: 'Content',
      skills: 'Writing, SEO, Content Strategy',
      projects: 10,
      courses: 3,
      image: 'https://i.pravatar.cc/150?img=44',
    },
    {
      id: 5,
      name: 'Ryan Taylor',
      username: '@ryantaylor',
      profession: 'Business Creator',
      category: 'Business',
      skills: 'Marketing, Strategy, Branding',
      projects: 9,
      courses: 4,
      image: 'https://i.pravatar.cc/150?img=11',
    },
    {
      id: 6,
      name: 'Olivia Brown',
      username: '@oliviabrown',
      profession: 'UX Researcher',
      category: 'UX',
      skills: 'Research, Prototyping, Figma',
      projects: 14,
      courses: 7,
      image: 'https://i.pravatar.cc/150?img=49',
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

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesCategory =
        category === 'All' || creator.category === category

      const searchText = search.toLowerCase()

      const matchesSearch =
        creator.name.toLowerCase().includes(searchText) ||
        creator.username.toLowerCase().includes(searchText) ||
        creator.profession.toLowerCase().includes(searchText) ||
        creator.skills.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [search, category])

  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-semibold text-purple-600">
          EXPLORE
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Discover Creators
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Find talented creators, explore their skills and discover projects
          and courses that match your interests.
        </p>
      </section>

      <section className="rounded-2xl border border-purple-100 bg-white p-5">

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            Search
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators, skills or professions"
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

      <section>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              CREATORS
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Recommended Creators
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredCreators.length} creators
          </p>
        </div>

        {filteredCreators.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-purple-100 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
              Search
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No creators found
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
              className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="rounded-2xl border border-purple-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-4">

                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-100"
                    />

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {creator.name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {creator.username}
                      </p>
                    </div>

                  </div>

                  <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                    {creator.category}
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-gray-800">
                    {creator.profession}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {creator.skills}
                  </p>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-[#faf9ff] p-3">
                    <p className="text-xs text-gray-400">
                      Projects
                    </p>

                    <p className="mt-1 text-lg font-bold text-purple-700">
                      {creator.projects}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9ff] p-3">
                    <p className="text-xs text-gray-400">
                      Courses
                    </p>

                    <p className="mt-1 text-lg font-bold text-purple-700">
                      {creator.courses}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                >
                  View Profile
                </button>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  )
}

export default ViewerExplore