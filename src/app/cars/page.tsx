import type { Metadata } from "next";
import { Suspense } from "react";
import CarsClient from "./CarsClient";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Browse Inspected Used Cars",
  description:
    "Filter and browse all available 1st & 2nd owner pre-owned cars from Ilahi Resale. Pan-India delivery. WhatsApp to inquire.",
};

export default function CarsPage() {
  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <span className="section-eyebrow">Inventory</span>
          <h1 className={styles.title}>Browse Our Cars</h1>
          <p className={styles.subtitle}>
            All cars are engine-inspected, from verified 1st &amp; 2nd owners.
            No prices shown — inquire on WhatsApp to get details.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className={`container ${styles.content}`}>
        <Suspense fallback={<div className={styles.loading}>Loading cars…</div>}>
          <CarsClient />
        </Suspense>
      </div>
    </div>
  );
}
