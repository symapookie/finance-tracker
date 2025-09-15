import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";

function App() {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // Load monthlyEntries from localStorage if available
  const [monthlyEntries, setMonthlyEntries] = useState(() => {
    const saved = localStorage.getItem("monthlyEntries");
    return saved ? JSON.parse(saved) : Array(12).fill([]);
  });

  // Save to localStorage whenever monthlyEntries changes
  useEffect(() => {
    localStorage.setItem("monthlyEntries", JSON.stringify(monthlyEntries));
  }, [monthlyEntries]);

  return (
    <Router>
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
              monthlyEntries={monthlyEntries}
              setMonthlyEntries={setMonthlyEntries}
            />
          }
        />
        <Route
          path="/yearly"
          element={
            <YearlySummary
              months={months}
              monthlyEntries={monthlyEntries}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;















