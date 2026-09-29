import type { Metadata } from "next";
import AdminShell from "./AdminShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: { default: "Admin — Ilahi Resale", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  return <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>;
}
