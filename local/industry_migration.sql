-- Industry-agnostic CRM migration
-- Adds industry support to tenant profiles and flexible JSONB fields to projects/quotes

-- 1. Add industry column to mt_business_profiles
ALTER TABLE mt_business_profiles ADD COLUMN IF NOT EXISTS industry text NOT NULL DEFAULT 'roofing';

-- 2. Add industry_fields JSONB to projects for non-roofing industries
ALTER TABLE projects ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';

-- 3. Add industry_fields JSONB to quote_requests for non-roofing industries
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';

-- 4. Add industry_fields JSONB to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS industry_fields jsonb DEFAULT '{}';

-- 5. Update existing dev tenant to roofing (it already is by default)
UPDATE mt_business_profiles SET industry = 'roofing' WHERE industry IS NULL;
