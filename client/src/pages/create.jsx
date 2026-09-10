import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const navigate = useNavigate()

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)

  return (
    <div className="create-page">

      {/* Header */}
      <div className="create-header">
        <div>
          <span className="create-label">CREATE</span>

          <h1>Bring your ideas to life ✨</h1>

          <p>
            Create a project, service, course or tutorial and share your
            creativity with the CraftLoop community.
          </p>
        </div>
      </div>


      {/* Create Options */}
      <div className="create-options">

        {/* Project / Service */}
        <div className="create-option-card">

          <div className="create-option-icon purple">
            ✦
          </div>

          <div className="create-option-content">

            <h2>Project / Service</h2>

            <p>
              Showcase your creative work or offer your skills and
              services to other people.
            </p>

            <div className="create-tags">
              <span>Graphic Design</span>
              <span>Branding</span>
              <span>UI Design</span>
            </div>

            <button
              type="button"
              className="create-option-btn"
              onClick={() => {
                setShowProjectForm(true)
                setShowCourseForm(false)
              }}
            >
              Create Project →
            </button>

          </div>
        </div>


        {/* Course */}
        <div className="create-option-card">

          <div className="create-option-icon blue">
            ▶
          </div>

          <div className="create-option-content">

            <h2>Course / Tutorial</h2>

            <p>
              Share your knowledge through courses, tutorials and
              step-by-step creative lessons.
            </p>

            <div className="create-tags">
              <span>Video Course</span>
              <span>Tutorial</span>
              <span>Lessons</span>
            </div>

            <button
              type="button"
              className="create-option-btn"
              onClick={() => {
                setShowCourseForm(true)
                setShowProjectForm(false)
              }}
            >
              Create Course →
            </button>

          </div>
        </div>

      </div>


      {/* Project Form */}
      {showProjectForm && (
        <section className="creation-form">

          <div className="creation-form-header">

            <div>
              <span>PROJECT / SERVICE</span>

              <h2>Create your project</h2>

              <p>
                Add some details about your creative work.
              </p>
            </div>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowProjectForm(false)}
            >
              ×
            </button>

          </div>


          <form>

            {/* Project Title */}
            <div className="form-group">

              <label>Project Title</label>

              <input
                type="text"
                placeholder="Enter your project title"
              />

            </div>


            {/* Category + Project Type */}
            <div className="form-row">

              <div className="form-group">

                <label>Category</label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>

                  <option>Graphic Design</option>
                  <option>UI / UX Design</option>
                  <option>Branding</option>
                  <option>Illustration</option>
                  <option>Photography</option>
                  <option>Video Editing</option>
                  <option>Other</option>
                </select>

              </div>


              <div className="form-group">

                <label>Project Type</label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select project type
                  </option>

                  <option>Personal Project</option>
                  <option>Client Work</option>
                  <option>Service</option>
                </select>

              </div>

            </div>


            {/* Description */}
            <div className="form-group">

              <label>Description</label>

              <textarea
                rows="5"
                placeholder="Tell people about your project..."
              ></textarea>

            </div>


            {/* Skills */}
            <div className="form-group">

              <label>Skills Used</label>

              <input
                type="text"
                placeholder="Example: Photoshop, Figma, Illustrator"
              />

            </div>


            {/* Project Image */}
            <div className="form-group">

              <label>Project Image</label>

              <div className="upload-box">
                <span>＋</span>
                <strong>Upload project image</strong>
                <small>PNG, JPG or WEBP</small>
              </div>

            </div>


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowProjectForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                Save Project
              </button>

            </div>

          </form>

        </section>
      )}


      {/* Course Form */}
      {showCourseForm && (
        <section className="creation-form">

          <div className="creation-form-header">

            <div>

              <span>COURSE / TUTORIAL</span>

              <h2>Create your course</h2>

              <p>
                Share your knowledge and help others learn.
              </p>

            </div>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowCourseForm(false)}
            >
              ×
            </button>

          </div>


          <form>

            {/* Course Title */}
            <div className="form-group">

              <label>Course Title</label>

              <input
                type="text"
                placeholder="Enter your course title"
              />

            </div>


            {/* Category + Level */}
            <div className="form-row">

              <div className="form-group">

                <label>Category</label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>

                  <option>Graphic Design</option>
                  <option>UI / UX Design</option>
                  <option>Branding</option>
                  <option>Illustration</option>
                  <option>Photography</option>
                  <option>Video Editing</option>
                </select>

              </div>


              <div className="form-group">

                <label>Level</label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select level
                  </option>

                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

              </div>

            </div>


            {/* Course Description */}
            <div className="form-group">

              <label>Course Description</label>

              <textarea
                rows="5"
                placeholder="Describe what students will learn..."
              ></textarea>

            </div>


            {/* Course Thumbnail */}
            <div className="form-group">

              <label>Course Thumbnail</label>

              <div className="upload-box">
                <span>＋</span>
                <strong>Upload course thumbnail</strong>
                <small>PNG, JPG or WEBP</small>
              </div>

            </div>


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCourseForm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="publish-btn"
                onClick={() => navigate('/course-details')}
              >
                Save Course
              </button>

            </div>

          </form>

        </section>
      )}


      {/* Tips */}
      <section className="create-tips">

        <div className="create-tips-heading">

          <span>CRAFTLOOP TIP</span>

          <h2>What can you create?</h2>

          <p>
            Start with something you know and turn your creativity
            into something valuable.
          </p>

        </div>


        <div className="create-tip-grid">

          {/* Creative Projects */}
          <div className="create-tip-card">

            <div>🎨</div>

            <h3>Creative Projects</h3>

            <p>
              Share designs, illustrations, branding projects and
              other creative work.
            </p>

          </div>


          {/* Services */}
          <div className="create-tip-card">

            <div>💼</div>

            <h3>Services</h3>

            <p>
              Offer your skills and help clients with their creative
              requirements.
            </p>

          </div>


          {/* Courses */}
          <div className="create-tip-card">

            <div>📚</div>

            <h3>Courses</h3>

            <p>
              Teach your skills through structured courses and
              learning content.
            </p>

          </div>


          {/* Tutorials */}
          <div className="create-tip-card">

            <div>💡</div>

            <h3>Tutorials</h3>

            <p>
              Create simple step-by-step tutorials to help others
              learn.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Create