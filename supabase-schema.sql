-- Personal Life Dashboard Supabase Schema Migration
-- Matches Architecture Specification DOC-04

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Life Domains Table
CREATE TABLE IF NOT EXISTS public.life_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    neglect_threshold_days INT DEFAULT 5,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    current_summary TEXT,
    momentum_state TEXT DEFAULT 'STABLE' CHECK (momentum_state IN ('IMPROVING', 'STABLE', 'SLIPPING', 'NEGLECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Goals Table (Multi-horizon)
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES public.life_domains(id) ON DELETE SET NULL,
    parent_goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    horizon TEXT NOT NULL CHECK (horizon IN ('LONG_TERM', 'MONTHLY', 'WEEKLY', 'DAILY')),
    title TEXT NOT NULL,
    why_it_matters TEXT,
    status TEXT DEFAULT 'ON_TRACK' CHECK (status IN ('ON_TRACK', 'DELAYED', 'RECONSIDER', 'COMPLETED')),
    progress_pct INT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    next_action TEXT,
    target_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Priorities Table (Top 3 Focus)
CREATE TABLE IF NOT EXISTS public.daily_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    priority_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rank INT NOT NULL CHECK (rank BETWEEN 1 AND 3),
    title TEXT NOT NULL,
    domain_id UUID REFERENCES public.life_domains(id) ON DELETE SET NULL,
    linked_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    linked_project_id UUID,
    status TEXT DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'COMPLETED', 'CARRIED_FORWARD')),
    blocker_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Idea Sandbox Table
CREATE TABLE IF NOT EXISTS public.idea_sandbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    proposed_purpose TEXT CHECK (proposed_purpose IN ('PERSONAL', 'LEARNING', 'PORTFOLIO', 'BUSINESS')),
    feasibility_notes TEXT,
    status TEXT DEFAULT 'EVALUATING' CHECK (status IN ('EVALUATING', 'PROMOTED', 'DEFERRED', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES public.life_domains(id) ON DELETE SET NULL,
    source_idea_id UUID REFERENCES public.idea_sandbox(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    purpose_type TEXT DEFAULT 'PERSONAL' CHECK (purpose_type IN ('PERSONAL', 'LEARNING', 'PORTFOLIO', 'BUSINESS')),
    is_existing_project BOOLEAN DEFAULT false,
    lifecycle_stage TEXT DEFAULT 'PLANNING' CHECK (lifecycle_stage IN ('DISCOVERY', 'PLANNING', 'UI_UX', 'ARCHITECTURE', 'ENGINEERING', 'RELEASE', 'MAINTENANCE')),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'BLOCKED', 'COMPLETED')),
    next_meaningful_action TEXT,
    pending_decision TEXT,
    needs_attention BOOLEAN DEFAULT false,
    milestone_progress_pct INT DEFAULT 0 CHECK (milestone_progress_pct BETWEEN 0 AND 100),
    last_touched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Ventures Table
CREATE TABLE IF NOT EXISTS public.ventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'ACTIVE',
    ongoing_activities JSONB DEFAULT '[]'::jsonb,
    pending_decisions JSONB DEFAULT '[]'::jsonb,
    milestone_progress_pct INT DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Career & Job Applications Table (95/5 Monitor)
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    status TEXT DEFAULT 'APPLIED' CHECK (status IN ('INTERESTED', 'APPLIED', 'PENDING', 'SHORTLISTED', 'INTERVIEWING', 'OFFER', 'REJECTED')),
    location TEXT,
    salary_range TEXT,
    applied_at DATE DEFAULT CURRENT_DATE,
    last_contact_at TIMESTAMPTZ DEFAULT NOW(),
    follow_up_due_at DATE,
    needs_follow_up BOOLEAN DEFAULT false,
    recruiter_name TEXT,
    recruiter_email TEXT,
    latest_message_snippet TEXT,
    gmail_thread_id TEXT,
    gmail_deep_link TEXT,
    application_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Learning & Skills Table
CREATE TABLE IF NOT EXISTS public.learning_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name TEXT NOT NULL,
    category TEXT,
    linked_career_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    topics_completed JSONB DEFAULT '[]'::jsonb,
    topics_in_progress JSONB DEFAULT '[]'::jsonb,
    topics_to_learn JSONB DEFAULT '[]'::jsonb,
    struggling_areas TEXT,
    capability_now TEXT,
    evidence_project_url TEXT,
    last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Health & Fitness Logs Table
CREATE TABLE IF NOT EXISTS public.health_fitness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_type TEXT,
    duration_mins INT DEFAULT 0,
    movement_summary TEXT,
    habits_completed JSONB DEFAULT '[]'::jsonb,
    water_intake_liters NUMERIC(3,1),
    sleep_hours NUMERIC(3,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Finance Entries & Upcoming Payments Table
CREATE TABLE IF NOT EXISTS public.finance_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('INCOME', 'EXPENSE', 'SAVINGS')),
    category TEXT NOT NULL,
    amount_inr NUMERIC(12,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.upcoming_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    amount_inr NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'PAID', 'OVERDUE')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Personal Operations Items
CREATE TABLE IF NOT EXISTS public.personal_ops_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type TEXT NOT NULL CHECK (item_type IN ('TASK', 'APPOINTMENT', 'COMMITMENT', 'RECURRING', 'REFERENCE_NOTE')),
    title TEXT NOT NULL,
    due_at TIMESTAMPTZ,
    recurrence_rule TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED')),
    reference_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Cadence Reviews & Reflections
CREATE TABLE IF NOT EXISTS public.cadence_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_type TEXT NOT NULL CHECK (review_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'REFLECTION')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    planned_items JSONB DEFAULT '[]'::jsonb,
    completed_items JSONB DEFAULT '[]'::jsonb,
    pending_carried_forward JSONB DEFAULT '[]'::jsonb,
    delays_and_interruptions TEXT,
    neglected_domains JSONB DEFAULT '[]'::jsonb,
    achievements TEXT,
    continue_doing TEXT,
    stop_doing TEXT,
    change_next TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Approval Queue Actions (5% Action Guardrail)
CREATE TABLE IF NOT EXISTS public.approval_queue_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL CHECK (action_type IN ('SEND_GMAIL', 'CREATE_GMAIL_DRAFT', 'SUBMIT_APPLICATION', 'SCHEDULE_FOLLOWUP')),
    target_entity_id UUID,
    summary_title TEXT NOT NULL,
    payload_json JSONB DEFAULT '{}'::jsonb,
    ai_rationale TEXT,
    status TEXT DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'EXECUTED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by_user_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ
);

-- Enable RLS (permissive for anon/authenticated for personal single-user app)
ALTER TABLE public.life_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_sandbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_fitness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_ops_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadence_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_queue_actions ENABLE ROW LEVEL SECURITY;

-- Add Public Read/Write Policies
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access on %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;
