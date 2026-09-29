import { WHATSAPP_NUMBER, BUSINESS_NAME } from "./constants";
import { Car } from "@/types";

/**
 * Generates a WhatsApp deep link for a specific car inquiry
 */
export function carInquiryLink(car: Car): string {
  const message = `Hi ${BUSINESS_NAME}, I'm interested in the ${car.year} ${car.make} ${car.model} ${car.variant} (${car.fuelType}, ${car.transmission}, ${formatKmRaw(car.kmDriven)} km) listed on your website. Could you please share more details and the price?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp deep link for selling a car
 */
export function sellCarLink(data: {
  name: string;
  carBrand: string;
  carModel: string;
  year: string;
  kmDriven: string;
  city: string;
}): string {
  const message = `Hi ${BUSINESS_NAME}, my name is ${data.name}. I want to sell my ${data.year} ${data.carBrand} ${data.carModel} (${data.kmDriven} km driven) from ${data.city}. Please contact me.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp deep link for exchanging a car
 */
export function exchangeCarLink(data: {
  name: string;
  carBrand: string;
  carModel: string;
  year: string;
  kmDriven: string;
  city: string;
  wantedCar?: string;
}): string {
  const wantedPart = data.wantedCar
    ? ` I'm interested in exchanging it for the ${data.wantedCar} from your inventory.`
    : " I would like to explore exchange options from your inventory.";
  const message = `Hi ${BUSINESS_NAME}, my name is ${data.name}. I want to exchange my ${data.year} ${data.carBrand} ${data.carModel} (${data.kmDriven} km driven) from ${data.city}.${wantedPart} Please contact me.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * General inquiry WhatsApp link (no specific car)
 */
export function generalInquiryLink(): string {
  const message = `Hi ${BUSINESS_NAME}, I'd like to know more about your car listings. Please help me.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatKmRaw(km: number): string {
  return km.toLocaleString("en-IN");
}
