"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PipboyClock } from "@/components/PipboyClock";
import styles from "./page.module.css";

const typedRoles = ["Youtubers.", "Artists.", "Podcasters.", "Developers.", "Writers."];

export default function Home() {
  const { creators } = useApp();
  const router = useRouter();
  const [claimName, setClaimName] = useState("");
  const [error, setError] = useState("");
  
  // Dynamic typing effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeWord = typedRoles[roleIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
      }, 100);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500); // Wait before delete
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % typedRoles.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = claimName.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
    
    if (!cleanName) {
      setError("Please enter a valid page name");
      return;
    }
    
    // Check if creator username already exists
    const match = creators.find(c => c.username === cleanName);
    if (match) {
      // Direct view of existing page
      router.push(`/${cleanName}`);
    } else {
      // Redirect to signup with pre-filled name
      router.push(`/signup?username=${cleanName}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            {/* Left: Pip-boy Clock Widget */}
            <div className={styles.heroLeft}>
              <PipboyClock />
            </div>

            {/* Right: Landing page taglines and actions */}
            <div className={styles.heroRight}>
              <div className={styles.badge}>🎁 100% Free for Creators</div>
              <h1 className={styles.title}>
                Fund your creative work with support from your fans for{" "}
                <span className={styles.titleHighlight}>
                  {currentText}
                  <span style={{ opacity: 0.7, marginLeft: "2px" }}>|</span>
                </span>
              </h1>
              <p className={styles.subtitle}>
                Accept support tips, offer monthly memberships, and sell custom products.
                Establish a direct payment link with your audience.
              </p>

              {/* URL Claim Input */}
              <form className={styles.claimContainer} onSubmit={handleClaim}>
                <span className={styles.prefix}>buymeacoffee.com/</span>
                <input
                  type="text"
                  placeholder="yourname"
                  className={styles.input}
                  value={claimName}
                  onChange={(e) => {
                    setClaimName(e.target.value);
                    if (error) setError("");
                  }}
                />
                <button type="submit" className={styles.btnClaim}>
                  Claim Page
                </button>
              </form>
              {error && <span className={styles.errorText}>{error}</span>}

              {/* Interactive quick count dashboard */}
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>1M+</span>
                  <span>creators trust us</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>$200M+</span>
                  <span>earned by creators</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0%</span>
                  <span>platform fee option</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Designed for creators, by creators</h2>
            <p className={styles.sectionSubtitle}>
              Skip high fees and direct integrations. Everything you need is set up in minutes.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💝</div>
              <h3 className={styles.featureTitle}>Support Tipping</h3>
              <p className={styles.featureDesc}>
                Let supporters buy you a coffee, pizza, or tea. Simple 1-click payments via QR code interfaces.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h3 className={styles.featureTitle}>Memberships</h3>
              <p className={styles.featureDesc}>
                Set up recurring subscriptions. Share exclusive content, posts, or source codes with premium tiers.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛍️</div>
              <h3 className={styles.featureTitle}>Extras Shop</h3>
              <p className={styles.featureDesc}>
                Sell digital downloads, zoom consultancies, design assets, or physical merchandise directly.
              </p>
            </div>
          </div>
        </section>

        {/* Creators Showcase Section */}
        <section className={styles.showcaseSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Creators loved by the community</h2>
            <p className={styles.sectionSubtitle}>
              Browse actual creators and see how they customize their pages.
            </p>
          </div>

          <div className={styles.creatorGrid}>
            {creators.map((creator) => (
              <div
                key={creator.username}
                className={styles.creatorCard}
                onClick={() => router.push(`/${creator.username}`)}
              >
                {/* Banner */}
                <div
                  className={styles.cardBanner}
                  style={{ backgroundImage: `url(${creator.coverPhoto})` }}
                />
                
                {/* Creator Meta */}
                <div className={styles.cardContent}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className={styles.cardAvatar}
                  />
                  <h3 className={styles.creatorName}>{creator.name}</h3>
                  <p className={styles.creatorBio}>{creator.bio}</p>
                  
                  <button className={styles.btnView}>
                    Support
                  </button>

                  <div className={styles.cardStats}>
                    <span>{creator.supportersCount} Supporters</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                      {creator.itemEmoji} ${creator.coffeePrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
