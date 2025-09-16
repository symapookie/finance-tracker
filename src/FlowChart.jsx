import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

export default function FlowChart({ user }) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [monthEntries, setMonthEntries] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fontSize, setFontSize] = useState(window.innerWidth > 768 ? 12 : 9);
  const [categoryGap, setCategoryGap] = useState(50);

  // Responsive font size & month spacing
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth > 768 ? 12 : 9);
      const gap = Math.max(50, window.innerWidth / months.length / 1.5);
      setCategoryGap(gap);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load data from Firestore
  useEffect(() => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", selectedYear.toString());
    const unsub = onSnapshot(yearRef, (docSnap) => {
      const yearData = docSnap.exists() ? docSnap.data() : {};
      const data = months.map(month => {
        const monthData = yearData[month] || { income: [], expense: [] };
        const income = monthData.income?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const expense = monthData.expense?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const savings = income - expense;
        return { month, Income: income, Expense: expense, Savings: savings, monthData };
      });
      setChartData(data);
    });
    return () => unsub();
  }, [user, selectedYear]);

  const handleBarClick = (monthData) => {
    setMonthEntries(monthData);
    setShowModal(true);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === "Income")?.value || 0;
      const expense = payload.find(p => p.dataKey === "Expense")?.value || 0;
      const savings = payload.find(p => p.dataKey === "Savings")?.value || 0;
      return (
        <div style={{ background: "#fff", padding: 10, border: "1px solid #ccc" }}>
          <strong>{label}</strong>
          <p style={{ color: "#4caf50" }}>Income: ${income}</p>
          <p style={{ color: "#f44336" }}>Expense: ${expense}</p>
          <p style={{ color: savings >= 0 ? "#2196f3" : "#ff9800" }}>Savings: ${savings}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "20px auto",
      padding: 20,
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center" }}>Finance Flow - {selectedYear}</h2>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          barCategoryGap={categoryGap} // spacing between months
          maxBarSize={40} // thicker bars
        >
          <XAxis
            dataKey="month"
            interval={0}
            tick={{ fontSize, fontWeight: 500 }}
            angle={0}
            textAnchor="middle"
            height={70}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Stacked bars with no gaps */}
          <Bar dataKey="Income" stackId="a" fill="#4caf50" onClick={d => handleBarClick(d.monthData)} />
          <Bar dataKey="Expense" stackId="a" fill="#f44336" onClick={d => handleBarClick(d.monthData)} />
          <Bar dataKey="Savings" stackId="a" onClick={d => handleBarClick(d.monthData)}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.Savings >= 0 ? "#2196f3" : "#ff9800"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Modal for month details */}
      {showModal && monthEntries && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            width: "90%",
            maxWidth: 450,
            maxHeight: "80%",
            overflowY: "auto",
            position: "relative"
          }}>
            <h3>Month Details</h3>
            <button
              style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <div>
              <h4 style={{ color: "#4caf50" }}>Income</h4>
              {monthEntries.income.length === 0 ? <p>None</p> : monthEntries.income.map((e, i) => <p key={i}>{e.description}: ${e.amount}</p>)}

              <h4 style={{ color: "#f44336" }}>Expense</h4>
              {monthEntries.expense.length === 0 ? <p>None</p> : monthEntries.expense.map((e, i) => <p key={i}>{e.description}: ${e.amount}</p>)}

              <h4 style={{
                color: monthEntries.income.reduce((sum,e)=>sum+e.amount,0) - monthEntries.expense.reduce((sum,e)=>sum+e.amount,0) >= 0 ? "#2196f3" : "#ff9800"
              }}>
                Savings: ${monthEntries.income.reduce((sum,e)=>sum+e.amount,0) - monthEntries.expense.reduce((sum,e)=>sum+e.amount,0)}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










