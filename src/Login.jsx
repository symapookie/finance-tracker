import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !username) return alert("Fill all fields");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      // Initialize empty financeData for this user
      const yearRef = doc(db, "users", user.uid, "financeData", new Date().getFullYear().toString());
      const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ];
      const emptyYear = {};
      months.forEach(m => emptyYear[m] = { income: [], expense: [] });
      await setDoc(yearRef, emptyYear);

      setUser(user);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return alert("Fill all fields");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create initial data if missing
        const yearRef = doc(db, "users", user.uid, "financeData", new Date().getFullYear().toString());
        const months = [
          "January","February","March","April","May","June",
          "July","August","September","October","November","December"
        ];
        const emptyYear = {};
        months.forEach(m => emptyYear[m] = { income: [], expense: [] });
        await setDoc(yearRef, emptyYear);
      }

      setUser(user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", borderRadius: "10px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>{isRegister ? "Register" : "Login"}</h2>
      {isRegister && <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      <button onClick={isRegister ? handleRegister : handleLogin} style={{ width: "100%", padding: "8px", marginBottom: "10px" }}>
        {isRegister ? "Register" : "Login"}
      </button>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;









