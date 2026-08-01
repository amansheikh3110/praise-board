"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import styles from "../signup/signup.module.css";

export default function LoginPage() {
  const { loginCreator, currentUser } = useApp();
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = loginCreator(emailOrUsername, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>☕</div>
          <h1 className={styles.title}>Log in to your page</h1>
          <p className={styles.subtitle}>Welcome back! Enter your details below.</p>
        </div>

        {/* Error notification */}
        {error && <div className={styles.errorText}>{error}</div>}

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email or Username */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username or Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="e.g. carlos"
                className={styles.input}
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
              💡 Hint: Enter <strong>password</strong> for seeded accounts (carlos, sara, alex)
            </span>
          </div>

          {/* Submit */}
          <button type="submit" className={styles.btnSubmit}>
            Log In
          </button>
        </form>

        {/* Toggle Signup link */}
        <div className={styles.footer}>
          New to Buy Me A Coffee?{" "}
          <Link href="/signup" className={styles.footerLink}>
            Start your page
          </Link>
        </div>
      </div>
    </div>
  );
}
