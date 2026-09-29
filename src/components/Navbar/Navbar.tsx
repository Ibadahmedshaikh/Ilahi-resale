"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_LINKS, BUSINESS_NAME } from "@/lib/constants";
import { generalInquiryLink } from "@/lib/whatsapp";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Ilahi Resale Home">
            <div className={styles.logoMark}>
              <Image
                src="/images/logo-mark.webp"
                alt="Ilahi Resale Logo"
                width={36}
                height={20}
                className={styles.logoImg}
                priority
              />
            </div>
            <span className={styles.logoBrand}>{BUSINESS_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  {link.label}
                  {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className={styles.actions}>
            {/* Search shortcut */}
            <Link href="/cars" className={styles.iconAction} aria-label="Search cars">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </Link>

            <a
              href={generalInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
              aria-label="Search or Inquire on WhatsApp"
            >
              Search
            </a>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      <nav
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.drawerHeader}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <Image
                src="/images/logo-mark.webp"
                alt="Ilahi Resale Logo"
                width={36}
                height={20}
                className={styles.logoImg}
              />
            </div>
            <span className={styles.logoBrand}>{BUSINESS_NAME}</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul className={styles.drawerLinks}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.drawerLink} ${pathname === link.href ? styles.drawerLinkActive : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={generalInquiryLink()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.drawerWa}
        >
          Chat on WhatsApp
        </a>
      </nav>
    </>
  );
}
