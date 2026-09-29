"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDS } from "@/lib/constants";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (query.trim()) params.set("q", query.trim());
    router.push(`/cars${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form className={styles.form} onSubmit={handleSearch} role="search">
      <div className={styles.pillContainer}>
        {/* Brand Dropdown */}
        <div className={styles.selectWrapper}>
          <label htmlFor="brand-select" className="sr-only">Select brand</label>
          <select
            id="brand-select"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={styles.select}
          >
            <option value="">All Brands</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Input */}
        <div className={styles.inputWrapper}>
          <label htmlFor="car-search" className="sr-only">Search car model</label>
          <input
            id="car-search"
            type="text"
            placeholder="Search model, e.g. Swift, Creta, City..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Blue Pill Search Button from Reference Image */}
        <button type="submit" className={styles.searchPillBtn} aria-label="Search cars">
          <span>Search Cars</span>
        </button>
      </div>
    </form>
  );
}
