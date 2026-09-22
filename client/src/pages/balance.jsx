import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Balance() {
  const navigate = useNavigate()
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)
  const [wallet, setWallet] = useState({
    availableBalance: 0,
    totalEarnings: 0,
    totalWithdrawn: 0,
    thisMonth: 0,
    transactions: [],
  })

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const res = await api.getWallet()
      if (res && res.success) {
        setWallet({
          availableBalance: res.availableBalance || 0,
          totalEarnings: res.totalEarnings || 0,
          totalWithdrawn: res.totalWithdrawn || 0,
          thisMonth: res.thisMonth || 0,
          transactions: Array.isArray(res.transactions) ? res.transactions : [],
        })
      }
    } catch (err) {
      console.error('Failed to fetch wallet:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  const availableBalance = wallet.availableBalance

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount)

    if (!withdrawAmount || withdrawAmount <= 0) {
      setIsError(true)
      setMessage('Please enter a valid amount.')
      return
    }

    if (withdrawAmount > availableBalance) {
      setIsError(true)
      setMessage('Amount cannot be greater than your available balance.')
      return
    }

    try {
      setWithdrawing(true)
      setIsError(false)
      const res = await api.withdrawBalance({ amount: withdrawAmount })
      if (res && res.success) {
        setMessage(
          res.message ||
            `Withdrawal request of ₹${withdrawAmount.toLocaleString('en-IN')} submitted successfully.`
        )
        setAmount('')
        setShowWithdraw(false)
        fetchWallet()
      } else {
        setIsError(true)
        setMessage(res?.message || 'Withdrawal failed. Please try again.')
      }
    } catch (err) {
      setIsError(true)
      setMessage(err?.message || 'Withdrawal failed. Please try again.')
    } finally {
      setWithdrawing(false)
    }
  }

  const formatTxDate = (dateStr) => {
    if (!dateStr) return 'Recent'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      })
    } catch {
      return 'Recent'
    }
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
              {loading ? '...' : `₹${availableBalance.toLocaleString('en-IN')}`}
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
              <h3>
                {loading ? '...' : `₹${wallet.totalEarnings.toLocaleString('en-IN')}`}
              </h3>
            </div>
          </div>

          <div className="balance-stat-card">
            <span>📤</span>
            <div>
              <p>Total Withdrawn</p>
              <h3>
                {loading ? '...' : `₹${wallet.totalWithdrawn.toLocaleString('en-IN')}`}
              </h3>
            </div>
          </div>

          <div className="balance-stat-card">
            <span>📈</span>
            <div>
              <p>This Month</p>
              <h3>
                {loading ? '...' : `₹${wallet.thisMonth.toLocaleString('en-IN')}`}
              </h3>
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

            {wallet.transactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                <p>No transactions yet.</p>
                <p className="mt-1 text-xs text-gray-400">
                  Sales, tips, and withdrawals will appear here automatically.
                </p>
              </div>
            ) : (
              wallet.transactions.map((tx) => {
                const isWithdrawal = tx.type === 'withdrawal'
                return (
                  <div key={tx._id || tx.id} className="transaction-item">
                    <div className="transaction-icon">
                      {isWithdrawal ? '−' : '＋'}
                    </div>

                    <div>
                      <h4>{tx.description || (isWithdrawal ? 'Withdrawal' : 'Earning')}</h4>
                      <p>
                        {formatTxDate(tx.createdAt)} · {tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Completed'}
                      </p>
                    </div>

                    <strong className={isWithdrawal ? 'withdrawal' : ''}>
                      {isWithdrawal ? '−' : '+'}₹{(Number(tx.amount) || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                )
              })
            )}
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
                  setIsError(false)
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
                    setIsError(false)
                  }}
                  placeholder="Enter amount"
                />

                <div className="withdraw-actions">
                  <button
                    type="button"
                    disabled={withdrawing}
                    onClick={handleWithdraw}
                  >
                    {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                  </button>

                  <button
                    type="button"
                    disabled={withdrawing}
                    onClick={() => {
                      setShowWithdraw(false)
                      setAmount('')
                      setMessage('')
                      setIsError(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {message && (
              <p className={isError ? 'withdraw-message text-red-500' : 'withdraw-message'}>
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