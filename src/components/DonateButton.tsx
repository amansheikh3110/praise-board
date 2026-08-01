"use client";

import React from "react";
import styles from "./DonateButton.module.css";
import { useApp } from "@/context/AppContext";

export const DonateButton: React.FC = () => {
  const { theme } = useApp();
  
  const handleDonateClick = () => {
    // Web3 / MetaMask logic will go here in the future
    alert("MetaMask connection coming soon!");
  };

  return (
    <button className={styles.donateBtn} onClick={handleDonateClick} title="Donate 5 Coffees via MetaMask">
      <span className={styles.icon}>{theme === "hacker" ? "ETH" : "☕"}</span>
      <span>Donate 5 Coffees</span>
    </button>
  );
};
