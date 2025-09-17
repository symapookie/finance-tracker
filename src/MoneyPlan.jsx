import { useState, useEffect, useMemo } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const currentYear = new Date().getFullYear();

export default function MoneyPlan({ user }) {
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [expectedSpend, setExpectedSpend] = useState("");
  const [planData, setPlanData] = useState({});
  const [actualData, setActualData] = useState({});

  useEffect(() => {
    if (!user) return;

    const planRef = doc(db, "users", user.uid, "moneyPlan", currentYear.toString());
    const trackerRef = doc(db, "users", user.uid, "financeData", currentYear.toString());

    // Plan listener
    const unsubPlan = onSnapshot(planRef, (docSnap) => {
      if (docSnap.exists()) {
        setPlanData(docSnap.data());
      } else {
        const emptyPlan = {};
        months.forEach(m => emptyPlan[m] = { expected: 0 });
        setDoc(planRef, emptyPlan);
        setPlanData(emptyPlan);
      }
    });

    // Tracker listener
    const unsubTracker = onSnapshot(trackerRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const actual = {};
        months.forEach(m => {
          const monthData = data[m] || { income: [], expense: [] };
          const spend = monthData.expense?.reduce((sum, e) => sum + e.amount, 0) || 0;
          const income = monthData.income?.reduce((sum, e) => sum + e.amount, 0) || 0;
          actual[m] = { spend, saving: income - spend, income };
        });
        setActualData(actual);
      }
    });

    // Cleanup
    return () => {
      unsubPlan();
      unsubTracker();
    };
  }, [user]);

  const savePlan = () => {
    if (expectedSpend === "" || isNaN(expectedSpend)) return alert("Enter valid number");

    const updated = { ...planData, [month]: { expected: Number(expectedSpend) } };
    setPlanData(updated);

    const planRef = doc(db, "users", user.uid, "moneyPlan", currentYear.toString());
    setDoc(planRef, { [month]: updated[month] }, { merge: true });

    setExpectedSpend("");
  };

  // Prepare table data (memoized for performance)
  const tableData = useMemo(() => {
    return months.map(m => {
      const expected = planData[m]?.expected || 0;
      const actualSpend = actualData[m]?.spend || 0;
      const income = actualData[m]?.income || 0;
      const saving = actualData[m]?.saving || 0;
      const color = income >= actualSpend ? "green" : "red";
      return { month: m, expected, actualSpend, income, saving, color };
    });
  }, [planData, actualData]);

  return (
    <div style={{
      maxWidth: "900px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "12px",
      background: "#f9f9f9",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Money Plan - {currentYear}</h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: 20 }}>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: "6px" }}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          type="number"
          placeholder="Expected Spend"
          value={expectedSpend}
          onChange={e => setExpectedSpend(e.target.value)}
          style={{ padding: "6px" }}
        />
        <button onClick={savePlan} style={{ padding: "6px 12px", cursor: "pointer" }}>Save</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Month</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Expected Spend</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actual Spend</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Income</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Savings</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((d) => (
            <tr key={d.month}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{d.month}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${d.expected}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${d.actualSpend}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${d.income}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", color: d.color, fontWeight: "bold" }}>
                ${d.saving}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}










