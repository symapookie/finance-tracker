import React, { useState } from 'react'

export default function AddTransaction({ onAdd }) {
  const [type, setType] = useState('Expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!category.trim() || !amount) return
    const t = {
      id: Date.now(),
      type,
      category: category.trim(),
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
    }
    onAdd(t)
    setCategory('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
      <input
        type="text"
        placeholder="Category (e.g., Food)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
      />
      <button type="submit">Add</button>
    </form>
  )
}
