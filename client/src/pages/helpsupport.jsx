import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HelpSupport() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      question: 'How do I create a project?',
      answer:
        'Go to Create from the sidebar and choose Project / Service. Add your project details and save it.'
    },
    {
      question: 'How can I edit my profile?',
      answer:
        'Open your profile menu and select Edit Profile. You can update your basic and professional information.'
    },
    {
      question: 'How can I contact another creator?',
      answer:
        'Open Messages from the sidebar and select a creator to start a conversation.'
    },
    {
      question: 'How can I share my profile?',
      answer:
        'Open your profile and use the Share option to share your creator profile.'
    },
    {
      question: 'How can I report a problem?',
      answer:
        'Use the Report a Problem option below and describe the issue you are experiencing.'
    },
  ]

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="help-page">

      <main className="help-main">

        {/* Header */}
        <section className="help-header">
          <div>
            <p className="help-label">SUPPORT CENTER</p>

            <h1>
              How can we <span>help?</span>
            </h1>

            <p>
              Find answers, explore helpful resources, or contact our support
              team.
            </p>
          </div>

          <button
            className="help-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>
        </section>

        {/* Search */}
        <div className="help-search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Quick Help */}
        <section className="help-quick-grid">

          <div className="help-quick-card">
            <div className="help-icon">📚</div>

            <h3>Getting Started</h3>

            <p>
              Learn how to create your profile, projects and courses.
            </p>

            <button>Learn More →</button>
          </div>

          <div className="help-quick-card">
            <div className="help-icon">💬</div>

            <h3>Contact Support</h3>

            <p>
              Need personal help? Send a message to our support team.
            </p>

            <button>Contact Us →</button>
          </div>

          <div className="help-quick-card">
            <div className="help-icon">🛡️</div>

            <h3>Community Guidelines</h3>

            <p>
              Learn how to keep CraftLoop friendly and respectful.
            </p>

            <button>View Guidelines →</button>
          </div>

        </section>

        {/* FAQ */}
        <section className="help-faq-section">

          <div className="help-section-heading">
            <div>
              <p className="help-small-label">FAQ</p>
              <h2>Frequently Asked Questions</h2>
            </div>

            <span>
              {filteredFaqs.length} questions
            </span>
          </div>

          <div className="faq-list">

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div className="faq-item" key={faq.question}>

                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  >
                    <span>{faq.question}</span>

                    <span className="faq-arrow">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </button>

                  {openFaq === index && (
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="no-help-results">
                <div>🔎</div>
                <h3>No results found</h3>
                <p>Try searching with a different keyword.</p>
              </div>
            )}

          </div>

        </section>

        {/* Support */}
        <section className="support-section">

          <div className="support-card">
            <div className="support-card-icon">🐛</div>

            <div>
              <h3>Report a Problem</h3>
              <p>
                Found something that isn't working correctly?
                Let us know.
              </p>
            </div>

            <button>Report Problem</button>
          </div>

          <div className="support-card">
            <div className="support-card-icon">✉️</div>

            <div>
              <h3>Still need help?</h3>
              <p>
                Our support team is here to help with your questions.
              </p>
            </div>

            <button>Contact Support</button>
          </div>

        </section>

      </main>

    </div>
  )
}

export default HelpSupport