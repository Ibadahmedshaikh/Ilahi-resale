"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

const STATUS_CYCLE: Record<string, string> = {
  new: "contacted",
  contacted: "closed",
  closed: "new",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export default function LeadStatusToggle({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function cycleStatus() {
    const next = STATUS_CYCLE[status] ?? "new";
    setLoading(true);
    const supabase = createClient();
    await supabase.from("leads").update({ status: next }).eq("id", leadId);
    setStatus(next);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      className={`${styles.statusBtn} ${
        status === "new" ? styles.statusNew
        : status === "contacted" ? styles.statusContacted
        : styles.statusClosed
      }`}
      onClick={cycleStatus}
      disabled={loading}
      title="Click to update status"
    >
      {loading ? <span className={styles.statusSpinner} /> : STATUS_LABELS[status] ?? status}
    </button>
  );
}
