-- Starter Seed Data for Personal Life Dashboard

-- 1. Seed Life Domains
INSERT INTO public.life_domains (slug, name, description, icon, neglect_threshold_days, last_activity_at, current_summary, momentum_state)
VALUES 
('career', 'Career & Income', 'Job hunting, engineering roles, interviews & compensation', 'Briefcase', 3, NOW() - INTERVAL '1 day', 'Active job hunt: 3 shortlisted applications, 1 interview scheduled this week.', 'IMPROVING'),
('ventures', 'Business & Ventures', 'Entrepreneurial projects, Klarone, client solutions', 'Rocket', 5, NOW() - INTERVAL '2 days', 'Klarone MVP spec locked; core architecture in progress.', 'STABLE'),
('learning', 'Learning & Skills', 'Deepening full-stack engineering, system design, and AI', 'GraduationCap', 4, NOW() - INTERVAL '1 day', 'Mastering Next.js 15, PostgreSQL indexing, and distributed agents.', 'IMPROVING'),
('health', 'Health & Fitness', 'Physical fitness, nutrition, hydration & recovery routines', 'HeartPulse', 2, NOW(), 'Completed 45m workout today; hydration on track.', 'IMPROVING'),
('finance', 'Personal Finance', 'Cashflow, savings rate, investments & recurring commitments', 'Wallet', 7, NOW() - INTERVAL '3 days', 'Monthly savings rate 42%; upcoming server hosting due in 5 days.', 'STABLE'),
('operations', 'Personal Operations', 'Daily administration, schedules, appointments & documents', 'CheckSquare', 3, NOW() - INTERVAL '6 days', '3 pending administrative reminders require attention.', 'SLIPPING'),
('growth', 'Personal Growth & Reflection', 'Self-reflection, habit integrity, and long-term trajectory', 'Compass', 7, NOW() - INTERVAL '4 days', 'Weekly review pending; consistency across technical goals is high.', 'STABLE')
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Goals
INSERT INTO public.goals (domain_id, horizon, title, why_it_matters, status, progress_pct, next_action, target_date)
VALUES
((SELECT id FROM public.life_domains WHERE slug = 'career'), 'LONG_TERM', 'Secure Senior Full-Stack / Product Engineer Role', 'Establish high-impact career trajectory, financial independence, and technical leadership', 'ON_TRACK', 65, 'Complete take-home technical challenge for Vercel ecosystem partner', CURRENT_DATE + INTERVAL '45 days'),
((SELECT id FROM public.life_domains WHERE slug = 'ventures'), 'MONTHLY', 'Complete Klarone Architecture & Prototype', 'Validate core client product value proposition and acquire pilot feedback', 'ON_TRACK', 50, 'Deploy staging prototype on Vercel and run smoke test', CURRENT_DATE + INTERVAL '20 days'),
((SELECT id FROM public.life_domains WHERE slug = 'learning'), 'WEEKLY', 'Master Advanced PostgreSQL Performance & Row Level Security', 'Architect secure enterprise-grade systems with high database query performance', 'ON_TRACK', 80, 'Benchmark compound indexes and RLS policy execution plans', CURRENT_DATE + INTERVAL '5 days'),
((SELECT id FROM public.life_domains WHERE slug = 'health'), 'WEEKLY', 'Hit 5x Strength Workouts and 7.5hr Average Sleep', 'Ensure physical endurance and cognitive sharpness for CEO-level productivity', 'ON_TRACK', 60, 'Complete Thursday upper body session', CURRENT_DATE + INTERVAL '3 days');

