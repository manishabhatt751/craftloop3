import { useNavigate } from 'react-router-dom'

function SkillProfile() {
  const navigate = useNavigate()

  const skills = [
    { name: 'Graphic Design', level: 'Advanced', percent: 90 },
    { name: 'UI/UX Design', level: 'Intermediate', percent: 75 },
    { name: 'Branding', level: 'Advanced', percent: 85 },
    { name: 'Social Media Design', level: 'Advanced', percent: 88 },
  ]

  const tools = [
    'Figma',
    'Canva',
    'Adobe Photoshop',
    'Adobe Illustrator',
  ]

  return (
    <div className="skill-profile-page">
      <main className="skill-profile-main">

        <section className="skill-profile-header">
          <div>
            <p className="skill-profile-label">CREATOR PROFILE</p>
            <h1>Skill <span>Profile</span></h1>
            <p>
              Showcase your creative skills, experience and tools.
            </p>
          </div>

          <button
            className="skill-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>
        </section>

        <section className="skill-profile-card">

          <div className="skill-profile-avatar">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Profile"
            />
          </div>

          <div className="skill-profile-info">
            <h2>Alex Morgan</h2>
            <p>@alexmorgan</p>
            <span>Graphic Designer</span>
          </div>

          <button
            className="skill-edit-btn"
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </button>

        </section>

        <section className="skill-content-grid">

          <div className="skills-card">
            <div className="skill-card-heading">
              <div>
                <p>MY EXPERTISE</p>
                <h2>Skills</h2>
              </div>

              <span>4 Skills</span>
            </div>

            {skills.map((skill) => (
              <div className="skill-item" key={skill.name}>

                <div className="skill-item-top">
                  <div>
                    <h3>{skill.name}</h3>
                    <p>{skill.level}</p>
                  </div>

                  <strong>{skill.percent}%</strong>
                </div>

                <div className="skill-progress">
                  <div
                    style={{ width: `${skill.percent}%` }}
                  />
                </div>

              </div>
            ))}
          </div>

          <div className="tools-card">

            <div className="skill-card-heading">
              <div>
                <p>TOOLS I USE</p>
                <h2>Creative Tools</h2>
              </div>
            </div>

            <div className="tools-list">
              {tools.map((tool) => (
                <div className="tool-item" key={tool}>
                  <span>✦</span>
                  {tool}
                </div>
              ))}
            </div>

            <button className="add-tool-btn">
              + Add Tool
            </button>

          </div>

        </section>

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