import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";

function App() {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [year, setYear] = useState(new Date().getFullYear()); // default to current year
  const [monthlyEntries, setMonthlyEntries] = useState({}); // store data per year

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("monthlyEntries");
    if (saved) setMonthlyEntries(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever monthlyEntries changes
  useEffect(() => {
    localStorage.setItem("monthlyEntries", JSON.stringify(monthlyEntries));
  }, [monthlyEntries]);

  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <label>
          Select Year:{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: "5px", width: "80px" }}
          />
        </label>
      </div>

      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Monthly</Link>
        <Link to="/yearly">Yearly</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <MonthlyTracker
              months={months}
              monthlyEntries={monthlyEntries[year] || Array(12).fill([])}
              setMonthlyEntries={(entries) =>
                setMonthlyEntries({ ...monthlyEntries, [year]: entries })
              }
            />
          }
        />
        <Route
          path="/yearly"
          element={
            <YearlySummary
              months={months}
              monthlyEntries={monthlyEntries[year] || Array(12).fill([])}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
















