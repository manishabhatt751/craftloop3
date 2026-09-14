import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const navigate = useNavigate()

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)

  // ---------------- PROJECT FORM ----------------

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    projectType: '',
    description: '',
    skills: '',
    image: '',
  })

  const handleProjectChange = (e) => {
    const { name, value } = e.target

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleProjectImage = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2 MB.')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setProjectForm((previous) => ({
        ...previous,
        image: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleProjectSubmit = (e) => {
    e.preventDefault()

    if (
      !projectForm.title ||
      !projectForm.category ||
      !projectForm.projectType ||
      !projectForm.description
    ) {
      alert('Please fill all required project fields.')
      return
    }

    const savedProjects = JSON.parse(
      localStorage.getItem('craftloopProjects') || '[]'
    )

    const projects = Array.isArray(savedProjects)
      ? savedProjects
      : []

    const newProject = {
      id: Date.now(),
      title: projectForm.title,
      category: projectForm.category,
      type:
        projectForm.projectType === 'Service'
          ? 'Service'
          : 'Project',
      projectType: projectForm.projectType,
      description: projectForm.description,
      skills: projectForm.skills,
      image: projectForm.image,
      status: 'Published',
      createdAt: new Date().toISOString(),
    }

    const updatedProjects = [
      ...projects,
      newProject,
    ]

    localStorage.setItem(
      'craftloopProjects',
      JSON.stringify(updatedProjects)
    )

    alert('Project saved successfully!')

    setProjectForm({
      title: '',
      category: '',
      projectType: '',
      description: '',
      skills: '',
      image: '',
    })

    setShowProjectForm(false)

    navigate('/your-project')
  }

  // ---------------- COURSE FORM ----------------

  const [courseForm, setCourseForm] = useState({
    title: '',
    category: '',
    level: '',
    description: '',
    thumbnail: '',
  })

  const handleCourseChange = (e) => {
    const { name, value } = e.target

    setCourseForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleCourseThumbnail = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2 MB.')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setCourseForm((previous) => ({
        ...previous,
        thumbnail: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleCourseSubmit = (e) => {
    e.preventDefault()

    if (
      !courseForm.title ||
      !courseForm.category ||
      !courseForm.level ||
      !courseForm.description
    ) {
      alert('Please fill all required course fields.')
      return
    }

    const savedCourses = JSON.parse(
      localStorage.getItem('craftloopCourses') || '[]'
    )

    const courses = Array.isArray(savedCourses)
      ? savedCourses
      : []

    const newCourse = {
      id: Date.now(),
      title: courseForm.title,
      category: courseForm.category,
      level: courseForm.level,
      description: courseForm.description,
      thumbnail: courseForm.thumbnail,
      status: 'Published',
      lessons: [],
      createdAt: new Date().toISOString(),
    }

    const updatedCourses = [
      ...courses,
      newCourse,
    ]

    localStorage.setItem(
      'craftloopCourses',
      JSON.stringify(updatedCourses)
    )

    alert('Course saved successfully!')

    navigate('/course-details')
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] px-8 py-10">

      {/* PAGE HEADER */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-600">
            Creator Studio
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            Create
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Turn your skills and ideas into projects, services,
            courses and tutorials.
          </p>
        </div>

        {/* CREATE OPTIONS */}
        {!showProjectForm && !showCourseForm && (
          <div className="grid gap-6 md:grid-cols-2">

            {/* PROJECT CARD */}
            <button
              onClick={() => {
                setShowProjectForm(true)
                setShowCourseForm(false)
              }}
              className="group rounded-3xl border border-purple-100 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                🎨
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Project / Service
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                Showcase your work or offer your skills as a
                service to clients and other users.
              </p>

              <div className="mt-6 font-semibold text-purple-600">
                Create Project →
              </div>
            </button>

            {/* COURSE CARD */}
            <button
              onClick={() => {
                setShowCourseForm(true)
                setShowProjectForm(false)
              }}
              className="group rounded-3xl border border-purple-100 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                🎓
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Course / Tutorial
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                Share your knowledge by creating courses,
                tutorials and educational content.
              </p>

              <div className="mt-6 font-semibold text-purple-600">
                Create Course →
              </div>
            </button>

          </div>
        )}

        {/* ================= PROJECT FORM ================= */}

        {showProjectForm && (
          <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600">
                  CREATE
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Project / Service
                </h2>
              </div>

              <button
                onClick={() => setShowProjectForm(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
            </div>

            <form
              onSubmit={handleProjectSubmit}
              className="space-y-6"
            >

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Project Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectChange}
                  placeholder="Enter your project title"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* CATEGORY + TYPE */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={projectForm.category}
                    onChange={handleProjectChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">
                      Select category
                    </option>
                    <option value="Graphic Design">
                      Graphic Design
                    </option>
                    <option value="UI / UX Design">
                      UI / UX Design
                    </option>
                    <option value="Branding">
                      Branding
                    </option>
                    <option value="Illustration">
                      Illustration
                    </option>
                    <option value="Photography">
                      Photography
                    </option>
                    <option value="Video Editing">
                      Video Editing
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Project Type *
                  </label>

                  <select
                    name="projectType"
                    value={projectForm.projectType}
                    onChange={handleProjectChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">
                      Select type
                    </option>
                    <option value="Personal Project">
                      Personal Project
                    </option>
                    <option value="Client Work">
                      Client Work
                    </option>
                    <option value="Service">
                      Service
                    </option>
                  </select>
                </div>

              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  rows="5"
                  placeholder="Describe your project..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* SKILLS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Skills Used
                </label>

                <input
                  type="text"
                  name="skills"
                  value={projectForm.skills}
                  onChange={handleProjectChange}
                  placeholder="Example: Figma, Photoshop, Illustrator"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Project Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-10 text-center hover:bg-purple-50">

                  {projectForm.image ? (
                    <img
                      src={projectForm.image}
                      alt="Project preview"
                      className="mb-4 h-40 w-full max-w-md rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-3 text-4xl">
                        🖼️
                      </div>

                      <p className="font-semibold text-gray-700">
                        Click to upload project image
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        PNG, JPG or WEBP — Max 2 MB
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProjectImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">

                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Save Project
                </button>

              </div>

            </form>
          </div>
        )}

        {/* ================= COURSE FORM ================= */}

        {showCourseForm && (
          <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600">
                  CREATE
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Course / Tutorial
                </h2>
              </div>

              <button
                onClick={() => setShowCourseForm(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
            </div>

            <form
              onSubmit={handleCourseSubmit}
              className="space-y-6"
            >

              {/* COURSE TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Course Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={courseForm.title}
                  onChange={handleCourseChange}
                  placeholder="Enter course title"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* CATEGORY + LEVEL */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleCourseChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">
                      Select category
                    </option>
                    <option value="Graphic Design">
                      Graphic Design
                    </option>
                    <option value="UI / UX Design">
                      UI / UX Design
                    </option>
                    <option value="Branding">
                      Branding
                    </option>
                    <option value="Illustration">
                      Illustration
                    </option>
                    <option value="Photography">
                      Photography
                    </option>
                    <option value="Video Editing">
                      Video Editing
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Level *
                  </label>

                  <select
                    name="level"
                    value={courseForm.level}
                    onChange={handleCourseChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">
                      Select level
                    </option>
                    <option value="Beginner">
                      Beginner
                    </option>
                    <option value="Intermediate">
                      Intermediate
                    </option>
                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>

              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Course Description *
                </label>

                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleCourseChange}
                  rows="5"
                  placeholder="Describe what students will learn..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* THUMBNAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Course Thumbnail
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-10 text-center hover:bg-purple-50">

                  {courseForm.thumbnail ? (
                    <img
                      src={courseForm.thumbnail}
                      alt="Course thumbnail"
                      className="mb-4 h-40 w-full max-w-md rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-3 text-4xl">
                        🎓
                      </div>

                      <p className="font-semibold text-gray-700">
                        Click to upload course thumbnail
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        PNG, JPG or WEBP — Max 2 MB
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCourseThumbnail}
                    className="hidden"
                  />
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">

                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Save Course
                </button>

              </div>

            </form>
          </div>
        )}

        {/* TIPS */}
        {!showProjectForm && !showCourseForm && (
          <div className="mt-10 rounded-2xl border border-purple-100 bg-purple-50 p-6">
            <h3 className="font-bold text-gray-900">
              💡 Creator Tips
            </h3>

            <div className="mt-4 grid gap-4 text-sm text-gray-600 md:grid-cols-3">
              <p>
                <strong>Projects:</strong> Showcase your best
                work with clear descriptions.
              </p>

              <p>
                <strong>Services:</strong> Clearly explain what
                you offer to potential clients.
              </p>

              <p>
                <strong>Courses:</strong> Organize your knowledge
                into easy-to-follow lessons.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Create