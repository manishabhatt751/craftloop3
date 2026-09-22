import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Projects')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    username: 'alexmorgan',
    bio: 'Creative designer passionate about branding, visual storytelling and creating meaningful experiences.',
    location: 'India',
    profession: 'Designer',
    skills: 'UI/UX Design, Graphic Design, Branding, Figma',
    avatar: '',
  })

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.getProfile()
      if (res && res.success && res.data) {
        const u = res.data
        const mapped = {
          name: u.name || 'Alex Morgan',
          username: u.username || (u.email ? u.email.split('@')[0] : 'alexmorgan'),
          bio: u.bio || 'Creative designer passionate about branding and visual storytelling.',
          location: u.location || 'India',
          profession: u.title || 'Designer',
          skills: Array.isArray(u.skills)
            ? u.skills.join(', ')
            : (u.skills || 'UI/UX Design, Graphic Design, Branding, Figma'),
          avatar: u.avatar || '',
        }
        setProfile(mapped)
        // Sync cached profile for Topbar / Sidebar fallback
        localStorage.setItem('craftloopCreatorProfile', JSON.stringify(mapped))
      }
    } catch (err) {
      console.error('Failed to load profile from MongoDB:', err)
      setError('Unable to load profile from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

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

  const skills = (profile.skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  const initials = (profile.name || 'CL')
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="profile-page">
      <div className="profile-main">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-gray-600">
              Loading creator profile from MongoDB Atlas...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-700"
            >
              Retry Loading
            </button>
          </div>
        ) : null}

        {/* Profile Header */}
        <section className="profile-hero">

          <div className="profile-cover"></div>

          <div className="profile-info">

            <div className="profile-avatar">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="profile-details">

              <div className="profile-name-row">

                <div>
                  <h1>{profile.name}</h1>
                  <p>@{profile.username}</p>
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
                {profile.bio}
              </p>

              <div className="profile-meta">
                <span>📍 {profile.location}</span>
                <span>🎨 {profile.profession}</span>
                <span>✨ Available for work</span>
              </div>

            </div>

          </div>

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

          <div className="profile-left">

            {/* Tabs */}
            <div className="profile-tabs">

              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={
                    activeTab === tab
                      ? 'active-profile-tab'
                      : ''
                  }
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

                        <button
                          type="button"
                          onClick={() =>
                            navigate('/your-project')
                          }
                        >
                          View →
                        </button>

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

                <button
                  type="button"
                  onClick={() => navigate('/create')}
                >
                  Create Course →
                </button>

              </div>
            )}

            {/* Skills */}
            {activeTab === 'Skills' && (
              <div className="skills-section">

                <h2>Skills & Expertise</h2>

                <p>
                  Show the skills you use in your creative work.
                </p>

                <div className="skills-list">

                  {skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* Right Side */}
          <aside className="profile-right">

            {/* Skill Profile */}
            <div className="profile-side-card">

              <div className="side-card-heading">

                <h3>Skill Profile</h3>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/skill-profile')
                  }
                >
                  View
                </button>

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

              <button
                type="button"
                onClick={() => navigate('/balance')}
              >
                View Balance →
              </button>

            </div>

            {/* Your Project */}
            <div className="profile-side-card">

              <div className="side-card-heading">

                <h3>Your Project</h3>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/your-project')
                  }
                >
                  View All
                </button>

              </div>

              <div className="mini-project">

                <div className="mini-project-icon">
                  ✦
                </div>

                <div>
                  <h4>Brand Identity</h4>
                  <p>Published</p>
                </div>

              </div>

              <div className="mini-project">

                <div className="mini-project-icon second">
                  ✦
                </div>

                <div>
                  <h4>Poster Collection</h4>
                  <p>Draft</p>
                </div>

              </div>

            </div>

            {/* Share */}
            <button
              type="button"
              className="share-profile-btn"
              onClick={() => navigate('/share')}
            >
              ↗ Share Profile
            </button>

          </aside>

        </section>

      </div>
    </div>
  )
}

export default Profile