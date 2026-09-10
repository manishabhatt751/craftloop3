import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Projects')

  const tabs = ['Projects', 'Courses', 'Skills']

  const projects = [
    {
      title: 'Brand Identity Design',
      category: 'Branding',
      status: 'Published',
    },
    {
      title: 'Social Media Campaign',
      category: 'Social Media',
      status: 'Published',
    },
    {
      title: 'Creative Poster Collection',
      category: 'Graphic Design',
      status: 'Draft',
    },
  ]

  const skills = [
    'UI/UX Design',
    'Graphic Design',
    'Branding',
    'Figma',
    'Adobe Illustrator',
    'Canva',
  ]

  return (
    <div className="profile-page">
      <div className="profile-main">

        {/* Profile Header */}
        <section className="profile-hero">

          <div className="profile-cover"></div>

          <div className="profile-info">

            <div className="profile-avatar">
              AM
            </div>

            <div className="profile-details">
              <div className="profile-name-row">
                <div>
                  <h1>Alex Morgan</h1>
                  <p>@alexmorgan</p>
                </div>

                <button
                  type="button"
                  className="edit-profile-btn"
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </button>
              </div>

              <p className="profile-bio">
                Creative designer passionate about branding,
                visual storytelling and creating meaningful experiences.
              </p>

              <div className="profile-meta">
                <span>📍 India</span>
                <span>🎨 Designer</span>
                <span>✨ Available for work</span>
              </div>
            </div>

          </div>

          {/* Profile Stats */}
          <div className="profile-stats">

            <div>
              <strong>2,480</strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>386</strong>
              <span>Following</span>
            </div>

            <div>
              <strong>24</strong>
              <span>Projects</span>
            </div>

            <div>
              <strong>12</strong>
              <span>Courses</span>
            </div>

          </div>

        </section>

        {/* Profile Content */}
        <section className="profile-content">

          {/* Left */}
          <div className="profile-left">

            <div className="profile-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? 'active-profile-tab' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Projects */}
            {activeTab === 'Projects' && (
              <div className="profile-project-grid">

                {projects.map((project, index) => (
                  <div
                    className="profile-project-card"
                    key={project.title}
                  >

                    <div
                      className={`profile-project-image project-color-${index}`}
                    >
                      <span>✦</span>
                    </div>

                    <div className="profile-project-content">
                      <span>{project.category}</span>

                      <h3>{project.title}</h3>

                      <div className="profile-project-bottom">
                        <small>{project.status}</small>
                        <button>View →</button>
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* Courses */}
            {activeTab === 'Courses' && (
              <div className="empty-profile-state">
                <div>🎓</div>
                <h3>Your Courses</h3>
                <p>
                  Courses you create will appear here.
                </p>
                <button>Create Course →</button>
              </div>
            )}

            {/* Skills */}
            {activeTab === 'Skills' && (
              <div className="skills-section">

                <h2>Skills & Expertise</h2>

                <p>
                  Showcase the skills you use in your creative work.
                </p>

                <div className="skills-list">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Right */}
          <aside className="profile-right">

            {/* Skill Profile */}
            <div className="profile-side-card">

              <div className="side-card-heading">
                <h3>Skill Profile</h3>
                <button>View</button>
              </div>

              <div className="skill-progress">
                <div>
                  <span>UI/UX Design</span>
                  <strong>85%</strong>
                </div>

                <div className="progress-track">
                  <div className="progress-fill progress-85"></div>
                </div>
              </div>

              <div className="skill-progress">
                <div>
                  <span>Graphic Design</span>
                  <strong>78%</strong>
                </div>

                <div className="progress-track">
                  <div className="progress-fill progress-78"></div>
                </div>
              </div>

              <div className="skill-progress">
                <div>
                  <span>Branding</span>
                  <strong>72%</strong>
                </div>

                <div className="progress-track">
                  <div className="progress-fill progress-72"></div>
                </div>
              </div>

            </div>

            {/* Balance */}
            <div className="profile-side-card balance-card">

              <div className="side-card-heading">
                <h3>Balance</h3>
                <span>💳</span>
              </div>

              <p>Available balance</p>

              <h2>₹12,450</h2>

              <button>View Balance →</button>

            </div>

            {/* Your Project */}
            <div className="profile-side-card">

              <div className="side-card-heading">
                <h3>Your Project</h3>
                <button>View All</button>
              </div>

              <div className="mini-project">
                <div className="mini-project-icon">✦</div>

                <div>
                  <h4>Brand Identity</h4>
                  <p>Published</p>
                </div>
              </div>

              <div className="mini-project">
                <div className="mini-project-icon second">✦</div>

                <div>
                  <h4>Poster Collection</h4>
                  <p>Draft</p>
                </div>
              </div>

            </div>

            {/* Share */}
            <button className="share-profile-btn">
              ↗ Share Profile
            </button>

          </aside>

        </section>

      </div>
    </div>
  )
}

export default Profile