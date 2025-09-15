// MonthlyTracker.jsx
import { useState } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function MonthlyTracker({ monthlyEntries, setMonthlyEntries }) {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  const handleAdd = () => {
    if (!description || !amount) return;

    const monthData = monthlyEntries[selectedMonth] || { income: [], expense: [] };
    const newEntry = { description, amount: Number(amount) };

    if (type === "Income") monthData.income.push(newEntry);
    else monthData.expense.push(newEntry);

    setMonthlyEntries({ ...monthlyEntries, [selectedMonth]: monthData });
    setDescription("");
    setAmount("");
  };

  const handleDelete = (entryType, index) => {
    const monthData = { ...monthlyEntries[selectedMonth] };
    monthData[entryType].splice(index, 1);
    setMonthlyEntries({ ...monthlyEntries, [selectedMonth]: monthData });
  };

  const monthData = monthlyEntries[selectedMonth] || { income: [], expense: [] };
  const totalIncome = monthData.income.reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = monthData.expense.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpense;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Monthly Tracker</h2>

      {/* Month selector */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Add entry */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "5px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: "5px", padding: "5px", width: "100px" }}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginRight: "5px" }}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Income & Expense Table */}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>Income</h3>
          {monthData.income.map((e, i) => (
            <div key={i}>
              {e.description}: ${e.amount}{" "}
              <button onClick={() => handleDelete("income", i)}>Delete</button>
            </div>
          ))}
          <h4>Total: ${totalIncome}</h4>
        </div>
        <div>
          <h3>Expense</h3>
          {monthData.expense.map((e, i) => (
            <div key={i}>
              {e.description}: ${e.amount}{" "}
              <button onClick={() => handleDelete("expense", i)}>Delete</button>
            </div>
          ))}
          <h4>Total: ${totalExpense}</h4>
        </div>
      </div>

      <h3 style={{ textAlign: "center" }}>Savings: ${savings}</h3>
    </div>
  );
}

export default MonthlyTracker;

