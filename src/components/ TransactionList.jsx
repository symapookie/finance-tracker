import React from 'react'

export default function TransactionList({ transactions }) {
  if (!transactions.length) return <p className="empty">No transactions yet.</p>

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((s, t) => s + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div>
      <div className="summary">
        <div className="summary-item">
          <div className="label">Balance</div>
          <div className="value">${balance.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Income</div>
          <div className="value income">${totalIncome.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Expense</div>
          <div className="value expense">${totalExpense.toFixed(2)}</div>
        </div>
      </div>

      <ul className="transactions">
        {transactions.map(t => (
          <li key={t.id} className={`transaction ${t.type.toLowerCase()}`}>
            <div className="left">
              <div className="category">{t.category}</div>
              <div className="date">{t.date}</div>
            </div>
            <div className="right">
              <div className="amount">${t.amount.toFixed(2)}</div>
              <div className="type">{t.type}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
