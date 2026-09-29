-- =============================================================
-- Ilahi Resale — Initial Schema
-- =============================================================

-- ── Table: cars ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cars (
  id                    text PRIMARY KEY,
  make                  text NOT NULL,
  model                 text NOT NULL,
  variant               text,
  year                  integer NOT NULL,
  fuel_type             text,
  transmission          text,
  km_driven             integer,
  ownership             text,
  body_type             text,
  color                 text,
  rto_state             text,
  photos                text[],
  features              text[],
  is_featured           boolean DEFAULT false,
  is_new                boolean DEFAULT false,
  is_sold               boolean DEFAULT false,
  added_at              timestamptz DEFAULT now(),
  inspection_engine     text DEFAULT 'Good',
  inspection_body       text DEFAULT 'Good',
  inspection_interior   text DEFAULT 'Good',
  inspection_electricals text DEFAULT 'Good',
  inspection_tyres      text DEFAULT 'Good',
  inspection_brakes     text DEFAULT 'Good',
  inspection_notes      text
);

-- ── Table: leads ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('sell', 'exchange')),
  name        text NOT NULL,
  phone       text NOT NULL,
  car_brand   text,
  car_model   text,
  year        text,
  km_driven   text,
  city        text,
  wanted_car  text,
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at  timestamptz DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public can read non-sold cars
CREATE POLICY "Public read active cars"
  ON public.cars FOR SELECT
  USING (is_sold = false);

-- Authenticated users (admin) can do everything on cars
CREATE POLICY "Admin full access to cars"
  ON public.cars FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public can insert leads
CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admin) can read leads
CREATE POLICY "Admin can read leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can update leads
CREATE POLICY "Admin can update leads"
  ON public.leads FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Storage Bucket: car-images ────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view car images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

CREATE POLICY "Admin can upload car images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete car images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');
