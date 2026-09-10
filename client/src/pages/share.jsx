import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Share() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const profileLink = 'https://craftloop.app/creator/alexmorgan'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-page">
      <main className="share-main">

        <section className="share-header">
          <div>
            <p className="share-label">SHARE YOUR WORK</p>
            <h1>Share <span>Your Profile</span></h1>
            <p>
              Let others discover your skills, projects and creative work.
            </p>
          </div>

          <button
            className="share-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>
        </section>

        <section className="share-layout">

          <div className="share-profile-card">

            <div className="share-avatar">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Profile"
              />
            </div>

            <h2>Alex Morgan</h2>
            <p className="share-username">@alexmorgan</p>

            <p className="share-bio">
              Graphic designer and creative learner passionate about
              branding, UI design and visual storytelling.
            </p>

            <div className="share-stats">
              <div>
                <strong>2.4K</strong>
                <span>Followers</span>
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

            <button
              className="view-profile-btn"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>

          </div>

          <div className="share-options-card">

            <p className="share-small-label">PROFILE LINK</p>
            <h2>Share your CraftLoop profile</h2>

            <p className="share-description">
              Copy your profile link and share it with friends,
              clients or other creators.
            </p>

            <div className="share-link-box">
              <span>{profileLink}</span>

              <button onClick={copyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="share-divider">
              <span>OR SHARE VIA</span>
            </div>

            <div className="share-social-grid">

              <button className="share-social-btn">
                <span>💬</span>
                WhatsApp
              </button>

              <button className="share-social-btn">
                <span>📧</span>
                Email
              </button>

              <button className="share-social-btn">
                <span>🔗</span>
                Copy Link
              </button>

              <button className="share-social-btn">
                <span>📱</span>
                More
              </button>

            </div>

            <div className="share-tip">
              <span>✨</span>

              <div>
                <h3>Grow your presence</h3>
                <p>
                  A complete profile helps people understand your
                  skills and discover your work.
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default Share