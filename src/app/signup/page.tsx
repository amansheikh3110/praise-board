"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import styles from "./signup.module.css";

function SignupForm() {
  const { registerCreator, currentUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Sync username from search params if present
  useEffect(() => {
    const urlUsername = searchParams.get("username");
    if (urlUsername) {
      setUsername(urlUsername.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    const result = registerCreator(username, name, email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>☕</div>
          <h1 className={styles.title}>Start your page</h1>
          <p className={styles.subtitle}>Create an account in less than a minute</p>
        </div>

        {/* Error notification */}
        {error && <div className={styles.errorText}>{error}</div>}

        {/* Registration Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Claim/Username */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Choose a username</label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>buymeacoffee.com/</span>
              <input
                type="text"
                placeholder="yourname"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>What should we call you?</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="e.g. Carlos Mendez"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="carlos@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          </div>

          {/* Submit */}
          <button type="submit" className={styles.btnSubmit}>
            Create Page
          </button>
        </form>

        {/* Toggle Login link */}
        <div className={styles.footer}>
          Already have a page?{" "}
          <Link href="/login" className={styles.footerLink}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.authCard} style={{ textAlign: "center" }}>Loading page parameters...</div></div>}>
      <SignupForm />
    </Suspense>
  );
}
