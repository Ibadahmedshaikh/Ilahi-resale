import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import CarForm from "../../CarForm";
import type { Metadata } from "next";
import styles from "./page.module.css";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit ${decodeURIComponent(id)}` };
}

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !car) notFound();

  const initialData = {
    id: car.id,
    make: car.make ?? "",
    model: car.model ?? "",
    variant: car.variant ?? "",
    year: car.year ?? "",
    fuel_type: car.fuel_type ?? "Petrol",
    transmission: car.transmission ?? "Manual",
    km_driven: car.km_driven ?? "",
    ownership: car.ownership ?? "1st Owner",
    body_type: car.body_type ?? "Hatchback",
    color: car.color ?? "",
    rto_state: car.rto_state ?? "Maharashtra",
    features: Array.isArray(car.features) ? car.features.join(", ") : "",
    is_featured: car.is_featured ?? false,
    is_new: car.is_new ?? false,
    is_sold: car.is_sold ?? false,
    inspection_engine: car.inspection_engine ?? "Good",
    inspection_body: car.inspection_body ?? "Good",
    inspection_interior: car.inspection_interior ?? "Good",
    inspection_electricals: car.inspection_electricals ?? "Good",
    inspection_tyres: car.inspection_tyres ?? "Good",
    inspection_brakes: car.inspection_brakes ?? "Good",
    inspection_notes: car.inspection_notes ?? "",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/cars" className={styles.backLink}>
            ← Back to Listings
          </Link>
          <h1 className={styles.pageTitle}>
            Edit — {car.year} {car.make} {car.model}
          </h1>
        </div>
      </div>
      <CarForm mode="edit" initialData={initialData} existingPhotos={car.photos ?? []} />
    </div>
  );
}
