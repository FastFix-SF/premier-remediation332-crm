-- ============================================================
-- FastFix CRM - Complete Schema Migration v2
-- Brings local DB to full parity with frontend expectations
-- Safe to re-run (IF NOT EXISTS throughout)
-- ============================================================

-- ============================================================
-- PART 1: All missing tables (165 tables)
-- ============================================================

-- admin_feedback
CREATE TABLE IF NOT EXISTS admin_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_notes TEXT,
  ai_analyzed_at TIMESTAMPTZ,
  ai_suggestion JSONB DEFAULT '{}',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  feedback_text TEXT NOT NULL,
  fix_description TEXT,
  fix_status TEXT,
  is_read BOOLEAN DEFAULT false,
  priority TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  screenshot_url TEXT,
  selected_element JSONB DEFAULT '{}',
  status TEXT,
  suggestion_status TEXT,
  user_id UUID
);

-- agent_conversation_messages
CREATE TABLE IF NOT EXISTS agent_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT,
  confidence NUMERIC,
  content TEXT NOT NULL,
  conversation_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT NOT NULL,
  structured_data JSONB DEFAULT '{}'
);

-- agent_conversations
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message TEXT,
  message_count NUMERIC,
  title TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- ai_learning_metrics
CREATE TABLE IF NOT EXISTS ai_learning_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accuracy_by_edge_type JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_trained_at TIMESTAMPTZ,
  metric_date TEXT NOT NULL,
  model_version TEXT,
  overall_accuracy NUMERIC,
  samples_by_edge_type JSONB DEFAULT '{}',
  total_training_samples NUMERIC,
  training_sample_count NUMERIC
);

-- ai_workforce_insights
CREATE TABLE IF NOT EXISTS ai_workforce_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_items JSONB DEFAULT '{}',
  analysis_period_end TEXT,
  analysis_period_start TEXT,
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data_sources JSONB DEFAULT '{}',
  description TEXT NOT NULL,
  impact_amount NUMERIC,
  impact_type TEXT,
  insight_type TEXT NOT NULL,
  status TEXT,
  title TEXT NOT NULL
);

-- app_icons
CREATE TABLE IF NOT EXISTS app_icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  icon_url TEXT,
  prompt_used TEXT,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- app_settings
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  key TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  value JSONB DEFAULT '{}'
);

-- bid_package_files
CREATE TABLE IF NOT EXISTS bid_package_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_package_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- bid_package_items
CREATE TABLE IF NOT EXISTS bid_package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_package_id UUID NOT NULL,
  cost_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  display_order NUMERIC,
  item_name TEXT NOT NULL,
  item_type TEXT,
  quantity NUMERIC,
  unit TEXT
);

-- bid_submissions
CREATE TABLE IF NOT EXISTS bid_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  awarded_at TIMESTAMPTZ,
  bid_package_id UUID NOT NULL,
  bid_total NUMERIC,
  bidder_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_awarded BOOLEAN DEFAULT false,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- bill_files
CREATE TABLE IF NOT EXISTS bill_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- call_logs
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bland_call_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  duration_min NUMERIC,
  from_number TEXT NOT NULL,
  is_available BOOLEAN DEFAULT false,
  raw JSONB DEFAULT '{}',
  recording_url TEXT,
  started_at TIMESTAMPTZ,
  status TEXT,
  summary TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  to_number TEXT NOT NULL,
  transcript TEXT
);

-- client_chatbot_conversations
CREATE TABLE IF NOT EXISTS client_chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deep_link_url TEXT,
  delivered_at TIMESTAMPTZ,
  message TEXT NOT NULL,
  message_type TEXT,
  project_id UUID,
  read_at TIMESTAMPTZ,
  sender_type TEXT NOT NULL,
  twilio_message_sid TEXT
);

-- client_contracts
CREATE TABLE IF NOT EXISTS client_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  end_date TEXT,
  file_url TEXT NOT NULL,
  project_id UUID NOT NULL,
  proposal_id UUID,
  signature_url TEXT,
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,
  start_date TEXT,
  status TEXT,
  title TEXT NOT NULL,
  total_value NUMERIC
);

-- client_deliverables
CREATE TABLE IF NOT EXISTS client_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_description TEXT,
  assigned_team_member TEXT,
  client_id UUID NOT NULL,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deliverable_id UUID NOT NULL,
  estimated_completion TEXT,
  last_activity TEXT,
  notes TEXT,
  progress_percent NUMERIC,
  screenshots JSONB DEFAULT '{}',
  status TEXT,
  timeline_events JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- client_designs
CREATE TABLE IF NOT EXISTS client_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  client_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  design_url TEXT,
  error_message TEXT,
  generation_prompt TEXT,
  inspiration_url TEXT,
  name TEXT NOT NULL,
  status TEXT,
  thumbnail_url TEXT
);

-- client_messages
CREATE TABLE IF NOT EXISTS client_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  sender_id UUID,
  sender_type TEXT NOT NULL
);

-- client_nfc_cards
CREATE TABLE IF NOT EXISTS client_nfc_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_data JSONB DEFAULT '{}',
  card_name TEXT NOT NULL,
  client_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  design_instructions TEXT,
  design_url TEXT,
  error_message TEXT,
  status TEXT,
  thumbnail_url TEXT
);

-- client_portal_access
CREATE TABLE IF NOT EXISTS client_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT NOT NULL,
  client_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT false,
  last_accessed_at TIMESTAMPTZ,
  project_id UUID,
  url_slug TEXT
);

-- contact_bills
CREATE TABLE IF NOT EXISTS contact_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC,
  bill_date TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  contact_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  is_billable BOOLEAN DEFAULT false,
  notes TEXT,
  project_id UUID,
  status TEXT,
  terms TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  vendor_id UUID
);

-- contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  status TEXT,
  contract_number TEXT,
  client_id UUID,
  project_id UUID,
  total_value NUMERIC,
  start_date TEXT,
  end_date TEXT
);

