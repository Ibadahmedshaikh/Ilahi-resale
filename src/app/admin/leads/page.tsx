import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import LeadStatusToggle from "./LeadStatusToggle";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Leads" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const sellLeads = leads?.filter((l) => l.type === "sell") ?? [];
  const exchangeLeads = leads?.filter((l) => l.type === "exchange") ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSubtitle}>
            {sellLeads.length} sell leads &middot; {exchangeLeads.length} exchange leads
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          Database error: {error.message} — Make sure the &quot;leads&quot; table exists in your Supabase project.
        </div>
      )}

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        {[
          { label: "Total Leads", val: leads?.length ?? 0, color: "#0284c7", bg: "#f0f9ff" },
          { label: "New", val: leads?.filter((l) => l.status === "new").length ?? 0, color: "#dc2626", bg: "#fff1f2" },
          { label: "Contacted", val: leads?.filter((l) => l.status === "contacted").length ?? 0, color: "#ca8a04", bg: "#fefce8" },
          { label: "Closed", val: leads?.filter((l) => l.status === "closed").length ?? 0, color: "#64748b", bg: "#f8fafc" },
        ].map((s) => (
          <div key={s.label} className={styles.summaryCard} style={{ "--c": s.color, "--bg": s.bg } as React.CSSProperties}>
            <div className={styles.summaryVal}>{s.val}</div>
            <div className={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sell Leads */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <span className={styles.typeBadgeSell}>Sell</span>
            Sell Your Car Leads
          </h2>
        </div>
        <LeadsTable leads={sellLeads} />
      </div>

      {/* Exchange Leads */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <span className={styles.typeBadgeExchange}>Exchange</span>
            Car Exchange Leads
          </h2>
        </div>
        <LeadsTable leads={exchangeLeads} showWantedCar />
      </div>
    </div>
  );
}


interface Lead {
  id: string;
  type: string;
  name: string;
  phone: string;
  car_brand?: string;
  car_model?: string;
  year?: string;
  km_driven?: string;
  city?: string;
  wanted_car?: string;
  status: string;
  created_at: string;
}

function LeadsTable({ leads, showWantedCar = false }: { leads: Lead[]; showWantedCar?: boolean }) {
  if (!leads.length) {
    return (
      <div className={styles.empty}>
        No {showWantedCar ? "exchange" : "sell"} leads yet. They will appear here when customers submit forms on the website.
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Car</th>
            {showWantedCar && <th>Wants</th>}
            <th>Date</th>
            <th>Status</th>
            <th>WhatsApp</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className={styles.customerName}>{lead.name}</div>
                <div className={styles.customerPhone}>{lead.phone}</div>
                {lead.city && <div className={styles.customerCity}>{lead.city}</div>}
              </td>
              <td>
                <div className={styles.carInfo}>
                  {lead.car_brand} {lead.car_model}
                </div>
                {lead.year && <div className={styles.carMeta}>{lead.year} · {lead.km_driven} km</div>}
              </td>
              {showWantedCar && (
                <td>
                  <div className={styles.carInfo}>{lead.wanted_car || "—"}</div>
                </td>
              )}
              <td className={styles.dateCell}>{formatDate(lead.created_at)}</td>
              <td>
                <LeadStatusToggle leadId={lead.id} currentStatus={lead.status} />
              </td>
              <td>
                <a
                  href={`https://wa.me/916363278962?text=Hi%20${encodeURIComponent(lead.name)}%2C%20we%20received%20your%20request%20to%20${showWantedCar ? "exchange" : "sell"}%20your%20${encodeURIComponent(`${lead.car_brand} ${lead.car_model}`)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waBtn}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Message
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

