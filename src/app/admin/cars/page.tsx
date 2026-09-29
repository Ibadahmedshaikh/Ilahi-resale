import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import CarActions from "./CarActions";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Car Listings" };

export default async function AdminCarsPage() {
  const supabase = await createClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("id, make, model, variant, year, fuel_type, transmission, km_driven, is_sold, is_featured, is_new, added_at, photos")
    .order("added_at", { ascending: false });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Car Listings</h1>
          <p className={styles.pageSubtitle}>
            {cars?.length ?? 0} total &middot;{" "}
            {cars?.filter((c) => !c.is_sold).length ?? 0} active &middot;{" "}
            {cars?.filter((c) => c.is_sold).length ?? 0} sold
          </p>
        </div>
        <Link href="/admin/cars/new" className={styles.addBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Car
        </Link>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          Database error: {error.message} — Make sure the &quot;cars&quot; table exists in your Supabase project.
        </div>
      )}

      <div className={styles.card}>
        {cars && cars.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Details</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>
                      <div className={styles.carCell}>
                        {car.photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={car.photos[0]} alt={`${car.make} ${car.model}`} className={styles.carThumb} />
                        ) : (
                          <div className={styles.carThumbPlaceholder}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.4V16c0 .6.4 1 1 1h2" />
                              <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className={styles.carName}>{car.year} {car.make} {car.model}</div>
                          {car.variant && <div className={styles.carVariant}>{car.variant}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.detailChips}>
                        <span className={styles.chip}>{car.fuel_type}</span>
                        <span className={styles.chip}>{car.transmission}</span>
                        <span className={styles.chip}>{car.km_driven?.toLocaleString("en-IN")} km</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tagChips}>
                        {car.is_featured && <span className={styles.tagFeatured}>Featured</span>}
                        {car.is_new && <span className={styles.tagNew}>New</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${car.is_sold ? styles.statusSold : styles.statusActive}`}>
                        {car.is_sold ? "Sold" : "Active"}
                      </span>
                    </td>
                    <td>
                      <CarActions carId={car.id} isSold={car.is_sold} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🚗</div>
            <p>No car listings yet.</p>
            <Link href="/admin/cars/new" className={styles.emptyLink}>Add your first car →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