-- crew_memberships
CREATE TABLE IF NOT EXISTS crew_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  crew_id UUID NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT NOT NULL,
  user_id UUID NOT NULL
);

-- crews
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  crew_lead_id UUID,
  crew_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  specialty TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- crm_customer_progress
CREATE TABLE IF NOT EXISTS crm_customer_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  current_phase_id UUID,
  current_step_id UUID,
  customer_id UUID NOT NULL,
  progress_percentage NUMERIC NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  workflow_id UUID NOT NULL
);

-- crm_documents
CREATE TABLE IF NOT EXISTS crm_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_progress_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  uploaded_by UUID NOT NULL
);

-- crm_step_history
CREATE TABLE IF NOT EXISTS crm_step_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_progress_id UUID NOT NULL,
  notes TEXT,
  started_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  step_id UUID NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- crm_user_assignments
CREATE TABLE IF NOT EXISTS crm_user_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID NOT NULL,
  customer_progress_id UUID NOT NULL,
  role TEXT NOT NULL,
  user_id UUID NOT NULL
);

-- crm_workflow_phases
CREATE TABLE IF NOT EXISTS crm_workflow_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  icon TEXT NOT NULL,
  name TEXT NOT NULL,
  phase_order NUMERIC NOT NULL,
  workflow_id UUID NOT NULL
);

-- crm_workflows
CREATE TABLE IF NOT EXISTS crm_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  name TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- document_fields
CREATE TABLE IF NOT EXISTS document_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  default_value TEXT,
  document_id UUID NOT NULL,
  field_label TEXT,
  field_type TEXT NOT NULL,
  height NUMERIC NOT NULL,
  is_required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '{}',
  page_number NUMERIC NOT NULL,
  recipient_id UUID NOT NULL,
  tab_order NUMERIC,
  validation_pattern TEXT,
  width NUMERIC NOT NULL,
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL
);

-- edge_actions
CREATE TABLE IF NOT EXISTS edge_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_custom BOOLEAN DEFAULT false,
  label TEXT NOT NULL,
  quote_id UUID NOT NULL
);

-- edge_categories
CREATE TABLE IF NOT EXISTS edge_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_order NUMERIC,
  group_name TEXT,
  hotkey TEXT,
  is_active BOOLEAN DEFAULT false,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  parent_id UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- edge_training_data
CREATE TABLE IF NOT EXISTS edge_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  angle_degrees NUMERIC,
  confidence_score NUMERIC,
  correction_applied BOOLEAN DEFAULT false,
  correction_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  drawing_sequence JSONB DEFAULT '{}',
  edge_type TEXT NOT NULL,
  imagery_metadata JSONB DEFAULT '{}',
  length_ft NUMERIC,
  line_geometry JSONB NOT NULL,
  neighboring_lines JSONB DEFAULT '{}',
  quote_id UUID NOT NULL,
  roof_context JSONB DEFAULT '{}',
  session_id UUID,
  training_quality_score NUMERIC,
  user_accepted BOOLEAN DEFAULT false,
  user_id UUID,
  was_ai_suggestion BOOLEAN DEFAULT false
);

-- employee_certifications
CREATE TABLE IF NOT EXISTS employee_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_name TEXT NOT NULL,
  certification_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  document_url TEXT,
  expiry_date TEXT,
  is_active BOOLEAN DEFAULT false,
  issued_date TEXT,
  issuing_body TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- employee_mapping
CREATE TABLE IF NOT EXISTS employee_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connecteam_employee_id TEXT NOT NULL,
  connecteam_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  sync_status TEXT NOT NULL,
  team_directory_user_id UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- employee_pay_rates
CREATE TABLE IF NOT EXISTS employee_pay_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  burden_multiplier NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  effective_from TEXT NOT NULL,
  effective_to TEXT,
  employee_mapping_id UUID NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  overhead_allocation_rate NUMERIC,
  overtime_multiplier NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- employee_scores
CREATE TABLE IF NOT EXISTS employee_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  experience_score NUMERIC NOT NULL,
  performance_score NUMERIC NOT NULL,
  reliability_score NUMERIC NOT NULL,
  safety_score NUMERIC NOT NULL,
  score_breakdown JSONB DEFAULT '{}',
  skills_score NUMERIC NOT NULL,
  total_score NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- employee_skills
CREATE TABLE IF NOT EXISTS employee_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  proficiency_level NUMERIC NOT NULL,
  skill_category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  years_experience NUMERIC
);

-- envelope_documents
CREATE TABLE IF NOT EXISTS envelope_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  document_order NUMERIC NOT NULL,
  envelope_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  name TEXT NOT NULL,
  page_count NUMERIC NOT NULL
);

-- envelope_drafts
CREATE TABLE IF NOT EXISTS envelope_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fields JSONB DEFAULT '{}',
  message TEXT NOT NULL,
  proposal_id UUID NOT NULL,
  recipients JSONB DEFAULT '{}',
  subject TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- estimate_cover_sheet_templates
CREATE TABLE IF NOT EXISTS estimate_cover_sheet_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_default BOOLEAN DEFAULT false,
  name TEXT NOT NULL
);

-- expense_files
CREATE TABLE IF NOT EXISTS expense_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- facets
CREATE TABLE IF NOT EXISTS facets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  flags JSONB DEFAULT '{}',
  pitch NUMERIC,
  polygon_geojson JSONB DEFAULT '{}' NOT NULL,
  project_id UUID NOT NULL,
  story NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- feedback_fix_diagnostics
CREATE TABLE IF NOT EXISTS feedback_fix_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  diagnostic_type TEXT NOT NULL,
  error_message TEXT,
  feedback_id UUID NOT NULL,
  result JSONB DEFAULT '{}',
  status TEXT NOT NULL
);

-- help_requests
CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_text TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  status TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT
);

