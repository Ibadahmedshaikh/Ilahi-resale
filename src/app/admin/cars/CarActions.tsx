"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

interface Props {
  carId: string;
  isSold: boolean;
}

export default function CarActions({ carId, isSold }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleSold() {
    setLoading("sold");
    const supabase = createClient();
    await supabase.from("cars").update({ is_sold: !isSold }).eq("id", carId);
    router.refresh();
    setLoading(null);
  }

  async function deleteCar() {
    if (!confirm(`Delete this car listing? This cannot be undone.`)) return;
    setLoading("delete");
    const supabase = createClient();
    await supabase.from("cars").delete().eq("id", carId);
    router.refresh();
    setLoading(null);
  }

  return (
    <div className={styles.actions}>
      <Link href={`/admin/cars/${carId}/edit`} className={styles.actionBtn} title="Edit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </Link>
      <button
        className={`${styles.actionBtn} ${isSold ? styles.actionBtnActive : styles.actionBtnSold}`}
        onClick={toggleSold}
        disabled={loading === "sold"}
        title={isSold ? "Mark as Active" : "Mark as Sold"}
      >
        {loading === "sold" ? (
          <span className={styles.spinner} />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        )}
        {isSold ? "Reactivate" : "Mark Sold"}
      </button>
      <button
        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
        onClick={deleteCar}
        disabled={loading === "delete"}
        title="Delete"
      >
        {loading === "delete" ? (
          <span className={styles.spinner} />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        )}
        Delete
      </button>
    </div>
  );
}
