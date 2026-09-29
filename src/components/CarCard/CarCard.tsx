import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";
import { formatKm } from "@/lib/utils";
import styles from "./CarCard.module.css";

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  return (
    <Link href={`/cars/${car.id}`} className={styles.card}>
      {/* Upper Area: Soft Pastel Backdrop matching reference image */}
      <div className={styles.imageBackdrop}>
        {/* Top Badges */}
        <div className={styles.topRow}>
          <span className={styles.bodyTypeTag}>{car.bodyType}</span>
          <span className={styles.ownerPill}>{car.ownership}</span>
        </div>

        {/* Vehicle Image */}
        <div className={styles.imageContainer}>
          <Image
            src={car.photos[0]}
            alt={`${car.year} ${car.make} ${car.model} ${car.variant}`}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Inspected Badge */}
        <div className={styles.bottomPillRow}>
          <span className={styles.inspectedPill}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Engine Inspected
          </span>
          {car.photos.length > 1 && (
            <span className={styles.photoCount}>
              {car.photos.length} photos
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {car.make} {car.model}
          </h3>
          <span className={styles.year}>{car.year}</span>
        </div>

        <p className={styles.variant}>{car.variant}</p>

        {/* Specs Pill Row */}
        <div className={styles.specsRow}>
          <span className={styles.specTag}>{car.fuelType}</span>
          <span className={styles.specDot}>·</span>
          <span className={styles.specTag}>{car.transmission}</span>
          <span className={styles.specDot}>·</span>
          <span className={styles.specTag}>{formatKm(car.kmDriven)} km</span>
        </div>

        {/* Bottom CTA Row */}
        <div className={styles.footerRow}>
          <span className={styles.priceLabel}>Price on Request</span>
          <span className={styles.viewPillBtn}>
            View Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
