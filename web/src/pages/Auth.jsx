// web/src/pages/Auth.jsx
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function AuthPage() {
  const [mode, setMode] = useState("signup"); // 'signup' | 'signin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        setMsg("✅ Account created. You are signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMsg("✅ Signed in.");
      }
    } catch (err) {
      console.error(err);
      setMsg(`❌ ${err.code || err.message}`);
    }
  };

  const onSignOut = async () => {
    try {
      await signOut(auth);
      setMsg("👋 Signed out.");
    } catch (err) {
      setMsg(`❌ ${err.code || err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontWeight: 800 }}>Account</h1>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button
          onClick={() => setMode("signup")}
          style={{ padding: "8px 12px", fontWeight: 700, border: mode === "signup" ? "2px solid #7C3AED" : "1px solid #ccc" }}
        >
          Sign Up
        </button>
        <button
          onClick={() => setMode("signin")}
          style={{ padding: "8px 12px", fontWeight: 700, border: mode === "signin" ? "2px solid #7C3AED" : "1px solid #ccc" }}
        >
          Sign In
        </button>
        <button onClick={onSignOut} style={{ padding: "8px 12px", fontWeight: 700 }}>
          Sign Out
        </button>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <button type="submit" style={{ padding: "10px 14px", fontWeight: 800, background: "#7C3AED", color: "white" }}>
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
