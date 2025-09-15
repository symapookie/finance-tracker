import React, { useState } from "react";

function MonthlyTracker({ months, monthlyEntries, setMonthlyEntries }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newEntry = {
      description: description.charAt(0).toUpperCase() + description.slice(1),
      amount: parseFloat(amount),
      type,
    };

    const updatedMonthEntries = [...monthlyEntries];
    const monthData = [...updatedMonthEntries[currentMonth]];

    if (editingIndex !== null) {
      monthData[editingIndex] = newEntry;
      setEditingIndex(null);
    } else {
      monthData.push(newEntry);
    }

    updatedMonthEntries[currentMonth] = monthData;
    setMonthlyEntries(updatedMonthEntries);

    setDescription("");
    setAmount("");
  };

  const deleteEntry = (index) => {
    const updatedMonthEntries = [...monthlyEntries];
    updatedMonthEntries[currentMonth] = updatedMonthEntries[currentMonth].filter((_, i) => i !== index);
    setMonthlyEntries(updatedMonthEntries);
  };

  const editEntry = (index) => {
    const entry = monthlyEntries[currentMonth][index];
    setDescription(entry.description);
    setAmount(entry.amount);
    setType(entry.type);
    setEditingIndex(index);
  };

  const entries = monthlyEntries[currentMonth];
  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  const savings = income - expense;

  const goToPreviousMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const goToNextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "90%",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#007bff" }}>Finance Tracker</h1>

      {/* Month Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={goToPreviousMonth}>◀ Previous</button>
        <strong style={{ fontSize: "18px" }}>{months[currentMonth]}</strong>
        <button onClick={goToNextMonth}>Next ▶</button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {editingIndex !== null ? "Save" : "Add"}
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontWeight: "bold", color: "green" }}>Income: ${income}</p>
        <p style={{ fontWeight: "bold", color: "red" }}>Expense: ${expense}</p>
      </div>
      <p style={{ fontWeight: "bold", color: "#007bff" }}>Savings: ${savings}</p>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "green" }}>Income</h3>
          {entries.filter(e => e.type === "income").map((entry, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{entry.description}: ${entry.amount}</span>
              <div>
                <button onClick={() => editEntry(index)}>Edit</button>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ color: "red" }}>Expense</h3>
          {entries.filter(e => e.type === "expense").map((entry, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{entry.description}: ${entry.amount}</span>
              <div>
                <button onClick={() => editEntry(index)}>Edit</button>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonthlyTracker;