-- incident_files
CREATE TABLE IF NOT EXISTS incident_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  incident_id UUID NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- inspection_checklist_items
CREATE TABLE IF NOT EXISTS inspection_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  inspection_id UUID,
  title TEXT,
  status TEXT,
  checked BOOLEAN DEFAULT false,
  notes TEXT,
  sort_order NUMERIC
);

-- inspection_files
CREATE TABLE IF NOT EXISTS inspection_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  inspection_id UUID,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size NUMERIC,
  uploaded_by UUID
);

-- inspection_notes
CREATE TABLE IF NOT EXISTS inspection_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  inspection_id UUID,
  content TEXT,
  created_by UUID
);

-- inspections
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID,
  inspection_type TEXT,
  status TEXT,
  scheduled_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  inspector_name TEXT,
  notes TEXT
);

-- inventory_categories
CREATE TABLE IF NOT EXISTS inventory_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_order NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- labor_burden_config
CREATE TABLE IF NOT EXISTS labor_burden_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  effective_date TEXT NOT NULL,
  health_insurance_monthly NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  other_benefits_rate NUMERIC NOT NULL,
  payroll_tax_rate NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  workers_comp_rate NUMERIC NOT NULL
);

-- material_bills
CREATE TABLE IF NOT EXISTS material_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL,
  checked_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_date TEXT,
  notes TEXT,
  order_date TEXT NOT NULL,
  project_id UUID NOT NULL,
  status TEXT NOT NULL,
  total_amount NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  vendor TEXT NOT NULL
);

-- meeting_chat_messages
CREATE TABLE IF NOT EXISTS meeting_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  room_id UUID NOT NULL,
  sender_id UUID
);

-- meeting_recordings
CREATE TABLE IF NOT EXISTS meeting_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds NUMERIC,
  extracted_items JSONB DEFAULT '{}',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size NUMERIC,
  file_url TEXT NOT NULL,
  participants TEXT[],
  recording_type TEXT,
  room_name TEXT,
  transcript TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- meeting_rooms
CREATE TABLE IF NOT EXISTS meeting_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  max_capacity NUMERIC,
  name TEXT NOT NULL
);

-- message_threads
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message TEXT NOT NULL,
  parent_message_id UUID NOT NULL,
  sender TEXT NOT NULL,
  sender_user_id UUID,
  "timestamp" TIMESTAMPTZ DEFAULT NOW()
);

-- mt_business_faqs
CREATE TABLE IF NOT EXISTS mt_business_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer TEXT NOT NULL,
  business_id UUID NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  question TEXT NOT NULL,
  service_id UUID,
  sort_order NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- mt_business_service_areas
CREATE TABLE IF NOT EXISTS mt_business_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aeo_city_summary TEXT,
  aeo_local_answer TEXT,
  aeo_local_context TEXT,
  aeo_nearby_landmarks TEXT[],
  business_id UUID NOT NULL,
  city TEXT NOT NULL,
  county TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  hero_image TEXT,
  is_primary BOOLEAN DEFAULT false,
  local_keywords TEXT[],
  neighborhoods TEXT[],
  region TEXT,
  seo_content TEXT,
  seo_description TEXT,
  seo_title TEXT,
  slug TEXT NOT NULL,
  state TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  zip_codes TEXT[]
);

-- mt_business_services
CREATE TABLE IF NOT EXISTS mt_business_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aeo_conversational_answer TEXT,
  aeo_key_points TEXT[],
  aeo_summary TEXT,
  business_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  duration TEXT,
  hero_image TEXT,
  icon TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  long_description TEXT,
  name TEXT NOT NULL,
  price_range TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  seo_title TEXT,
  short_description TEXT,
  slug TEXT NOT NULL,
  sort_order NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- mug_requests
CREATE TABLE IF NOT EXISTS mug_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  mug_accepted BOOLEAN DEFAULT false NOT NULL,
  project_address TEXT NOT NULL
);

-- overhead_config
CREATE TABLE IF NOT EXISTS overhead_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  effective_date TEXT NOT NULL,
  equipment_rental_rate NUMERIC NOT NULL,
  facility_overhead_rate NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  liability_insurance_rate NUMERIC NOT NULL,
  office_staff_rate NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_files
CREATE TABLE IF NOT EXISTS payment_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  payment_id UUID NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- permit_files
CREATE TABLE IF NOT EXISTS permit_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  permit_id UUID NOT NULL,
  uploaded_by UUID
);

-- permit_notes
CREATE TABLE IF NOT EXISTS permit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  permit_id UUID NOT NULL,
  title TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- permits
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID,
  agency_name TEXT,
  approved_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  expires_date TEXT,
  fee NUMERIC,
  must_pull_by_date TEXT,
  permit_number TEXT NOT NULL,
  permit_type TEXT NOT NULL,
  project_address TEXT,
  project_id UUID,
  project_name TEXT,
  pulled_date TEXT,
  referenced_inspection_id UUID,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- photo_annotations
CREATE TABLE IF NOT EXISTS photo_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_type TEXT NOT NULL,
  color TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL,
  height NUMERIC,
  photo_id UUID NOT NULL,
  project_id UUID NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  width NUMERIC,
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL
);

-- photo_comments
CREATE TABLE IF NOT EXISTS photo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_id UUID,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL,
  created_by_name TEXT,
  created_by_type TEXT,
  is_resolved BOOLEAN DEFAULT false,
  photo_id UUID NOT NULL,
  project_id UUID NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- pinned_messages
CREATE TABLE IF NOT EXISTS pinned_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_id UUID NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  pinned_by UUID
);

-- pins
CREATE TABLE IF NOT EXISTS pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_url TEXT,
  position_point_geojson JSONB DEFAULT '{}' NOT NULL,
  project_id UUID NOT NULL,
  qty NUMERIC,
  size TEXT,
  subtype TEXT,
  type TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- price_sheets
