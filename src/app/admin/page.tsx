import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalCars },
    { count: activeCars },
    { count: soldCars },
    { count: totalLeads },
    { count: newLeads },
    { data: recentCars },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("cars").select("*", { count: "exact", head: true }),
    supabase.from("cars").select("*", { count: "exact", head: true }).eq("is_sold", false),
    supabase.from("cars").select("*", { count: "exact", head: true }).eq("is_sold", true),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("cars").select("id, make, model, year, is_sold, added_at").order("added_at", { ascending: false }).limit(5),
    supabase.from("leads").select("id, type, name, phone, created_at, status").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Cars", value: totalCars ?? 0, icon: "🚗", color: "#0284c7", bg: "#f0f9ff", href: "/admin/cars" },
    { label: "Active Listings", value: activeCars ?? 0, icon: "✅", color: "#16a34a", bg: "#f0fdf4", href: "/admin/cars" },
    { label: "Cars Sold", value: soldCars ?? 0, icon: "🏷️", color: "#9333ea", bg: "#faf5ff", href: "/admin/cars" },
    { label: "Total Leads", value: totalLeads ?? 0, icon: "👥", color: "#ea580c", bg: "#fff7ed", href: "/admin/leads" },
    { label: "New Leads", value: newLeads ?? 0, icon: "🔔", color: "#dc2626", bg: "#fff1f2", href: "/admin/leads" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back — here&apos;s your overview</p>
        </div>
        <Link href="/admin/cars/new" className={styles.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Car
        </Link>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={styles.statCard} style={{ "--stat-color": s.color, "--stat-bg": s.bg } as React.CSSProperties}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Two column: recent cars + recent leads */}
      <div className={styles.grid2}>
        {/* Recent Cars */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Car Listings</h2>
            <Link href="/admin/cars" className={styles.cardLink}>View all →</Link>
          </div>
          {recentCars && recentCars.length > 0 ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Year</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCars.map((car) => (
                    <tr key={car.id}>
                      <td>
                        <Link href={`/admin/cars/${car.id}/edit`} className={styles.tableLink}>
                          {car.make} {car.model}
                        </Link>
                      </td>
                      <td>{car.year}</td>
                      <td>
                        <span className={`${styles.badge} ${car.is_sold ? styles.badgeSold : styles.badgeActive}`}>
                          {car.is_sold ? "Sold" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>No car listings yet. <Link href="/admin/cars/new">Add one →</Link></div>
          )}
        </div>

        {/* Recent Leads */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Leads</h2>
            <Link href="/admin/leads" className={styles.cardLink}>View all →</Link>
          </div>
          {recentLeads && recentLeads.length > 0 ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <span className={styles.leadName}>{lead.name}</span>
                        <span className={styles.leadPhone}>{lead.phone}</span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${lead.type === "sell" ? styles.badgeSell : styles.badgeExchange}`}>
                          {lead.type === "sell" ? "Sell" : "Exchange"}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${
                          lead.status === "new" ? styles.badgeNew
                          : lead.status === "contacted" ? styles.badgeContacted
                          : styles.badgeClosed
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>No leads yet. They will appear here when customers submit forms.</div>
          )}
        </div>
      </div>
    </div>
  );
}
