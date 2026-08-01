"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QrCodeModal } from "@/components/QrCodeModal";
import styles from "./page.module.css";

interface CreatorPageProps {
  params: Promise<{ username: string }>;
}

export default function CreatorProfile({ params }: CreatorPageProps) {
  const { username } = use(params);
  const { getCreatorByUsername, getTransactionsForCreator, addSupport } = useApp();
  const router = useRouter();

  const creator = getCreatorByUsername(username);
  const creatorTransactions = getTransactionsForCreator(username);

  // Widget States
  const [selectedQty, setSelectedQty] = useState<number | "custom">(1);
  const [customQty, setCustomQty] = useState<string>("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Modal & Success States
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!creator) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <main className={styles.main} style={{ display: "flex", alignItems: "center", padding: "100px 24px" }}>
          <div style={{ margin: "auto", textAlign: "center", maxWidth: "480px", background: "var(--bg-primary)", padding: "40px", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "64px" }}>🔍</span>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "20px 0 10px 0" }}>Page is not available yet</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "15px" }}>
              The page <strong>buymeacoffee.com/{username}</strong> hasn&apos;t been claimed. You can start this page in less than a minute!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href={`/signup?username=${username}`}
                style={{
                  display: "block",
                  background: "var(--primary)",
                  color: "#ffffff",
                  padding: "12px",
                  borderRadius: "30px",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                Claim buymeacoffee.com/{username}
              </Link>
              <Link
                href="/"
                style={{
                  display: "block",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  padding: "12px",
                  borderRadius: "30px",
                  fontWeight: 700,
                  fontSize: "15px",
                  border: "1px solid var(--border-color)",
                }}
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate quantities
  const finalQuantity = selectedQty === "custom" ? Math.max(1, parseInt(customQty) || 1) : selectedQty;
  const finalAmount = finalQuantity * creator.coffeePrice;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setIsQrOpen(true); // Open payment QR Code modal
  };

  const handlePaymentConfirm = () => {
    // Add transaction to global context state
    addSupport(creator.username, supporterName, finalQuantity, message, isPrivate);
    
    // UI flow updates
    setIsQrOpen(false);
    setIsSuccess(true);
    
    // Clear inputs
    setSupporterName("");
    setMessage("");
    setIsPrivate(false);
    setSelectedQty(1);
    setCustomQty("");

    // Hide success alert after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 6000);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "S";
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.main}>
        {/* Cover Banner Photo */}
        <div
          className={styles.coverBanner}
          style={{ backgroundImage: `url(${creator.coverPhoto})` }}
        />

        {/* Profile Details Container */}
        <div className={styles.profileContainer}>
          <div className={styles.profileLayout}>
            {/* Left Column: Creator Profile details and comments feed */}
            <div className={styles.leftColumn}>
              {/* Header profile info */}
              <div className={styles.profileHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className={styles.avatar}
                />
                <div className={styles.metaInfo}>
                  <h1 className={styles.name}>{creator.name}</h1>
                  <p className={styles.bio}>{creator.bio}</p>
                  
                  <div className={styles.statsRow}>
                    <div className={styles.statBadge}>
                      👥 {creator.supportersCount} Supporters
                    </div>
                    <div className={styles.statBadge}>
                      💰 {creator.itemEmoji} ${creator.coffeePrice} / {creator.itemNoun}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className={styles.aboutCard}>
                <h2 className={styles.sectionTitle}>About {creator.name}</h2>
                <p className={styles.aboutText}>{creator.about}</p>
              </div>

              {/* Recent Tipping Feed comments */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h2 className={styles.sectionTitle}>
                  Recent support ({creatorTransactions.length})
                </h2>

                {creatorTransactions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span>Be the first one to support {creator.name}!</span>
                  </div>
                ) : (
                  creatorTransactions.map((tx) => (
                    <div key={tx.id} className={styles.feedCard}>
                      <div className={styles.feedInitials}>
                        {tx.isPrivate ? "🕵️" : getInitials(tx.supporterName)}
                      </div>
                      <div className={styles.feedMeta}>
                        <div className={styles.feedHeader}>
                          <span className={styles.supporterTitle}>
                            {tx.isPrivate ? "Private supporter" : tx.supporterName}
                          </span>
                          <span className={styles.supporterGave}>
                            bought {tx.coffeeCount} {creator.itemNoun}
                            {tx.coffeeCount > 1 ? "s" : ""} {creator.itemEmoji}
                          </span>
                        </div>
                        
                        {tx.message && <p className={styles.feedMessage}>{tx.message}</p>}
                        
                        <span className={styles.feedTime}>{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Sticky Tipping widget form */}
            <div className={styles.rightColumn}>
              {/* If payment just completed, show success panel */}
              {isSuccess && (
                <div className={styles.successContainer} style={{ marginBottom: "20px" }}>
                  <span className={styles.successIcon}>🎉</span>
                  <h3 className={styles.successTitle}>Support Transmitted!</h3>
                  <p className={styles.successDesc}>
                    Thank you so much! Your encouragement message has been posted directly to the feed below.
                  </p>
                </div>
              )}

              <form className={styles.widgetCard} onSubmit={handleSupportSubmit}>
                <div className={styles.widgetHeader}>
                  <span>Buy {creator.name} a {creator.itemNoun}</span>
                  <span style={{ fontSize: "22px" }}>{creator.itemEmoji}</span>
                </div>

                {/* Quantity selectors */}
                <div className={styles.selectorGrid}>
                  {[1, 3, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`${styles.qtyBtn} ${
                        selectedQty === num ? styles.qtyActive : ""
                      }`}
                      onClick={() => setSelectedQty(num)}
                    >
                      <span>{num}</span>
                      <span className={styles.qtyLabel}>{creator.itemEmoji}</span>
                    </button>
                  ))}
                  
                  {/* Custom option toggle */}
                  <button
                    type="button"
                    className={`${styles.qtyBtn} ${
                      selectedQty === "custom" ? styles.qtyActive : ""
                    }`}
                    onClick={() => setSelectedQty("custom")}
                  >
                    <span>Custom</span>
                    <span className={styles.qtyLabel}>qty</span>
                  </button>
                </div>

                {/* If custom is selected, show numeric field */}
                {selectedQty === "custom" && (
                  <div className={styles.customInputWrapper}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                      Qty:
                    </span>
                    <input
                      type="number"
                      min="1"
                      className={styles.customInput}
                      placeholder="e.g. 10"
                      value={customQty}
                      onChange={(e) => setCustomQty(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Support inputs */}
                <div className={styles.inputsBox}>
                  <input
                    type="text"
                    placeholder="Name or @social (optional)"
                    className={styles.inputField}
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                  />
                  <textarea
                    placeholder="Say something nice... (optional)"
                    className={`${styles.inputField} ${styles.textareaField}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <span>Make my message private</span>
                  </label>
                </div>

                {/* Submit Support */}
                <button type="submit" className={styles.btnSupport}>
                  Support ${finalAmount}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Tipping Payment QR Modal Overlay */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onConfirm={handlePaymentConfirm}
        creatorName={creator.name}
        upiId={creator.paymentUpi}
        amount={finalAmount}
        coffeeCount={finalQuantity}
        itemNoun={creator.itemNoun}
        itemEmoji={creator.itemEmoji}
      />
    </div>
  );
}
