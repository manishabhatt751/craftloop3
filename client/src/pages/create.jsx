import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

function Create() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [submittingProject, setSubmittingProject] = useState(false)
  const [submittingCourse, setSubmittingCourse] = useState(false)

  // ---------------- PROJECT FORM ----------------

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    projectType: '',
    description: '',
    skills: '',
    image: '',
  })

  useEffect(() => {
    if (location.state?.editProject) {
      const p = location.state.editProject
      setEditingProjectId(p._id || p.id)
      setProjectForm({
        title: p.title || '',
        category: p.category || '',
        projectType: p.projectType || p.type || 'Project',
        description: p.description || '',
        skills: Array.isArray(p.tags) && p.tags.length > 0
          ? p.tags.join(', ')
          : (p.skills || ''),
        image: p.image || '',
      })
      setShowProjectForm(true)
      setShowCourseForm(false)
    }
  }, [location.state])

  const handleProjectChange = (e) => {
    const { name, value } = e.target

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleProjectImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const FIVE_GB = 5000 * 1024 * 1024
    if (file.size > FIVE_GB) {
      alert('File exceeds the 5 GB limit. Maximum file size: 5 GB.')
      return
    }

    try {
      const res = await api.uploadMedia(file, 'craftloop/projects')
      if (res && res.success && res.url) {
        setProjectForm((previous) => ({
          ...previous,
          image: res.url,
        }))
        return
      }
    } catch (err) {
      console.error('Project media upload failed:', err)
      alert(err.message || 'Media upload failed. Please try again.')
    }
  }

  const handleProjectSubmit = async (e) => {
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

    try {
      setSubmittingProject(true)
      let backendProject = null
      const payload = {
        title: projectForm.title,
        category: projectForm.category,
        type:
          projectForm.projectType === 'Service'
            ? 'Service'
            : 'Project',
        projectType: projectForm.projectType,
        description: projectForm.description,
        skills: projectForm.skills || '',
        status: 'Published',
        tags: projectForm.skills
          ? projectForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        image: projectForm.image || '',
      }

      if (api.isAuthenticated()) {
        try {
          if (editingProjectId) {
            const res = await api.updateProject(editingProjectId, payload)
            if (res && res.data) {
              backendProject = res.data
            }
          } else {
            const res = await api.createProject(payload)
            if (res && res.data) {
              backendProject = res.data
            }
          }
        } catch (apiErr) {
          console.warn('Backend project error:', apiErr)
        }
      }

      const savedProjects = JSON.parse(
        localStorage.getItem('craftloopProjects') || '[]'
      )
      const projects = Array.isArray(savedProjects) ? savedProjects : []
      const finalProject = backendProject || {
        id: editingProjectId || Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      }

      const updatedProjects = editingProjectId
        ? projects.map((p) =>
            (p._id || p.id) === editingProjectId ? finalProject : p
          )
        : [finalProject, ...projects]

      localStorage.setItem(
        'craftloopProjects',
        JSON.stringify(updatedProjects)
      )

      alert(
        editingProjectId
          ? 'Project updated successfully!'
          : 'Project saved successfully!'
      )

      setProjectForm({
        title: '',
        category: '',
        projectType: '',
        description: '',
        skills: '',
        image: '',
      })
      setEditingProjectId(null)
      setShowProjectForm(false)

      navigate('/your-project')
    } catch (err) {
      console.error('Project submit error:', err)
      alert(err.message || 'Error saving project.')
    } finally {
      setSubmittingProject(false)
    }
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

  const handleCourseThumbnail = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const FIVE_GB = 5000 * 1024 * 1024
    if (file.size > FIVE_GB) {
      alert('File exceeds the 5 GB limit. Maximum file size: 5 GB.')
      return
    }

    try {
      const res = await api.uploadMedia(file, 'craftloop/courses')
      if (res && res.success && res.url) {
        setCourseForm((previous) => ({
          ...previous,
          thumbnail: res.url,
        }))
        return
      }
    } catch (err) {
      console.error('Course thumbnail upload failed:', err)
      alert(err.message || 'Thumbnail upload failed. Please try again.')
    }
  }

  const handleCourseSubmit = async (e) => {
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

    try {
      setSubmittingCourse(true)
      let backendCourse = null
      const payload = {
        title: courseForm.title,
        category: courseForm.category,
        level: courseForm.level,
        description: courseForm.description,
        thumbnail: courseForm.thumbnail || '',
        status: 'Published',
        lessons: [],
      }

      if (api.isAuthenticated()) {
        try {
          const res = await api.createCourse(payload)
          if (res && res.data) {
            backendCourse = res.data
          }
        } catch (apiErr) {
          console.warn('Backend course creation error:', apiErr)
        }
      }

      const savedCourses = JSON.parse(
        localStorage.getItem('craftloopCourses') || '[]'
      )
      const courses = Array.isArray(savedCourses)
        ? savedCourses
        : []

      const newCourse = backendCourse || {
        id: Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      }

      const updatedCourses = [
        newCourse,
        ...courses.filter(
          (c) => (c._id || c.id) !== (newCourse._id || newCourse.id)
        ),
      ]

      localStorage.setItem(
        'craftloopCourses',
        JSON.stringify(updatedCourses)
      )

      alert('Course saved successfully!')

      const targetId = newCourse._id || newCourse.id
      navigate(`/course-details?courseId=${targetId}`)
    } catch (err) {
      console.error('Course submit error:', err)
      alert(err.message || 'Error creating course.')
    } finally {
      setSubmittingCourse(false)
    }
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
                        Click to upload project media
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Upload files up to 5 GB (Maximum file size: 5 GB)
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*,video/*"
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
                        Click to upload course thumbnail / media
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Upload files up to 5 GB (Maximum file size: 5 GB)
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*,video/*"
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