-- 3. Seed Daily Priorities (Today's Top 3 Focus)
INSERT INTO public.daily_priorities (priority_date, rank, title, domain_id, status, blocker_notes)
VALUES
(CURRENT_DATE, 1, 'Finalize & test technical application for Senior Frontend Engineer role', (SELECT id FROM public.life_domains WHERE slug = 'career'), 'PLANNED', NULL),
(CURRENT_DATE, 2, 'Klarone: Finalize core schema and API service layer', (SELECT id FROM public.life_domains WHERE slug = 'ventures'), 'PLANNED', NULL),
(CURRENT_DATE, 3, 'Complete 45-minute strength training and 3L hydration target', (SELECT id FROM public.life_domains WHERE slug = 'health'), 'COMPLETED', NULL);

-- 4. Seed Ventures
INSERT INTO public.ventures (name, purpose, status, milestone_progress_pct, ongoing_activities, pending_decisions)
VALUES
('Klarone', 'Scalable modern business operational infrastructure & customer intelligence platform', 'ACTIVE', 45, 
 '["Finalizing PostgreSQL schema", "Designing executive analytics dashboard", "Connecting Gemini advisor flow"]'::jsonb,
 '["Finalize pricing tier structure for beta access", "Select email transactional provider (Resend vs Postmark)"]'::jsonb),
('Krishna Infotech Solutions', 'Enterprise software consultancy and high-performance digital systems delivery', 'ACTIVE', 75,
 '["Delivering client portal MVP", "Setting up CI/CD pipeline automation"]'::jsonb,
 '["Schedule Q1 roadmap review with lead stakeholder"]'::jsonb);

-- 5. Seed Job Applications (95/5 Monitor)
INSERT INTO public.job_applications (company_name, role_title, status, location, salary_range, applied_at, last_contact_at, follow_up_due_at, needs_follow_up, recruiter_name, recruiter_email, latest_message_snippet, notes)
VALUES
('Vercel Ecosystem Labs', 'Senior Frontend / UI Engineer', 'SHORTLISTED', 'Remote', '$140k - $170k', CURRENT_DATE - INTERVAL '6 days', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', false, 'Sarah Jenkins', 'sarah.j@vercelecosystem.com', 'Hi Naitik, your portfolio and systems engineering work look fantastic. Would love to schedule a 30m chat this Thursday.', 'Recruiter responded very positively. Interview scheduled.'),
('Linear Sync Partners', 'Full-Stack Product Engineer', 'INTERVIEWING', 'Remote', '$135k - $160k', CURRENT_DATE - INTERVAL '12 days', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', true, 'David Vance', 'david.vance@linearsync.dev', 'We reviewed your take-home code and are moving you to the technical panel round with the engineering leads.', 'Need to confirm slot for technical deep-dive.'),
('Supabase Cloud Solutions', 'Developer Experience & Systems Engineer', 'APPLIED', 'Remote', '$130k - $155k', CURRENT_DATE - INTERVAL '4 days', NOW() - INTERVAL '4 days', CURRENT_DATE + INTERVAL '3 days', false, 'Tech Talent Team', 'careers@supabase.com', 'Application received: Senior DX Engineer. Review underway by hiring squad.', 'Application submitted with custom cover letter.'),
('Acme AI Platform', 'Frontend Architect', 'PENDING', 'Hybrid / Remote', '$145k - $175k', CURRENT_DATE - INTERVAL '9 days', NOW() - INTERVAL '9 days', CURRENT_DATE - INTERVAL '1 day', true, 'Marcus Chen', 'marcus.c@acmeai.io', 'Thanks for applying. Our talent team is reviewing candidates.', 'Follow-up email due: 8 business days since initial application.');

-- 6. Seed Learning Skills
INSERT INTO public.learning_skills (skill_name, category, topics_completed, topics_in_progress, topics_to_learn, capability_now, evidence_project_url, last_practiced_at)
VALUES
('Next.js 15 & Server Components', 'Frontend Engineering', '["App Router", "Streaming SSR", "Server Actions", "Route Handlers"]'::jsonb, '["Turbopack caching strategies", "Partial Prerendering (PPR)"]'::jsonb, '["Custom SWC compilation plugins"]'::jsonb, 'Able to architect complex enterprise UI systems with instantaneous navigation and zero client bundle bloat.', 'https://github.com/Naitik2408/WorkTracker', NOW()),
('Distributed Agent Architecture', 'AI & Systems', '["Agent memory frameworks", "Tool calling protocols", "Subagent orchestration"]'::jsonb, '["Reactive task triggers", "Human-in-the-loop approval state machines"]'::jsonb, '["Multi-agent consensus algorithms"]'::jsonb, 'Capable of designing autonomous multi-agent pipelines with guaranteed human safety guardrails.', 'https://github.com/Naitik2408/WorkTracker', NOW() - INTERVAL '1 day');

-- 7. Seed Finance & Payments
INSERT INTO public.finance_entries (entry_date, entry_type, category, amount_inr, notes)
VALUES
(CURRENT_DATE - INTERVAL '2 days', 'INCOME', 'Consulting Project Milestone', 85000.00, 'Milestone payout for Krishna Infotech portal'),
(CURRENT_DATE - INTERVAL '1 day', 'EXPENSE', 'Development Infrastructure', 3200.00, 'Supabase Pro & Cloud domain renewals'),
(CURRENT_DATE, 'SAVINGS', 'Investment Reserve', 35000.00, 'Allocated to emergency & tech venture reserve');

INSERT INTO public.upcoming_payments (title, amount_inr, due_date, is_recurring, status)
VALUES
('Supabase Pro & Hosting Infrastructure', 2500.00, CURRENT_DATE + INTERVAL '5 days', true, 'UPCOMING'),
('GitHub Copilot & AI Developer Tools', 1650.00, CURRENT_DATE + INTERVAL '12 days', true, 'UPCOMING'),
('Health & Gym Membership Subscription', 3500.00, CURRENT_DATE + INTERVAL '18 days', true, 'UPCOMING');

-- 8. Seed Idea Sandbox
INSERT INTO public.idea_sandbox (title, description, proposed_purpose, feasibility_notes, status)
VALUES
('AI-Powered Resume Tailorer for Developer Roles', 'CLI and lightweight web hook that reads a job description and formats highlighted GitHub project links automatically.', 'PORTFOLIO', 'High feasibility. Can be integrated directly into Personal Life Dashboard 5% action queue.', 'EVALUATING'),
('Automated Code Review Agent for Next.js Pull Requests', 'GitHub Action bot that verifies Vercel bundle budgets and Accessibility standards before merge.', 'BUSINESS', 'Strong enterprise demand. Evaluating pricing and CI execution cost.', 'EVALUATING');

-- 9. Seed Personal Ops Items
INSERT INTO public.personal_ops_items (item_type, title, due_at, status, reference_data)
VALUES
('APPOINTMENT', 'Technical Panel Interview with Linear Sync Partners', NOW() + INTERVAL '2 days' + INTERVAL '3 hours', 'PENDING', '{"platform": "Google Meet", "interviewer": "Engineering Squad Lead"}'::jsonb),
('TASK', 'Update resume PDF download link with latest Supabase & Next.js architecture deliverables', NOW() + INTERVAL '1 day', 'PENDING', '{}'::jsonb),
('RECURRING', 'Weekly Executive Life Review & Priority Recalibration', NOW() + INTERVAL '5 days', 'PENDING', '{"cadence": "Sunday 18:00"}'::jsonb);

-- 10. Seed Approval Queue Action (5% Action Guardrail)
INSERT INTO public.approval_queue_actions (action_type, summary_title, payload_json, ai_rationale, status)
VALUES
('SEND_GMAIL', 'Follow-up Email to Marcus Chen (Acme AI Platform)', 
 '{"to": "marcus.c@acmeai.io", "subject": "Following up: Frontend Architect Application - Naitik Kumar", "body": "Hi Marcus,\n\nI hope you are having a productive week. Following up on my Frontend Architect application submitted 8 business days ago. I recently shipped several enterprise Next.js systems and wanted to reiterate my strong enthusiasm for Acme AI.\n\nBest regards,\nNaitik Kumar"}'::jsonb,
 '8 business days have elapsed since initial submission with no update. A polite, value-adding follow-up increases recruiter response probability by 40%.',
 'PENDING_APPROVAL');
