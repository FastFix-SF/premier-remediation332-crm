-- ============================================================================
-- FastFix CRM - Complete Local Schema Migration
-- Brings local dev DB to parity with frontend expectations
-- Source of truth: src/integrations/supabase/types.ts
-- Generated: 2026-02-09
-- Safe to re-run: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- Run with: sudo docker exec -i fastfix-postgres psql -U postgres -d fastfix -f /dev/stdin < local/complete_schema_migration.sql
-- ============================================================================

-- ============================================================================
-- PART 1: ALTER EXISTING TABLES (add missing columns)
-- ============================================================================
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS ai_measurements JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS ai_measurements_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS ai_measurements_updated_at TIMESTAMPTZ;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS converted_to_project_at TIMESTAMPTZ;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS crop_meta JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS edges JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS enhanced_roi_image_url TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS existing_roof TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS existing_roof_deck TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS facets JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS imagery_scale_meta JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS imagery_transform JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS insulation TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS material_items JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS measurements JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS pins JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS pitch_schema JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS pitches JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS project_manager_id UUID;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS project_variables JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS property_address TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS reference_line JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS rf_items JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_image_bearing NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_image_center_lat NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_image_center_lng NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_image_url TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_image_zoom NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roi_summary JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roof_roi JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS roof_seed JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS sales_representative_id UUID;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS selected_imagery JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS services_items JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS shingles_items JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS site_manager_id UUID;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS template_configurations JSONB;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS wanted_roof TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS wanted_roof_deck TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS additional_contact TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_labor NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_materials NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_overhead NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cf_project_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_access_settings JSONB;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_phone TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS connecteam_job_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS connecteam_last_labor_sync_at TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS connectteam_job_code_norm TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS connectteam_job_code_raw TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS connectteam_job_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contract_amount NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contractor_address TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contractor_company_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contractor_contact_person TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contractor_email TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contractor_phone TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS customer_access_granted BOOLEAN;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS customer_rating NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS existing_roof TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS existing_roof_deck TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS external_ref TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS insulation TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_contractor_managed BOOLEAN;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_public BOOLEAN;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS labels TEXT[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS original_scope TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_category TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_manager_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS quote_request_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS rating_submitted_at TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS retention_percentage NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS roof_type TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sales_representative_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS site_manager_id UUID;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS stopped_date TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS target_gp_percentage NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS wanted_roof TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS wanted_roof_deck TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS warranty_months NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS warranty_start_date TIMESTAMPTZ;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS balance_due NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS credit_card_fee NUMERIC;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS customer_id UUID;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS estimate_id UUID;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS online_payment_enabled BOOLEAN;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS period_end_date TIMESTAMPTZ;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS period_start_date TIMESTAMPTZ;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS project_address TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS project_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS retainage_percent NUMERIC;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_rate NUMERIC;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS qualification_data JSONB;
ALTER TABLE public.team_updates ADD COLUMN IF NOT EXISTS background_color TEXT NOT NULL DEFAULT '#ffffff';
ALTER TABLE public.team_updates ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.team_updates ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS camera_on BOOLEAN;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS class_code TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS current_room_id TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS in_call_with TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS invite_token TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS invited_by UUID;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS push_token TEXT;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS sms_notifications_enabled BOOLEAN;
ALTER TABLE public.team_directory ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;


-- ============================================================================
-- PART 2: FK STUB TABLES (needed before child tables in P5-P8)
-- ============================================================================
CREATE TABLE IF NOT EXISTS signature_envelopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT, status TEXT DEFAULT 'draft', created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS envelope_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  envelope_id UUID REFERENCES signature_envelopes(id) ON DELETE CASCADE,
  name TEXT, email TEXT, role TEXT DEFAULT 'signer', status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PART 3: CREATE NEW TABLES (P1-P4, 52 tables)
-- ============================================================================

-- PRIORITY 1 -- Core Forms (Tables #1-15)

-- #1  mt_business_profiles
-- Source: types.ts line 6490
CREATE TABLE IF NOT EXISTS mt_business_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           UUID NOT NULL REFERENCES businesses(id) ON DELETE SET NULL,
  business_name         TEXT NOT NULL,
  address               TEXT,
  city                  TEXT,
  state                 TEXT,
  zip                   TEXT,
  phone                 TEXT,
  email                 TEXT,
  description           TEXT,
  tagline               TEXT,
  hours                 TEXT,
  license_number        TEXT,
  owner_name            TEXT,
  owner_bio             TEXT,
  owner_photo_url       TEXT,
  employees_count       TEXT,
  founded_year          NUMERIC,
  years_in_business     NUMERIC,
  google_place_id       TEXT,
  google_business_url   TEXT,
  google_average_rating NUMERIC,
  google_total_reviews  NUMERIC,
  hero_headline         TEXT,
  hero_subheadline      TEXT,
  hero_highlight        TEXT,
  hero_cta_primary      TEXT,
  hero_cta_secondary    TEXT,
  hero_image_url        TEXT,
  hero_video_url        TEXT,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- #2  tenant_edge_functions
-- Source: NOT in types.ts; derived from TenantContext.tsx / TenantOnboardingWizard.tsx
-- Columns observed: tenant_id, function_slug, is_enabled + FK to edge_function_catalog
CREATE TABLE IF NOT EXISTS tenant_edge_functions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  function_slug   TEXT NOT NULL,
  is_enabled      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, function_slug)
);