CREATE TABLE IF NOT EXISTS price_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT false,
  lines JSONB DEFAULT '{}' NOT NULL,
  name TEXT NOT NULL,
  system TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_access_requests
CREATE TABLE IF NOT EXISTS project_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID NOT NULL,
  reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  requester_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  responded_at TIMESTAMPTZ,
  responded_by UUID,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_assignments
CREATE TABLE IF NOT EXISTS project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID NOT NULL,
  customer_email TEXT NOT NULL,
  customer_id UUID,
  project_id UUID NOT NULL
);

-- project_calendar_events
CREATE TABLE IF NOT EXISTS project_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignee_ids TEXT[],
  color_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  end_date TEXT,
  event_date TEXT NOT NULL,
  event_type TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  parent_event_id UUID,
  project_id UUID,
  recurrence_days INTEGER[],
  recurrence_end_date TEXT,
  recurrence_interval NUMERIC,
  recurrence_type TEXT,
  reminder_days NUMERIC,
  status TEXT,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_change_orders
CREATE TABLE IF NOT EXISTS project_change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC NOT NULL,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  change_order_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  impact_days NUMERIC,
  project_id UUID NOT NULL,
  reason TEXT,
  requested_at TIMESTAMPTZ,
  requested_by UUID,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_contacts
CREATE TABLE IF NOT EXISTS project_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  name TEXT NOT NULL,
  notes TEXT,
  phone TEXT,
  project_id UUID NOT NULL,
  role TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_daily_reports
CREATE TABLE IF NOT EXISTS project_daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  crew_count NUMERIC,
  hours_total NUMERIC,
  materials_used JSONB DEFAULT '{}',
  photos JSONB DEFAULT '{}',
  project_id UUID NOT NULL,
  report_date TEXT NOT NULL,
  summary TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  weather JSONB DEFAULT '{}'
);

-- project_documents
CREATE TABLE IF NOT EXISTS project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  coordinator_id UUID,
  description TEXT,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  name TEXT NOT NULL,
  project_id UUID NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- project_incidents
CREATE TABLE IF NOT EXISTS project_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL,
  follow_up TEXT,
  incident_date TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  photos JSONB DEFAULT '{}',
  project_id UUID NOT NULL,
  reported_by UUID,
  resolved BOOLEAN DEFAULT false,
  severity TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_inspections
CREATE TABLE IF NOT EXISTS project_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  inspection_type TEXT NOT NULL,
  inspector_email TEXT,
  inspector_name TEXT,
  inspector_phone TEXT,
  project_id UUID NOT NULL,
  result_notes TEXT,
  scheduled_date TEXT,
  scheduled_time TEXT,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_materials
CREATE TABLE IF NOT EXISTS project_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID,
  checked_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date TEXT NOT NULL,
  delivery_date TEXT,
  external_id TEXT,
  file_url TEXT,
  is_returned BOOLEAN DEFAULT false,
  item_code TEXT,
  item_description TEXT NOT NULL,
  notes TEXT,
  project_id UUID NOT NULL,
  quantity NUMERIC,
  quantity_ordered NUMERIC,
  quantity_received NUMERIC,
  quantity_remaining NUMERIC,
  return_date TEXT,
  sent_to_yard BOOLEAN DEFAULT false,
  source TEXT NOT NULL,
  status TEXT,
  tax_amount NUMERIC,
  total_amount NUMERIC NOT NULL,
  unit TEXT,
  unit_price NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  vendor TEXT NOT NULL
);

-- project_photos
CREATE TABLE IF NOT EXISTS project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT,
  display_order NUMERIC,
  file_size NUMERIC,
  is_highlighted_after BOOLEAN DEFAULT false,
  is_highlighted_before BOOLEAN DEFAULT false,
  is_visible_to_customer BOOLEAN DEFAULT false NOT NULL,
  photo_tag TEXT,
  photo_url TEXT NOT NULL,
  project_id UUID NOT NULL,
  recommendation TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID NOT NULL
);

-- project_punchlists
CREATE TABLE IF NOT EXISTS project_punchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_number NUMERIC NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  photo_url TEXT,
  assigned_to UUID,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_rating
CREATE TABLE IF NOT EXISTS project_rating (
  project_id UUID PRIMARY KEY,
  rating TEXT NOT NULL,
  ai_suggested_rating TEXT,
  ai_suggestion_reason TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID
);

-- project_revenue
CREATE TABLE IF NOT EXISTS project_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  revenue_type TEXT NOT NULL,
  description TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_status_updates
CREATE TABLE IF NOT EXISTS project_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  status TEXT NOT NULL,
  user_id UUID NOT NULL,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_tasks (must be created before project_task_assignees and project_task_subtasks)
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  assigned_to UUID,
  assigned_by UUID,
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  duration_days NUMERIC,
  display_order NUMERIC,
  progress_percent NUMERIC,
  color TEXT,
  screenshots JSONB DEFAULT '{}',
  visible_to_client BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_task_assignees
CREATE TABLE IF NOT EXISTS project_task_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL,
  user_id UUID NOT NULL,
  assigned_at TIMESTAMPTZ,
  assigned_by UUID
);

-- project_task_subtasks
CREATE TABLE IF NOT EXISTS project_task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_task_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  order_index NUMERIC,
  assigned_to UUID,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_team_assignments
CREATE TABLE IF NOT EXISTS project_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  assigned_by UUID NOT NULL,
  role TEXT NOT NULL,
  assignment_status TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- project_training_documents
CREATE TABLE IF NOT EXISTS project_training_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  source_file_type TEXT NOT NULL,
  source_file_url TEXT NOT NULL,
  processing_status TEXT,
  extracted_data JSONB DEFAULT '{}',
  quote_request_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_updates
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  is_visible_to_customer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_videos
CREATE TABLE IF NOT EXISTS project_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  duration_seconds NUMERIC,
  file_size NUMERIC,
  is_visible_to_customer BOOLEAN DEFAULT false,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- proposal_commissions
