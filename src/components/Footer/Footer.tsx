import Link from "next/link";
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.4V16c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
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
