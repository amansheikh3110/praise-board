"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>☕</span>
            <span>buy me a coffee</span>
          </div>
          <p className={styles.tagline}>
            Give your audience a way to thank you. Buy Me A Coffee makes supporting creators easy and friendly.
          </p>
          <div className={styles.socials}>
            <span className={styles.socialIcon} aria-label="Twitter">🕊️</span>
            <span className={styles.socialIcon} aria-label="Instagram">📸</span>
            <span className={styles.socialIcon} aria-label="YouTube">📺</span>
            <span className={styles.socialIcon} aria-label="GitHub">💻</span>
          </div>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Product</h4>
          <ul className={styles.links}>
            <li><Link href="/" className={styles.link}>Features</Link></li>
            <li><Link href="/" className={styles.link}>Integrations</Link></li>
            <li><Link href="/" className={styles.link}>Pricing</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Resources</h4>
          <ul className={styles.links}>
            <li><Link href="/" className={styles.link}>Help Center</Link></li>
            <li><Link href="/" className={styles.link}>Community</Link></li>
            <li><Link href="/" className={styles.link}>Creator Guidelines</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Company</h4>
          <ul className={styles.links}>
            <li><Link href="/" className={styles.link}>About Us</Link></li>
            <li><Link href="/" className={styles.link}>Careers</Link></li>
            <li><Link href="/" className={styles.link}>Brand Assets</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Buy Me A Coffee Clone. All rights reserved.</span>
        <ul className={styles.bottomLinks}>
          <li><Link href="/" className={styles.link}>Privacy Policy</Link></li>
          <li><Link href="/" className={styles.link}>Terms of Service</Link></li>
        </ul>
      </div>
    </footer>
  );
};
