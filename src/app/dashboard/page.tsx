"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "./page.module.css";

export default function Dashboard() {
  const { currentUser, updateCreatorProfile, getTransactionsForCreator } = useApp();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    // Wait for context load
    const storedSession = localStorage.getItem("bmc_session");
    if (!storedSession && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [price, setPrice] = useState(5);
  const [noun, setNoun] = useState("coffee");
  const [emoji, setEmoji] = useState("☕");
  const [upi, setUpi] = useState("");

  // Feedback states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize values when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setBio(currentUser.bio);
      setAbout(currentUser.about);
      setCoverPhoto(currentUser.coverPhoto);
      setPrice(currentUser.coffeePrice);
      setNoun(currentUser.itemNoun);
      setEmoji(currentUser.itemEmoji);
      setUpi(currentUser.paymentUpi);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <main className={styles.main} style={{ display: "flex", alignItems: "center", padding: "100px 24px" }}>
          <div style={{ margin: "auto", textAlign: "center" }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "5px solid var(--border-color)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px auto"
            }} />
            <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Verifying login session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const transactions = getTransactionsForCreator(currentUser.username);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessAlert(false);

    const result = updateCreatorProfile({
      name: name.trim(),
      bio: bio.trim(),
      about: about.trim(),
      coverPhoto: coverPhoto.trim(),
      coffeePrice: Number(price) || 5,
      itemNoun: noun.trim() || "coffee",
      itemEmoji: emoji.trim() || "☕",
      paymentUpi: upi.trim() || `${currentUser.username}@upi`,
    });

    if (result.success) {
      setShowSuccessAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowSuccessAlert(false), 4000);
    }
  };

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/${currentUser.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render dashboard vector QR code
  const renderDashboardQr = () => {
    return (
      <svg
        viewBox="0 0 29 29"
        style={{ width: "100%", height: "100%", shapeRendering: "crispEdges" }}
        aria-label="Creator QR code"
      >
        <path d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z" fill="#1d1d1f" />
        <path d="M22,0 h7 v7 h-7 z M23,1 h5 v5 h-5 z M24,2 h3 v3 h-3 z" fill="#1d1d1f" />
        <path d="M0,22 h7 v7 h-7 z M1,23 h5 v5 h-5 z M2,24 h3 v3 h-3 z" fill="#1d1d1f" />
        <path
          d="M8,1 h2 v1 h-2 z M12,0 h1 v3 h-1 z M15,1 h3 v1 h-3 z M20,0 h1 v2 h-1 z
             M8,3 h1 v2 h-1 z M10,4 h4 v1 h-4 z M16,3 h2 v2 h-2 z M20,4 h1 v1 h-1 z
             M8,6 h1 v1 h-1 z M11,6 h2 v1 h-2 z M15,6 h2 v1 h-2 z M19,6 h2 v1 h-2 z
             M0,8 h3 v1 h-3 z M5,8 h4 v1 h-4 z M10,8 h2 v2 h-2 z M14,8 h3 v1 h-3 z M18,8 h4 v1 h-4 z M23,8 h2 v1 h-2 z M27,8 h2 v1 h-2 z
             M2,10 h1 v2 h-1 z M4,11 h2 v1 h-2 z M8,10 h1 v1 h-1 z M11,10 h2 v2 h-2 z M15,11 h1 v1 h-1 z M17,10 h3 v1 h-3 z M21,11 h3 v1 h-3 z M25,10 h4 v1 h-4 z
             M0,13 h2 v1 h-2 z M4,13 h1 v1 h-1 z M6,13 h2 v2 h-2 z M9,14 h3 v1 h-3 z M13,13 h2 v1 h-2 z M16,14 h2 v1 h-2 z M19,13 h1 v1 h-1 z M22,14 h4 v1 h-4 z M27,13 h2 v2 h-2 z
             M1,16 h4 v1 h-4 z M7,16 h2 v1 h-2 z M10,16 h1 v2 h-1 z M12,17 h3 v1 h-3 z M16,16 h1 v1 h-1 z M18,17 h3 v1 h-3 z M22,16 h2 v1 h-2 z M26,17 h2 v1 h-2 z
             M0,19 h2 v1 h-2 z M3,19 h2 v2 h-2 z M7,20 h2 v1 h-2 z M10,19 h3 v1 h-3 z M14,20 h1 v1 h-1 z M16,19 h2 v2 h-2 z M20,20 h1 v1 h-1 z M23,19 h1 v1 h-1 z M25,20 h3 v1 h-3 z"
          fill="#1d1d1f"
        />
        <rect x="11.5" y="11.5" width="6" height="6" rx="1" fill="#ffffff" />
        <text
          x="14.5"
          y="15.8"
          fontSize="5.5"
          fontWeight="bold"
          textAnchor="middle"
          fill="#ff813f"
        >
          ☕
        </text>
      </svg>
    );
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Success alert badge */}
          {showSuccessAlert && (
            <div className={styles.alertSuccess}>
              <span>✨</span>
              <span>Creator profile settings updated successfully! View your public link to verify changes.</span>
            </div>
          )}

          {/* Header */}
          <div className={styles.dashboardHeader}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>Welcome back, {currentUser.name}!</h1>
              <p className={styles.subtitle}>
                Manage your support tipping, change settings, or share your page links.
              </p>
            </div>
            <button
              onClick={() => router.push(`/${currentUser.username}`)}
              className={styles.btnViewPage}
            >
              👁️ View public page
            </button>
          </div>

          {/* Stats Grid cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Total Earnings</span>
                <span className={styles.statValue}>${currentUser.earnings}</span>
              </div>
              <div className={styles.statIcon} style={{ background: "#e6f9ed", color: "#34c759" }}>
                💰
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Supporters</span>
                <span className={styles.statValue}>{currentUser.supportersCount}</span>
              </div>
              <div className={styles.statIcon} style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                👥
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Page Views</span>
                <span className={styles.statValue}>{currentUser.pageViews}</span>
              </div>
              <div className={styles.statIcon} style={{ background: "#e6f0fa", color: "#007aff" }}>
                📈
              </div>
            </div>
          </div>

          {/* Core Layout Columns */}
          <div className={styles.layoutGrid}>
            {/* Left Column: Ledger/History */}
            <div className={styles.leftColumn}>
              <div className={styles.contentCard}>
                <h2 className={styles.cardTitle}>💝 Recent Support History</h2>

                {transactions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span>No donations yet. Share your URL to receive your first coffee!</span>
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.txTable}>
                      <thead>
                        <tr>
                          <th>Supporter</th>
                          <th>Donation</th>
                          <th>Amount</th>
                          <th>Message</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className={styles.txSupporter}>
                              {tx.isPrivate ? <span className={styles.txPrivate}>Private</span> : tx.supporterName}
                            </td>
                            <td>
                              {tx.coffeeCount} {currentUser.itemNoun}
                              {tx.coffeeCount > 1 ? "s" : ""} {currentUser.itemEmoji}
                            </td>
                            <td className={styles.txAmount}>${tx.amount}</td>
                            <td>
                              {tx.message ? (
                                <span className={styles.txComment} title={tx.message}>
                                  {tx.message}
                                </span>
                              ) : (
                                <span style={{ color: "var(--text-tertiary)" }}>—</span>
                              )}
                            </td>
                            <td style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>
                              {formatDate(tx.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: QR Share Widget and Settings Form */}
            <div className={styles.rightColumn}>
              {/* Share QR Panel widget */}
              <div className={styles.contentCard}>
                <h2 className={styles.cardTitle}>🔗 Share Your Link</h2>
                <div className={styles.qrWidget}>
                  <div className={styles.qrContainer}>{renderDashboardQr()}</div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Supporters can scan this QR code directly off your screen or printouts to buy you a coffee!
                  </p>
                  
                  {/* Share Link input */}
                  <div className={styles.shareLinkBox}>
                    <span className={styles.shareLinkText}>
                      buymeacoffee.com/{currentUser.username}
                    </span>
                    <button onClick={handleCopyLink} className={styles.btnCopy}>
                      {copiedLink ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Settings Form panel */}
              <div className={styles.contentCard}>
                <h2 className={styles.cardTitle}>⚙️ Profile Settings</h2>
                
                <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
                  {/* Display Name */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Display Name</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Bio Description */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Bio Headline</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>

                  {/* About Text */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>About Text (Markdown supported)</label>
                    <textarea
                      className={`${styles.inputField} ${styles.textareaField}`}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      required
                    />
                  </div>

                  {/* Banner cover url */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Cover Image URL</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      required
                    />
                  </div>

                  {/* Tipping Customizer */}
                  <div className={styles.flexInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Noun (e.g. coffee)</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={noun}
                        onChange={(e) => setNoun(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Emoji (e.g. ☕)</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.flexInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Price per unit (USD)</label>
                      <input
                        type="number"
                        min="1"
                        className={styles.inputField}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || 5)}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Your UPI ID for QR code</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={upi}
                        onChange={(e) => setUpi(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" className={styles.btnSave}>
                    Save Settings
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
