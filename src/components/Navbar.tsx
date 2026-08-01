"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  const { currentUser, logoutCreator } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logoutCreator();
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path ? `${styles.link} ${styles.active}` : styles.link;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <span className={styles.logoText}>buy me a coffee</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={isActive("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/creator/carlos" className={isActive("/creator/carlos")}>
              Sample Creator
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link href="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Actions */}
        <div className={styles.actions}>
          {currentUser ? (
            <div className={styles.userMenu}>
              <Link href={`/${currentUser.username}`} className={styles.userMenu}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={styles.avatar}
                />
                <span className={styles.userName}>{currentUser.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`${styles.btn} ${styles.btnOutline}`}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={`${styles.btn} ${styles.btnText}`}>
                Log in
              </Link>
              <Link href="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start my page
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`${styles.mobileMenu} ${
            mobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <Link
            href="/"
            className={isActive("/")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/creator/carlos"
            className={isActive("/creator/carlos")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sample Creator
          </Link>
          {currentUser && (
            <Link
              href="/dashboard"
              className={isActive("/dashboard")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <div className={styles.mobileActions}>
            {currentUser ? (
              <>
                <Link
                  href={`/${currentUser.username}`}
                  className={`${styles.btn} ${styles.btnOutline}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${styles.btn} ${styles.btnOutline}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start my page
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