CREATE TABLE IF NOT EXISTS proposal_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  team_member_id UUID NOT NULL,
  team_member_name TEXT NOT NULL,
  commission_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- proposal_photos
CREATE TABLE IF NOT EXISTS proposal_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL,
  description TEXT,
  display_order NUMERIC,
  file_size NUMERIC,
  comparison_block_id TEXT,
  comparison_metadata JSONB DEFAULT '{}',
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- proposal_pricing
CREATE TABLE IF NOT EXISTS proposal_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  system_name TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC,
  total_price NUMERIC,
  description TEXT,
  display_order NUMERIC,
  is_optional BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- punchlists
CREATE TABLE IF NOT EXISTS punchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  status TEXT,
  project_id UUID,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- purchase_order_files
CREATE TABLE IF NOT EXISTS purchase_order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- quantities
CREATE TABLE IF NOT EXISTS quantities (
  project_id UUID PRIMARY KEY,
  area_sq NUMERIC,
  eave_lf NUMERIC,
  hip_lf NUMERIC,
  rake_lf NUMERIC,
  ridge_lf NUMERIC,
  step_lf NUMERIC,
  valley_lf NUMERIC,
  wall_lf NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- quiz_answers
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  answer_text TEXT NOT NULL,
  answer_order NUMERIC NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

-- quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score NUMERIC NOT NULL,
  passed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  question_order NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  passing_score NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT false,
  presentation_url TEXT,
  week_number NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- quote_attachments
CREATE TABLE IF NOT EXISTS quote_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size NUMERIC,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- quote_settings
CREATE TABLE IF NOT EXISTS quote_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_markup_pct NUMERIC,
  default_waste_pct NUMERIC,
  labor_rate_per_sq NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- quote_training_sessions
CREATE TABLE IF NOT EXISTS quote_training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL,
  user_id UUID,
  actions_sequence JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds NUMERIC,
  total_actions NUMERIC,
  total_lines_drawn NUMERIC,
  total_facets_created NUMERIC,
  total_measurements NUMERIC,
  undo_count NUMERIC,
  redo_count NUMERIC,
  final_estimate NUMERIC,
  difficulty_rating NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- recognitions
CREATE TABLE IF NOT EXISTS recognitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL,
  to_user_ids TEXT[] NOT NULL,
  badge_name TEXT NOT NULL,
  badge_emoji TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_analyses
CREATE TABLE IF NOT EXISTS roof_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aerial_image_id UUID NOT NULL,
  analysis_status TEXT NOT NULL,
  total_roof_area NUMERIC,
  roof_pitch_degrees NUMERIC,
  roof_complexity_score NUMERIC,
  ai_confidence_score NUMERIC,
  ai_response_data JSONB DEFAULT '{}',
  roof_outline_coordinates JSONB DEFAULT '{}',
  roof_planes_data JSONB DEFAULT '{}',
  ridge_length_ft NUMERIC,
  gutter_length_ft NUMERIC,
  chimney_count NUMERIC,
  skylight_count NUMERIC,
  vent_count NUMERIC,
  dormer_count NUMERIC,
  penetration_count NUMERIC,
  valley_count NUMERIC,
  downspout_count NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_corrections
CREATE TABLE IF NOT EXISTS roof_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID,
  vision_analysis_id UUID,
  original_vertices JSONB NOT NULL,
  corrected_vertices JSONB NOT NULL,
  original_edges JSONB DEFAULT '{}',
  corrected_edges JSONB DEFAULT '{}',
  adjustment_summary JSONB DEFAULT '{}',
  correction_notes TEXT,
  roof_type TEXT,
  image_quality TEXT,
  image_resolution TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_features
CREATE TABLE IF NOT EXISTS roof_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roof_analysis_id UUID NOT NULL,
  feature_type TEXT NOT NULL,
  feature_coordinates JSONB NOT NULL,
  feature_count NUMERIC,
  confidence_score NUMERIC,
  dimensions JSONB DEFAULT '{}',
  measurements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_measurements
CREATE TABLE IF NOT EXISTS roof_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  data JSONB DEFAULT '{}',
  confidence_score NUMERIC,
  analysis_notes TEXT,
  assistant_thread_id TEXT,
  assistant_run_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_planes
CREATE TABLE IF NOT EXISTS roof_planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roof_analysis_id UUID NOT NULL,
  plane_coordinates JSONB NOT NULL,
  plane_type TEXT,
  area_sqft NUMERIC,
  slope_angle NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_quoter_projects
CREATE TABLE IF NOT EXISTS roof_quoter_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roof_structures
CREATE TABLE IF NOT EXISTS roof_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID NOT NULL,
  structure_id TEXT NOT NULL,
  geometry JSONB NOT NULL,
  area_sq_ft NUMERIC NOT NULL,
  perimeter_ft NUMERIC,
  confidence NUMERIC NOT NULL,
  is_included BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- room_participants
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID,
  member_id UUID NOT NULL,
  is_muted BOOLEAN DEFAULT false,
  is_camera_on BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- safety_checklist_responses
CREATE TABLE IF NOT EXISTS safety_checklist_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  time_clock_id UUID,
  hard_hat BOOLEAN DEFAULT false,
  protective_glasses BOOLEAN DEFAULT false,
  safety_vest BOOLEAN DEFAULT false,
  steel_cap_boots BOOLEAN DEFAULT false,
  additional_items TEXT,
  selfie_url TEXT,
  signature_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- safety_meeting_files
CREATE TABLE IF NOT EXISTS safety_meeting_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_files
CREATE TABLE IF NOT EXISTS service_ticket_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size NUMERIC,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_invoices
CREATE TABLE IF NOT EXISTS service_ticket_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date TIMESTAMPTZ DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  paid_amount NUMERIC,
  balance NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_items
CREATE TABLE IF NOT EXISTS service_ticket_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT,
  description TEXT,
  quantity NUMERIC,
  unit TEXT,
  unit_cost NUMERIC,
  total NUMERIC,
  cost_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_notes
CREATE TABLE IF NOT EXISTS service_ticket_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_payments
CREATE TABLE IF NOT EXISTS service_ticket_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  invoice_id UUID,
  amount NUMERIC NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  payment_type TEXT,
  payment_note TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_ticket_time_cards
CREATE TABLE IF NOT EXISTS service_ticket_time_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  employee_id UUID,
  employee_name TEXT,
  work_date TIMESTAMPTZ NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  duration_hours NUMERIC,
  cost_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- shift_tasks
CREATE TABLE IF NOT EXISTS shift_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- site_content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT false,
  keywords TEXT[],
  search_score NUMERIC,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  url TEXT NOT NULL
);

