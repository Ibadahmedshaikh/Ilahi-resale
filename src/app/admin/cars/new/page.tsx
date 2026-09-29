import type { Metadata } from "next";
import Link from "next/link";
import CarForm from "../CarForm";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Add New Car" };

export default function NewCarPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/cars" className={styles.backLink}>
            ← Back to Listings
          </Link>
          <h1 className={styles.pageTitle}>Add New Car</h1>
        </div>
      </div>
      <CarForm mode="create" />
    </div>
  );
}
