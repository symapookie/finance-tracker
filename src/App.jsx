import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";
import MoneyPlan from "./MoneyPlan";
import Reports from "./Reports";
import FlowChart from "./FlowChart"; // <-- import your flow chart page

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  if (!user) return <Login setUser={setUser} />;

  return (
    <Router>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Finance Tracker</h2>
          <div>
            <span>Welcome, {user.displayName || user.email}!</span>
            <button onClick={() => signOut(auth)} style={{ marginLeft: "10px" }}>Logout</button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
          <Link to="/">Monthly Tracker</Link>
          <Link to="/yearly">Yearly Summary</Link>
          <Link to="/moneyplan">Money Plan</Link>
          <Link to="/flowchart">Flow Chart</Link> {/* <-- Flow Chart link */}
          <Link to="/reports">Reports</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MonthlyTracker user={user} />} />
          <Route path="/yearly" element={<YearlySummary user={user} />} />
          <Route path="/moneyplan" element={<MoneyPlan user={user} />} />
          <Route path="/flowchart" element={<FlowChart user={user} />} /> {/* <-- Flow Chart route */}
          <Route path="/reports" element={<Reports user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




































































