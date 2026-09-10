import { useNavigate } from 'react-router-dom'

function YourProject() {
  const navigate = useNavigate()

  const projects = [
    {
      title: 'Brand Identity Design',
      category: 'Graphic Design',
      type: 'Project',
      description: 'Complete visual identity including logo, colors and brand assets.',
      skills: 'Branding · Figma · Illustrator',
      status: 'Published',
    },
    {
      title: 'Social Media Poster Pack',
      category: 'Flyers & Posters',
      type: 'Service',
      description: 'Creative social media posters designed for modern brands.',
      skills: 'Canva · Photoshop · Social Media',
      status: 'Published',
    },
    {
      title: 'Minimal Portfolio Website',
      category: 'Web Design',
      type: 'Project',
      description: 'A clean and modern portfolio website for creative professionals.',
      skills: 'UI Design · Figma · Web Design',
      status: 'Draft',
    },
  ]

  return (
    <div className="your-project-page">
      <main className="your-project-main">

        <section className="your-project-header">
          <div>
            <p className="your-project-label">CREATOR WORKSPACE</p>
            <h1>Your <span>Project</span></h1>
            <p>Manage and showcase the projects and services you have created.</p>
          </div>

          <div className="your-project-actions">
            <button
              className="project-back-btn"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Home
            </button>

            <button
              className="project-create-btn"
              onClick={() => navigate('/create')}
            >
              + Create New
            </button>
          </div>
        </section>

        <section className="project-summary">
          <div>
            <span>📁</span>
            <div>
              <p>Total Projects</p>
              <h3>3</h3>
            </div>
          </div>

          <div>
            <span>✓</span>
            <div>
              <p>Published</p>
              <h3>2</h3>
            </div>
          </div>

          <div>
            <span>◷</span>
            <div>
              <p>Drafts</p>
              <h3>1</h3>
            </div>
          </div>
        </section>

        <section className="projects-section">

          <div className="projects-section-heading">
            <div>
              <p className="project-small-label">MY WORK</p>
              <h2>Your Projects</h2>
            </div>

            <select defaultValue="all">
              <option value="all">All Projects</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <div className="your-project-grid">

            {projects.map((project) => (
              <article className="your-project-card" key={project.title}>

                <div className="project-preview">
                  <span>{project.category}</span>
                </div>

                <div className="project-card-content">

                  <div className="project-card-top">
                    <span className="project-type">
                      {project.type}
                    </span>

                    <span
                      className={
                        project.status === 'Published'
                          ? 'project-status published'
                          : 'project-status draft'
                      }
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="project-skills">
                    {project.skills}
                  </div>

                  <div className="project-card-actions">
                    <button>Edit</button>
                    <button>View</button>
                    <button>Share</button>
                  </div>

                </div>
              </article>
            ))}

          </div>
        </section>

        <section className="project-empty-tip">
          <div className="project-tip-icon">✨</div>

          <div>
            <h3>Keep building your portfolio</h3>
            <p>
              Add more projects and services to show your skills
              and attract new opportunities.
            </p>
          </div>

          <button onClick={() => navigate('/create')}>
            Add Project
          </button>
        </section>

      </main>
    </div>
  )
}

export default YourProject