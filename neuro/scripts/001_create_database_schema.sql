-- ============================================
-- SAMD (Software as a Medical Device)
-- HIPAA-Compliant Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Stores parent/caregiver information
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- CHILDREN TABLE
-- Stores child information with PHI protection
-- ============================================
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  diagnosis TEXT,
  diagnosis_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for children
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS Policies for children
CREATE POLICY "children_select_own"
  ON public.children FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "children_insert_own"
  ON public.children FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "children_update_own"
  ON public.children FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "children_delete_own"
  ON public.children FOR DELETE
  USING (auth.uid() = parent_id);

-- ============================================
-- BEHAVIOR_LOGS TABLE
-- Daily behavior tracking entries
-- ============================================
CREATE TABLE IF NOT EXISTS public.behavior_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  mood TEXT, -- happy, neutral, frustrated, anxious, etc.
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_hours DECIMAL(4,2),
  behaviors_observed TEXT[], -- array of behavior tags
  triggers TEXT, -- what triggered behaviors
  successes TEXT, -- positive moments
  challenges TEXT, -- difficult moments
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for behavior_logs
ALTER TABLE public.behavior_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for behavior_logs
CREATE POLICY "behavior_logs_select_own"
  ON public.behavior_logs FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "behavior_logs_insert_own"
  ON public.behavior_logs FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "behavior_logs_update_own"
  ON public.behavior_logs FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "behavior_logs_delete_own"
  ON public.behavior_logs FOR DELETE
  USING (auth.uid() = parent_id);

-- ============================================
-- ACTIVITIES TABLE
-- Track activities, exercises, and routines
-- ============================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL, -- therapy, exercise, learning, routine, sensory
  activity_name TEXT NOT NULL,
  duration_minutes INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  child_engagement INTEGER CHECK (child_engagement >= 1 AND child_engagement <= 5),
  completion_status TEXT, -- completed, partial, skipped
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activities
CREATE POLICY "activities_select_own"
  ON public.activities FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "activities_insert_own"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "activities_update_own"
  ON public.activities FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "activities_delete_own"
  ON public.activities FOR DELETE
  USING (auth.uid() = parent_id);

-- ============================================
-- AI_RECOMMENDATIONS TABLE
-- AI-generated personalized recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_date DATE NOT NULL,
  recommendation_type TEXT NOT NULL, -- daily_plan, exercise, strategy, intervention
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT, -- why this was recommended based on data
  priority TEXT, -- high, medium, low
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, skipped
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for ai_recommendations
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_recommendations
CREATE POLICY "ai_recommendations_select_own"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "ai_recommendations_insert_own"
  ON public.ai_recommendations FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "ai_recommendations_update_own"
  ON public.ai_recommendations FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "ai_recommendations_delete_own"
  ON public.ai_recommendations FOR DELETE
  USING (auth.uid() = parent_id);

-- ============================================
-- PROGRESS_METRICS TABLE
-- Track quantifiable progress over time
-- ============================================
CREATE TABLE IF NOT EXISTS public.progress_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- communication, social, motor, academic, behavioral
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2),
  unit TEXT, -- percentage, count, score, etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for progress_metrics
ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for progress_metrics
CREATE POLICY "progress_metrics_select_own"
  ON public.progress_metrics FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "progress_metrics_insert_own"
  ON public.progress_metrics FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "progress_metrics_update_own"
  ON public.progress_metrics FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "progress_metrics_delete_own"
  ON public.progress_metrics FOR DELETE
  USING (auth.uid() = parent_id);

-- ============================================
-- AUDIT_LOGS TABLE
-- HIPAA-required audit trail for data access
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- view, create, update, delete
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for audit_logs (only viewable by owner)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_select_own"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON public.children(parent_id);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_child_id ON public.behavior_logs(child_id);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_log_date ON public.behavior_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_activities_child_id ON public.activities(child_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_date ON public.activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_child_id ON public.ai_recommendations(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_child_id ON public.progress_metrics(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_metric_date ON public.progress_metrics(metric_date);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_behavior_logs_updated_at
  BEFORE UPDATE ON public.behavior_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at
  BEFORE UPDATE ON public.ai_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
