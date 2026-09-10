function Community() {
  return (
    <div className="community-page">

      {/* Header */}
      <section className="community-header">
        <div>
          <span>COMMUNITY</span>

          <h1>Connect with creative people ✨</h1>

          <p>
            Discover creators, explore their work and share ideas with
            the CraftLoop community.
          </p>
        </div>

        <button className="community-create-btn">
          + Share Something
        </button>
      </section>


      {/* Search */}
      <div className="community-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search creators, projects or skills..."
        />
      </div>


      {/* Community filters */}
      <div className="community-filters">

        <button className="community-filter active">
          All
        </button>

        <button className="community-filter">
          Creators
        </button>

        <button className="community-filter">
          Projects
        </button>

        <button className="community-filter">
          Design
        </button>

        <button className="community-filter">
          Tutorials
        </button>

      </div>


      {/* Content */}
      <section className="community-grid">

        {/* Creator card */}
        <article className="creator-card">

          <div className="creator-cover"></div>

          <div className="creator-content">

            <div className="creator-avatar">
              A
            </div>

            <h3>Alex Morgan</h3>

            <span className="creator-role">
              UI / UX Designer
            </span>

            <p>
              Creating simple and meaningful digital experiences.
            </p>

            <div className="creator-skills">
              <span>Figma</span>
              <span>UI Design</span>
              <span>Branding</span>
            </div>

            <button className="follow-btn">
              Follow
            </button>

          </div>

        </article>


        {/* Project card */}
        <article className="community-project-card">

          <div className="community-project-image purple-project">
            🎨
          </div>

          <div className="community-project-content">

            <div className="project-category">
              GRAPHIC DESIGN
            </div>

            <h3>Modern Brand Identity</h3>

            <p>
              A clean and modern identity concept created for a
              creative startup.
            </p>

            <div className="project-author">
              <div className="small-avatar">
                S
              </div>

              <div>
                <strong>Sarah Williams</strong>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className="project-actions">
              <button>♡ 128</button>
              <button>💬 24</button>
              <button>↗ Share</button>
            </div>

          </div>

        </article>


        {/* Project card */}
        <article className="community-project-card">

          <div className="community-project-image blue-project">
            ✦
          </div>

          <div className="community-project-content">

            <div className="project-category">
              UI DESIGN
            </div>

            <h3>Creative Dashboard Concept</h3>

            <p>
              Exploring a friendly dashboard experience with a
              minimal visual language.
            </p>

            <div className="project-author">
              <div className="small-avatar">
                R
              </div>

              <div>
                <strong>Ryan Lee</strong>
                <span>5 hours ago</span>
              </div>
            </div>

            <div className="project-actions">
              <button>♡ 94</button>
              <button>💬 16</button>
              <button>↗ Share</button>
            </div>

          </div>

        </article>


        {/* Tutorial card */}
        <article className="community-project-card">

          <div className="community-project-image pink-project">
            📚
          </div>

          <div className="community-project-content">

            <div className="project-category">
              TUTORIAL
            </div>

            <h3>Learn Better Color Combinations</h3>

            <p>
              A beginner-friendly guide to choosing colors for
              creative projects.
            </p>

            <div className="project-author">
              <div className="small-avatar">
                M
              </div>

              <div>
                <strong>Maya Chen</strong>
                <span>Yesterday</span>
              </div>
            </div>

            <div className="project-actions">
              <button>♡ 76</button>
              <button>💬 11</button>
              <button>↗ Share</button>
            </div>

          </div>

        </article>

      </section>

    </div>
  )
}

export default Community