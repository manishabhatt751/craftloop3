import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Balance() {
  const navigate = useNavigate()
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const availableBalance = 12450

  const handleWithdraw = () => {
    const withdrawAmount = Number(amount)

    if (!withdrawAmount || withdrawAmount <= 0) {
      setMessage('Please enter a valid amount.')
      return
    }

    if (withdrawAmount > availableBalance) {
      setMessage('Amount cannot be greater than your available balance.')
      return
    }

    setMessage(
      `Withdrawal request of ₹${withdrawAmount.toLocaleString('en-IN')} submitted successfully.`
    )

    setAmount('')
    setShowWithdraw(false)
  }

  return (
    <div className="balance-page">
      <main className="balance-main">

        {/* Header */}
        <section className="balance-header">

          <div>
            <p className="balance-label">
              CREATOR WALLET
            </p>

            <h1>
              Your <span>Balance</span>
            </h1>

            <p>
              Track your earnings and manage your creator balance.
            </p>
          </div>

          <button
            type="button"
            className="balance-back-btn"
            onClick={() => navigate('/profile')}
          >
            ← Back to Profile
          </button>

        </section>

        {/* Available Balance */}
        <section className="balance-card">

          <div>
            <p className="balance-card-label">
              Available Balance
            </p>

            <h2>
              ₹{availableBalance.toLocaleString('en-IN')}
            </h2>

            <p className="balance-subtext">
              Available for withdrawal
            </p>
          </div>

          <div className="balance-wallet-icon">
            ₹
          </div>

        </section>

        {/* Stats */}
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

        {/* Content */}
        <section className="balance-content">

          {/* Transactions */}
          <div className="balance-transactions">

            <div className="balance-section-title">

              <div>
                <p className="balance-small-label">
                  ACTIVITY
                </p>

                <h2>
                  Recent Transactions
                </h2>
              </div>

            </div>

            <div className="transaction-item">

              <div className="transaction-icon">
                ＋
              </div>

              <div>
                <h4>Logo Design Project</h4>
                <p>Today · Completed</p>
              </div>

              <strong>
                +₹2,500
              </strong>

            </div>

            <div className="transaction-item">

              <div className="transaction-icon">
                ＋
              </div>

              <div>
                <h4>Poster Design</h4>
                <p>Yesterday · Completed</p>
              </div>

              <strong>
                +₹1,800
              </strong>

            </div>

            <div className="transaction-item">

              <div className="transaction-icon">
                −
              </div>

              <div>
                <h4>Withdrawal</h4>
                <p>05 Sep · Bank Transfer</p>
              </div>

              <strong className="withdrawal">
                −₹5,000
              </strong>

            </div>

          </div>

          {/* Withdraw */}
          <div className="withdraw-card">

            <p className="balance-small-label">
              WITHDRAW
            </p>

            <h2>
              Ready to cash out?
            </h2>

            <p>
              Transfer your available balance to your connected
              bank account.
            </p>

            {!showWithdraw && (
              <button
                type="button"
                className="withdraw-btn"
                onClick={() => {
                  setShowWithdraw(true)
                  setMessage('')
                }}
              >
                Withdraw Balance
              </button>
            )}

            {showWithdraw && (
              <div className="withdraw-form">

                <label>
                  Withdrawal Amount
                </label>

                <input
                  type="number"
                  min="1"
                  max={availableBalance}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setMessage('')
                  }}
                  placeholder="Enter amount"
                />

                <div className="withdraw-actions">

                  <button
                    type="button"
                    onClick={handleWithdraw}
                  >
                    Confirm Withdrawal
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdraw(false)
                      setAmount('')
                      setMessage('')
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            {message && (
              <p className="withdraw-message">
                {message}
              </p>
            )}

          </div>

        </section>

      </main>
    </div>
  )
}

export default Balance