import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

function Reports({ user }) {
  const [yearData, setYearData] = useState({});
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("All");

  useEffect(() => {
    if (!user) return;
    const yearRef = doc(db, "users", user.uid, "financeData", selectedYear.toString());
    const unsub = onSnapshot(yearRef, (docSnap) => {
      if (docSnap.exists()) setYearData(docSnap.data());
      else setYearData({});
    });
    return () => unsub();
  }, [user, selectedYear]);

  const getRows = () => {
    if (!yearData) return [];
    const filteredMonths = selectedMonth === "All" ? months : [selectedMonth];
    return filteredMonths.map(month => {
      const data = yearData[month] || { income: [], expense: [] };
      const income = data.income?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const expense = data.expense?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const savings = income - expense;
      return [month, income, expense, savings];
    });
  };

  const downloadCSV = () => {
    const rows = getRows();
    if (!rows.length) return alert("No data to download");

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Month,Income,Expense,Savings", ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `Finance_Report_${selectedYear}_${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const rows = getRows();
    if (!rows.length) return alert("No data to download");

    const doc = new jsPDF();
    doc.text(`Finance Report - ${selectedMonth} ${selectedYear}`, 14, 15);
    doc.autoTable({
      head: [["Month", "Income", "Expense", "Savings"]],
      body: rows.map(r => [r[0], `$${r[1]}`, `$${r[2]}`, `$${r[3]}`]),
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    doc.save(`Finance_Report_${selectedYear}_${selectedMonth}.pdf`);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Reports</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          <option value="All">All Months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        <button onClick={downloadCSV} style={{ padding: "8px 15px" }}>Download CSV</button>
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
          {getRows().map(([month, income, expense, savings]) => (
            <tr key={month}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{month}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${income}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${expense}</td>
              <td style={{
                border: "1px solid #ccc",
                padding: "8px",
                color: savings >= 0 ? "green" : "red"
              }}>${savings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;





