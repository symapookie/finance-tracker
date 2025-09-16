import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({length: 21}, (_, i) => currentYear - 10 + i);

function MonthlyTracker({ user }) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [monthData, setMonthData] = useState({ income: [], expense: [] });
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  // Real-time listener for the selected year
  useEffect(() => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", selectedYear.toString());

    const unsub = onSnapshot(yearRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMonthData(data[selectedMonth] || { income: [], expense: [] });
      } else {
        // Initialize year in Firestore if not exist
        const emptyYear = {};
        months.forEach(m => emptyYear[m] = { income: [], expense: [] });
        setDoc(yearRef, emptyYear);
        setMonthData(emptyYear[selectedMonth]);
      }
    });

    return () => unsub();
  }, [user, selectedYear, selectedMonth]);

  // Save month data to Firestore
  const saveMonth = (updatedMonth) => {
    setMonthData(updatedMonth);
    const yearRef = doc(db, "users", user.uid, "financeData", selectedYear.toString());
    setDoc(yearRef, { [selectedMonth]: updatedMonth }, { merge: true });
  };

  const addEntry = () => {
    if (!desc || isNaN(amount) || Number(amount) <= 0) return alert("Enter valid description & amount");
    const updatedMonth = { ...monthData, [type]: [...monthData[type], { description: desc, amount: Number(amount) }] };
    saveMonth(updatedMonth);
    setDesc(""); setAmount("");
  };

  const deleteEntry = (t, index) => {
    const updatedMonth = { ...monthData, [t]: monthData[t].filter((_, i) => i !== index) };
    saveMonth(updatedMonth);
  };

  const total = (t) => monthData[t]?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const savings = total("income") - total("expense");

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", borderRadius: "10px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h3 style={{ textAlign: "center" }}>{selectedMonth} {selectedYear}</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "15px" }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button onClick={addEntry}>Add</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h4>Income: ${total("income")}</h4>
          {monthData.income?.map((e, i) => <div key={i}>{e.description}: ${e.amount} <button onClick={() => deleteEntry("income", i)}>Delete</button></div>)}
        </div>
        <div>
          <h4>Expense: ${total("expense")}</h4>
          {monthData.expense?.map((e, i) => <div key={i}>{e.description}: ${e.amount} <button onClick={() => deleteEntry("expense", i)}>Delete</button></div>)}
        </div>
      </div>
      <h4 style={{ textAlign: "center" }}>Savings: ${savings}</h4>
    </div>
  );
}

export default MonthlyTracker;






