"use client";

import { useState } from "react";
import { sellCarLink, exchangeCarLink } from "@/lib/whatsapp";
import { BRANDS } from "@/lib/constants";
import { Car } from "@/types";
import styles from "./LeadForm.module.css";

interface Props {
  type: "sell" | "exchange";
  inventory?: Car[];
}

interface FormData {
  name: string;
  phone: string;
  carBrand: string;
  carModel: string;
  year: string;
  kmDriven: string;
  city: string;
  wantedCarId: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

export default function LeadForm({ type, inventory = [] }: Props) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    carBrand: "",
    carModel: "",
    year: "",
    kmDriven: "",
    city: "",
    wantedCarId: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.carBrand) newErrors.carBrand = "Please select a brand";
    if (!form.carModel.trim()) newErrors.carModel = "Car model is required";
    if (!form.year) newErrors.year = "Please select the year";
    if (!form.kmDriven.trim()) newErrors.kmDriven = "Approximate km is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const wantedCar = inventory.find((c) => c.id === form.wantedCarId);
    const wantedCarLabel = wantedCar
      ? `${wantedCar.year} ${wantedCar.make} ${wantedCar.model}`
      : undefined;

    const link =
      type === "sell"
        ? sellCarLink({
            name: form.name,
            carBrand: form.carBrand,
            carModel: form.carModel,
            year: form.year,
            kmDriven: form.kmDriven,
            city: form.city,
          })
        : exchangeCarLink({
            name: form.name,
            carBrand: form.carBrand,
            carModel: form.carModel,
            year: form.year,
            kmDriven: form.kmDriven,
            city: form.city,
            wantedCar: wantedCarLabel,
          });

    setSubmitted(true);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🎉</div>
        <h3 className={styles.successTitle}>WhatsApp is opening!</h3>
        <p className={styles.successText}>
          Your message has been pre-filled. Just hit <strong>Send</strong> on
          WhatsApp and our team will get back to you shortly.
        </p>
        <button
          className="btn btn-outline"
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              phone: "",
              carBrand: "",
              carModel: "",
              year: "",
              kmDriven: "",
              city: "",
              wantedCarId: "",
            });
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        {/* Name */}
        <div className={`form-group ${errors.name ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-name">
            Your Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            className="form-input"
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        {/* Phone */}
        <div className={`form-group ${errors.phone ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-phone">
            Mobile Number <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            className="form-input"
            placeholder="10-digit number"
            value={form.phone}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
          />
          {errors.phone && (
            <span className={styles.error}>{errors.phone}</span>
          )}
        </div>

        {/* Brand */}
        <div className={`form-group ${errors.carBrand ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-brand">
            Car Brand <span aria-hidden="true">*</span>
          </label>
          <select
            id="lead-brand"
            name="carBrand"
            className="form-select"
            value={form.carBrand}
            onChange={handleChange}
          >
            <option value="">Select brand</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.carBrand && (
            <span className={styles.error}>{errors.carBrand}</span>
          )}
        </div>

        {/* Model */}
        <div className={`form-group ${errors.carModel ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-model">
            Car Model <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-model"
            name="carModel"
            type="text"
            className="form-input"
            placeholder="e.g. Swift, i20, Creta"
            value={form.carModel}
            onChange={handleChange}
          />
          {errors.carModel && (
            <span className={styles.error}>{errors.carModel}</span>
          )}
        </div>

        {/* Year */}
        <div className={`form-group ${errors.year ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-year">
            Manufacturing Year <span aria-hidden="true">*</span>
          </label>
          <select
            id="lead-year"
            name="year"
            className="form-select"
            value={form.year}
            onChange={handleChange}
          >
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.year && <span className={styles.error}>{errors.year}</span>}
        </div>

        {/* KM */}
        <div
          className={`form-group ${errors.kmDriven ? styles.hasError : ""}`}
        >
          <label className="form-label" htmlFor="lead-km">
            Approximate KM Driven <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-km"
            name="kmDriven"
            type="text"
            className="form-input"
            placeholder="e.g. 45,000"
            value={form.kmDriven}
            onChange={handleChange}
            inputMode="numeric"
          />
          {errors.kmDriven && (
            <span className={styles.error}>{errors.kmDriven}</span>
          )}
        </div>

        {/* City */}
        <div className={`form-group ${errors.city ? styles.hasError : ""}`}>
          <label className="form-label" htmlFor="lead-city">
            Your City <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-city"
            name="city"
            type="text"
            className="form-input"
            placeholder="e.g. Bangalore, Mumbai"
            value={form.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />
          {errors.city && <span className={styles.error}>{errors.city}</span>}
        </div>

        {/* Exchange: pick a car */}
        {type === "exchange" && inventory.length > 0 && (
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label" htmlFor="lead-wanted">
              Which car would you like to exchange for?{" "}
              <span className={styles.optional}>(Optional)</span>
            </label>
            <select
              id="lead-wanted"
              name="wantedCarId"
              className="form-select"
              value={form.wantedCarId}
              onChange={handleChange}
            >
              <option value="">I&apos;ll decide later / discuss with team</option>
              {inventory.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.year} {car.make} {car.model} {car.variant} —{" "}
                  {car.fuelType}, {car.transmission}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Submitting opens a pre-filled WhatsApp message to our team
        </p>
        <button type="submit" className="btn btn-whatsapp btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {type === "sell" ? "Send via WhatsApp" : "Send Exchange Request"}
        </button>
      </div>
    </form>
  );
}
