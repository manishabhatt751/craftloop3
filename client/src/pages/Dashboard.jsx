import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <main className="dashboard-content">

          {/* Welcome */}
          <section className="welcome-section">
            <div>
              <span className="welcome-label">CREATOR DASHBOARD</span>

              <h1>Good evening, Creator 👋</h1>

              <p>
                Here's what's happening with your work today.
              </p>
            </div>

            <button className="create-new-btn">
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

                <button className="view-all-btn">
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

                <span className="message-time">10m</span>
              </div>


              <div className="message-row">
                <div className="message-avatar avatar-blue">
                  S
                </div>

                <div className="message-details">
                  <strong>Sarah Williams</strong>
                  <p>Can you share the tutorial?</p>
                </div>

                <span className="message-time">1h</span>
              </div>


              <div className="message-row">
                <div className="message-avatar avatar-pink">
                  R
                </div>

                <div className="message-details">
                  <strong>Ryan Lee</strong>
                  <p>Your project looks amazing.</p>
                </div>

                <span className="message-time">3h</span>
              </div>

            </div>


            {/* Your Projects */}
            <div className="dashboard-card">

              <div className="card-title-row">
                <div>
                  <h3>Your Projects</h3>
                  <p>Your latest creative work.</p>
                </div>

                <button className="view-all-btn">
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
          <section className="recommendations">

            <div className="recommendation-heading">

              <span>CRAFTLOOP RECOMMENDATIONS</span>

              <h2>Ideas to help you grow ✨</h2>

              <p>
                Small improvements can make a big difference to your
                creative journey.
              </p>

            </div>


            <div className="recommendation-grid">

              <div className="recommendation-card">
                <div className="recommendation-icon">🎨</div>

                <div>
                  <h3>Explore Creative Tools</h3>

                  <p>
                    Try new design and creative tools to improve your
                    workflow and discover new ideas.
                  </p>

                  <button>Explore Tools →</button>
                </div>
              </div>


              <div className="recommendation-card">
                <div className="recommendation-icon">◷</div>

                <div>
                  <h3>Manage Your Time</h3>

                  <p>
                    Break large projects into smaller tasks and create
                    a simple routine for consistent progress.
                  </p>

                  <button>View Tips →</button>
                </div>
              </div>


              <div className="recommendation-card">
                <div className="recommendation-icon">✦</div>

                <div>
                  <h3>Grow Your Skills</h3>

                  <p>
                    Learn new techniques, follow useful tutorials and
                    keep improving your creative skills.
                  </p>

                  <button>Start Learning →</button>
                </div>
              </div>


              <div className="recommendation-card">
                <div className="recommendation-icon">💡</div>

                <div>
                  <h3>Know What Users Like</h3>

                  <p>
                    Keep your designs clear, useful and visually
                    engaging to create a better experience.
                  </p>

                  <button>See Insights →</button>
                </div>
              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  )
}

export default Dashboard