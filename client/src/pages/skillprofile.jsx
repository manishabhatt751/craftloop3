import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SkillProfile() {
  const navigate = useNavigate()

  const savedProfile = JSON.parse(
    localStorage.getItem('craftloopCreatorProfile') || 'null'
  )

  const profile = savedProfile || {
    name: 'Alex Morgan',
    username: 'alexmorgan',
    profession: 'Designer',
    skills: 'UI/UX Design, Graphic Design, Branding, Figma',
  }

  const profileSkills = profile.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  const [tools, setTools] = useState([
    'Figma',
    'Canva',
    'Adobe Photoshop',
    'Adobe Illustrator',
  ])

  const [showToolInput, setShowToolInput] = useState(false)
  const [newTool, setNewTool] = useState('')

  const skills = profileSkills.map((skill, index) => ({
    name: skill,
    level: index % 2 === 0 ? 'Advanced' : 'Intermediate',
    percent: index % 2 === 0 ? 90 : 75,
  }))

  const handleAddTool = () => {
    const trimmedTool = newTool.trim()

    if (!trimmedTool) {
      return
    }

    if (tools.includes(trimmedTool)) {
      alert('This tool is already added.')
      return
    }

    setTools((prev) => [...prev, trimmedTool])
    setNewTool('')
    setShowToolInput(false)
  }

  return (
    <div className="skill-profile-page">
      <main className="skill-profile-main">

        {/* Header */}
        <section className="skill-profile-header">

          <div>
            <p className="skill-profile-label">
              CREATOR PROFILE
            </p>

            <h1>
              Skill <span>Profile</span>
            </h1>

            <p>
              Showcase your creative skills, experience and tools.
            </p>
          </div>

          <button
            type="button"
            className="skill-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>

        </section>

        {/* Creator Information */}
        <section className="skill-profile-card">

          <div className="skill-profile-avatar">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Profile"
            />
          </div>

          <div className="skill-profile-info">

            <h2>{profile.name}</h2>

            <p>@{profile.username}</p>

            <span>{profile.profession}</span>

          </div>

          <button
            type="button"
            className="skill-edit-btn"
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </button>

        </section>

        {/* Skills and Tools */}
        <section className="skill-content-grid">

          {/* Skills */}
          <div className="skills-card">

            <div className="skill-card-heading">

              <div>
                <p>MY EXPERTISE</p>
                <h2>Skills</h2>
              </div>

              <span>
                {skills.length} Skills
              </span>

            </div>

            {skills.length > 0 ? (
              skills.map((skill) => (
                <div
                  className="skill-item"
                  key={skill.name}
                >

                  <div className="skill-item-top">

                    <div>
                      <h3>{skill.name}</h3>
                      <p>{skill.level}</p>
                    </div>

                    <strong>
                      {skill.percent}%
                    </strong>

                  </div>

                  <div className="skill-progress">
                    <div
                      style={{
                        width: `${skill.percent}%`,
                      }}
                    />
                  </div>

                </div>
              ))
            ) : (
              <div className="empty-profile-state">
                <h3>No skills added yet</h3>

                <p>
                  Add your skills from Edit Profile.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/edit-profile')}
                >
                  Add Skills →
                </button>
              </div>
            )}

          </div>

          {/* Tools */}
          <div className="tools-card">

            <div className="skill-card-heading">

              <div>
                <p>TOOLS I USE</p>
                <h2>Creative Tools</h2>
              </div>

            </div>

            <div className="tools-list">

              {tools.map((tool) => (
                <div
                  className="tool-item"
                  key={tool}
                >
                  <span>✦</span>
                  {tool}
                </div>
              ))}

            </div>

            {!showToolInput && (
              <button
                type="button"
                className="add-tool-btn"
                onClick={() => setShowToolInput(true)}
              >
                + Add Tool
              </button>
            )}

            {showToolInput && (
              <div className="add-tool-form">

                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="Enter tool name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTool()
                    }
                  }}
                />

                <div>
                  <button
                    type="button"
                    onClick={handleAddTool}
                  >
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowToolInput(false)
                      setNewTool('')
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}

          </div>

        </section>

        {/* Experience */}
        <section className="experience-card">

          <div className="skill-card-heading">

            <div>
              <p>BACKGROUND</p>
              <h2>Experience & Focus</h2>
            </div>

          </div>

          <div className="experience-grid">

            <div>
              <span>🎨</span>

              <h3>Creative Design</h3>

              <p>
                Focused on creating clean, attractive and
                user-friendly visual designs.
              </p>
            </div>

            <div>
              <span>💻</span>

              <h3>Digital Products</h3>

              <p>
                Interested in UI design, digital products and
                creative web experiences.
              </p>
            </div>

            <div>
              <span>📚</span>

              <h3>Continuous Learning</h3>

              <p>
                Always improving design skills and exploring
                new creative tools.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default SkillProfile