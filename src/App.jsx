import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";

function App() {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const currentYear = new Date().getFullYear();

  // Load year from localStorage or use current year
  const [year, setYear] = useState(() => {
    const savedYear = localStorage.getItem("selectedYear");
    return savedYear ? Number(savedYear) : currentYear;
  });

  // Load monthlyEntries from localStorage or empty object
  const [monthlyEntries, setMonthlyEntries] = useState(() => {
    const saved = localStorage.getItem("monthlyEntries");
    return saved ? JSON.parse(saved) : {};
  });

  // Save monthlyEntries to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("monthlyEntries", JSON.stringify(monthlyEntries));
  }, [monthlyEntries]);

  // Save selected year to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedYear", year);
  }, [year]);

  // Initialize years: 10 past + current + 9 future
  const [years, setYears] = useState(() => {
    const start = currentYear - 10;
    const end = currentYear + 9;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Handle year change
  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);

    // Automatically extend years if selecting first or last 5-year boundary
    const firstYear = years[0];
    const lastYear = years[years.length - 1];

    if (selectedYear <= firstYear + 4) {
      // add 5 more years to the past
      const newYears = Array.from({ length: 5 }, (_, i) => firstYear - 5 + i);
      setYears([...newYears, ...years]);
    } else if (selectedYear >= lastYear - 4) {
      // add 5 more years to the future
      const newYears = Array.from({ length: 5 }, (_, i) => lastYear + 1 + i);
      setYears([...years, ...newYears]);
    }
  };

  return (
    <Router>
      {/* Year Selector */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <label>
          Select Year:{" "}
          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            style={{ padding: "5px", width: "120px" }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Navigation */}
      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Monthly</Link>
        <Link to="/yearly">Yearly</Link>
      </nav>

      {/* Routes */}
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


















