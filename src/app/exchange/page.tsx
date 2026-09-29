import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm/LeadForm";
import { getAvailableCars } from "@/data/cars";
import styles from "../sell/page.module.css";
import exchangeStyles from "./page.module.css";

export const metadata: Metadata = {
  title: "Exchange Your Car",
  description:
    "Trade in your existing car for a better one from Ilahi Resale's inspected inventory. Pan-India. Contact us via WhatsApp.",
};

export default function ExchangePage() {
  const inventory = getAvailableCars();

  return (
    <div className={styles.page}>
      <div className={`${styles.hero} ${exchangeStyles.exchangeHero}`}>
        <div className="container">
          <span className="section-eyebrow">Exchange Your Car</span>
          <h1 className={styles.heroTitle}>Upgrade with an Easy Exchange</h1>
          <p className={styles.heroText}>
            Trade in your current car for one of our inspected pre-owned
            vehicles. Tell us about your car and pick one from our inventory —
            our team will handle everything.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Your car + what you want</h2>
            <p className={styles.formSubtitle}>
              Tell us about your car and optionally pick a car from our
              inventory you&apos;d like in exchange.
            </p>
            <LeadForm type="exchange" inventory={inventory} />
          </div>

          {/* Info sidebar */}
          <aside className={styles.info}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>How exchange works</h3>
              <ol className={styles.steps}>
                {[
                  "Share details about your car.",
                  "Optionally pick a car from our inventory you want.",
                  "We evaluate both cars and discuss the exchange value.",
                  "If everything works, we finalise the exchange.",
                  "Drive home your new car — we handle all paperwork.",
                ].map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Exchange benefits</h3>
              <ul className={styles.buyList}>
                {[
                  "Upgrade to a better or newer car",
                  "Skip the hassle of finding a buyer",
                  "No middlemen — direct deal with Ilahi Resale",
                  "Full documentation handled by us",
                  "Pan-India — we can arrange logistics",
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
