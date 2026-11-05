CREATE TYPE public.app_role AS ENUM ('admin', 'ops_manager', 'guide', 'finance');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL,
  travel_dates TEXT NOT NULL DEFAULT '',
  party_size INTEGER NOT NULL DEFAULT 1,
  nationality TEXT NOT NULL DEFAULT 'non_resident',
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website',
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planned',
  lead_guide TEXT NOT NULL DEFAULT '',
  capacity INTEGER NOT NULL DEFAULT 12,
  guest_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.crew_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'porter',
  days_worked INTEGER NOT NULL DEFAULT 0,
  daily_rate_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  advance_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  gate_balance_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crew_assignments TO authenticated;
GRANT ALL ON public.crew_assignments TO service_role;
ALTER TABLE public.crew_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.gear_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'camp',
  quantity INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 0,
  daily_rate_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'good',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gear_inventory TO authenticated;
GRANT ALL ON public.gear_inventory TO service_role;
ALTER TABLE public.gear_inventory ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.fleet_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'safari_4x4',
  quantity INTEGER NOT NULL DEFAULT 1,
  available INTEGER NOT NULL DEFAULT 1,
  daily_rate_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  service_mode TEXT NOT NULL DEFAULT 'chauffeur',
  features TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fleet_inventory TO authenticated;
GRANT ALL ON public.fleet_inventory TO service_role;
ALTER TABLE public.fleet_inventory ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'permit',
  storage_path TEXT NOT NULL,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.is_operations_staff()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'ops_manager', 'guide', 'finance')
  )
$$;
REVOKE ALL ON FUNCTION public.is_operations_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_operations_staff() TO authenticated;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC;
CREATE TRIGGER on_auth_user_created_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_new_user();

CREATE POLICY "Users view their own profile or admins view all" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role('admin'::public.app_role));
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view their own roles and admins view all" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role('admin'::public.app_role));
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role)) WITH CHECK (public.has_role('admin'::public.app_role));
CREATE POLICY "Public can submit tour inquiries" ON public.inquiries FOR INSERT TO anon WITH CHECK (char_length(name) BETWEEN 2 AND 140 AND char_length(email) BETWEEN 5 AND 254 AND char_length(service) BETWEEN 2 AND 160 AND party_size BETWEEN 1 AND 30);
CREATE POLICY "Operations staff manage inquiries" ON public.inquiries FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage trips" ON public.trips FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage crew assignments" ON public.crew_assignments FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage gear inventory" ON public.gear_inventory FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage fleet inventory" ON public.fleet_inventory FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage document metadata" ON public.documents FOR ALL TO authenticated USING (public.is_operations_staff()) WITH CHECK (public.is_operations_staff());
CREATE POLICY "Operations staff manage private operations documents" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('operations-vault', 'ops-documents') AND public.is_operations_staff()) WITH CHECK (bucket_id IN ('operations-vault', 'ops-documents') AND public.is_operations_staff());