-- #3  tenant_services
-- Source: NOT in types.ts or frontend hooks; minimal definition
CREATE TABLE IF NOT EXISTS tenant_services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  service_name  TEXT NOT NULL,
  description   TEXT,
  is_active     BOOLEAN DEFAULT false,
  display_order NUMERIC,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- #4  tenant_service_areas
-- Source: NOT in types.ts or frontend hooks; minimal definition
CREATE TABLE IF NOT EXISTS tenant_service_areas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  area_name   TEXT NOT NULL,
  city        TEXT,
  state       TEXT,
  zip         TEXT,
  is_active   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- #5  tenant_faqs
-- Source: NOT in types.ts or frontend hooks; minimal definition
CREATE TABLE IF NOT EXISTS tenant_faqs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  question      TEXT NOT NULL,
  answer        TEXT,
  display_order NUMERIC,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- #6  tenant_branding
-- Source: NOT in types.ts or frontend hooks; minimal definition
CREATE TABLE IF NOT EXISTS tenant_branding (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL UNIQUE,
  logo_url          TEXT,
  favicon_url       TEXT,
  primary_color     TEXT,
  secondary_color   TEXT,
  accent_color      TEXT,
  font_family       TEXT,
  custom_css        TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #7  sales_clients
-- Source: types.ts line 10929
CREATE TABLE IF NOT EXISTS sales_clients (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      TEXT NOT NULL,
  status                    TEXT NOT NULL DEFAULT 'lead',
  email                     TEXT,
  phone                     TEXT,
  address                   TEXT,
  assigned_to               TEXT,
  avatar_url                TEXT,
  business_name             TEXT,
  call_status               TEXT,
  chatbot_started_at        TIMESTAMPTZ,
  client_type               TEXT,
  company_size              TEXT,
  contact_name              TEXT,
  contract_end_date         TEXT,
  facebook_url              TEXT,
  google_business_url       TEXT,
  industry                  TEXT,
  instagram_handle          TEXT,
  last_chatbot_message_at   TIMESTAMPTZ,
  lead_source               TEXT,
  monthly_value             NUMERIC,
  notes                     TEXT,
  onboarding_date           TEXT,
  parent_client_id          UUID REFERENCES sales_clients(id) ON DELETE SET NULL,
  plan_start_date           TEXT,
  plan_type                 TEXT,
  preferred_contact_method  TEXT,
  preferred_language        TEXT,
  secondary_email           TEXT,
  secondary_phone           TEXT,
  service_area              TEXT,
  tiktok_handle             TEXT,
  timezone                  TEXT,
  website                   TEXT,
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);

-- #8  tasks  (alias for team_tasks -- the codebase uses team_tasks)
-- Source: types.ts line 13100 (team_tasks)
-- NOTE: The frontend writes to "team_tasks". Creating as "tasks" per request,
CREATE TABLE IF NOT EXISTS tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  status              TEXT NOT NULL DEFAULT 'NOT_STARTED',
  priority            TEXT NOT NULL DEFAULT 'P2',
  owner_id            UUID,
  collaborator_ids    TEXT[],
  project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id           UUID,
  client_name         TEXT,
  due_date            TIMESTAMPTZ,
  end_time            TIMESTAMPTZ,
  estimated_duration  TEXT NOT NULL DEFAULT 'M',
  current_focus       BOOLEAN DEFAULT false,
  importance_level    NUMERIC NOT NULL DEFAULT 0,
  urgency_level       NUMERIC NOT NULL DEFAULT 0,
  progress_percent    NUMERIC NOT NULL DEFAULT 0,
  completed_at        TIMESTAMPTZ,
  blocker_notes       TEXT,
  document_title      TEXT,
  document_url        TEXT,
  proof_description   TEXT,
  proof_url           TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- #9  task_attachments
-- Source: types.ts line 12429
CREATE TABLE IF NOT EXISTS task_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL,
  size        NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- #10  shifts
-- Source: NOT in types.ts or frontend hooks; minimal definition
CREATE TABLE IF NOT EXISTS shifts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  shift_date      DATE NOT NULL,
  start_time      TIMESTAMPTZ,
  end_time        TIMESTAMPTZ,
  break_minutes   NUMERIC DEFAULT 0,
  status          TEXT DEFAULT 'scheduled',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- #11  service_tickets
-- Source: types.ts line 11325
CREATE TABLE IF NOT EXISTS service_tickets (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number           TEXT NOT NULL,
  title                   TEXT NOT NULL,
  status                  TEXT NOT NULL DEFAULT 'open',
  description             TEXT,
  assigned_technician_id  UUID,
  customer_id             UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id              UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by              UUID,
  customer_access_token   TEXT,
  access_gate_code        TEXT,
  scheduled_date          TEXT,
  scheduled_time          TEXT,
  service_address         TEXT,
  service_city            TEXT,
  service_state           TEXT,
  service_zip             TEXT,
  service_notes           TEXT,
  internal_notes          TEXT,
  duration_hours          NUMERIC,
  total_amount            NUMERIC,
  is_billable             BOOLEAN,
  latitude                NUMERIC,
  longitude               NUMERIC,
  checked_in_at           TIMESTAMPTZ,
  checked_out_at          TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- #12  customer_feedback
-- Source: types.ts line 2973
CREATE TABLE IF NOT EXISTS customer_feedback (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE SET NULL,
  customer_email    TEXT NOT NULL,
  content           TEXT NOT NULL,
  feedback_type     TEXT NOT NULL DEFAULT 'general',
  feedback_source   TEXT,
  is_read           BOOLEAN,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- #13  directory_contacts
-- Source: types.ts line 3414
CREATE TABLE IF NOT EXISTS directory_contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type  TEXT NOT NULL,
  first_name    TEXT,
  last_name     TEXT,
  contact_name  TEXT,
  company       TEXT,
  email         TEXT,
  phone         TEXT,
  cell          TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  notes         TEXT,
  rating        NUMERIC,
  is_active     BOOLEAN,
  is_favorite   BOOLEAN,
  metadata      JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- #14  contact_notes
-- Source: types.ts line 2430
CREATE TABLE IF NOT EXISTS contact_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  UUID NOT NULL REFERENCES directory_contacts(id) ON DELETE CASCADE,
  title       TEXT,
  description TEXT,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- #15  contact_files
-- Source: types.ts line 2389
CREATE TABLE IF NOT EXISTS contact_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  UUID NOT NULL REFERENCES directory_contacts(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  file_size   NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);


-- PRIORITY 2 -- Financial (Tables #16-27)

-- #16  bills
-- Source: types.ts line 980
CREATE TABLE IF NOT EXISTS bills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number   TEXT,
  bill_date     TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  due_date      TEXT,
  status        TEXT DEFAULT 'draft',
  description   TEXT,
  vendor_id     UUID,
  vendor_name   TEXT,
  project_id    UUID REFERENCES projects(id) ON DELETE SET NULL,
  project_name  TEXT,
  ref_number    TEXT,
  terms         TEXT,
  sub_total     NUMERIC,
  tax           NUMERIC,
  total         NUMERIC,
  paid          NUMERIC,
  balance_due   NUMERIC,
  is_billable   BOOLEAN,
  created_by    UUID,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- #17  bill_items
-- Source: types.ts line 854
CREATE TABLE IF NOT EXISTS bill_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id       UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  item_name     TEXT NOT NULL,
  description   TEXT,
  cost_code     TEXT,
  quantity      NUMERIC,
  unit          TEXT,
  unit_cost     NUMERIC,
  total         NUMERIC,
  is_taxable    BOOLEAN,
  display_order NUMERIC,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #18  bill_payments
-- Source: types.ts line 939
CREATE TABLE IF NOT EXISTS bill_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id         UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  amount          NUMERIC NOT NULL,
  payment_date    TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  payment_method  TEXT,
  notes           TEXT,
  created_by      UUID,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #19  bill_notes
-- Source: types.ts line 907
CREATE TABLE IF NOT EXISTS bill_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id     UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- #20  invoice_items
-- Source: types.ts line 5443
CREATE TABLE IF NOT EXISTS invoice_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_name       TEXT NOT NULL,
  item_type       TEXT,
  cost_code       TEXT,
  quantity        NUMERIC,
  unit            TEXT,
  unit_cost       NUMERIC,
  total           NUMERIC,
  markup_percent  NUMERIC,
  is_taxable      BOOLEAN,
  photo_url       TEXT,
  display_order   NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #21  invoice_payments
-- Source: types.ts line 5534
CREATE TABLE IF NOT EXISTS invoice_payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount        NUMERIC NOT NULL,
  payment_date  TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  payment_type  TEXT,
  payment_note  TEXT,
  status        TEXT,
  created_by    UUID,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #22  invoice_files
-- Source: types.ts line 5402
CREATE TABLE IF NOT EXISTS invoice_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  file_size   NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- #23  invoice_notes
-- Source: types.ts line 5502
CREATE TABLE IF NOT EXISTS invoice_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- #24  expenses
-- Source: types.ts line 4661
CREATE TABLE IF NOT EXISTS expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_name    TEXT NOT NULL,
  expense_number  TEXT,
  expense_type    TEXT,
  expense_date    TEXT,
  status          TEXT DEFAULT 'draft',
  amount          NUMERIC,
  account         TEXT,
  bank_account    TEXT,
  cost_code       TEXT,
  employee_name   TEXT,
  vendor          TEXT,
  reason          TEXT,
  ref_number      TEXT,
  is_billable     BOOLEAN,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by      UUID,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- #25  expense_notes
-- Source: types.ts line 4629
CREATE TABLE IF NOT EXISTS expense_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id  UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- #26  payments
-- Source: types.ts line 6953
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     TEXT NOT NULL,
  amount            NUMERIC NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'pending',
  payment_date      TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  payment_number    TEXT,
  payment_type      TEXT,
  reference_number  TEXT,
  address           TEXT,
  deposit_to        TEXT,
  invoice_id        UUID REFERENCES invoices(id) ON DELETE SET NULL,
  invoice_number    TEXT,
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #27  payment_notes
-- Source: types.ts line 6918
CREATE TABLE IF NOT EXISTS payment_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id  UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- PRIORITY 3 -- Estimates & Bids (Tables #28-36)

-- #28  project_estimates
-- Source: types.ts line 7883
CREATE TABLE IF NOT EXISTS project_estimates (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_number         TEXT NOT NULL,
  title                   TEXT,
  status                  TEXT NOT NULL DEFAULT 'draft',
  estimate_date           TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  expiration_date         TEXT,
  project_id              UUID REFERENCES projects(id) ON DELETE SET NULL,
  customer_id             UUID,
  customer_name           TEXT,
  customer_email          TEXT,
  customer_phone          TEXT,
  customer_address        TEXT,
  city                    TEXT,
  state                   TEXT,
  zip                     TEXT,
  estimator_id            UUID,
  project_manager_id      UUID,
  sales_rep_id            UUID,
  approved_by_id          UUID,
  invoiced_to             TEXT,
  project_type            TEXT,
  sector                  TEXT,
  scope_summary           TEXT,
  subtotal                NUMERIC,
  tax_pct                 NUMERIC,
  tax_amount              NUMERIC,
  profit_margin_pct       NUMERIC,
  profit_margin_amount    NUMERIC,
  grand_total             NUMERIC,
  include_cover_sheet     BOOLEAN,
  cover_sheet_template_id UUID,
  cover_sheet_content     TEXT,
  inclusions_content      TEXT,
  exclusions_content      TEXT,
  terms_content           TEXT,
  created_by              UUID,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- #29  estimate_items
-- Source: types.ts line 4405
CREATE TABLE IF NOT EXISTS estimate_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id     UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  item_name       TEXT NOT NULL,
  item_type       TEXT NOT NULL DEFAULT 'material',
  description     TEXT,
  cost_code       TEXT,
  quantity        NUMERIC,
  unit            TEXT,
  unit_cost       NUMERIC,
  total           NUMERIC,
  markup_pct      NUMERIC,
  tax_applicable  BOOLEAN,
  assigned_to_id  UUID,
  display_order   NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #30  estimate_notes
-- Source: types.ts line 4467
CREATE TABLE IF NOT EXISTS estimate_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- #31  estimate_files
-- Source: types.ts line 4364
CREATE TABLE IF NOT EXISTS estimate_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  file_size   NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- #32  estimate_bid_packages
-- Source: types.ts line 4308
CREATE TABLE IF NOT EXISTS estimate_bid_packages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id   UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  package_name  TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #33  estimate_scope_items
-- Source: types.ts line 4499
CREATE TABLE IF NOT EXISTS estimate_scope_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id   UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  category      TEXT NOT NULL,
  description   TEXT NOT NULL,
  quantity      NUMERIC,
  unit          TEXT,
  is_included   BOOLEAN,
  display_order NUMERIC,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #34  bid_packages
-- Source: types.ts line 694
CREATE TABLE IF NOT EXISTS bid_packages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  bid_number        TEXT,
  status            TEXT DEFAULT 'draft',
  estimate_id       UUID REFERENCES project_estimates(id) ON DELETE SET NULL,
  bid_manager_id    UUID,
  bidding_deadline  TEXT,
  deadline_time     TEXT,
  reminder_days     NUMERIC,
  scope_of_work     TEXT,
  terms             TEXT,
  inclusions        TEXT,
  exclusions        TEXT,
  clarification     TEXT,
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #35  bid_package_bidders
-- Source: types.ts line 544
CREATE TABLE IF NOT EXISTS bid_package_bidders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_package_id  UUID NOT NULL REFERENCES bid_packages(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  contact_name    TEXT,
  email           TEXT,
  phone           TEXT,
  status          TEXT DEFAULT 'pending',
  bid_amount      NUMERIC,
  notes           TEXT,
  invited_at      TIMESTAMPTZ,
  date_sent       TEXT,
  will_submit     BOOLEAN,
  submitted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- #36  bid_responses  (actual table name in codebase: bid_submissions)
-- Source: types.ts line 762 (bid_submissions)
-- NOTE: The frontend hook useBidManager.ts uses "bid_submissions" as the table name.
CREATE TABLE IF NOT EXISTS bid_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bidder_id       UUID NOT NULL REFERENCES bid_package_bidders(id) ON DELETE CASCADE,
  bid_package_id  UUID NOT NULL REFERENCES bid_packages(id) ON DELETE CASCADE,
  bid_total       NUMERIC,
  notes           TEXT,
  is_awarded      BOOLEAN,
  awarded_at      TIMESTAMPTZ,
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- PRIORITY 4 -- Project Sub-modules (Tables #37-52)

-- #37  change_orders
-- Source: types.ts line 1340
CREATE TABLE IF NOT EXISTS change_orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  co_number             TEXT,
  status                TEXT NOT NULL DEFAULT 'draft',
  date                  TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
  description           TEXT,
  project_id            UUID REFERENCES projects(id) ON DELETE SET NULL,
  estimate_id           UUID REFERENCES project_estimates(id) ON DELETE SET NULL,
  customer_id           UUID,
  customer_co_number    TEXT,
  estimator_id          UUID,
  project_manager_id    UUID,
  approved_by           UUID,
  requested_by          TEXT,
  associated_rfi        TEXT,
  time_delay            TEXT,
  estimated_cost        NUMERIC,
  sub_total             NUMERIC,
  tax                   NUMERIC,
  profit_margin         NUMERIC,
  grand_total           NUMERIC,
  is_no_cost            BOOLEAN,
  created_by            UUID,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- #38  change_order_items
-- Source: types.ts line 1249
CREATE TABLE IF NOT EXISTS change_order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_order_id   UUID NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  item_name         TEXT NOT NULL,
  item_type         TEXT,
  cost_code         TEXT,
  quantity          NUMERIC,
  unit              TEXT,
  unit_cost         NUMERIC,
  total             NUMERIC,
  markup_percent    NUMERIC,
  is_taxable        BOOLEAN,
  assigned_to       TEXT,
  display_order     NUMERIC,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- #39  change_order_files
-- Source: types.ts line 1208
CREATE TABLE IF NOT EXISTS change_order_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_order_id UUID NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_url        TEXT NOT NULL,
  file_type       TEXT,
  file_size       NUMERIC,
  uploaded_by     UUID,
  uploaded_at     TIMESTAMPTZ DEFAULT now()
);

-- #40  change_order_notes
-- Source: types.ts line 1308
CREATE TABLE IF NOT EXISTS change_order_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_order_id UUID NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  created_by      UUID,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #41  daily_log_entries
-- Source: types.ts line 3014
CREATE TABLE IF NOT EXISTS daily_log_entries (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE SET NULL,
  log_date              TEXT NOT NULL,
  status                TEXT,
  arrival_time          TEXT,
  departure_time        TEXT,
  site_condition        TEXT,
  site_condition_notes  TEXT,
  tasks_performed       TEXT,
  delay_notes           TEXT,
  has_weather_delay     BOOLEAN,
  has_schedule_delay    BOOLEAN,
  weather_data          JSONB DEFAULT '{}'::jsonb,
  created_by            UUID,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- #42  daily_log_people
-- Source: types.ts line 3261
CREATE TABLE IF NOT EXISTS daily_log_people (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id  UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  user_id       UUID,
  hours_worked  NUMERIC,
  cost_code     TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #43  daily_log_visitors
-- Source: types.ts line 3343
CREATE TABLE IF NOT EXISTS daily_log_visitors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id    UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  visitor_name    TEXT NOT NULL,
  company         TEXT,
  purpose         TEXT,
  arrival_time    TEXT,
  departure_time  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #44  daily_log_subcontractors
-- Source: types.ts line 3302
CREATE TABLE IF NOT EXISTS daily_log_subcontractors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id    UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  contact_name    TEXT,
  workers_count   NUMERIC,
  work_performed  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #45  daily_log_materials
-- Source: types.ts line 3173
CREATE TABLE IF NOT EXISTS daily_log_materials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id  UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  item_name     TEXT NOT NULL,
  material_type TEXT NOT NULL,
  quantity      NUMERIC,
  unit          TEXT,
  supplier      TEXT,
  delivered_by  TEXT,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #46  daily_log_equipment
-- Source: types.ts line 3079
CREATE TABLE IF NOT EXISTS daily_log_equipment (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id    UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  equipment_name  TEXT NOT NULL,
  equipment_type  TEXT NOT NULL,
  operator        TEXT,
  hours           NUMERIC,
  status          TEXT,
  cost_code       TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- #47  daily_log_notes
-- Source: types.ts line 3220
CREATE TABLE IF NOT EXISTS daily_log_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id  UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  title         TEXT,
  content       TEXT NOT NULL,
  note_type     TEXT NOT NULL DEFAULT 'general',
  posted_by     TEXT,
  posted_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #48  daily_log_files
-- Source: types.ts line 3126
CREATE TABLE IF NOT EXISTS daily_log_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id  UUID NOT NULL REFERENCES daily_log_entries(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_url      TEXT NOT NULL,
  file_type     TEXT,
  file_size     NUMERIC,
  category      TEXT,
  description   TEXT,
  uploaded_by   UUID,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- #49  purchase_orders
-- Source: types.ts line 9448
CREATE TABLE IF NOT EXISTS purchase_orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  po_number         TEXT,
  status            TEXT DEFAULT 'draft',
  order_date        TEXT,
  delivery_date     TEXT,
  description       TEXT,
  project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  supplier          TEXT,
  supplier_contact  TEXT,
  from_employee     TEXT,
  ship_to           TEXT,
  shipped_via       TEXT,
  fob_point         TEXT,
  payment_terms     TEXT,
  reference_number  TEXT,
  total_amount      NUMERIC,
  tax_amount        NUMERIC,
  is_billable       BOOLEAN,
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #50  purchase_order_notes
-- Source: types.ts line 9416
CREATE TABLE IF NOT EXISTS purchase_order_notes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- #51  comparison_blocks
-- Source: NOT a standalone table in types.ts.
CREATE TABLE IF NOT EXISTS comparison_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Design Transformation',
  subtitle    TEXT DEFAULT 'Drag the slider to compare',
  swap        BOOLEAN DEFAULT false,
  show_badges BOOLEAN DEFAULT false,
  visibility  TEXT DEFAULT 'private',
  notes       TEXT,
  quote_id    UUID,
  quote_option_name TEXT,
  quote_amount      NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- #52  comparison_block_items
-- Source: NOT a standalone table in types.ts.
CREATE TABLE IF NOT EXISTS comparison_block_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_block_id   UUID NOT NULL REFERENCES comparison_blocks(id) ON DELETE CASCADE,
  photo_type            TEXT NOT NULL,
  photo_url             TEXT NOT NULL,
  description           TEXT,
  display_order         NUMERIC,
  file_size             NUMERIC,
  uploaded_by           UUID,
  created_at            TIMESTAMPTZ DEFAULT now()
);



-- ============================================================================
-- PART 4: CREATE NEW TABLES (P5-P8, 20 tables)
-- ============================================================================
-- ============================================================================
-- Priority 5-8 Tables (tables #53–72)
-- Generated from src/integrations/supabase/types.ts Row definitions
-- ============================================================================
-- Priority 5 — CRM Pipeline & Automation  (#53-57)
-- Priority 6 — Safety & Workforce          (#58-64)
-- Priority 7 — Communication & Tracking    (#65-69)
-- Priority 8 — AI & Audit                  (#70-72)
-- ============================================================================


-- ============================================================================
-- PRIORITY 5 — CRM Pipeline & Automation
-- ============================================================================

-- #53  opportunities
-- NOTE: The frontend OpportunitiesManager.tsx reads/writes to the "leads" table
-- directly (not a separate "opportunities" table). We create a dedicated table
-- for future decoupling of opportunities from leads.
CREATE TABLE IF NOT EXISTS opportunities (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    email             TEXT NOT NULL DEFAULT '',
    phone             TEXT,
    address           TEXT,
    project_type      TEXT,
    status            TEXT NOT NULL DEFAULT 'new',
    source            TEXT,
    notes             TEXT,
    estimated_value   NUMERIC,
    company           TEXT,
    first_name        TEXT,
    last_name         TEXT,
    lead_id           UUID REFERENCES leads(id) ON DELETE SET NULL,
    assigned_to       UUID,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #54  opportunity_pipeline_stages
-- Not present in types.ts or hooks. Created as a minimal lookup table for
-- kanban-style pipeline columns shown in OpportunitiesManager.tsx.
CREATE TABLE IF NOT EXISTS opportunity_pipeline_stages (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key               TEXT NOT NULL UNIQUE,
    label             TEXT NOT NULL,
    color             TEXT NOT NULL DEFAULT 'bg-gray-400',
    display_order     INTEGER NOT NULL DEFAULT 0,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #55  team_members_opportunities
-- Not present in types.ts. Junction table for assigning team members to
-- opportunities.
CREATE TABLE IF NOT EXISTS team_members_opportunities (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id    UUID NOT NULL,
    opportunity_id    UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    role              TEXT DEFAULT 'member',
    assigned_at       TIMESTAMPTZ DEFAULT now(),
    created_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE (team_member_id, opportunity_id)
);

-- #56  crm_automations  (automation_rules)
-- Source: types.ts lines 2586-2620
CREATE TABLE IF NOT EXISTS crm_automations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    trigger_event     TEXT NOT NULL,
    action_type       TEXT NOT NULL,
    action_data       JSONB DEFAULT '{}',
    condition_data    JSONB,
    is_active         BOOLEAN DEFAULT false,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #57  project_proposals  (proposals)
-- Source: types.ts lines 8365-8443
CREATE TABLE IF NOT EXISTS project_proposals (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_number      TEXT NOT NULL,
    client_name          TEXT NOT NULL,
    client_email         TEXT NOT NULL,
    client_phone         TEXT,
    property_address     TEXT NOT NULL,
    project_type         TEXT NOT NULL DEFAULT 'residential',
    scope_of_work        TEXT,
    notes_disclaimers    TEXT,
    status               TEXT NOT NULL DEFAULT 'draft',
    access_token         TEXT,
    agreement_number     TEXT,
    contract_price       NUMERIC,
    contract_url         TEXT,
    contract_created_at  TIMESTAMPTZ,
    payment_schedule     JSONB,
    expires_at           TIMESTAMPTZ,
    quote_request_id     UUID REFERENCES quote_requests(id) ON DELETE SET NULL,
    created_by           UUID NOT NULL,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PRIORITY 6 — Safety & Workforce
-- ============================================================================

-- #58  incidents
-- Source: types.ts lines 5158-5284
CREATE TABLE IF NOT EXISTS incidents (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type                        TEXT NOT NULL DEFAULT 'general',
    incident_date               TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
    incident_time               TEXT,
    incident_number             TEXT,
    description                 TEXT,
    location                    TEXT,
    severity                    TEXT,
    status                      TEXT DEFAULT 'open',
    classification              TEXT,
    action_taken                TEXT,
    corrective_steps            TEXT,
    cost_code                   TEXT,
    reported_by                 TEXT,
    created_by                  TEXT,
    has_injury                  BOOLEAN,
    injury_type                 TEXT,
    injury_description          TEXT,
    accepted_treatment          BOOLEAN,
    treatment_description       TEXT,
    transported_to_hospital     BOOLEAN,
    hospital_description        TEXT,
    returned_to_work_same_day   BOOLEAN,
    return_description          TEXT,
    days_away_from_work         NUMERIC,
    days_job_transfer           NUMERIC,
    is_osha_violation           BOOLEAN,
    osha_description            TEXT,
    notified_date               TEXT,
    notified_ids                TEXT[],
    involved_employee_ids       TEXT[],
    witness_ids                 TEXT[],
    resolved_at                 TIMESTAMPTZ,
    resolved_by                 TEXT,
    project_id                  UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at                  TIMESTAMPTZ DEFAULT now(),
    updated_at                  TIMESTAMPTZ DEFAULT now()
);

-- #59  incident_notes
-- Source: types.ts lines 5123-5156
CREATE TABLE IF NOT EXISTS incident_notes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id   UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    title         TEXT,
    content       TEXT NOT NULL,
    created_by    TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- #60  safety_meetings
-- Source: types.ts lines 10864-10927
CREATE TABLE IF NOT EXISTS safety_meetings (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic                 TEXT NOT NULL,
    topic_text            TEXT,
    meeting_date          TEXT NOT NULL DEFAULT CURRENT_DATE::TEXT,
    meeting_time          TEXT,
    meeting_type          TEXT,
    location              TEXT,
    cost_code             TEXT,
    status                TEXT DEFAULT 'scheduled',
    meeting_leader_id     TEXT,
    meeting_leader_name   TEXT,
    completed_at          TIMESTAMPTZ,
    project_id            UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_by            TEXT,
    created_at            TIMESTAMPTZ DEFAULT now(),
    updated_at            TIMESTAMPTZ DEFAULT now()
);

-- #61  safety_meeting_attendees
-- Source: types.ts lines 10747-10786
CREATE TABLE IF NOT EXISTS safety_meeting_attendees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id          UUID NOT NULL REFERENCES safety_meetings(id) ON DELETE CASCADE,
    employee_name       TEXT NOT NULL,
    employee_id         TEXT,
    employee_initials   TEXT,
    signature_url       TEXT,
    signed_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- #62  safety_meeting_notes
-- Source: types.ts lines 10829-10862
CREATE TABLE IF NOT EXISTS safety_meeting_notes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id    UUID NOT NULL REFERENCES safety_meetings(id) ON DELETE CASCADE,
    title         TEXT,
    content       TEXT NOT NULL,
    created_by    TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- #63  inventory_items
-- Source: types.ts lines 5319-5362
CREATE TABLE IF NOT EXISTS inventory_items (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  TEXT NOT NULL,
    category              TEXT NOT NULL,
    quantity              NUMERIC NOT NULL DEFAULT 0,
    unit_type             TEXT,
    requires_protection   BOOLEAN DEFAULT false,
    notes                 TEXT,
    photo_url             TEXT,
    created_by            TEXT,
    updated_by            TEXT,
    created_at            TIMESTAMPTZ DEFAULT now(),
    updated_at            TIMESTAMPTZ DEFAULT now()
);

-- #64  inventory_logs
-- Source: types.ts lines 5364-5400
CREATE TABLE IF NOT EXISTS inventory_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id             UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    previous_quantity   NUMERIC NOT NULL,
    new_quantity        NUMERIC NOT NULL,
    note                TEXT,
    changed_by          TEXT,
    changed_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PRIORITY 7 — Communication & Tracking
-- ============================================================================

-- #65  team_update_interactions
-- Source: types.ts lines 13231-13261
CREATE TABLE IF NOT EXISTS team_update_interactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update_id   UUID NOT NULL REFERENCES team_updates(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL,
    liked       BOOLEAN DEFAULT false,
    viewed_at   TIMESTAMPTZ
);

-- #66  team_update_comments
-- Source: types.ts lines 13199-13229
CREATE TABLE IF NOT EXISTS team_update_comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update_id   UUID NOT NULL REFERENCES team_updates(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- #67  direct_conversations
-- Source: types.ts lines 3387-3412
CREATE TABLE IF NOT EXISTS direct_conversations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_one_id  TEXT NOT NULL,
    participant_two_id  TEXT NOT NULL,
    last_message_at     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- #68  team_messages
-- Source: types.ts lines 13023-13065
CREATE TABLE IF NOT EXISTS team_messages (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id   UUID NOT NULL REFERENCES direct_conversations(id) ON DELETE CASCADE,
    sender_id         TEXT NOT NULL,
    content           TEXT NOT NULL,
    attachments       JSONB,
    is_deleted        BOOLEAN DEFAULT false,
    read_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- #69  aerial_images
-- Source: types.ts lines 107-195
CREATE TABLE IF NOT EXISTS aerial_images (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_address      TEXT NOT NULL,
    image_url             TEXT NOT NULL,
    api_source            TEXT NOT NULL,
    image_type            TEXT NOT NULL DEFAULT 'aerial',
    thumbnail_url         TEXT,
    angle                 TEXT,
    resolution            TEXT,
    season                TEXT,
    capture_date          TEXT,
    latitude              NUMERIC,
    longitude             NUMERIC,
    zoom_level            NUMERIC,
    file_size             NUMERIC,
    image_quality_score   NUMERIC,
    processing_status     TEXT,
    image_metadata        JSONB,
    lead_id               UUID REFERENCES leads(id) ON DELETE SET NULL,
    project_id            UUID REFERENCES projects(id) ON DELETE SET NULL,
    quote_request_id      UUID,
    created_at            TIMESTAMPTZ DEFAULT now(),
    updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PRIORITY 8 — AI & Audit
-- ============================================================================

-- #70  ai_suggestions
-- Source: types.ts lines 310-371
CREATE TABLE IF NOT EXISTS ai_suggestions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id          UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    suggestion_type   TEXT NOT NULL,
    suggested_data    JSONB NOT NULL,
    confidence_score  NUMERIC NOT NULL,
    context_data      JSONB,
    modified_data     JSONB,
    user_action       TEXT,
    user_id           TEXT,
    feedback_notes    TEXT,
    responded_at      TIMESTAMPTZ,
    session_id        UUID,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- #71  fasto_failed_requests
-- Source: types.ts lines 4776-4807
CREATE TABLE IF NOT EXISTS fasto_failed_requests (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_text      TEXT NOT NULL,
    failure_reason    TEXT,
    agent_response    TEXT,
    tool_attempted    TEXT,
    category          TEXT,
    user_id           TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- #72  envelope_audit_trail
-- Source: types.ts lines 4107-4156
CREATE TABLE IF NOT EXISTS envelope_audit_trail (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    envelope_id     UUID NOT NULL REFERENCES signature_envelopes(id) ON DELETE CASCADE,
    action          TEXT NOT NULL,
    details         JSONB,
    recipient_id    UUID REFERENCES envelope_recipients(id) ON DELETE SET NULL,
    user_id         TEXT,
    ip_address      TEXT,
    user_agent      TEXT,
    "timestamp"     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Seed default opportunity pipeline stages (from OpportunitiesManager.tsx)
-- ============================================================================
INSERT INTO opportunity_pipeline_stages (key, label, color, display_order)
VALUES
    ('pending',    'Pending',    'bg-gray-400',   1),
    ('new',        'Received',   'bg-blue-500',   2),
    ('qualifying', 'Quoted',     'bg-yellow-500', 3),
    ('quoted',     'Qualifying', 'bg-purple-500', 4),
    ('approved',   'Qualified',  'bg-green-500',  5),
    ('lost',       'Lost',       'bg-red-500',    6)
ON CONFLICT (key) DO NOTHING;



-- ============================================================================
-- PART 5: UNIQUE CONSTRAINTS (needed for upsert operations)
-- ============================================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_team_update_interactions_update_user') THEN
    ALTER TABLE team_update_interactions ADD CONSTRAINT uq_team_update_interactions_update_user UNIQUE (update_id, user_id);
  END IF;
END $$;

-- ============================================================================
-- PART 6: GRANTS (PostgREST roles)
-- ============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================================================
-- PART 7: updated_at TRIGGERS for new tables
-- ============================================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'mt_business_profiles','tenant_edge_functions','tenant_services','tenant_service_areas',
    'tenant_faqs','tenant_branding','sales_clients','tasks','shifts','service_tickets',
    'directory_contacts','contact_notes','bills','expenses','payments','purchase_orders',
    'project_estimates','bid_packages','bid_package_bidders','change_orders','daily_log_entries',
    'opportunities','opportunity_pipeline_stages','crm_automations','project_proposals',
    'incidents','safety_meetings','inventory_items','direct_conversations','team_messages',
    'signature_envelopes'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s; CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON public.%s FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t, t, t, t);
  END LOOP;
END $$;
