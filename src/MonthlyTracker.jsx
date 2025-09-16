// src/MonthlyTracker.jsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => CURRENT_YEAR - 10 + i);

export default function MonthlyTracker({ user }) {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [yearData, setYearData] = useState({});
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  // Listen to the current year document
  useEffect(() => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", String(selectedYear));

    const initAndListen = async () => {
      // Ensure year doc exists
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

  const monthData = yearData[selectedMonth] || { income: [], expense: [] };

  // Save current month to Firestore
  const saveMonth = async (updatedMonth) => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", String(selectedYear));

    await runTransaction(db, async (t) => {
      const snap = await t.get(yearRef);
      let newYearData = snap.exists() ? snap.data() : {};

      // Initialize missing months
      MONTHS.forEach(m => {
        if (!newYearData[m]) newYearData[m] = { income: [], expense: [] };
      });

      newYearData[selectedMonth] = updatedMonth;
      t.set(yearRef, newYearData);
    });
  };

  const addEntry = () => {
    const d = desc.trim();
    const num = Number(amount);
    if (!d || isNaN(num) || num <= 0) return alert("Enter valid description & amount");

    const updatedMonth = {
      ...monthData,
      [type]: [...(monthData[type] || []), { description: d, amount: num }]
    };

    saveMonth(updatedMonth);
    setDesc("");
    setAmount("");
  };

  const deleteEntry = (t, idx) => {
    const updatedMonth = {
      ...monthData,
      [t]: (monthData[t] || []).filter((_, i) => i !== idx)
    };
    saveMonth(updatedMonth);
  };

  const total = (t) => (monthData[t] || []).reduce((sum, e) => sum + e.amount, 0);
  const savings = total("income") - total("expense");

  return (
    <div style={{ maxWidth: 820, margin: "20px auto", padding: 18, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
      <h3 style={{ textAlign: "center" }}>{selectedMonth} {selectedYear}</h3>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 12 }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button onClick={addEntry}>Add</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", gap: 20 }}>
        <div>
          <h4>Income: ${total("income")}</h4>
          {(monthData.income || []).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", width: 320 }}>
              <div>{e.description}: ${e.amount}</div>
              <button onClick={() => deleteEntry("income", i)}>Delete</button>
            </div>
          ))}
        </div>

        <div>
          <h4>Expense: ${total("expense")}</h4>
          {(monthData.expense || []).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", width: 320 }}>
              <div>{e.description}: ${e.amount}</div>
              <button onClick={() => deleteEntry("expense", i)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <h4 style={{ textAlign: "center", marginTop: 14 }}>Savings: ${savings}</h4>
    </div>
  );
}




















