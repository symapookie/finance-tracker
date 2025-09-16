// src/App.jsx
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <Login setUser={setUser} />;

  return (
    <Router>
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2>Finance Tracker</h2>
          <div>
            <span>Welcome, {user.displayName || user.email}!</span>
            <button onClick={() => signOut(auth)} style={{ marginLeft: 10 }}>Logout</button>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <Link to="/">Monthly Tracker</Link>
          <Link to="/yearly">Yearly Summary</Link>
        </nav>

        <Routes>
          <Route path="/" element={<MonthlyTracker user={user} />} />
          <Route path="/yearly" element={<YearlySummary user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

































































