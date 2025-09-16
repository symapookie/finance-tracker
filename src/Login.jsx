// src/Login.jsx
import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const initYear = async (user) => {
    const yearRef = doc(db, "users", user.uid, "financeData", new Date().getFullYear().toString());
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const yearDoc = await getDoc(yearRef);
    if (!yearDoc.exists()) {
      const emptyYear = {};
      months.forEach(m => emptyYear[m] = { income: [], expense: [] });
      await setDoc(yearRef, emptyYear);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username) return alert("Fill all fields");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await initYear(user);
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
      await initYear(user); // Ensure year exists
      setUser(user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>{isRegister ? "Register" : "Login"}</h2>
      {isRegister && <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <button onClick={isRegister ? handleRegister : handleLogin} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
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



























