import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({length: 21}, (_, i) => currentYear - 10 + i);

function YearlySummary({ user }) {
  const [yearData, setYearData] = useState({});
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", selectedYear.toString());

    const unsub = onSnapshot(yearRef, docSnap => {
      if (docSnap.exists()) {
        setYearData(docSnap.data());
      } else {
        // Initialize empty year
        const empty = {};
        months.forEach(m => empty[m] = { income: [], expense: [] });
        setYearData(empty);
      }
    });

    return () => unsub();
  }, [user, selectedYear]);

  const getMonthlyTotals = (month) => {
    const monthData = yearData[month] || { income: [], expense: [] };
    const income = monthData.income?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const expense = monthData.expense?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const savings = income - expense;
    return { income, expense, savings };
  };

  const yearlyTotals = months.reduce((acc, month) => {
    const { income, expense, savings } = getMonthlyTotals(month);
    acc.income += income;
    acc.expense += expense;
    acc.savings += savings;
    return acc;
  }, { income: 0, expense: 0, savings: 0 });

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px", borderRadius: "10px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Yearly Summary - {selectedYear}</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Month</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Income</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Expense</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Savings</th>
          </tr>
        </thead>
        <tbody>
          {months.map(month => {
            const { income, expense, savings } = getMonthlyTotals(month);
            return (
              <tr key={month}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{month}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${income}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${expense}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${savings}</td>
              </tr>
            )
          })}
          <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>Total</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>${yearlyTotals.income}</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>${yearlyTotals.expense}</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>${yearlyTotals.savings}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default YearlySummary;








  
  
