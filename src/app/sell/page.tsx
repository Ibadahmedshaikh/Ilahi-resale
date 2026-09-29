import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm/LeadForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sell Your Car",
  description:
    "Sell your used car to Ilahi Resale. We buy 1st and 2nd owner cars in good condition. Get a fair offer — contact us via WhatsApp.",
};

export default function SellPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <span className="section-eyebrow">Sell Your Car</span>
          <h1 className={styles.heroTitle}>Get a Fair Price for Your Car</h1>
          <p className={styles.heroText}>
            We buy 1st and 2nd owner cars in good condition — directly,
            transparently, and at a fair valuation. Fill in the details below
            and our team will reach out via WhatsApp.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Tell us about your car</h2>
            <p className={styles.formSubtitle}>
              We&apos;ll reach back out on WhatsApp with a valuation.
            </p>
            <LeadForm type="sell" />
          </div>

          {/* Info sidebar */}
          <aside className={styles.info}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>What happens next?</h3>
              <ol className={styles.steps}>
                {[
                  "Submit your car details using the form.",
                  "A pre-filled WhatsApp message opens — send it to us.",
                  "Our team reviews your car details and contacts you.",
                  "We agree on a fair price and schedule an inspection.",
                  "Once satisfied, we complete the paperwork and pay you.",
                ].map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>We buy these cars</h3>
              <ul className={styles.buyList}>
                {[
                  "1st and 2nd owner cars",
                  "All brands — Maruti, Hyundai, Honda, Tata, Mahindra, and more",
                  "Petrol, Diesel, CNG vehicles",
                  "Good condition (running, no major damage)",
                  "Years 2010 and above",
                ].map((item) => (
                  <li key={item} className={styles.buyItem}>
                    <span className={styles.buyCheck}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
