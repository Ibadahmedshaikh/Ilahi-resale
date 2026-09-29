"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./CarForm.module.css";

interface CarFormData {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number | "";
  fuel_type: string;
  transmission: string;
  km_driven: number | "";
  ownership: string;
  body_type: string;
  color: string;
  rto_state: string;
  features: string;
  is_featured: boolean;
  is_new: boolean;
  is_sold: boolean;
  inspection_engine: string;
  inspection_body: string;
  inspection_interior: string;
  inspection_electricals: string;
  inspection_tyres: string;
  inspection_brakes: string;
  inspection_notes: string;
}

interface Props {
  initialData?: Partial<CarFormData>;
  existingPhotos?: string[];
  mode: "create" | "edit";
}

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];
const BODY_TYPES = ["Sedan", "Hatchback", "SUV", "MUV", "Coupe", "Convertible", "Wagon", "Truck", "Van"];
const OWNERSHIPS = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner", "Dealer / Company"];
const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Needs Attention"];
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const MAX_SIZE_BYTES = 100 * 1024; // 100 KB

/** Convert any image to WebP ≤100KB client-side */
async function convertToWebP(file: File): Promise<{ blob: Blob; warning?: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      // Scale down if needed
      const MAX_DIMENSION = 1200;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality 0.85 → 0.7 → 0.55 → 0.4 until ≤100KB
      const qualities = [0.85, 0.7, 0.55, 0.4];
      let resultBlob: Blob | null = null;
      let i = 0;

      function tryQuality() {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          if (blob.size <= MAX_SIZE_BYTES || i >= qualities.length - 1) {
            resolve({
              blob,
              warning: blob.size > MAX_SIZE_BYTES ? `Image is ${Math.round(blob.size / 1024)}KB (above 100KB limit even at lowest quality)` : undefined,
            });
          } else {
            i++;
            tryQuality();
          }
        }, "image/webp", qualities[i]);
      }
      tryQuality();
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

const empty: CarFormData = {
  id: "", make: "", model: "", variant: "", year: "", fuel_type: "Petrol",
  transmission: "Manual", km_driven: "", ownership: "1st Owner", body_type: "Hatchback",
  color: "", rto_state: "Maharashtra", features: "",
  is_featured: false, is_new: false, is_sold: false,
  inspection_engine: "Good", inspection_body: "Good", inspection_interior: "Good",
  inspection_electricals: "Good", inspection_tyres: "Good", inspection_brakes: "Good",
  inspection_notes: "",
};

