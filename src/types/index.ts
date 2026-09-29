export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
export type Transmission = "Manual" | "Automatic";
export type Ownership = "1st Owner" | "2nd Owner" | "3rd Owner";
export type BodyType =
  | "Hatchback"
  | "Sedan"
  | "SUV"
  | "MPV"
  | "Crossover"
  | "Pickup";

export interface InspectionReport {
  engine: "Good" | "Excellent";
  body: "Good" | "Excellent";
  interior: "Good" | "Excellent";
  electricals: "Good" | "Excellent";
  tyres: "Good" | "Excellent";
  brakes: "Good" | "Excellent";
  notes?: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuelType: FuelType;
  transmission: Transmission;
  kmDriven: number;
  ownership: Ownership;
  bodyType: BodyType;
  color: string;
  rtoState: string;
  photos: string[];
  inspection: InspectionReport;
  features: string[];
  isFeatured: boolean;
  isNew: boolean;
  addedAt: string; // ISO date string
  isSold?: boolean;
}

export interface LeadFormData {
  name: string;
  phone: string;
  carBrand: string;
  carModel: string;
  year: string;
  kmDriven: string;
  city: string;
  type: "sell" | "exchange";
  exchangeCarId?: string;
}

export type FilterState = {
  brand: string;
  fuelType: string;
  transmission: string;
  ownership: string;
  bodyType: string;
  yearMin: string;
  yearMax: string;
};

export type SortOption = "newest" | "year-desc" | "year-asc" | "km-asc" | "km-desc";
