-- Missing tables for FastFix CRM

-- User tenant memberships (multi-tenant support)
CREATE TABLE IF NOT EXISTS public.user_tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID,
  business_id UUID,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses table (for multi-tenant)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Job schedules
CREATE TABLE IF NOT EXISTS public.job_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  job_name TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  status TEXT DEFAULT 'scheduled',
  assigned_to UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES public.projects(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  invoice_number TEXT UNIQUE,
  project_id UUID REFERENCES public.projects(id),
  lead_id UUID REFERENCES public.leads(id),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Work orders
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  work_order_number TEXT UNIQUE,
  project_id UUID REFERENCES public.projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal',
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Employee requests (PTO, time off, etc)
CREATE TABLE IF NOT EXISTS public.employee_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  request_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team updates (announcements, news)
CREATE TABLE IF NOT EXISTS public.team_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quote requests
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT,
  lead_id UUID REFERENCES public.leads(id),
  email TEXT,
  phone TEXT,
  name TEXT,
  address TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_tenant_memberships_user ON public.user_tenant_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenant_memberships_tenant ON public.user_tenant_memberships(tenant_id);
CREATE INDEX IF NOT EXISTS idx_job_schedules_start ON public.job_schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);

-- Insert sample business
INSERT INTO public.businesses (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000002', 'FastFix Roofing', 'fastfix')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user tenant membership
INSERT INTO public.user_tenant_memberships (user_id, tenant_id, business_id, is_primary, is_active, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev-tenant-001',
  '00000000-0000-0000-0000-000000000002',
  true,
  true,
  'owner'
) ON CONFLICT DO NOTHING;

-- Insert sample job schedules
INSERT INTO public.job_schedules (tenant_id, job_name, start_time, end_time, location, status)
VALUES
  ('dev-tenant-001', 'Roof Inspection - Smith', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', '123 Main St, Austin TX', 'scheduled'),
  ('dev-tenant-001', 'Metal Roof Install', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 8 hours', '456 Oak Ave, Austin TX', 'scheduled')
ON CONFLICT DO NOTHING;

-- Insert sample team update
INSERT INTO public.team_updates (tenant_id, title, content, is_pinned)
VALUES ('dev-tenant-001', 'Welcome to FastFix Local Dev!', 'This is a sample team update for local development.', true)
ON CONFLICT DO NOTHING;

COMMIT;
