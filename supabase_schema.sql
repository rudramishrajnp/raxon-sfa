-- ============================================================================
-- RAXON PHARMA SFA: PRODUCTION SUPABASE POSTGRESQL DDL & RLS MIGRATION (PHASE-1)
-- FINAL HARDENED SECURITY PATCH: IMMUTABLE ROLES, AUTHORIZATION & SECURE RPC
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SECURITY DEFINER CONTEXT RESOLUTION FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT COALESCE(role, 'ANONYMOUS')
  FROM public.user_profiles 
  WHERE id = (auth.uid())::text 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_company_id()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT COALESCE(company_id, '')
  FROM public.user_profiles 
  WHERE id = (auth.uid())::text 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_division_id()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT COALESCE(division_id, '')
  FROM public.user_profiles 
  WHERE id = (auth.uid())::text 
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_auth_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_role() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_auth_company_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_company_id() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_auth_division_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_division_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. TABLE DEFINITIONS (22 RELATIONAL & MASTER STORES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY, -- Auth UUID from auth.users
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  division_id TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'MEDICAL_REPRESENTATIVE',
  email TEXT,
  name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dcrs (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  division_id TEXT DEFAULT '',
  user_id TEXT NOT NULL,
  user_name TEXT,
  call_date TEXT NOT NULL,
  area TEXT,
  total_pob NUMERIC DEFAULT 0,
  calls JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mtps (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  division_id TEXT DEFAULT '',
  user_id TEXT NOT NULL,
  user_name TEXT,
  manager_id TEXT,
  month_year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  days JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pob_approvals (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  division_id TEXT DEFAULT '',
  user_id TEXT NOT NULL,
  requests JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expense_policies (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  policies JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expense_claims (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  claims JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gps_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  accuracy NUMERIC,
  source TEXT,
  timestamp BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sync_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  division_id TEXT DEFAULT '',
  executor_uid TEXT,
  executor_email TEXT,
  action TEXT NOT NULL,
  action_type TEXT,
  entity_type TEXT,
  entity_id TEXT,
  new_values JSONB DEFAULT '{}'::jsonb,
  source TEXT DEFAULT 'WEB_SFA',
  migration_version TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_meta (
  id TEXT PRIMARY KEY,
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mail_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  text_body TEXT,
  html_body TEXT,
  type TEXT,
  status TEXT DEFAULT 'PENDING_DELIVERY',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mail_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  channel TEXT,
  message_id TEXT,
  success BOOLEAN DEFAULT true,
  error TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Master Stores (Phase-1 JSONB Model)
CREATE TABLE IF NOT EXISTS public.company_employees (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  employees JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.master_doctors (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  doctors JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.master_chemists (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  chemists JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.master_stockists (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  stockists JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.master_products (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.master_samples (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  samples JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.headquarters (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  headquarters JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.territories (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sample_inventory (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  samples JSONB DEFAULT '[]'::jsonb,
  gifts JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sample_audit_logs (
  company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. UNIFIED SECURITY GUARD TRIGGER (SUPER_ADMIN + ROLE IMMUTABILITY)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.guard_user_profile_security()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_caller_uid TEXT := (auth.uid())::text;
  v_caller_role TEXT;
  v_caller_company TEXT;
BEGIN
  -- Resolve caller identity
  SELECT COALESCE(role, 'ANONYMOUS'), COALESCE(company_id, '')
  INTO v_caller_role, v_caller_company
  FROM public.user_profiles
  WHERE id = v_caller_uid
  LIMIT 1;

  -- 1. SUPER_ADMIN DELETION & DEMOTION PROTECTION
  IF TG_OP = 'DELETE' AND OLD.role = 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'CRITICAL: Protected Platform SUPER_ADMIN account cannot be deleted.';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'SUPER_ADMIN' AND NEW.role <> 'SUPER_ADMIN' THEN
      RAISE EXCEPTION 'CRITICAL: Protected Platform SUPER_ADMIN role cannot be demoted.';
    END IF;

    IF OLD.role = 'SUPER_ADMIN' AND (NEW.company_id IS NOT NULL AND NEW.company_id <> '') THEN
      RAISE EXCEPTION 'CRITICAL: Platform SUPER_ADMIN cannot be bound to a single tenant company.';
    END IF;

    -- 2. PRIVILEGE ESCALATION: Non-SUPER_ADMIN cannot grant SUPER_ADMIN
    IF v_caller_role <> 'SUPER_ADMIN' AND NEW.role = 'SUPER_ADMIN' AND OLD.role <> 'SUPER_ADMIN' THEN
      RAISE EXCEPTION 'FORBIDDEN: Only Platform SUPER_ADMIN can grant SUPER_ADMIN privileges.';
    END IF;

    -- 3. DIRECT SELF-UPDATE LOCKDOWN: Users cannot modify authorization fields on self
    IF v_caller_uid = OLD.id AND v_caller_role <> 'SUPER_ADMIN' THEN
      IF NEW.role <> OLD.role THEN
        RAISE EXCEPTION 'FORBIDDEN: You are not authorized to modify your own role.';
      END IF;

      IF COALESCE(NEW.company_id, '') <> COALESCE(OLD.company_id, '') THEN
        RAISE EXCEPTION 'FORBIDDEN: You are not authorized to modify your assigned company.';
      END IF;

      IF COALESCE(NEW.division_id, '') <> COALESCE(OLD.division_id, '') THEN
        RAISE EXCEPTION 'FORBIDDEN: You are not authorized to modify your assigned division.';
      END IF;

      IF NEW.status <> OLD.status THEN
        RAISE EXCEPTION 'FORBIDDEN: You are not authorized to modify your account status.';
      END IF;

      IF NEW.email <> OLD.email THEN
        RAISE EXCEPTION 'FORBIDDEN: Email modifications must be performed via Supabase Auth verification.';
      END IF;

      -- 4. JSONB AUTHORIZATION SANITIZATION
      NEW.data := OLD.data || jsonb_build_object(
        'name', COALESCE(NEW.data->>'name', NEW.name),
        'phone', COALESCE(NEW.data->>'phone', NEW.phone),
        'avatarUrl', COALESCE(NEW.data->>'avatarUrl', OLD.data->>'avatarUrl'),
        'avatarBg', COALESCE(NEW.data->>'avatarBg', OLD.data->>'avatarBg'),
        'initials', COALESCE(NEW.data->>'initials', OLD.data->>'initials')
      );
      NEW.data := jsonb_set(NEW.data, '{role}', to_jsonb(OLD.role));
      NEW.data := jsonb_set(NEW.data, '{companyId}', to_jsonb(OLD.company_id));
      NEW.data := jsonb_set(NEW.data, '{divisionId}', to_jsonb(OLD.division_id));
      NEW.data := jsonb_set(NEW.data, '{status}', to_jsonb(OLD.status));
    END IF;

    -- 5. SYSTEM_ADMIN CROSS-TENANT BOUNDARY
    IF v_caller_role = 'SYSTEM_ADMIN' AND v_caller_uid <> OLD.id THEN
      IF OLD.company_id <> v_caller_company OR NEW.company_id <> v_caller_company THEN
        RAISE EXCEPTION 'FORBIDDEN: Company Administrators can only manage users within their assigned company.';
      END IF;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_user_profile_security ON public.user_profiles;
CREATE TRIGGER trg_guard_user_profile_security
  BEFORE UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_profile_security();

-- ============================================================================
-- 4. SECURE SELF PROFILE UPDATE RPC (APPROVED PERSONAL FIELDS ONLY)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_my_profile(
  p_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_avatar_bg TEXT DEFAULT NULL,
  p_initials TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid TEXT := (auth.uid())::text;
  v_updated_profile JSONB;
BEGIN
  IF v_uid IS NULL OR v_uid = '' THEN
    RAISE EXCEPTION 'UNAUTHORIZED: User must be authenticated to update profile.';
  END IF;

  UPDATE public.user_profiles
  SET
    name = COALESCE(NULLIF(TRIM(p_name), ''), name),
    phone = COALESCE(NULLIF(TRIM(p_phone), ''), phone),
    data = data || jsonb_build_object(
      'name', COALESCE(NULLIF(TRIM(p_name), ''), name),
      'phone', COALESCE(NULLIF(TRIM(p_phone), ''), phone),
      'avatarUrl', COALESCE(p_avatar_url, data->>'avatarUrl'),
      'avatarBg', COALESCE(p_avatar_bg, data->>'avatarBg'),
      'initials', COALESCE(p_initials, data->>'initials')
    ),
    updated_at = NOW()
  WHERE id = v_uid
  RETURNING to_jsonb(user_profiles.*) INTO v_updated_profile;

  RETURN v_updated_profile;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_my_profile(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_my_profile(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- 5. VERIFIED AUTH EMAIL SYNCHRONIZATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_auth_user_email_sync()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.email IS NOT NULL AND (OLD.email IS NULL OR NEW.email <> OLD.email) THEN
    UPDATE public.user_profiles
    SET email = NEW.email, updated_at = NOW()
    WHERE id = (NEW.id)::text;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_user_email_sync ON auth.users;
CREATE TRIGGER trg_auth_user_email_sync
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_email_sync();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dcrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mtps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pob_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_chemists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_stockists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.headquarters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Policies: companies
DROP POLICY IF EXISTS "companies_select" ON public.companies;
DROP POLICY IF EXISTS "companies_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_update" ON public.companies;
DROP POLICY IF EXISTS "companies_delete" ON public.companies;

CREATE POLICY "companies_select" ON public.companies FOR SELECT
  USING (id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "companies_insert" ON public.companies FOR INSERT
  WITH CHECK (public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "companies_update" ON public.companies FOR UPDATE
  USING (id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN')
  WITH CHECK (id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "companies_delete" ON public.companies FOR DELETE
  USING (public.get_auth_role() = 'SUPER_ADMIN');

-- Policies: user_profiles
DROP POLICY IF EXISTS "user_profiles_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete" ON public.user_profiles;

CREATE POLICY "user_profiles_select" ON public.user_profiles FOR SELECT
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN' OR id = (auth.uid())::text);
CREATE POLICY "user_profiles_insert" ON public.user_profiles FOR INSERT
  WITH CHECK (
    public.get_auth_role() = 'SUPER_ADMIN' OR
    (public.get_auth_role() = 'SYSTEM_ADMIN' AND company_id = public.get_auth_company_id() AND role <> 'SUPER_ADMIN')
  );
CREATE POLICY "user_profiles_update" ON public.user_profiles FOR UPDATE
  USING (
    public.get_auth_role() = 'SUPER_ADMIN' OR
    (public.get_auth_role() = 'SYSTEM_ADMIN' AND company_id = public.get_auth_company_id() AND role <> 'SUPER_ADMIN')
  )
  WITH CHECK (
    public.get_auth_role() = 'SUPER_ADMIN' OR
    (public.get_auth_role() = 'SYSTEM_ADMIN' AND company_id = public.get_auth_company_id() AND role <> 'SUPER_ADMIN')
  );
CREATE POLICY "user_profiles_delete" ON public.user_profiles FOR DELETE
  USING (
    public.get_auth_role() = 'SUPER_ADMIN' OR
    (public.get_auth_role() = 'SYSTEM_ADMIN' AND company_id = public.get_auth_company_id() AND role <> 'SUPER_ADMIN')
  );

-- Policies: dcrs
DROP POLICY IF EXISTS "dcrs_select" ON public.dcrs;
DROP POLICY IF EXISTS "dcrs_insert" ON public.dcrs;
DROP POLICY IF EXISTS "dcrs_update" ON public.dcrs;
DROP POLICY IF EXISTS "dcrs_delete" ON public.dcrs;

CREATE POLICY "dcrs_select" ON public.dcrs FOR SELECT
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "dcrs_insert" ON public.dcrs FOR INSERT
  WITH CHECK ((company_id = public.get_auth_company_id() AND user_id = (auth.uid())::text) OR public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "dcrs_update" ON public.dcrs FOR UPDATE
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN')
  WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "dcrs_delete" ON public.dcrs FOR DELETE
  USING ((company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN')) OR public.get_auth_role() = 'SUPER_ADMIN');

-- Policies: mtps
DROP POLICY IF EXISTS "mtps_select" ON public.mtps;
DROP POLICY IF EXISTS "mtps_insert" ON public.mtps;
DROP POLICY IF EXISTS "mtps_update" ON public.mtps;
DROP POLICY IF EXISTS "mtps_delete" ON public.mtps;

CREATE POLICY "mtps_select" ON public.mtps FOR SELECT
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "mtps_insert" ON public.mtps FOR INSERT
  WITH CHECK ((company_id = public.get_auth_company_id() AND user_id = (auth.uid())::text) OR public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "mtps_update" ON public.mtps FOR UPDATE
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN')
  WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "mtps_delete" ON public.mtps FOR DELETE
  USING ((company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN')) OR public.get_auth_role() = 'SUPER_ADMIN');

-- Master Data Tables RLS Policies
DO $$
DECLARE
  tbl TEXT;
  master_tables TEXT[] := ARRAY[
    'pob_approvals', 'expense_policies', 'expense_claims', 'company_employees',
    'master_doctors', 'master_chemists', 'master_stockists', 'master_products',
    'master_samples', 'headquarters', 'territories', 'sample_inventory',
    'sample_audit_logs'
  ];
BEGIN
  FOREACH tbl IN ARRAY master_tables LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "%s_select" ON public.%I;
      DROP POLICY IF EXISTS "%s_write" ON public.%I;
      CREATE POLICY "%s_select" ON public.%I FOR SELECT
        USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = ''SUPER_ADMIN'');
      CREATE POLICY "%s_write" ON public.%I FOR ALL
        USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = ''SUPER_ADMIN'')
        WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = ''SUPER_ADMIN'');
    ', tbl, tbl, tbl, tbl, tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- Policies: gps_pings, sync_audit_logs, system_meta, mail_queue, mail_logs
DROP POLICY IF EXISTS "gps_pings_select" ON public.gps_pings;
DROP POLICY IF EXISTS "gps_pings_insert" ON public.gps_pings;
CREATE POLICY "gps_pings_select" ON public.gps_pings FOR SELECT
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "gps_pings_insert" ON public.gps_pings FOR INSERT
  WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');

DROP POLICY IF EXISTS "sync_audit_logs_select" ON public.sync_audit_logs;
DROP POLICY IF EXISTS "sync_audit_logs_insert" ON public.sync_audit_logs;
CREATE POLICY "sync_audit_logs_select" ON public.sync_audit_logs FOR SELECT
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');
CREATE POLICY "sync_audit_logs_insert" ON public.sync_audit_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "system_meta_select" ON public.system_meta;
DROP POLICY IF EXISTS "system_meta_write" ON public.system_meta;
CREATE POLICY "system_meta_select" ON public.system_meta FOR SELECT USING (true);
CREATE POLICY "system_meta_write" ON public.system_meta FOR ALL
  USING (public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN'))
  WITH CHECK (public.get_auth_role() IN ('SYSTEM_ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "mail_queue_all" ON public.mail_queue;
CREATE POLICY "mail_queue_all" ON public.mail_queue FOR ALL
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN')
  WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');

DROP POLICY IF EXISTS "mail_logs_all" ON public.mail_logs;
CREATE POLICY "mail_logs_all" ON public.mail_logs FOR ALL
  USING (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN')
  WITH CHECK (company_id = public.get_auth_company_id() OR public.get_auth_role() = 'SUPER_ADMIN');

-- ============================================================================
-- 7. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_comp_role ON public.user_profiles(company_id, role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_dcrs_comp_user_date ON public.dcrs(company_id, user_id, call_date);
CREATE INDEX IF NOT EXISTS idx_dcrs_comp_date ON public.dcrs(company_id, call_date);
CREATE INDEX IF NOT EXISTS idx_mtps_comp_user_month ON public.mtps(company_id, user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_mtps_comp_manager_status ON public.mtps(company_id, manager_id, status);
CREATE INDEX IF NOT EXISTS idx_gps_pings_comp_user_time ON public.gps_pings(company_id, user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_audit_comp_time ON public.sync_audit_logs(company_id, timestamp DESC);

-- ============================================================================
-- 8. REALTIME PUBLICATION CONFIGURATION
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.dcrs;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.mtps;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.pob_approvals;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_claims;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
