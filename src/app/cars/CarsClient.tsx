"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard/CarCard";
import { cars as allCars } from "@/data/cars";
import {
  BRANDS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  OWNERSHIP_OPTIONS,
  BODY_TYPES,
} from "@/lib/constants";
import { Car, FilterState, SortOption } from "@/types";
import styles from "./CarsClient.module.css";

const CURRENT_YEAR = new Date().getFullYear();

const defaultFilters: FilterState = {
  brand: "",
  fuelType: "",
  transmission: "",
  ownership: "",
  bodyType: "",
  yearMin: "",
  yearMax: "",
};

export default function CarsClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    brand: searchParams.get("brand") || "",
  });
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  const filtered = useMemo(() => {
    let list: Car[] = allCars.filter((c) => !c.isSold);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.variant.toLowerCase().includes(q)
      );
    }
    if (filters.brand) list = list.filter((c) => c.make === filters.brand);
    if (filters.fuelType)
      list = list.filter((c) => c.fuelType === filters.fuelType);
    if (filters.transmission)
      list = list.filter((c) => c.transmission === filters.transmission);
    if (filters.ownership)
      list = list.filter((c) => c.ownership === filters.ownership);
    if (filters.bodyType)
      list = list.filter((c) => c.bodyType === filters.bodyType);
    if (filters.yearMin)
      list = list.filter((c) => c.year >= parseInt(filters.yearMin));
    if (filters.yearMax)
      list = list.filter((c) => c.year <= parseInt(filters.yearMax));

    // Sort
    switch (sort) {
      case "year-desc":
        return [...list].sort((a, b) => b.year - a.year);
      case "year-asc":
        return [...list].sort((a, b) => a.year - b.year);
      case "km-asc":
        return [...list].sort((a, b) => a.kmDriven - b.kmDriven);
      case "km-desc":
        return [...list].sort((a, b) => b.kmDriven - a.kmDriven);
      default:
        return [...list].sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
    }
  }, [filters, sort, searchQuery]);

  function updateFilter(key: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSearchQuery("");
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Filter panel content (shared between desktop sidebar and mobile drawer)
  const FilterContent = () => (
    <div className={styles.filterContent}>
      {/* Search */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-search">
          Search
        </label>
        <input
          id="filter-search"
          type="text"
          className="form-input"
          placeholder="Brand, model, variant…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Brand */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-brand">Brand</label>
        <select
          id="filter-brand"
          className="form-select"
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
        >
          <option value="">All Brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Fuel */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-fuel">Fuel Type</label>
        <div className={styles.pills}>
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              className={`${styles.filterPill} ${filters.fuelType === f ? styles.pillActive : ""}`}
              onClick={() => updateFilter("fuelType", filters.fuelType === f ? "" : f)}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Transmission</label>
        <div className={styles.pills}>
          {TRANSMISSION_TYPES.map((t) => (
            <button
              key={t}
              className={`${styles.filterPill} ${filters.transmission === t ? styles.pillActive : ""}`}
              onClick={() => updateFilter("transmission", filters.transmission === t ? "" : t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ownership */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Ownership</label>
        <div className={styles.pills}>
          {OWNERSHIP_OPTIONS.map((o) => (
            <button
              key={o}
              className={`${styles.filterPill} ${filters.ownership === o ? styles.pillActive : ""}`}
              onClick={() => updateFilter("ownership", filters.ownership === o ? "" : o)}
              type="button"
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-body">Body Type</label>
        <select
          id="filter-body"
          className="form-select"
          value={filters.bodyType}
          onChange={(e) => updateFilter("bodyType", e.target.value)}
        >
          <option value="">All Types</option>
          {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Year range */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Year Range</label>
        <div className={styles.yearRange}>
          <select
            aria-label="Year from"
            className="form-select"
            value={filters.yearMin}
            onChange={(e) => updateFilter("yearMin", e.target.value)}
          >
            <option value="">From</option>
            {Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - 14 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className={styles.yearSep}>–</span>
          <select
            aria-label="Year to"
            className="form-select"
            value={filters.yearMax}
            onChange={(e) => updateFilter("yearMax", e.target.value)}
          >
            <option value="">To</option>
            {Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - 14 + i).reverse().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button className={styles.resetBtn} onClick={resetFilters} type="button">
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.layout}>
      {/* Desktop sidebar */}
      <aside className={styles.sidebar} aria-label="Filters">
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Filter Cars</h2>
          {activeFilterCount > 0 && (
            <span className={styles.filterCount}>{activeFilterCount}</span>
          )}
        </div>
        <FilterContent />
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          {/* Mobile filter button */}
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          <p className={styles.resultCount}>
            <strong>{filtered.length}</strong> car{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <label htmlFor="sort-select" className={styles.sortLabel}>Sort:</label>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="newest">Newest Listed</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="year-asc">Year: Oldest First</option>
              <option value="km-asc">KM: Low to High</option>
              <option value="km-desc">KM: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No cars match your filters</h3>
            <p className={styles.emptyText}>
              Try adjusting your filters or{" "}
              <button className={styles.emptyReset} onClick={resetFilters}>
                clear all
              </button>{" "}
              to see all available cars.
            </p>
          </div>
        )}
      </div>

      {/* Mobile filter drawer overlay */}
      {mobileFiltersOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileFiltersOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile filter drawer */}
      <div
        className={`${styles.mobileDrawer} ${mobileFiltersOpen ? styles.drawerOpen : ""}`}
        aria-label="Filters"
      >
        <div className={styles.drawerHead}>
          <h2 className={styles.drawerTitle}>Filter Cars</h2>
          <button
            className={styles.drawerClose}
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
        <div className={styles.drawerBody}>
          <FilterContent />
        </div>
        <div className={styles.drawerFooter}>
          <button
            className="btn btn-primary"
            onClick={() => setMobileFiltersOpen(false)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Show {filtered.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}
