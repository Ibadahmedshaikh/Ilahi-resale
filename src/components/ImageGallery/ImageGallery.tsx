"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

interface Props {
  photos: string[];
  alt: string;
}

export default function ImageGallery({ photos, alt }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i === 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i === photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      <div className={styles.gallery}>
        {/* Main image */}
        <div
          className={styles.main}
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View full-size image ${activeIdx + 1} of ${photos.length}`}
          onKeyDown={(e) => { if (e.key === "Enter") setLightboxOpen(true); }}
        >
          <Image
            src={photos[activeIdx]}
            alt={`${alt} — photo ${activeIdx + 1}`}
            fill
            className={styles.mainImg}
            sizes="(max-width: 768px) 100vw, 65vw"
            priority={activeIdx === 0}
          />
          <div className={styles.expandHint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            Tap to enlarge
          </div>
          {/* Prev / Next on main */}
          {photos.length > 1 && (
            <>
              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          <div className={styles.counter}>
            {activeIdx + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className={styles.thumbs} role="tablist" aria-label="Car photos">
            {photos.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ""}`}
                onClick={() => setActiveIdx(i)}
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Photo ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  className={styles.thumbImg}
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className={styles.lbClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <div className={styles.lbImage}>
            <Image
              src={photos[activeIdx]}
              alt={`${alt} — full size photo ${activeIdx + 1}`}
              fill
              className={styles.lbImg}
              sizes="100vw"
            />
          </div>
          {photos.length > 1 && (
            <>
              <button
                className={`${styles.lbArrow} ${styles.lbLeft}`}
                onClick={prev}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className={`${styles.lbArrow} ${styles.lbRight}`}
                onClick={next}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          <div className={styles.lbCounter}>
            {activeIdx + 1} / {photos.length}
          </div>
          <div
            className={styles.lbBg}
            onClick={() => setLightboxOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
