import { useNavigate } from 'react-router-dom'

function Balance() {
  const navigate = useNavigate()

  return (
    <div className="balance-page">
      <main className="balance-main">

        <section className="balance-header">
          <div>
            <p className="balance-label">CREATOR WALLET</p>
            <h1>Your <span>Balance</span></h1>
            <p>Track your earnings and manage your creator balance.</p>
          </div>

          <button
            className="balance-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Home
          </button>
        </section>

        <section className="balance-card">
          <div>
            <p className="balance-card-label">Available Balance</p>
            <h2>₹12,450</h2>
            <p className="balance-subtext">
              Available for withdrawal
            </p>
          </div>

          <div className="balance-wallet-icon">
            ₹
          </div>
        </section>

        <section className="balance-stats">
          <div className="balance-stat-card">
            <span>💰</span>
            <div>
              <p>Total Earnings</p>
              <h3>₹28,750</h3>
            </div>
          </div>

          <div className="balance-stat-card">
            <span>📤</span>
            <div>
              <p>Total Withdrawn</p>
              <h3>₹16,300</h3>
            </div>
          </div>

          <div className="balance-stat-card">
            <span>📈</span>
            <div>
              <p>This Month</p>
              <h3>₹4,850</h3>
            </div>
          </div>
        </section>

        <section className="balance-content">
          <div className="balance-transactions">
            <div className="balance-section-title">
              <div>
                <p className="balance-small-label">ACTIVITY</p>
                <h2>Recent Transactions</h2>
              </div>
            </div>

            <div className="transaction-item">
              <div className="transaction-icon">＋</div>
              <div>
                <h4>Logo Design Project</h4>
                <p>Today · Completed</p>
              </div>
              <strong>+₹2,500</strong>
            </div>

            <div className="transaction-item">
              <div className="transaction-icon">＋</div>
              <div>
                <h4>Poster Design</h4>
                <p>Yesterday · Completed</p>
              </div>
              <strong>+₹1,800</strong>
            </div>

            <div className="transaction-item">
              <div className="transaction-icon">−</div>
              <div>
                <h4>Withdrawal</h4>
                <p>05 Sep · Bank Transfer</p>
              </div>
              <strong className="withdrawal">−₹5,000</strong>
            </div>
          </div>

          <div className="withdraw-card">
            <p className="balance-small-label">WITHDRAW</p>
            <h2>Ready to cash out?</h2>
            <p>
              Transfer your available balance to your connected
              bank account.
            </p>

            <button className="withdraw-btn">
              Withdraw Balance
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Balance