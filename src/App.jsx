import { useState, useEffect } from "react";
import Login from "./Login";
import MonthlyTracker from "./MonthlyTracker";
import YearlySummary from "./YearlySummary";
import { auth, db } from "./firebase";
import { saveMonthlyEntries, loadMonthlyEntries } from "./firestoreHelpers";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyEntries, setMonthlyEntries] = useState({});
  const [view, setView] = useState("monthly");

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Load username if missing
  useEffect(() => {
    if (user && !user.displayName) {
      const fetchUsername = async () => {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          user.displayName = docSnap.data().username;
          setUser({ ...user });
        }
      };
      fetchUsername();
    }
  }, [user]);

  // Load monthly entries from Firestore
  useEffect(() => {
    if (user) {
      loadMonthlyEntries(user).then((data) => {
        if (data[selectedYear]) setMonthlyEntries(data[selectedYear]);
      });
    }
  }, [user, selectedYear]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`monthlyEntries-${selectedYear}`, JSON.stringify(monthlyEntries));
  }, [monthlyEntries, selectedYear]);

  // Save to Firestore
  useEffect(() => {
    if (user) saveMonthlyEntries(user, selectedYear, monthlyEntries);
  }, [monthlyEntries, user, selectedYear]);

  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Finance Tracker</h1>
      <p style={{ textAlign: "center" }}>Welcome, {user.displayName ? user.displayName : user.email}!</p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setView("monthly")} style={{ marginRight: "10px", padding: "8px 16px" }}>Monthly Tracker</button>
        <button onClick={() => setView("yearly")} style={{ padding: "8px 16px" }}>Yearly Summary</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Select Year: </label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {view === "monthly" ? (
        <MonthlyTracker monthlyEntries={monthlyEntries} setMonthlyEntries={setMonthlyEntries} />
      ) : (
        <YearlySummary monthlyEntries={monthlyEntries} />
      )}
    </div>
  );
}

export default App;






















