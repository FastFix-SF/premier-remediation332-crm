-- ============================================================================
-- Migration: Industry-Agnostic Config + Command Center Fixes
-- Date: 2026-02-09
-- Description:
--   1. Add industry support columns to core tables
--   2. Fix constraint defaults that cause insert failures
--   3. Fix FK references
--   4. Add get_team_members RPC function
--   5. Ensure admin_feedback table exists
--
-- All statements are idempotent (safe to re-run).
-- ============================================================================

-- ============================================================================
-- SECTION 1: Industry Support (new columns)
-- ============================================================================

-- Add industry column to business profiles for multi-industry support
ALTER TABLE mt_business_profiles ADD COLUMN IF NOT EXISTS industry text NOT NULL DEFAULT 'roofing';

-- Add industry_fields JSONB to core tables for non-roofing industries
ALTER TABLE projects ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';

-- Backfill existing rows
UPDATE mt_business_profiles SET industry = 'roofing' WHERE industry IS NULL;


-- ============================================================================
-- SECTION 2: Constraint Fixes (defaults + nullability)
-- These fix insert failures found during Command Center audit.
-- ============================================================================

-- client_portal_access.access_token: needs default so inserts don't fail
DO $$ BEGIN
  ALTER TABLE client_portal_access
    ALTER COLUMN access_token SET DEFAULT gen_random_uuid()::text;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE client_portal_access
    ALTER COLUMN access_token DROP NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- task_subtasks.status: needs default 'pending'
DO $$ BEGIN
  ALTER TABLE task_subtasks
    ALTER COLUMN status SET DEFAULT 'pending';
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE task_subtasks
    ALTER COLUMN status DROP NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- task_subtasks.order_index: needs default 0
DO $$ BEGIN
  ALTER TABLE task_subtasks
    ALTER COLUMN order_index SET DEFAULT 0;
EXCEPTION WHEN others THEN NULL;
END $$;

-- team_tasks.status: needs default 'pending'
DO $$ BEGIN
  ALTER TABLE team_tasks
    ALTER COLUMN status SET DEFAULT 'pending';
EXCEPTION WHEN others THEN NULL;
END $$;

-- project_estimates.estimate_number: needs default and nullable (column may not exist)
DO $$ BEGIN
  ALTER TABLE project_estimates
    ALTER COLUMN estimate_number SET DEFAULT ('EST-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 4));
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN undefined_column THEN NULL;
         WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE project_estimates
    ALTER COLUMN estimate_number DROP NOT NULL;
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN undefined_column THEN NULL;
         WHEN others THEN NULL;
END $$;


-- ============================================================================
-- SECTION 3: Foreign Key Fixes
-- ============================================================================

-- task_attachments.task_id should reference team_tasks(id), not tasks(id)
DO $$ BEGIN
  ALTER TABLE task_attachments DROP CONSTRAINT IF EXISTS task_attachments_task_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE task_attachments
    ADD CONSTRAINT task_attachments_task_id_fkey
    FOREIGN KEY (task_id) REFERENCES team_tasks(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN undefined_column THEN NULL;
         WHEN duplicate_object THEN NULL;
         WHEN others THEN NULL;
END $$;

-- sub_contracts FK constraints for PostgREST embedded queries
DO $$ BEGIN
  ALTER TABLE sub_contracts
    ADD CONSTRAINT sub_contracts_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN undefined_column THEN NULL;
         WHEN duplicate_object THEN NULL;
         WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE sub_contracts
    ADD CONSTRAINT sub_contracts_subcontractor_id_fkey
    FOREIGN KEY (subcontractor_id) REFERENCES directory_contacts(id) ON DELETE SET NULL;
EXCEPTION WHEN undefined_table THEN NULL;
         WHEN undefined_column THEN NULL;
         WHEN duplicate_object THEN NULL;
         WHEN others THEN NULL;
END $$;


-- ============================================================================
-- SECTION 4: get_team_members RPC Function
-- ============================================================================

-- Overloaded function: no-args version returns all team members
CREATE OR REPLACE FUNCTION get_team_members()
RETURNS SETOF team_directory
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY SELECT * FROM team_directory;
END;
$$;

-- Parameterized version with search, pagination
CREATE OR REPLACE FUNCTION get_team_members(
  q text DEFAULT NULL,
  page integer DEFAULT 1,
  page_size integer DEFAULT 100
)
RETURNS TABLE(
  user_id uuid,
  email text,
  full_name text,
  role text,
  role_label text,
  status text,
  phone_number text,
  invited_at text,
  last_login_at text,
  created_at text,
  updated_at text
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    td.user_id,
    td.email,
    td.full_name,
    td.role,
    INITCAP(REPLACE(COALESCE(td.role, 'member'), '_', ' ')) AS role_label,
    td.status,
    td.phone_number,
    COALESCE(td.created_at::text, '') AS invited_at,
    '' AS last_login_at,
    COALESCE(td.created_at::text, '') AS created_at,
    COALESCE(td.updated_at::text, td.created_at::text, '') AS updated_at
  FROM team_directory td
  WHERE (q IS NULL OR q = '' OR
    td.full_name ILIKE '%' || q || '%' OR
    td.email ILIKE '%' || q || '%' OR
    td.phone_number ILIKE '%' || q || '%')
  ORDER BY td.full_name
  LIMIT page_size
  OFFSET (page - 1) * page_size;
END;
$$;


-- ============================================================================
-- SECTION 5: admin_feedback table (may already exist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  feedback_text text NOT NULL,
  selected_element text,
  screenshot_url text,
  admin_notes text,
  is_read boolean DEFAULT false,
  ai_suggestion jsonb,
  ai_analyzed_at timestamptz,
  suggestion_status text DEFAULT 'pending',
  status text DEFAULT 'new',
  category text DEFAULT 'uncategorized',
  priority text DEFAULT 'medium',
  fix_description text,
  fix_status text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  debug_context jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add debug_context column if table existed without it
ALTER TABLE admin_feedback ADD COLUMN IF NOT EXISTS debug_context jsonb;

-- Enable RLS (if not already)
ALTER TABLE admin_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can insert their own feedback
DO $$ BEGIN
  CREATE POLICY "Users can insert own feedback" ON admin_feedback
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy: authenticated users can read all feedback (admin view)
DO $$ BEGIN
  CREATE POLICY "Admins can read all feedback" ON admin_feedback
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policy: authenticated users can update feedback (admin triage)
DO $$ BEGIN
  CREATE POLICY "Admins can update feedback" ON admin_feedback
    FOR UPDATE TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
