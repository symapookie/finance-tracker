// src/App.jsx
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";
import FlowChart from "./FlowChart"; // NEW PAGE

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
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Finance Tracker</h2>
          <div>
            <span>Welcome, {user.displayName || user.email}!</span>
            <button onClick={() => signOut(auth)} style={{ marginLeft: "10px" }}>Logout</button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <Link to="/">Monthly Tracker</Link>
          <Link to="/yearly">Yearly Summary</Link>
          <Link to="/flow">Finance Flow</Link> {/* NEW LINK */}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MonthlyTracker user={user} />} />
          <Route path="/yearly" element={<YearlySummary user={user} />} />
          <Route path="/flow" element={<FlowChart user={user} />} /> {/* NEW ROUTE */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


































































