# Product Requirements Document — ilahi Resale

## 1. Overview

**Business Name:** ilahi Resale
**Location:** Mundgod (base of operations, inspection & inventory)
**Business Type:** Owned-inventory used car reselling — website-only (no app)

ilahi Resale buys used cars (first-owner or second-owner, in good condition) directly from sellers, inspects them thoroughly (engine and full mechanical/cosmetic check), and resells them to buyers across India. The website acts as a **catalog + lead-generation** platform — buyers browse cars and contact ilahi Resale directly over WhatsApp to inquire, negotiate price, and close the deal offline.

## 2. Business Model

- **Owned Inventory:** ilahi Resale purchases the car outright, inspects/reconditions it, then lists and resells it. ilahi Resale owns the car during the resale period (not a marketplace connecting third-party sellers to buyers).
- **Sell-to-us:** Any individual can contact ilahi Resale to sell their car to the business.
- **Exchange:** A seller can trade in their car and receive another car from ilahi Resale's inventory (exchange flow).
- **Pricing:** No prices are displayed publicly on the website. All pricing is discussed directly over WhatsApp/call after inquiry — likely because prices are negotiable and vary based on condition, so keeping this offline gives the team pricing flexibility.

## 3. Goals

1. Showcase ilahi Resale's current inventory of inspected, quality cars to a nationwide audience.
2. Generate high-intent WhatsApp inquiries for specific car models with zero friction.
3. Build trust through transparency around inspection/condition (engine check, no major/minor issues).
4. Capture "sell your car to us" and "exchange" leads from the general public.
5. Give the ilahi Resale team an easy way to manage (add/edit/remove) listings without technical help.

## 4. Users & Roles

| Role | Description |
|---|---|
| **Buyer (Visitor)** | Browses cars, uses filters, views car details, taps "Inquire on WhatsApp" — no login required. |
| **Seller (Visitor)** | Wants to sell their car to ilahi Resale, or exchange it — submits basic car details, contacted by team. |
| **Admin (ilahi Resale team)** | Logs into an admin panel to add/edit/remove car listings, mark cars as sold, manage incoming sell/exchange leads. |

*Assumption: Buyers do not need an account/login since the entire contact flow is WhatsApp-based. This keeps the buying side frictionless. Only Admin has a login.*

## 5. Core Features

### 5.1 Homepage
- Hero section introducing ilahi Resale (Mundgod-based, pan-India delivery, inspected cars).
- Featured/recently added cars.
- Quick search bar (by brand/model/city).
- "Sell your car" / "Exchange your car" call-to-action.

### 5.2 Car Listings Page
- Grid/list of all available cars.
- Each card shows: photo(s), model name, year, fuel type, transmission, mileage (km driven), ownership (1st/2nd owner), inspection badge (e.g., "Engine Inspected ✅") — **no price shown**.

### 5.3 Search & Filters
- Filters: Brand, Model, Year range, Fuel type (Petrol/Diesel/CNG/EV), Transmission (Manual/Automatic), Ownership (1st/2nd/3rd owner), Body type (Sedan/SUV/Hatchback etc.), Budget range (optional — even without showing exact price, a rough budget filter can help buyers narrow down, to be discussed).
- Sort by: Newest listed, Year, Mileage.

### 5.4 Car Detail Page
- Full photo gallery.
- Full specs: make, model, variant, year, km driven, fuel type, transmission, ownership, color, registration state/RTO (if relevant), inspection notes/checklist.
- Condition/inspection summary (engine, body, interior — confirming no major/minor issues).
- **Inquire on WhatsApp** button (see 5.5).

### 5.5 WhatsApp Inquiry Flow (Core Feature)
- No price listing, no in-site messaging/contact form for buying.
- "Inquire Now" button generates a **WhatsApp deep link** (`https://wa.me/<ilahi-resale-number>?text=<prefilled-message>`).
- Pre-filled message auto-includes the specific car's details, e.g.:
  > "Hi ilahi Resale, I'm interested in the [2019 Maruti Swift VXI, Petrol, 45,000 km] listed on your website. Could you share more details and the price?"
- Tapping the button opens WhatsApp (web or app) with this message ready to send — one tap for the buyer.

### 5.6 Sell Your Car to Us
- Simple form (or WhatsApp deep link) where a seller submits: name, phone, car brand/model, year, km driven, city.
- Submits either as a lead in the admin panel and/or opens a pre-filled WhatsApp message like:
  > "Hi ilahi Resale, I want to sell my [Brand Model, Year] car. Please contact me."
- Admin sees this in a "Sell Leads" section of the admin panel.

### 5.7 Exchange Your Car
- Similar form/flow to "Sell Your Car," but flagged as an exchange request, so the team knows the seller wants a replacement car rather than a payout.
- Optionally lets the seller pick a car from current inventory they're interested in exchanging for.

### 5.8 Admin Panel
- Secure login for the ilahi Resale team.
- Add new car listing (upload multiple photos, enter all specs/condition notes).
- Edit existing listing.
- Mark a car as "Sold" (removes from public site or shows a "Sold" badge).
- View and manage incoming "Sell" and "Exchange" leads.
- Delete listings.

## 6. Explicitly Out of Scope (V1)

- No mobile app (Android/iOS) — website only.
- No price display anywhere on the public site.
- No online payment or deposit/booking flow — all transactions happen offline after WhatsApp contact.
- No buyer accounts/login.
- No financing/loan calculator (can be considered later).

## 7. Non-Functional Requirements

- **Mobile-first design** — most inquiries will likely come from mobile users tapping through to WhatsApp.
- **Fast image loading** — car photos are central to buyer trust; needs optimized image handling/gallery.
- **Pan-India relevance** — copy and design should reflect that ilahi Resale ships/delivers cars across India, not just Mundgod/Karnataka.
- **Trust signals** — inspection checklist, "1st/2nd owner" transparency, and possibly customer testimonials should be prominent.

## 8. Success Metrics

- Number of WhatsApp inquiries generated per listing / per month.
- Number of "Sell your car" and "Exchange" leads captured.
- Time-to-sale per listed car (tracked via admin panel "sold" marking).
- Website traffic and top-performing car models (by inquiry count).

## 9. Future Scope (Post V1)

- Optional price ranges or "starting from ₹X" to reduce unqualified inquiries.
- Customer testimonials/reviews section.
- Financing partner integration.
- Native mobile app.
- Multi-language support (Hindi, Kannada, etc.) given pan-India reach.
