// src/YearlySummary.jsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => CURRENT_YEAR - 10 + i);

export default function YearlySummary({ user }) {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [yearData, setYearData] = useState({});

  useEffect(() => {
    if (!user) return;

    const yearRef = doc(db, "users", user.uid, "financeData", String(selectedYear));

    const initAndListen = async () => {
      // Ensure year document exists
      await runTransaction(db, async (t) => {
        const snap = await t.get(yearRef);
        if (!snap.exists()) {
          const empty = {};
          MONTHS.forEach(m => empty[m] = { income: [], expense: [] });
          t.set(yearRef, empty);
        }
      });

      return onSnapshot(yearRef, (snap) => {
        setYearData(snap.exists() ? snap.data() : {});
      });
    };

    const unsubscribe = initAndListen();

    return () => { if (unsubscribe && typeof unsubscribe === "function") unsubscribe(); };
  }, [user, selectedYear]);

  const getMonthlyTotals = (month) => {
    const m = yearData[month] || { income: [], expense: [] };
    const income = (m.income || []).reduce((sum, e) => sum + e.amount, 0);
    const expense = (m.expense || []).reduce((sum, e) => sum + e.amount, 0);
    return { income, expense, savings: income - expense };
  };

  const yearlyTotals = MONTHS.reduce((acc, month) => {
    const t = getMonthlyTotals(month);
    acc.income += t.income;
    acc.expense += t.expense;
    acc.savings += t.savings;
    return acc;
  }, { income: 0, expense: 0, savings: 0 });

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
      <h2 style={{ textAlign: "center" }}>Yearly Summary - {selectedYear}</h2>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Month</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Income</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Expense</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Savings</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map(month => {
            const { income, expense, savings } = getMonthlyTotals(month);
            return (
              <tr key={month}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{month}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>${income}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>${expense}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>${savings}</td>
              </tr>
            );
          })}

          {/* Yearly totals row */}
          <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Total</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>${yearlyTotals.income}</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>${yearlyTotals.expense}</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>${yearlyTotals.savings}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}










  
  












  
  