-- skill_level_evaluations
CREATE TABLE IF NOT EXISTS skill_level_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_level NUMERIC NOT NULL,
  competency_scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  employee_id UUID NOT NULL,
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  evaluation_notes TEXT,
  evaluator_id UUID NOT NULL,
  is_current BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- skill_levels
CREATE TABLE IF NOT EXISTS skill_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  can_lead_crew BOOLEAN DEFAULT false,
  can_work_alone BOOLEAN DEFAULT false,
  color TEXT NOT NULL,
  competencies JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL,
  level NUMERIC NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL
);

-- sms_conversations
CREATE TABLE IF NOT EXISTS sms_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  direction TEXT NOT NULL,
  from_phone TEXT NOT NULL,
  lead_id UUID,
  message TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  twilio_sid TEXT
);

-- solar_analyses
CREATE TABLE IF NOT EXISTS solar_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  imagery_date TEXT,
  imagery_quality TEXT,
  parsed_roof_data JSONB DEFAULT '{}',
  quote_request_id UUID NOT NULL,
  raw_api_response JSONB DEFAULT '{}',
  status TEXT NOT NULL,
  total_area_sqft NUMERIC,
  total_area_squares NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- store_orders
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_email TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB DEFAULT '{}',
  notes TEXT,
  order_number TEXT NOT NULL,
  shipping NUMERIC,
  shipping_address JSONB DEFAULT '{}',
  status TEXT NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC,
  total NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- sub_contracts
CREATE TABLE IF NOT EXISTS sub_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_number TEXT,
  balance NUMERIC,
  billed_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  date TEXT,
  issued_by TEXT,
  paid NUMERIC,
  project_id UUID,
  remaining_retainage NUMERIC,
  status TEXT,
  subcontractor_id UUID,
  subject TEXT NOT NULL,
  total NUMERIC,
  total_retainage NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  work_retainage_percent NUMERIC
);

-- sub_contract_bills
CREATE TABLE IF NOT EXISTS sub_contract_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_date TEXT,
  bill_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TEXT,
  paid NUMERIC,
  sub_contract_id UUID NOT NULL,
  total NUMERIC
);

-- sub_contract_documents
CREATE TABLE IF NOT EXISTS sub_contract_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  file_url TEXT,
  policy_number TEXT,
  policy_type TEXT,
  status TEXT,
  sub_contract_id UUID NOT NULL
);

-- sub_contract_files
CREATE TABLE IF NOT EXISTS sub_contract_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  sub_contract_id UUID NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID
);

-- sub_contract_items
CREATE TABLE IF NOT EXISTS sub_contract_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billed NUMERIC,
  cost_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_order NUMERIC,
  item_name TEXT NOT NULL,
  item_type TEXT,
  quantity NUMERIC,
  remaining NUMERIC,
  sub_contract_id UUID NOT NULL,
  total NUMERIC,
  unit TEXT,
  unit_cost NUMERIC
);

-- sub_contract_notes
CREATE TABLE IF NOT EXISTS sub_contract_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  sub_contract_id UUID NOT NULL
);

-- sub_contract_terms
CREATE TABLE IF NOT EXISTS sub_contract_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clarifications TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  default_terms TEXT,
  exclusions TEXT,
  inclusions TEXT,
  scope_of_work TEXT,
  sub_contract_id UUID NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- submittal_items
CREATE TABLE IF NOT EXISTS submittal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date_received TEXT,
  date_sent TEXT,
  description TEXT,
  item_number TEXT NOT NULL,
  manufacturer TEXT,
  name TEXT NOT NULL,
  order_index NUMERIC,
  plan_sheet_numbers TEXT,
  response_note TEXT,
  response_status TEXT,
  spec_section TEXT,
  status TEXT,
  submittal_id UUID NOT NULL
);

-- submittal_item_attachments
CREATE TABLE IF NOT EXISTS submittal_item_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  file_size NUMERIC,
  file_type TEXT,
  name TEXT NOT NULL,
  submittal_item_id UUID NOT NULL,
  uploaded_by UUID,
  url TEXT NOT NULL
);

-- submittals
CREATE TABLE IF NOT EXISTS submittals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coordinator_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date_received TEXT,
  description TEXT,
  due_date TEXT,
  external_approver TEXT,
  external_comments TEXT,
  external_link TEXT,
  external_status TEXT,
  internal_approver_id UUID,
  internal_comments TEXT,
  internal_response TEXT,
  name TEXT NOT NULL,
  plan_sheet_numbers TEXT,
  project_id UUID NOT NULL,
  sent_to TEXT,
  spec_section TEXT,
  status TEXT,
  submittal_type TEXT,
  submitted_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- task_comments
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subtask_id UUID,
  task_id UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- task_subtasks
CREATE TABLE IF NOT EXISTS task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  due_date TEXT,
  order_index NUMERIC NOT NULL,
  parent_task_id UUID NOT NULL,
  proof_description TEXT,
  proof_url TEXT,
  status TEXT NOT NULL,
  title TEXT NOT NULL
);

