import Link from "next/link";
import Image from "next/image";
import { BUSINESS_NAME, BUSINESS_LOCATION, NAV_LINKS } from "@/lib/constants";
import { generalInquiryLink } from "@/lib/whatsapp";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoMark}>
                <Image
                  src="/images/logo-mark.webp"
                  alt="Ilahi Resale Logo"
                  width={34}
                  height={18}
                  className={styles.logoImg}
                />
              </div>
              <span className={styles.logoBrand}>{BUSINESS_NAME}</span>
            </div>
            <p className={styles.brandDesc}>
              Mundgod&apos;s trusted destination for inspected pre-owned cars.
              Verified 1st &amp; 2nd owner vehicles delivered across India with direct WhatsApp communication.
            </p>
            <div className={styles.location}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{BUSINESS_LOCATION}</span>
            </div>
            <a
              href={generalInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waPillBtn}
            >
              Inquire on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div className={styles.links}>
            <h3 className={styles.colTitle}>Navigation</h3>
            <ul className={styles.linkList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.links}>
            <h3 className={styles.colTitle}>Services</h3>
            <ul className={styles.linkList}>
              <li><Link href="/cars" className={styles.link}>Browse Inventory</Link></li>
              <li><Link href="/sell" className={styles.link}>Sell Your Car</Link></li>
              <li><Link href="/exchange" className={styles.link}>Exchange Vehicle</Link></li>
            </ul>
          </div>

          {/* Why us */}
          <div className={styles.trust}>
            <h3 className={styles.colTitle}>Our Promise</h3>
            <ul className={styles.trustList}>
              {[
                "100% Engine & mechanical inspection",
                "Verified 1st & 2nd owner cars only",
                "Doorstep delivery across all Indian states",
                "Direct WhatsApp support — zero middlemen",
                "Transparent condition reports",
              ].map((item) => (
                <li key={item} className={styles.trustItem}>
                  <span className={styles.trustCheck}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {BUSINESS_NAME}. All rights reserved. Based in {BUSINESS_LOCATION}.
          </p>
          <p className={styles.disclaimer}>
            Prices on request. Connect with our team on WhatsApp for personalized quotes and availability.
          </p>
        </div>
      </div>
    </footer>
  );
}
