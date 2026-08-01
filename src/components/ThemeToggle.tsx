"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        backgroundColor: theme === "hacker" ? "#000000" : "var(--neon-yellow)",
        color: theme === "hacker" ? "#39ff14" : "#000000",
        border: theme === "hacker" ? "1px solid #39ff14" : "3px solid #000000",
        borderRadius: theme === "hacker" ? "0px" : "12px",
        padding: "12px 16px",
        boxShadow: theme === "hacker" ? "none" : "4px 4px 0px #000000",
        fontFamily: theme === "hacker" ? 'var(--font-vt323), "Courier New", Courier, monospace' : "inherit",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease"
      }}
      title="Toggle Cyber-Mode"
    >
      {theme === "hacker" ? (
        <>
          <span>🟢</span> SYSTEM DETACH
        </>
      ) : (
        <>
          <span>📟</span> ENTER TERMINAL
        </>
      )}
    </button>
  );
};