export default function CarForm({ initialData, existingPhotos = [], mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CarFormData>({ ...empty, ...initialData });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [keptPhotos, setKeptPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoWarnings, setPhotoWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const warnings: string[] = [];
    const converted: File[] = [];
    const previews: string[] = [];

    for (const file of arr) {
      const { blob, warning } = await convertToWebP(file);
      if (warning) warnings.push(`${file.name}: ${warning}`);
      const converted_file = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
      converted.push(converted_file);
      previews.push(URL.createObjectURL(blob));
    }

    setPhotos((prev) => [...prev, ...converted]);
    setPhotoPreviews((prev) => [...prev, ...previews]);
    setPhotoWarnings(warnings);
  }, []);

  function removeNewPhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeExistingPhoto(url: string) {
    setKeptPhotos((prev) => prev.filter((u) => u !== url));
  }

  function set(key: keyof CarFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();

      // 1. Upload new photos to Supabase Storage
      const newPhotoUrls: string[] = [];
      if (photos.length > 0) {
        setUploading(true);
        for (const file of photos) {
          const path = `${form.id || Date.now()}-${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from("car-images")
            .upload(path, file, { contentType: "image/webp", upsert: true });
          if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

          const { data: { publicUrl } } = supabase.storage
            .from("car-images")
            .getPublicUrl(data.path);
          newPhotoUrls.push(publicUrl);
        }
        setUploading(false);
      }

      const allPhotos = [...keptPhotos, ...newPhotoUrls];
      const features = form.features.split(",").map((f) => f.trim()).filter(Boolean);

      const payload = {
        make: form.make,
        model: form.model,
        variant: form.variant,
        year: Number(form.year),
        fuel_type: form.fuel_type,
        transmission: form.transmission,
        km_driven: Number(form.km_driven),
        ownership: form.ownership,
        body_type: form.body_type,
        color: form.color,
        rto_state: form.rto_state,
        photos: allPhotos,
        features,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_sold: form.is_sold,
        inspection_engine: form.inspection_engine,
        inspection_body: form.inspection_body,
        inspection_interior: form.inspection_interior,
        inspection_electricals: form.inspection_electricals,
        inspection_tyres: form.inspection_tyres,
        inspection_brakes: form.inspection_brakes,
        inspection_notes: form.inspection_notes,
      };

      if (mode === "create") {
        // Generate slug-like ID from year + make + model
        const baseId = `${form.year}-${form.make}-${form.model}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const id = `${baseId}-${Date.now().toString(36)}`;
        const { error: insertError } = await supabase.from("cars").insert({ id, added_at: new Date().toISOString(), ...payload });
        if (insertError) throw new Error(insertError.message);
        router.push("/admin/cars");
      } else {
        const { error: updateError } = await supabase.from("cars").update(payload).eq("id", form.id);
        if (updateError) throw new Error(updateError.message);
        router.push("/admin/cars");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* ── Section: Basic Info ────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🚗</span> Basic Information
        </legend>
        <div className={styles.grid3}>
          <div className={styles.field}>
            <label className={styles.label}>Make <span className={styles.req}>*</span></label>
            <input required className={styles.input} placeholder="e.g. Maruti" value={form.make} onChange={(e) => set("make", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Model <span className={styles.req}>*</span></label>
            <input required className={styles.input} placeholder="e.g. Swift" value={form.model} onChange={(e) => set("model", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Variant</label>
            <input className={styles.input} placeholder="e.g. VXI" value={form.variant} onChange={(e) => set("variant", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year <span className={styles.req}>*</span></label>
            <input required type="number" min="1990" max={new Date().getFullYear() + 1} className={styles.input} placeholder="e.g. 2021" value={form.year} onChange={(e) => set("year", e.target.value ? Number(e.target.value) : "")} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <input className={styles.input} placeholder="e.g. Pearl White" value={form.color} onChange={(e) => set("color", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Body Type</label>
            <select className={styles.select} value={form.body_type} onChange={(e) => set("body_type", e.target.value)}>
              {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* ── Section: Specs ─────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⚙️</span> Specifications
        </legend>
        <div className={styles.grid3}>
          <div className={styles.field}>
            <label className={styles.label}>Fuel Type</label>
            <select className={styles.select} value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)}>
              {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Transmission</label>
            <select className={styles.select} value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>KM Driven <span className={styles.req}>*</span></label>
            <input required type="number" min="0" className={styles.input} placeholder="e.g. 45000" value={form.km_driven} onChange={(e) => set("km_driven", e.target.value ? Number(e.target.value) : "")} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Ownership</label>
            <select className={styles.select} value={form.ownership} onChange={(e) => set("ownership", e.target.value)}>
              {OWNERSHIPS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>RTO State</label>
            <select className={styles.select} value={form.rto_state} onChange={(e) => set("rto_state", e.target.value)}>
              {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* ── Section: Photos ─────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📸</span> Photos
          <span className={styles.sectionBadge}>Auto-converted to WebP ≤100KB</span>
        </legend>

        {photoWarnings.length > 0 && (
          <div className={styles.warningBox}>
            {photoWarnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}
          </div>
        )}

        {/* Existing photos */}
        {keptPhotos.length > 0 && (
          <div className={styles.photoGrid}>
            {keptPhotos.map((url) => (
              <div key={url} className={styles.photoItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className={styles.photoThumb} />
                <button type="button" className={styles.photoRemove} onClick={() => removeExistingPhoto(url)} aria-label="Remove photo">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* New photo previews */}
        {photoPreviews.length > 0 && (
          <div className={styles.photoGrid}>
            {photoPreviews.map((src, i) => (
              <div key={i} className={`${styles.photoItem} ${styles.photoNew}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className={styles.photoThumb} />
                <button type="button" className={styles.photoRemove} onClick={() => removeNewPhoto(i)} aria-label="Remove photo">✕</button>
                <span className={styles.photoNewBadge}>New</span>
              </div>
            ))}
          </div>
        )}

        {/* Upload drop area */}
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handlePhotoSelect(e.dataTransfer.files); }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" />
          </svg>
          <p className={styles.dropText}>Click or drag images here</p>
          <p className={styles.dropHint}>JPG, PNG, WEBP — automatically converted to WebP ≤100 KB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handlePhotoSelect(e.target.files)}
        />
      </fieldset>

      {/* ── Section: Features ──────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>✨</span> Features
        </legend>
        <div className={styles.field}>
          <label className={styles.label}>Features (comma-separated)</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Sunroof, Rear Camera, Apple CarPlay, Push Start"
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
            rows={3}
          />
          <span className={styles.hint}>Enter each feature separated by a comma</span>
        </div>
      </fieldset>

      {/* ── Section: Inspection ────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🔍</span> Inspection Report
        </legend>
        <div className={styles.grid3}>
          {(
            [
              ["inspection_engine", "Engine"],
              ["inspection_body", "Body"],
              ["inspection_interior", "Interior"],
              ["inspection_electricals", "Electricals"],
              ["inspection_tyres", "Tyres"],
              ["inspection_brakes", "Brakes"],
            ] as [keyof CarFormData, string][]
          ).map(([key, label]) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <select className={styles.select} value={form[key] as string} onChange={(e) => set(key, e.target.value)}>
                {CONDITION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className={styles.field} style={{ marginTop: "1rem" }}>
          <label className={styles.label}>Inspection Notes</label>
          <textarea
            className={styles.textarea}
            placeholder="Any additional notes about the car condition..."
            value={form.inspection_notes}
            onChange={(e) => set("inspection_notes", e.target.value)}
            rows={3}
          />
        </div>
      </fieldset>

      {/* ── Section: Visibility ────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🏷️</span> Visibility & Status
        </legend>
        <div className={styles.togglesGrid}>
          {([
            ["is_featured", "⭐ Featured on homepage"],
            ["is_new", "🆕 Mark as New Arrival"],
            ["is_sold", "🚫 Mark as Sold"],
          ] as [keyof CarFormData, string][]).map(([key, label]) => (
            <label key={key} className={styles.toggle}>
              <div className={`${styles.toggleTrack} ${form[key] ? styles.toggleOn : ""}`}>
                <div className={styles.toggleThumb} />
                <input
                  type="checkbox"
                  checked={form[key] as boolean}
                  onChange={(e) => set(key, e.target.checked)}
                  style={{ display: "none" }}
                />
              </div>
              <span className={styles.toggleLabel}>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Error & Submit ─────────────────────────────────────── */}
      {error && (
        <div className={styles.errorBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
        <button type="submit" className={styles.submitBtn} disabled={saving || uploading}>
          {saving || uploading ? (
            <>
              <span className={styles.spinner} />
              {uploading ? "Uploading photos…" : "Saving…"}
            </>
          ) : mode === "create" ? "Add Car Listing" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