-- team_activity_log
CREATE TABLE IF NOT EXISTS team_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_data JSONB DEFAULT '{}',
  action_description TEXT,
  action_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  member_id UUID NOT NULL,
  points NUMERIC
);

-- team_board_comments
CREATE TABLE IF NOT EXISTS team_board_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  item_id UUID NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- team_board_items
CREATE TABLE IF NOT EXISTS team_board_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to UUID,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  description TEXT,
  feedback_id UUID,
  priority TEXT,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  votes_count NUMERIC
);

-- team_board_votes
CREATE TABLE IF NOT EXISTS team_board_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  item_id UUID NOT NULL,
  user_id UUID NOT NULL
);

-- team_chats
CREATE TABLE IF NOT EXISTS team_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attachments JSONB DEFAULT '{}',
  audio_url TEXT,
  channel_name TEXT,
  connecteam_chat_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  duration NUMERIC,
  is_important BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  message_type TEXT,
  sender TEXT NOT NULL,
  sender_employee_id UUID,
  sender_user_id UUID,
  team_id UUID,
  "timestamp" TIMESTAMPTZ NOT NULL
);

-- team_tasks
CREATE TABLE IF NOT EXISTS team_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_notes TEXT,
  client_id UUID,
  client_name TEXT,
  collaborator_ids TEXT[],
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  current_focus BOOLEAN DEFAULT false,
  description TEXT,
  document_title TEXT,
  document_url TEXT,
  due_date TEXT,
  end_time TEXT,
  estimated_duration TEXT NOT NULL,
  importance_level NUMERIC NOT NULL,
  owner_id UUID,
  priority TEXT NOT NULL,
  progress_percent NUMERIC NOT NULL,
  project_id UUID,
  proof_description TEXT,
  proof_url TEXT,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  urgency_level NUMERIC NOT NULL
);

-- time_clock
CREATE TABLE IF NOT EXISTS time_clock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  break_location TEXT,
  break_start_time TIMESTAMPTZ,
  break_time_minutes NUMERIC,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  clock_out_location TEXT,
  connecteam_timecard_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  employee_name TEXT NOT NULL,
  employee_role TEXT,
  job_id UUID,
  location TEXT,
  notes TEXT,
  overtime_hours NUMERIC,
  project_name TEXT,
  status TEXT,
  total_hours NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT,
  assigned_to UUID,
  assigned_to_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  description TEXT,
  due_date TEXT,
  priority TEXT NOT NULL,
  project_id UUID,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_actions_log
CREATE TABLE IF NOT EXISTS user_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_data JSONB DEFAULT '{}' NOT NULL,
  action_type TEXT NOT NULL,
  quote_id UUID,
  session_id UUID,
  state_after JSONB DEFAULT '{}',
  state_before JSONB DEFAULT '{}',
  time_since_last_action_ms NUMERIC,
  "timestamp" TIMESTAMPTZ DEFAULT NOW(),
  tool_active TEXT,
  user_id UUID,
  view_state JSONB DEFAULT '{}'
);

-- user_devices
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  device_token TEXT NOT NULL,
  platform TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- visualizer
CREATE TABLE IF NOT EXISTS visualizer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- visualizer_images
CREATE TABLE IF NOT EXISTS visualizer_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  height NUMERIC NOT NULL,
  original_url TEXT NOT NULL,
  project_id UUID NOT NULL,
  width NUMERIC NOT NULL
);

-- visualizer_masks
CREATE TABLE IF NOT EXISTS visualizer_masks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alpha_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_id UUID NOT NULL,
  name TEXT,
  svg_path TEXT NOT NULL,
  type TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- visualizer_projects
CREATE TABLE IF NOT EXISTS visualizer_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  owner TEXT,
  session_token TEXT,
  title TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- visualizer_variants
CREATE TABLE IF NOT EXISTS visualizer_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  hex TEXT NOT NULL,
  image_id UUID NOT NULL,
  preview_url TEXT
);

-- work_activities
CREATE TABLE IF NOT EXISTS work_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  connectteam_timecard_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  employee_mapping_id UUID,
  employee_name TEXT NOT NULL,
  employee_role TEXT,
  hourly_rate NUMERIC,
  notes TEXT,
  overtime_hours NUMERIC,
  overtime_rate NUMERIC,
  project_id UUID NOT NULL,
  regular_hours NUMERIC,
  status TEXT,
  total_cost NUMERIC,
  total_hours NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  work_date TEXT NOT NULL
);

-- workforce_attendance
CREATE TABLE IF NOT EXISTS workforce_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  break_duration_minutes NUMERIC,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  connecteam_timecard_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  employee_mapping_id UUID NOT NULL,
  employee_name TEXT NOT NULL,
  employee_role TEXT,
  location_data JSONB DEFAULT '{}',
  project_id UUID,
  status TEXT NOT NULL,
  sync_date TEXT NOT NULL,
  total_hours NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  work_date TEXT NOT NULL
);

-- workforce_messages
CREATE TABLE IF NOT EXISTS workforce_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attachments JSONB DEFAULT '{}',
  author_employee_id UUID,
  author_name TEXT NOT NULL,
  author_role TEXT,
  channel_name TEXT,
  connecteam_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_important BOOLEAN DEFAULT false,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL,
  sync_date TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL
);

-- workforce_schedules
CREATE TABLE IF NOT EXISTS workforce_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_date TEXT NOT NULL,
  connecteam_schedule_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  employee_mapping_id UUID NOT NULL,
  employee_name TEXT NOT NULL,
  employee_role TEXT,
  project_id UUID,
  scheduled_hours NUMERIC,
  shift_description TEXT,
  shift_end TIMESTAMPTZ NOT NULL,
  shift_start TIMESTAMPTZ NOT NULL,
  shift_title TEXT,
  status TEXT NOT NULL,
  sync_date TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- work_order_files
