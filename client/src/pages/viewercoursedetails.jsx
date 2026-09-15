import { useNavigate, useParams } from 'react-router-dom'

function ViewerCourseDetails() {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const courses = [
    {
      id: '1',
      title: 'Complete UI UX Design',
      category: 'Design',
      level: 'Beginner',
      creator: 'Alex Morgan',
      lessons: 12,
      duration: '4h 30m',
      students: 240,
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
      description:
        'Learn the fundamentals of UI UX design and create modern digital experiences. This course covers important design concepts, user experience principles and practical design workflows.',
      learn: [
        'Understand basic UI UX principles',
        'Create user friendly interfaces',
        'Learn design thinking concepts',
        'Build practical design projects',
      ],
    },
    {
      id: '2',
      title: 'Graphic Design with Canva',
      category: 'Design',
      level: 'Beginner',
      creator: 'Sarah Wilson',
      lessons: 10,
      duration: '3h 20m',
      students: 180,
      image:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
      description:
        'Learn how to create professional graphics, social media designs and presentations using Canva and modern design techniques.',
      learn: [
        'Learn Canva design tools',
        'Create professional graphics',
        'Design social media content',
        'Create attractive presentations',
      ],
    },
    {
      id: '3',
      title: 'React for Beginners',
      category: 'Development',
      level: 'Beginner',
      creator: 'Daniel Smith',
      lessons: 15,
      duration: '5h 10m',
      students: 320,
      image:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
      description:
        'Start building interactive websites using React and modern JavaScript. Learn components, state, props and practical React development.',
      learn: [
        'Understand React fundamentals',
        'Create reusable components',
        'Work with state and props',
        'Build interactive web applications',
      ],
    },
    {
      id: '4',
      title: 'Content Writing Masterclass',
      category: 'Content',
      level: 'Intermediate',
      creator: 'Emma Johnson',
      lessons: 8,
      duration: '2h 45m',
      students: 145,
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      description:
        'Learn content writing, storytelling and techniques for creating engaging content for different audiences and platforms.',
      learn: [
        'Learn effective writing techniques',
        'Create engaging content',
        'Understand storytelling',
        'Write for different audiences',
      ],
    },
    {
      id: '5',
      title: 'Digital Marketing Basics',
      category: 'Business',
      level: 'Beginner',
      creator: 'Ryan Taylor',
      lessons: 11,
      duration: '3h 50m',
      students: 210,
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      description:
        'Understand digital marketing, branding, social media and online growth strategies to build a strong digital presence.',
      learn: [
        'Understand digital marketing',
        'Learn social media strategies',
        'Understand online branding',
        'Explore growth strategies',
      ],
    },
    {
      id: '6',
      title: 'Figma Prototyping',
      category: 'UX',
      level: 'Intermediate',
      creator: 'Olivia Brown',
      lessons: 9,
      duration: '3h 15m',
      students: 165,
      image:
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
      description:
        'Create professional prototypes and improve your UX workflow using Figma. Learn how to turn ideas into interactive designs.',
      learn: [
        'Understand Figma basics',
        'Create interactive prototypes',
        'Build user flows',
        'Improve your UX workflow',
      ],
    },
  ]

  const course = courses.find(
    (item) => item.id === courseId
  )

  if (!course) {
    return (
      <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-xl font-bold text-purple-600">
          !
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Course Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The course you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate('/viewercourse')}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
        >
          Back to Courses
        </button>

      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/viewercourse')}
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        ← Back to Courses
      </button>


      {/* Course Details */}
      <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">

        {/* Course Image */}
        <div className="h-64 overflow-hidden bg-purple-100">

          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />

        </div>


        <div className="p-8">

          {/* Category and Level */}
          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
              {course.category}
            </span>

            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
              {course.level}
            </span>

          </div>


          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {course.title}
          </h1>


          {/* Creator */}
          <p className="mt-2 text-sm font-semibold text-purple-600">
            By {course.creator}
          </p>


          {/* Description */}
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
            {course.description}
          </p>


          {/* Course Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Lessons
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.lessons}
              </p>
            </div>


            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Duration
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.duration}
              </p>
            </div>


            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-semibold text-gray-400">
                Students
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {course.students}
              </p>
            </div>

          </div>


          {/* What You Will Learn */}
          <div className="mt-8">

            <h2 className="text-xl font-bold text-gray-900">
              What You Will Learn
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              {course.learn.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-purple-100 p-4 text-sm text-gray-600"
                >
                  ✓ {item}
                </div>
              ))}

            </div>

          </div>


          {/* Start Course */}
          <button
  type="button"
  onClick={() => {
    const existingCourses =
      JSON.parse(localStorage.getItem('craftloop_learning')) || []

    const alreadyAdded = existingCourses.some(
      (item) => item.id === course.id
    )

    if (!alreadyAdded) {
      localStorage.setItem(
        'craftloop_learning',
        JSON.stringify([
          ...existingCourses,
          {
            id: course.id,
            title: course.title,
            creator: course.creator,
            lessons: course.lessons,
            duration: course.duration,
            image: course.image,
            progress: 0,
          },
        ])
      )
    }

    navigate(`/watchlesson/${course.id}`)
  }}
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