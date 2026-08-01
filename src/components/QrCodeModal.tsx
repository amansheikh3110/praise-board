"use client";

import React from "react";
import styles from "./QrCodeModal.module.css";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creatorName: string;
  upiId: string;
  amount: number;
  coffeeCount: number;
  itemNoun: string;
  itemEmoji: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  creatorName,
  upiId,
  amount,
  coffeeCount,
  itemNoun,
  itemEmoji,
}) => {
  if (!isOpen) return null;

  // Render a mock QR code layout in vector SVG format
  const renderQrCodeSvg = () => {
    return (
      <svg
        viewBox="0 0 29 29"
        style={{ width: "100%", height: "100%", shapeRendering: "crispEdges" }}
        aria-label="Payment QR Code Grid"
      >
        {/* Alignment cubes - Top Left */}
        <path d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z" fill="#1d1d1f" />
        {/* Alignment cubes - Top Right */}
        <path d="M22,0 h7 v7 h-7 z M23,1 h5 v5 h-5 z M24,2 h3 v3 h-3 z" fill="#1d1d1f" />
        {/* Alignment cubes - Bottom Left */}
        <path d="M0,22 h7 v7 h-7 z M1,23 h5 v5 h-5 z M2,24 h3 v3 h-3 z" fill="#1d1d1f" />
        
        {/* Mock QR data bits */}
        <path
          d="M8,1 h2 v1 h-2 z M12,0 h1 v3 h-1 z M15,1 h3 v1 h-3 z M20,0 h1 v2 h-1 z
             M8,3 h1 v2 h-1 z M10,4 h4 v1 h-4 z M16,3 h2 v2 h-2 z M20,4 h1 v1 h-1 z
             M8,6 h1 v1 h-1 z M11,6 h2 v1 h-2 z M15,6 h2 v1 h-2 z M19,6 h2 v1 h-2 z
             M0,8 h3 v1 h-3 z M5,8 h4 v1 h-4 z M10,8 h2 v2 h-2 z M14,8 h3 v1 h-3 z M18,8 h4 v1 h-4 z M23,8 h2 v1 h-2 z M27,8 h2 v1 h-2 z
             M2,10 h1 v2 h-1 z M4,11 h2 v1 h-2 z M8,10 h1 v1 h-1 z M11,10 h2 v2 h-2 z M15,11 h1 v1 h-1 z M17,10 h3 v1 h-3 z M21,11 h3 v1 h-3 z M25,10 h4 v1 h-4 z
             M0,13 h2 v1 h-2 z M4,13 h1 v1 h-1 z M6,13 h2 v2 h-2 z M9,14 h3 v1 h-3 z M13,13 h2 v1 h-2 z M16,14 h2 v1 h-2 z M19,13 h1 v1 h-1 z M22,14 h4 v1 h-4 z M27,13 h2 v2 h-2 z
             M1,16 h4 v1 h-4 z M7,16 h2 v1 h-2 z M10,16 h1 v2 h-1 z M12,17 h3 v1 h-3 z M16,16 h1 v1 h-1 z M18,17 h3 v1 h-3 z M22,16 h2 v1 h-2 z M26,17 h2 v1 h-2 z
             M0,19 h2 v1 h-2 z M3,19 h2 v2 h-2 z M7,20 h2 v1 h-2 z M10,19 h3 v1 h-3 z M14,20 h1 v1 h-1 z M16,19 h2 v2 h-2 z M20,20 h1 v1 h-1 z M23,19 h1 v1 h-1 z M25,20 h3 v1 h-3 z
             M8,22 h2 v1 h-2 z M11,23 h3 v1 h-3 z M16,22 h1 v1 h-1 z M18,22 h2 v2 h-2 z M21,23 h1 v1 h-1 z
             M8,25 h1 v2 h-1 z M10,26 h2 v1 h-2 z M13,25 h2 v1 h-2 z M16,26 h3 v1 h-3 z M20,25 h2 v1 h-2 z
             M8,28 h3 v1 h-3 z M12,28 h2 v1 h-2 z M16,28 h1 v1 h-1 z M19,28 h2 v1 h-2 z"
          fill="#1d1d1f"
        />

        {/* Small brand icon in center of QR */}
        <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" fill="#ffffff" />
        <text
          x="14.5"
          y="16"
          fontSize="5.5"
          fontWeight="bold"
          textAnchor="middle"
          fill="#ff813f"
          style={{ fontFamily: "sans-serif" }}
        >
          ☕
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <span className={styles.title}>Send Tip to {creatorName}</span>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.content}>
          {/* Ticket Receipt */}
          <div className={styles.receipt}>
            <div className={styles.receiptItem}>
              <span className={styles.receiptLabel}>Gifting</span>
              <span className={styles.receiptValue}>
                {coffeeCount} {itemNoun}
                {coffeeCount > 1 ? "s" : ""} {itemEmoji}
              </span>
            </div>
            <div className={styles.receiptItem} style={{ alignItems: "flex-end" }}>
              <span className={styles.receiptLabel}>Total Cost</span>
              <span className={styles.receiptValue} style={{ color: "var(--primary)", fontSize: "18px" }}>
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className={styles.qrContainer}>
            <div className={styles.qrWrapper}>{renderQrCodeSvg()}</div>
            <div className={styles.qrScanLine} />
          </div>

          {/* UPI Address Details */}
          <div className={styles.details}>
            <span className={styles.receiptLabel}>Scan or pay UPI ID</span>
            <span className={styles.upiText}>{upiId}</span>
          </div>

          {/* Scanning Instructions */}
          <div className={styles.instructions}>
            <div className={styles.instructionStep}>
              <span className={styles.stepNum}>1.</span>
              <span>Open your camera or any UPI/banking application.</span>
            </div>
            <div className={styles.instructionStep}>
              <span className={styles.stepNum}>2.</span>
              <span>Scan this QR code and complete the tip transfer.</span>
            </div>
            <div className={styles.instructionStep}>
              <span className={styles.stepNum}>3.</span>
              <span>Once paid, click the button below to publish your comment.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={styles.footer}>
          <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.btnAction} ${styles.btnConfirm}`} onClick={onConfirm}>
            I Have Paid
          </button>
        </div>
      </div>
    </div>
  );
};