CREATE TABLE IF NOT EXISTS work_order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID,
  work_order_id UUID NOT NULL
);

-- work_order_items
CREATE TABLE IF NOT EXISTS work_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cost_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_order NUMERIC,
  item_name TEXT NOT NULL,
  item_type TEXT,
  markup_percentage NUMERIC,
  quantity NUMERIC,
  tax_applicable BOOLEAN DEFAULT false,
  total NUMERIC,
  unit TEXT,
  unit_cost NUMERIC,
  work_order_id UUID NOT NULL
);

-- work_order_notes
CREATE TABLE IF NOT EXISTS work_order_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  created_by_name TEXT,
  work_order_id UUID NOT NULL
);


-- ============================================================
-- PART 2: Unique constraints needed for UPSERT operations
-- ============================================================

-- push_subscriptions: upsert on user_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'push_subscriptions_user_id_key') THEN
    ALTER TABLE push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- app_settings: upsert on key
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_settings_key_key') THEN
    ALTER TABLE app_settings ADD CONSTRAINT app_settings_key_key UNIQUE (key);
  END IF;
END $$;

-- proposal_commissions: upsert on proposal_id, team_member_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'proposal_commissions_proposal_member_key') THEN
    ALTER TABLE proposal_commissions ADD CONSTRAINT proposal_commissions_proposal_member_key UNIQUE (proposal_id, team_member_id);
  END IF;
END $$;

-- room_participants: upsert on room_id, member_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'room_participants_room_member_key') THEN
    ALTER TABLE room_participants ADD CONSTRAINT room_participants_room_member_key UNIQUE (room_id, member_id);
  END IF;
END $$;

-- signature_envelopes: upsert on proposal_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'signature_envelopes_proposal_id_key') THEN
    ALTER TABLE signature_envelopes ADD CONSTRAINT signature_envelopes_proposal_id_key UNIQUE (proposal_id);
  END IF;
END $$;

-- employee_pay_rates: upsert on employee_mapping_id, effective_from
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'employee_pay_rates_mapping_from_key') THEN
    ALTER TABLE employee_pay_rates ADD CONSTRAINT employee_pay_rates_mapping_from_key UNIQUE (employee_mapping_id, effective_from);
  END IF;
END $$;

-- admin_users: upsert on user_id (add if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_user_id_key') THEN
    ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- team_directory: upsert on user_id (add if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'team_directory_user_id_key') THEN
    ALTER TABLE team_directory ADD CONSTRAINT team_directory_user_id_key UNIQUE (user_id);
  END IF;
END $$;


-- ============================================================
-- PART 3: GRANT permissions to PostgREST roles
-- ============================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('GRANT ALL ON %I TO anon, authenticated, service_role', tbl);
  END LOOP;
END $$;


-- ============================================================
-- PART 4: Stub RPC functions for local dev
-- (These return NULL/empty but prevent "function not found" errors)
-- ============================================================

CREATE OR REPLACE FUNCTION validate_invitation_token(p_token TEXT)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '{}'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION get_or_create_conversation(p_user_id UUID, p_other_user_id UUID)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE conv_id UUID;
BEGIN
  SELECT id INTO conv_id FROM direct_conversations LIMIT 1;
  IF conv_id IS NULL THEN
    INSERT INTO direct_conversations (id, created_at) VALUES (gen_random_uuid(), NOW()) RETURNING id INTO conv_id;
  END IF;
  RETURN conv_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_phone(p_user_id UUID)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN RETURN NULL; END;
$$;

CREATE OR REPLACE FUNCTION pin_message(p_message_id UUID, p_channel_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO pinned_messages (message_id, channel_id) VALUES (p_message_id, p_channel_id) ON CONFLICT DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_employee_score(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '{}'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION calculate_all_employee_scores()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION initialize_contributor_scores()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION crm_move_customer(p_progress_id UUID, p_target_phase_id UUID, p_target_step_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION calculate_correction_adjustments(p_correction_id UUID)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '{}'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION get_team_members()
RETURNS SETOF team_directory LANGUAGE plpgsql AS $$
BEGIN RETURN QUERY SELECT * FROM team_directory; END;
$$;

CREATE OR REPLACE FUNCTION generate_service_ticket_token(p_ticket_id UUID)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN RETURN gen_random_uuid()::text; END;
$$;

CREATE OR REPLACE FUNCTION execute_tenant_query(p_tenant_id TEXT, p_query TEXT)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '{}'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION list_tenants()
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '[]'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION get_tenant_config(p_tenant_id TEXT)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN '{}'::jsonb; END;
$$;

CREATE OR REPLACE FUNCTION create_tenant(p_name TEXT, p_domain TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql AS $$
BEGIN RETURN jsonb_build_object('id', gen_random_uuid()); END;
$$;

CREATE OR REPLACE FUNCTION update_tenant_subscription(p_tenant_id TEXT, p_plan TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION toggle_tenant_edge_function(p_tenant_id TEXT, p_function_slug TEXT, p_enabled BOOLEAN)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION bulk_toggle_edge_functions(p_tenant_id TEXT, p_slugs TEXT[], p_enabled BOOLEAN)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;

CREATE OR REPLACE FUNCTION update_onboarding_progress(p_tenant_id TEXT, p_step TEXT, p_data JSONB DEFAULT '{}')
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN NULL; END;
$$;


-- ============================================================
-- PART 5: updated_at triggers for all new tables
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN (
      SELECT c.relname FROM pg_class c
      JOIN pg_attribute a ON a.attrelid = c.oid
      WHERE a.attname = 'updated_at' AND c.relkind = 'r'
    )
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'set_updated_at_' || tbl
      AND tgrelid = tbl::regclass
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER set_updated_at_%s BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
        tbl, tbl
      );
    END IF;
  END LOOP;
END $$;


-- Done!
