import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCarById, getAvailableCars } from "@/data/cars";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import { carInquiryLink } from "@/lib/whatsapp";
import { formatKm } from "@/lib/utils";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const cars = getAvailableCars();
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.year} ${car.make} ${car.model} ${car.variant}`,
    description: `${car.year} ${car.make} ${car.model} ${car.variant} — ${car.fuelType}, ${car.transmission}, ${formatKm(car.kmDriven)} km, ${car.ownership}. Engine inspected. Inquire on WhatsApp.`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) notFound();

  const waLink = carInquiryLink(car);

  const specs = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Variant", value: car.variant },
    { label: "Year", value: car.year.toString() },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Transmission", value: car.transmission },
    { label: "Body Type", value: car.bodyType },
    { label: "KM Driven", value: `${formatKm(car.kmDriven)} km` },
    { label: "Ownership", value: car.ownership },
    { label: "Color", value: car.color },
    { label: "RTO State", value: car.rtoState },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadLink}>Home</Link>
          <span className={styles.breadSep} aria-hidden="true">›</span>
          <Link href="/cars" className={styles.breadLink}>Cars</Link>
          <span className={styles.breadSep} aria-hidden="true">›</span>
          <span className={styles.breadCurrent} aria-current="page">
            {car.year} {car.make} {car.model}
          </span>
        </nav>

        <div className={styles.layout}>
          {/* Left: Gallery + Specs */}
          <div className={styles.left}>
            {/* Gallery */}
            <ImageGallery
              photos={car.photos}
              alt={`${car.year} ${car.make} ${car.model}`}
            />

            {/* Specs grid */}
            <section className={styles.section} aria-label="Car specifications">
              <h2 className={styles.sectionTitle}>Specifications</h2>
              <div className={styles.specsGrid}>
                {specs.map((spec) => (
                  <div key={spec.label} className={styles.specItem}>
                    <dt className={styles.specLabel}>{spec.label}</dt>
                    <dd className={styles.specValue}>{spec.value}</dd>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            {car.features.length > 0 && (
              <section className={styles.section} aria-label="Features">
                <h2 className={styles.sectionTitle}>Key Features</h2>
                <ul className={styles.featureList}>
                  {car.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.featureCheck} aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Inspection report */}
            <section className={styles.section} aria-label="Inspection report">
              <h2 className={styles.sectionTitle}>
                <span className={styles.inspectionIcon}>🔍</span>
                Inspection Report
              </h2>
              <div className={styles.inspectionGrid}>
                {[
                  { label: "Engine", value: car.inspection.engine },
                  { label: "Body", value: car.inspection.body },
                  { label: "Interior", value: car.inspection.interior },
                  { label: "Electricals", value: car.inspection.electricals },
                  { label: "Tyres", value: car.inspection.tyres },
                  { label: "Brakes", value: car.inspection.brakes },
                ].map((item) => (
                  <div key={item.label} className={styles.inspectionItem}>
                    <span className={styles.inspectionLabel}>{item.label}</span>
                    <span
                      className={`${styles.inspectionValue} ${
                        item.value === "Excellent" ? styles.excellent : styles.good
                      }`}
                    >
                      {item.value === "Excellent" ? "★ " : "✓ "}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              {car.inspection.notes && (
                <div className={styles.inspectionNotes}>
                  <p className={styles.notesLabel}>Inspector&apos;s Notes:</p>
                  <p className={styles.notesText}>{car.inspection.notes}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right: Sticky CTA card */}
          <aside className={styles.right} aria-label="Inquiry">
            <div className={styles.ctaCard}>
              {/* Car summary */}
              <div className={styles.ctaSummary}>
                <div className={styles.ctaBadges}>
                  <span className="badge badge-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Engine Inspected
                  </span>
                  <span className={`badge ${car.ownership === "1st Owner" ? "ownership-first" : "ownership-second"}`}>
                    {car.ownership}
                  </span>
                </div>

                <h1 className={styles.ctaCarName}>
                  {car.year} {car.make} {car.model}
                </h1>
                <p className={styles.ctaVariant}>{car.variant}</p>

                <div className={styles.ctaQuickSpecs}>
                  <span>{car.fuelType}</span>
                  <span className={styles.dot}>·</span>
                  <span>{car.transmission}</span>
                  <span className={styles.dot}>·</span>
                  <span>{formatKm(car.kmDriven)} km</span>
                </div>

                <div className={styles.noPrice}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  Price on request via WhatsApp
                </div>
              </div>

              {/* CTA buttons */}
              <div className={styles.ctaActions}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-whatsapp btn-lg ${styles.waBtn}`}
                  aria-label={`Inquire about ${car.year} ${car.make} ${car.model} on WhatsApp`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Inquire on WhatsApp
                </a>

                <Link href="/sell" className={`btn btn-outline ${styles.sellBtn}`}>
                  Want to sell / exchange your car?
                </Link>
              </div>

              {/* Trust notes */}
              <ul className={styles.trustNotes}>
                {[
                  "Engine & full condition inspected",
                  "Documentation verified",
                  "Pan-India delivery available",
                  "No broker — direct contact",
                ].map((note) => (
                  <li key={note} className={styles.trustNote}>
                    <span className={styles.trustCheck} aria-hidden="true">✓</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Mobile sticky CTA */}
        <div className={styles.mobileCta}>
          <div className={styles.mobileCtaInfo}>
            <span className={styles.mobileCarName}>
              {car.year} {car.make} {car.model}
            </span>
            <span className={styles.mobileNoprice}>Price on WhatsApp</span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            aria-label="Inquire on WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Inquire Now
          </a>
        </div>
      </div>
    </div>
  );
}
