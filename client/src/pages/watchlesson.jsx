import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function WatchLesson() {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const courses = {
    '1': {
      title: 'Complete UI UX Design',
      lessons: [
        {
          title: 'Introduction to UI/UX',
          duration: '18 min',
          description:
            'Learn the basic concepts of UI and UX design and understand how they work together.',
        },
        {
          title: 'Understanding User Experience',
          duration: '22 min',
          description:
            'Understand user needs, user journeys and the importance of creating useful experiences.',
        },
        {
          title: 'Design Principles',
          duration: '20 min',
          description:
            'Learn the fundamental principles that help designers create clear and effective interfaces.',
        },
        {
          title: 'Wireframing Basics',
          duration: '25 min',
          description:
            'Learn how to create simple wireframes and structure a digital product before visual design.',
        },
        {
          title: 'Creating User Flows',
          duration: '19 min',
          description:
            'Understand how users move through a product and how to create simple user flows.',
        },
        {
          title: 'Introduction to Prototyping',
          duration: '24 min',
          description:
            'Learn how prototypes help designers test ideas and improve user experiences.',
        },
        {
          title: 'Visual Design',
          duration: '21 min',
          description:
            'Explore typography, spacing, colors and other important visual design concepts.',
        },
        {
          title: 'Design Systems',
          duration: '23 min',
          description:
            'Learn how design systems create consistency across digital products.',
        },
        {
          title: 'Responsive Design',
          duration: '20 min',
          description:
            'Understand how interfaces adapt to different screen sizes and devices.',
        },
        {
          title: 'Usability Testing',
          duration: '26 min',
          description:
            'Learn how usability testing helps identify problems and improve digital experiences.',
        },
        {
          title: 'Final Project',
          duration: '30 min',
          description:
            'Apply the concepts you learned by working on a practical UI/UX design project.',
        },
        {
          title: 'Course Summary',
          duration: '15 min',
          description:
            'Review the major concepts covered throughout the complete UI/UX design course.',
        },
      ],
    },

    '2': {
      title: 'Graphic Design with Canva',
      lessons: [
        {
          title: 'Introduction to Canva',
          duration: '18 min',
          description:
            'Learn the basics of Canva and understand how to start creating professional designs.',
        },
        {
          title: 'Canva Design Tools',
          duration: '20 min',
          description:
            'Explore Canva tools, templates, elements and design features.',
        },
        {
          title: 'Working with Typography',
          duration: '17 min',
          description:
            'Learn how to choose and combine fonts to create attractive designs.',
        },
        {
          title: 'Color and Branding',
          duration: '22 min',
          description:
            'Understand colors and branding principles for consistent visual designs.',
        },
        {
          title: 'Social Media Designs',
          duration: '21 min',
          description:
            'Create attractive social media posts using Canva.',
        },
        {
          title: 'Poster and Flyer Design',
          duration: '24 min',
          description:
            'Learn how to create professional posters and flyers.',
        },
        {
          title: 'Presentation Design',
          duration: '20 min',
          description:
            'Create clean and engaging presentations using Canva.',
        },
        {
          title: 'Creative Layouts',
          duration: '19 min',
          description:
            'Learn how spacing, alignment and composition improve your designs.',
        },
        {
          title: 'Design Tips',
          duration: '16 min',
          description:
            'Discover useful tips for making your designs more professional.',
        },
        {
          title: 'Final Canva Project',
          duration: '25 min',
          description:
            'Apply everything you learned by creating a complete Canva project.',
        },
      ],
    },

    '3': {
      title: 'React for Beginners',
      lessons: [
        {
          title: 'Introduction to React',
          duration: '20 min',
          description:
            'Understand what React is and why it is used for modern web development.',
        },
        {
          title: 'Components',
          duration: '24 min',
          description:
            'Learn how React components work and how to create reusable UI elements.',
        },
        {
          title: 'JSX Basics',
          duration: '18 min',
          description:
            'Understand JSX syntax and how it is used inside React applications.',
        },
        {
          title: 'Props',
          duration: '22 min',
          description:
            'Learn how to pass data between React components using props.',
        },
        {
          title: 'State and useState',
          duration: '25 min',
          description:
            'Understand state and learn how useState makes React interfaces interactive.',
        },
        {
          title: 'Event Handling',
          duration: '20 min',
          description:
            'Learn how to handle user interactions such as clicks and form input.',
        },
        {
          title: 'Conditional Rendering',
          duration: '19 min',
          description:
            'Learn how to display different content based on application state.',
        },
        {
          title: 'Lists and Keys',
          duration: '21 min',
          description:
            'Understand how to render lists of data and why React keys are important.',
        },
        {
          title: 'React Router',
          duration: '26 min',
          description:
            'Learn how to create multiple pages and navigate between them using React Router.',
        },
        {
          title: 'Forms in React',
          duration: '23 min',
          description:
            'Build interactive forms and manage form data in React.',
        },
        {
          title: 'API Basics',
          duration: '25 min',
          description:
            'Understand the basics of connecting a React frontend with APIs.',
        },
        {
          title: 'Project Structure',
          duration: '18 min',
          description:
            'Learn how to organize a React project using components and pages.',
        },
        {
          title: 'Building a Project',
          duration: '28 min',
          description:
            'Combine React concepts to build a practical application.',
        },
        {
          title: 'Best Practices',
          duration: '20 min',
          description:
            'Learn useful practices for writing clean and maintainable React code.',
        },
        {
          title: 'Final Project',
          duration: '30 min',
          description:
            'Apply your React knowledge by completing a practical final project.',
        },
      ],
    },

    '4': {
      title: 'Content Writing Masterclass',
      lessons: [
        {
          title: 'Introduction to Content Writing',
          duration: '18 min',
          description:
            'Understand the fundamentals of professional content writing.',
        },
        {
          title: 'Finding Your Audience',
          duration: '20 min',
          description:
            'Learn how to understand your audience and create content for them.',
        },
        {
          title: 'Writing Strong Headlines',
          duration: '16 min',
          description:
            'Learn techniques for writing attractive and effective headlines.',
        },
        {
          title: 'Storytelling',
          duration: '22 min',
          description:
            'Use storytelling techniques to make your content more engaging.',
        },
        {
          title: 'Blog Writing',
          duration: '21 min',
          description:
            'Learn how to structure and write useful blog posts.',
        },
        {
          title: 'SEO Writing',
          duration: '24 min',
          description:
            'Understand basic SEO techniques for creating searchable content.',
        },
        {
          title: 'Editing and Proofreading',
          duration: '19 min',
          description:
            'Learn how to improve clarity, grammar and quality through editing.',
        },
        {
          title: 'Final Writing Project',
          duration: '25 min',
          description:
            'Create a complete piece of content using everything you learned.',
        },
      ],
    },

    '5': {
      title: 'Digital Marketing Basics',
      lessons: [
        {
          title: 'Introduction to Digital Marketing',
          duration: '20 min',
          description:
            'Understand digital marketing and how businesses use it to reach customers.',
        },
        {
          title: 'Digital Branding',
          duration: '19 min',
          description:
            'Learn the fundamentals of creating a strong digital brand.',
        },
        {
          title: 'Social Media Marketing',
          duration: '23 min',
          description:
            'Understand how businesses use social media to connect with audiences.',
        },
        {
          title: 'Content Marketing',
          duration: '21 min',
          description:
            'Learn how useful content can attract and engage customers.',
        },
        {
          title: 'SEO Basics',
          duration: '24 min',
          description:
            'Understand the fundamentals of search engine optimization.',
        },
        {
          title: 'Email Marketing',
          duration: '18 min',
          description:
            'Learn how email campaigns can support customer engagement.',
        },
        {
          title: 'Online Advertising',
          duration: '22 min',
          description:
            'Explore the basics of online advertising and digital campaigns.',
        },
        {
          title: 'Marketing Analytics',
          duration: '20 min',
          description:
            'Learn how analytics help marketers understand campaign performance.',
        },
        {
          title: 'Growth Strategies',
          duration: '24 min',
          description:
            'Explore strategies for growing an online presence.',
        },
        {
          title: 'Digital Marketing Project',
          duration: '27 min',
          description:
            'Create a simple digital marketing strategy using the concepts learned.',
        },
        {
          title: 'Course Summary',
          duration: '15 min',
          description:
            'Review the important concepts covered in digital marketing.',
        },
      ],
    },

    '6': {
      title: 'Figma Prototyping',
      lessons: [
        {
          title: 'Introduction to Figma',
          duration: '20 min',
          description:
            'Learn the basics of Figma and understand its role in modern UX design.',
        },
        {
          title: 'Figma Interface',
          duration: '18 min',
          description:
            'Explore the Figma interface, tools and workspace.',
        },
        {
          title: 'Frames and Layers',
          duration: '21 min',
          description:
            'Learn how frames and layers help organize your designs.',
        },
        {
          title: 'Components',
          duration: '24 min',
          description:
            'Understand reusable components and how they improve design consistency.',
        },
        {
          title: 'Auto Layout',
          duration: '25 min',
          description:
            'Learn how Auto Layout helps create flexible and responsive designs.',
        },
        {
          title: 'Creating User Flows',
          duration: '20 min',
          description:
            'Create clear user flows to represent how users move through a product.',
        },
        {
          title: 'Interactive Prototypes',
          duration: '23 min',
          description:
            'Learn how to connect screens and create interactive prototypes.',
        },
        {
          title: 'Prototype Testing',
          duration: '19 min',
          description:
            'Understand how to test prototypes and identify usability issues.',
        },
        {
          title: 'Final Prototype',
          duration: '28 min',
          description:
            'Create a complete interactive prototype using Figma.',
        },
      ],
    },
  }

  const course = courses[courseId]

  if (!course) {
    return (
      <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Course Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The course you are trying to watch does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate('/viewercourse')}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700"
        >
          Back to Courses
        </button>
      </div>
    )
  }

  const [currentLesson, setCurrentLesson] = useState(0)

  const lesson = course.lessons[currentLesson]

  const progress = Math.round(
    ((currentLesson + 1) / course.lessons.length) * 100
    
  )
  const updateProgress = (lessonIndex) => {
  const savedCourses =
    JSON.parse(localStorage.getItem('craftloop_learning')) || []

  const updatedCourses = savedCourses.map((item) => {
    if (item.id === courseId) {
      return {
        ...item,
        progress: Math.round(
          ((lessonIndex + 1) / course.lessons.length) * 100
        ),
      }
    }

    return item
  })

  localStorage.setItem(
    'craftloop_learning',
    JSON.stringify(updatedCourses)
  )
}

  const handleNext = () => {
  updateProgress(currentLesson)

  if (currentLesson < course.lessons.length - 1) {
    setCurrentLesson((prev) => prev + 1)
  } else {
    updateProgress(course.lessons.length - 1)
    navigate('/mylearning')
  }
}
  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson((prev) => prev - 1)
    }
  }

  return (
    <div className="space-y-6">

      <button
        type="button"
        onClick={() =>
          navigate(`/viewercoursedetails/${courseId}`)
        }
        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        ← Back to Course
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* Main Lesson */}
        <div className="space-y-6">

          <div className="overflow-hidden rounded-3xl border border-purple-100 bg-black shadow-sm">
            <div className="flex aspect-video items-center justify-center">
              <div className="text-center text-white">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-3xl">
                  ▶
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  {lesson.title}
                </h2>

                <p className="mt-2 text-sm text-gray-300">
                  {lesson.duration}
                </p>

              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <p className="text-xs font-semibold text-purple-600">
                  Lesson {currentLesson + 1} of{' '}
                  {course.lessons.length}
                </p>

                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
              </div>

              <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                In Progress
              </span>

            </div>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              {lesson.description}
            </p>

            {/* Progress */}
            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-semibold text-gray-500">
                  Course Progress
                </span>

                <span className="text-xs font-bold text-purple-600">
                  {progress}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-purple-100">

                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap justify-between gap-3">

              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentLesson === 0}
                className="rounded-xl border border-purple-100 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                {currentLesson === course.lessons.length - 1
                  ? 'Finish Course'
                  : 'Next Lesson →'}
              </button>

            </div>

          </div>

        </div>

        {/* Course Content */}
        <div className="h-fit overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">

          <div className="border-b border-purple-100 p-5">

            <h2 className="font-bold text-gray-900">
              {course.title}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {course.lessons.length} Lessons
            </p>

          </div>

          <div className="max-h-[600px] overflow-y-auto">

            {course.lessons.map((item, index) => (

              <button
                key={item.title}
                type="button"
                onClick={() => {
  setCurrentLesson(index)
  updateProgress(index)
}}
                className={`flex w-full items-center gap-3 border-b border-purple-50 p-4 text-left transition ${
                  index === currentLesson
                    ? 'bg-purple-50'
                    : 'hover:bg-purple-50'
                }`}
              >

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    index === currentLesson
                      ? 'bg-purple-600 text-white'
                      : index < currentLesson
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index < currentLesson ? '✓' : index + 1}
                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className={`text-sm font-semibold ${
                      index === currentLesson
                        ? 'text-purple-700'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.duration}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default WatchLesson