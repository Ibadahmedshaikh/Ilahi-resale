import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection/HeroSection";
import CarCard from "@/components/CarCard/CarCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { getFeaturedCars, getAvailableCars } from "@/data/cars";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ilahi Resale — Inspected Pre-Owned Cars, Pan-India",
  description:
    "Browse inspected 1st & 2nd owner pre-owned cars from Ilahi Resale, Mundgod. Pan-India delivery. Inquire on WhatsApp.",
};

export default function HomePage() {
  const featured = getFeaturedCars(6);
  const totalCars = getAvailableCars().length;

  return (
    <>
      {/* 1. Hero Section matching reference image */}
      <HeroSection />

      {/* 2. Search Section: "Find your perfect car / in just a few clicks" */}
      <section className={styles.searchSection} aria-label="Search cars">
        <div className="container">
          <div className={styles.searchHeader}>
            <h2 className={styles.searchTitle}>Find your perfect car</h2>
            <p className={styles.searchSubtitle}>in just a few clicks</p>
          </div>
          <div className={styles.searchWrap}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 3. Features Row matching the 3 circular icons in reference image */}
      <section className={styles.featuresSection} aria-label="Our highlights">
        <div className="container">
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>
              Here&apos;s what sets us apart.
            </h2>
            <p className={styles.featuresSubtitle}>
              Guaranteed peace of mind with every drive.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.4V16c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h3 className={styles.featureName}>100% Inspected</h3>
              <p className={styles.featureDesc}>
                Full engine and mechanical condition check on every vehicle. Comprehensive verification so you drive with absolute confidence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className={styles.featureName}>Verified Ownership</h3>
              <p className={styles.featureDesc}>
                We exclusively buy and sell cars from verified 1st and 2nd owners. Full documentation and clean ownership records provided.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className={styles.featureName}>Pan-India Delivery</h3>
              <p className={styles.featureDesc}>
                Based in Mundgod, Karnataka — we safely coordinate transport and door-to-door delivery anywhere across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Inventory matching bottom row of cards */}
      <section className={styles.featuredSection} aria-label="Featured cars">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Inventory</span>
            <h2 className="section-title">Featured Cars</h2>
            <p className="section-subtitle">
              Inspected, certified, and ready for you. Direct WhatsApp inquiries with transparent vehicle histories.
            </p>
          </div>

          <div className={styles.grid}>
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className={styles.viewAll}>
            <Link href="/cars" className="btn btn-primary btn-lg">
              View All {totalCars} Cars
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Sell & Exchange CTAs */}
      <section className={styles.ctaSection} aria-label="Sell or exchange your car">
        <div className="container">
          <div className={styles.ctaGrid}>
            {/* Sell CTA */}
            <div className={styles.ctaCard}>
              <div className={styles.ctaBadge}>Sell</div>
              <h2 className={styles.ctaTitle}>Sell Your Car to Us</h2>
              <p className={styles.ctaText}>
                Looking to sell your car? Get a fair, transparent offer from Ilahi Resale. We purchase 1st and 2nd owner cars in clean condition.
              </p>
              <Link href="/sell" className="btn btn-primary">
                Get a Quote
              </Link>
            </div>

            {/* Exchange CTA */}
            <div className={styles.ctaCard}>
              <div className={styles.ctaBadge}>Exchange</div>
              <h2 className={styles.ctaTitle}>Exchange Your Car</h2>
              <p className={styles.ctaText}>
                Upgrade seamlessly. Trade in your existing vehicle and drive home a better, inspected one from our verified inventory.
              </p>
              <Link href="/exchange" className="btn btn-secondary">
                Start Exchange
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Process: How It Works */}
      <section id="how-it-works" className={styles.processSection} aria-label="How it works">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Seamless Process</span>
            <h2 className="section-title">Buy in 3 Simple Steps</h2>
          </div>
          <div className={styles.steps}>
            {[
              { num: "01", title: "Browse & Select", desc: "Explore our inspected inventory. Filter by make, fuel type, transmission, or budget." },
              { num: "02", title: "WhatsApp Direct", desc: "Tap 'Inquire Now'. A pre-filled WhatsApp message connects you directly with our team." },
              { num: "03", title: "Doorstep Delivery", desc: "Confirm your choice. We arrange door-to-door delivery anywhere in India." },
            ].map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
