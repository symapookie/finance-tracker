import React from "react";

function YearlySummary({ months, monthlyEntries }) {
  // Compute data automatically from monthlyEntries
  const monthData = months.map((month, i) => {
    const entries = monthlyEntries[i] || [];
    const income = entries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const expense = entries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    const savings = income - expense;
    return { month, income, expense, savings };
  });

  const totalIncome = monthData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthData.reduce((sum, m) => sum + m.expense, 0);
  const totalSavings = totalIncome - totalExpense;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>📊 Yearly Summary</h1>
      <table
        style={{
          margin: "0 auto",
          borderCollapse: "collapse",
          width: "80%",
          fontSize: "1.1rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={cellStyle}>Month</th>
            <th style={cellStyle}>Income</th>
            <th style={cellStyle}>Expense</th>
            <th style={cellStyle}>Savings</th>
          </tr>
        </thead>
        <tbody>
          {monthData.map((m, index) => (
            <tr key={index}>
              <td style={cellStyle}>{m.month}</td>
              <td style={{ ...cellStyle, color: "green" }}>${m.income}</td>
              <td style={{ ...cellStyle, color: "red" }}>${m.expense}</td>
              <td style={{ ...cellStyle, color: "#007bff" }}>${m.savings}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
            <td style={cellStyle}>TOTAL</td>
            <td style={{ ...cellStyle, color: "green" }}>${totalIncome}</td>
            <td style={{ ...cellStyle, color: "red" }}>${totalExpense}</td>
            <td style={{ ...cellStyle, color: "#007bff" }}>${totalSavings}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "center",
};

export default YearlySummary;
