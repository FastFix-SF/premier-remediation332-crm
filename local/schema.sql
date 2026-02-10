-- FastFix CRM Local Development Schema
-- This schema works with PostgREST without Supabase dependencies

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create mock auth schema (replaces Supabase auth)
CREATE SCHEMA IF NOT EXISTS auth;

-- Mock auth.users table
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  encrypted_password TEXT,
  raw_user_meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Helper function to get current user (mock - always returns dev user)
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    '00000000-0000-0000-0000-000000000001'
  )::uuid;
$$ LANGUAGE SQL STABLE;

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  admin_background_style TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Roles table
CREATE TABLE IF NOT EXISTS public.rf_roles (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

INSERT INTO public.rf_roles(key, label) VALUES
  ('owner', 'Owner'),
  ('admin', 'Admin'),
  ('leader', 'Leader'),
  ('contributor', 'Contributor'),
  ('viewer', 'Viewer')
ON CONFLICT (key) DO NOTHING;

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team directory table
CREATE TABLE IF NOT EXISTS public.team_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  tenant_id TEXT,
  name TEXT,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'contributor' REFERENCES public.rf_roles(key),
  secondary_role TEXT REFERENCES public.rf_roles(key),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'disabled')),
  invited_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_directory_user_id ON public.team_directory(user_id);
CREATE INDEX IF NOT EXISTS idx_team_directory_tenant_id ON public.team_directory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_team_directory_role ON public.team_directory(role);
CREATE INDEX IF NOT EXISTS idx_team_directory_status ON public.team_directory(status);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  notes TEXT,
  project_type TEXT,
  property_type TEXT,
  roof_size TEXT,
  timeline TEXT,
  budget_range TEXT,
  estimated_value DECIMAL(10,2),
  assigned_to UUID REFERENCES auth.users(id),
  mrf_prospect_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  lead_id UUID REFERENCES public.leads(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  start_date DATE,
  end_date DATE,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON public.projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id),
  quote_number TEXT UNIQUE,
  items JSONB DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- App config table
CREATE TABLE IF NOT EXISTS public.app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'FastFix Team',
  category TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat conversations
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION create_updated_at_trigger(table_name TEXT) RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s;
    CREATE TRIGGER update_%s_updated_at
    BEFORE UPDATE ON public.%s
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  ', table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

SELECT create_updated_at_trigger('profiles');
SELECT create_updated_at_trigger('admin_users');
SELECT create_updated_at_trigger('team_directory');
SELECT create_updated_at_trigger('leads');
SELECT create_updated_at_trigger('projects');
SELECT create_updated_at_trigger('quotes');
SELECT create_updated_at_trigger('app_config');
SELECT create_updated_at_trigger('blog_posts');
SELECT create_updated_at_trigger('chat_conversations');

-- Create PostgREST roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'postgres';
  END IF;
END
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO authenticated, service_role;

-- Grant authenticator the ability to switch to these roles
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Insert dev user
INSERT INTO auth.users (id, email, phone, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@localhost.dev',
  '+15550000000',
  '{"name": "Dev Admin", "role": "owner"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Insert dev profile
INSERT INTO public.profiles (id, display_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Dev Admin')
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;

-- Insert dev admin
INSERT INTO public.admin_users (user_id, email, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@localhost.dev', true)
ON CONFLICT (user_id) DO UPDATE SET is_active = true;

-- Insert dev team member
INSERT INTO public.team_directory (user_id, tenant_id, name, email, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev-tenant-001',
  'Dev Admin',
  'admin@localhost.dev',
  'owner',
  'active'
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'owner',
  status = 'active';

-- Insert sample data
INSERT INTO public.leads (tenant_id, name, email, phone, status, source, notes)
VALUES
  ('dev-tenant-001', 'John Smith', 'john@example.com', '+15551234567', 'new', 'website', 'Interested in metal roofing'),
  ('dev-tenant-001', 'Jane Doe', 'jane@example.com', '+15559876543', 'contacted', 'referral', 'Commercial building project'),
  ('dev-tenant-001', 'Bob Wilson', 'bob@example.com', '+15555555555', 'qualified', 'google', 'Residential re-roofing')
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (tenant_id, name, description, status, address, city, state)
VALUES
  ('dev-tenant-001', 'Smith Residence Roof', 'Complete metal roof installation', 'in_progress', '123 Main St', 'Austin', 'TX'),
  ('dev-tenant-001', 'Downtown Office Complex', 'Commercial flat roof repair', 'pending', '456 Business Ave', 'Austin', 'TX')
ON CONFLICT DO NOTHING;

COMMIT;
