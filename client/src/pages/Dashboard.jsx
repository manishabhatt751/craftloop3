import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-content">

      {/* Welcome */}
      <section className="welcome-section">
        <div>
          <span className="welcome-label">CREATOR DASHBOARD</span>

          <h1>Good evening, Creator 👋</h1>

          <p>
            Here's what's happening with your work today.
          </p>
        </div>

        <button
          type="button"
          className="create-new-btn"
          onClick={() => navigate('/create')}
        >
          + Create New
        </button>
      </section>


      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-header">
            <span>Followers</span>
            <span className="stat-icon">♧</span>
          </div>

          <h2>2,480</h2>

          <p className="stat-growth">
            ↑ 12.5% <span>this month</span>
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-header">
            <span>Profile Views</span>
            <span className="stat-icon">◉</span>
          </div>

          <h2>8,642</h2>

          <p className="stat-growth">
            ↑ 8.2% <span>this month</span>
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-header">
            <span>Likes</span>
            <span className="stat-icon">♡</span>
          </div>

          <h2>1,294</h2>

          <p className="stat-growth">
            ↑ 18.4% <span>this month</span>
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-header">
            <span>Messages</span>
            <span className="stat-icon">✉</span>
          </div>

          <h2>36</h2>

          <p className="message-growth">
            ● 5 new messages
          </p>
        </div>

      </section>


      {/* Messages + Projects */}
      <section className="dashboard-two-column">

        {/* Recent Messages */}
        <div className="dashboard-card">

          <div className="card-title-row">
            <div>
              <h3>Recent Messages</h3>
              <p>Stay connected with your community.</p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate('/messages')}
            >
              View All
            </button>
          </div>


          <div className="message-row">
            <div className="message-avatar avatar-purple">
              A
            </div>

            <div className="message-details">
              <strong>Alex Morgan</strong>
              <p>Loved your latest design project!</p>
            </div>

            <span className="message-time">10m ago</span>
          </div>


          <div className="message-row">
            <div className="message-avatar avatar-blue">
              S
            </div>

            <div className="message-details">
              <strong>Sarah Williams</strong>
              <p>Can we collaborate on the branding task?</p>
            </div>

            <span className="message-time">1h ago</span>
          </div>


          <div className="message-row">
            <div className="message-avatar avatar-pink">
              R
            </div>

            <div className="message-details">
              <strong>Ryan Lee</strong>
              <p>Thanks for sharing the creative tutorial.</p>
            </div>

            <span className="message-time">Yesterday</span>
          </div>

        </div>


        {/* Your Projects */}
        <div className="dashboard-card">

          <div className="card-title-row">
            <div>
              <h3>Your Projects</h3>
              <p>Your latest creative work.</p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate('/your-project')}
            >
              View All
            </button>
          </div>


          <div className="project-row">

            <div className="project-thumbnail purple-thumb">
              🎨
            </div>

            <div className="project-details">
              <strong>Brand Identity Design</strong>
              <p>Graphic Design • 2 days ago</p>
            </div>

            <span className="project-status published">
              Published
            </span>

          </div>


          <div className="project-row">

            <div className="project-thumbnail blue-thumb">
              ✦
            </div>

            <div className="project-details">
              <strong>Social Media Kit</strong>
              <p>Branding • 5 days ago</p>
            </div>

            <span className="project-status published">
              Published
            </span>

          </div>


          <div className="project-row">

            <div className="project-thumbnail pink-thumb">
              ✎
            </div>

            <div className="project-details">
              <strong>Creative Portfolio</strong>
              <p>UI Design • 1 week ago</p>
            </div>

            <span className="project-status draft">
              Draft
            </span>

          </div>

        </div>

      </section>


      {/* Recommendations */}
      <section className="dashboard-recommendations">

        <div className="dashboard-card">

          <div className="card-title-row">
            <div>
              <h3>Recommended for You</h3>
              <p>Expand your skills and grow faster on CraftLoop.</p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate('/community')}
            >
              Explore
            </button>
          </div>


          <div className="recommendation-grid">

            <div className="recommendation-card">
              <div className="recommendation-icon">
                ✦
              </div>

              <div>
                <h3>Connect with Top Designers</h3>

                <p>
                  Discover trending designers and see what projects are
                  getting the most engagement.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/community')}
                >
                  Discover Creators →
                </button>
              </div>
            </div>


            <div className="recommendation-card">
              <div className="recommendation-icon">
                ✎
              </div>

              <div>
                <h3>Share a New Creative Project</h3>

                <p>
                  Publish your latest ideas, tutorials or services to get
                  more eyes on your profile.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/create')}
                >
                  Create Now →
                </button>
              </div>
            </div>


            <div className="recommendation-card">
              <div className="recommendation-icon">
                ◉
              </div>

              <div>
                <h3>Know What Users Like</h3>

                <p>
                  Keep your designs clear, useful and visually
                  engaging to create a better experience.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/ai-chat')}
                >
                  Ask AI Assistant →
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard