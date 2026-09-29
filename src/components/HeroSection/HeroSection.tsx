import Link from "next/link";
import Image from "next/image";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {/* Left Column: Typography & CTAs */}
          <div className={styles.leftCol}>
            <div className={styles.badgePill}>
              <span className={styles.badgeDot} />
              Mundgod, Karnataka · Pan-India Delivery
            </div>

            <h1 className={styles.headline}>
              Your Journey<br />
              Starts Here.
            </h1>

            <p className={styles.subtext}>
              Certified pre-owned cars, 100% inspected with doorstep delivery across India.
              Direct WhatsApp communication, verified 1st &amp; 2nd owners, and zero broker fees.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/cars" className="btn btn-primary btn-lg">
                Browse Cars
              </Link>
              <a href="#how-it-works" className={styles.howItWorksBtn}>
                <span className={styles.playIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>How It Works</span>
              </a>
            </div>

            <div className={styles.heroFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureCheck}>✓</span>
                <span>100% Inspected</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureCheck}>✓</span>
                <span>1st &amp; 2nd Owner Only</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureCheck}>✓</span>
                <span>Direct WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Blue Car Visual (from Reference Image) */}
          <div className={styles.rightCol}>
            <div className={styles.carBackdrop}>
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85&auto=format&fit=crop"
                alt="Premium verified pre-owned car"
                fill
                priority
                className={styles.carImg}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.carGlow} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
