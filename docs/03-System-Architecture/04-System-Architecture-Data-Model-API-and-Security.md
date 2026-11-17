# 04 — System Architecture, Data Model, API & Security Blueprint

- **Google Doc Link:** [04 - System Architecture, Data Model, API & Security](https://docs.google.com/document/d/1lR7MH3mSYCXfgYtsm3RfFAChxGfO5Tbgr7OrXKbQ-fI/edit)
- **Owning Skill:** System Architecture (Stage 04)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. Architecture Overview & Style Selection
- **Architecture Pattern:** **Modular Monolith** built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + Row-Level Security)**, deployed on **Vercel** (with an optional lightweight Node.js/Express background cron worker on **Render/Railway** if long-running Gmail/Calendar sync jobs are desired).
- **Why Modular Monolith:**
  - Directly matches Naitik's core expertise (React/Next.js, Node.js, TypeScript, Supabase, Vercel/Render).
  - Provides strict relational integrity across all 7 life areas, goals, projects, and reviews in a single PostgreSQL database.
  - Eliminates distributed-systems latency and operational overhead while maintaining clean internal module boundaries.

---

## 2. System Component Decomposition

```
+-----------------------------------------------------------------------------------+
|                        Presentation Layer (Next.js + Tailwind)                    |
|  Morning View | Life at a Glance | 7 Domain Views | Multi-View Charts | Reviews   |
+-----------------------------------------+-----------------------------------------+
                                          | (Typed Internal API / Server Actions)
+-----------------------------------------v-----------------------------------------+
|                         Core Domain & Application Services                        |
|  +-----------------------+  +------------------------+  +----------------------+  |
|  | Briefing & Priority   |  | Career & 95/5 Job      |  | Ventures, Projects & |  |
|  | Engine (Top 3 +       |  | Tracker Service        |  | Idea Sandbox Service |  |
|  | Neglect Detector)     |  +------------------------+  +----------------------+  |
|  +-----------------------+  +------------------------+  +----------------------+  |
|  | Learning, Fitness,    |  | Multi-Horizon Goal     |  | Cadence Review &     |  |
|  | Finance, Ops & Growth |  | Alignment Service      |  | Trend Analytics Svc  |  |
|  +-----------------------+  +------------------------+  +----------------------+  |
+-------------------+---------------------------------------------+-----------------+
                    |                                             |
+-------------------v--------------------+   +--------------------v-----------------+
|   Gemini Personal Advisor & Gate Svc   |   |   External Integration Connectors    |
| - Context Snapshot Assembler           |   | - Gmail API (Read Snippets / Drafts) |
| - Grounded Recommendation Generator    |   | - Google Calendar API (Read Events)  |
| - Hard Approval Queue State Machine    |   | - Deep-Link URI Builder              |
+-------------------+--------------------+   +--------------------+-----------------+
                    |                                             |
+-------------------v---------------------------------------------v-----------------+
|                    Persistence Layer: Supabase PostgreSQL (RLS)                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Relational Database Schema (PostgreSQL)

### 3.1 Core Cross-Domain Tables
- **`life_domains`**
  - `id` (UUID PK), `slug` (TEXT UNIQUE: `career`, `ventures`, `learning`, `health`, `finance`, `operations`, `growth`), `name` (TEXT), `neglect_threshold_days` (INT DEFAULT 5), `last_activity_at` (TIMESTAMPTZ), `current_summary` (TEXT), `momentum_state` (`IMPROVING` | `STABLE` | `SLIPPING` | `NEGLECTED`).
- **`goals`**
  - `id` (UUID PK), `domain_id` (UUID FK → `life_domains`), `parent_goal_id` (UUID FK → `goals` NULLABLE), `horizon` (`LONG_TERM` | `MONTHLY` | `WEEKLY` | `DAILY`), `title` (TEXT), `why_it_matters` (TEXT), `status` (`ON_TRACK` | `DELAYED` | `RECONSIDER` | `COMPLETED`), `progress_pct` (INT), `next_action` (TEXT), `target_date` (DATE), `updated_at` (TIMESTAMPTZ).
- **`daily_priorities`**
  - `id` (UUID PK), `priority_date` (DATE), `rank` (INT CHECK `rank BETWEEN 1 AND 3`), `title` (TEXT), `domain_id` (UUID FK), `linked_goal_id` (UUID FK NULLABLE), `linked_project_id` (UUID FK NULLABLE), `status` (`PLANNED` | `COMPLETED` | `CARRIED_FORWARD`), `blocker_notes` (TEXT).

### 3.2 Projects, Idea Sandbox & Business Ventures
- **`idea_sandbox`**
  - `id` (UUID PK), `title` (TEXT), `description` (TEXT), `proposed_purpose` (`PERSONAL` | `LEARNING` | `PORTFOLIO` | `BUSINESS`), `feasibility_notes` (TEXT), `status` (`EVALUATING` | `PROMOTED` | `DEFERRED` | `ARCHIVED`), `created_at` (TIMESTAMPTZ).
- **`projects`**
  - `id` (UUID PK), `domain_id` (UUID FK), `source_idea_id` (UUID FK → `idea_sandbox` NULLABLE), `name` (TEXT), `purpose_type` (`PERSONAL` | `LEARNING` | `PORTFOLIO` | `BUSINESS`), `is_existing_project` (BOOLEAN), `lifecycle_stage` (`DISCOVERY` | `PLANNING` | `UI_UX` | `ARCHITECTURE` | `ENGINEERING` | `RELEASE` | `MAINTENANCE`), `status` (`ACTIVE` | `PAUSED` | `BLOCKED` | `COMPLETED`), `next_meaningful_action` (TEXT), `pending_decision` (TEXT), `needs_attention` (BOOLEAN), `last_touched_at` (TIMESTAMPTZ).
- **`ventures`**
  - `id` (UUID PK), `project_id` (UUID FK → `projects` NULLABLE), `name` (TEXT, e.g., `Klarone`, `Krishna Infotech Solutions`), `purpose` (TEXT), `status` (TEXT), `ongoing_activities` (JSONB), `pending_decisions` (JSONB), `milestone_progress_pct` (INT), `last_activity_at` (TIMESTAMPTZ).

### 3.3 Domain-Specific Tables (Career, Learning, Health, Finance, Ops, Growth)
- **`job_applications`**
  - `id` (UUID PK), `company_name` (TEXT), `role_title` (TEXT), `status` (`INTERESTED` | `APPLIED` | `PENDING` | `SHORTLISTED` | `INTERVIEWING` | `OFFER` | `REJECTED`), `applied_at` (DATE), `last_contact_at` (TIMESTAMPTZ), `follow_up_due_at` (DATE), `needs_follow_up` (BOOLEAN), `recruiter_name` (TEXT), `recruiter_email` (TEXT), `latest_message_snippet` (TEXT), `gmail_thread_id` (TEXT), `gmail_deep_link` (TEXT), `application_url` (TEXT).
- **`learning_skills` & `learning_checkpoints`**
  - `learning_skills`: `id` (UUID PK), `skill_name` (TEXT), `linked_career_goal_id` (UUID FK → `goals`), `topics_completed` (JSONB), `topics_in_progress` (JSONB), `topics_to_learn` (JSONB), `struggling_areas` (TEXT), `last_practiced_at` (TIMESTAMPTZ).
  - `learning_checkpoints`: `id` (UUID PK), `skill_id` (UUID FK), `recorded_at` (DATE), `capability_before` (TEXT), `capability_now` (TEXT), `evidence_project_url` (TEXT).
- **`health_fitness_logs`**
  - `id` (UUID PK), `log_date` (DATE), `workout_type` (TEXT), `duration_mins` (INT), `movement_summary` (TEXT), `habits_completed` (JSONB), `notes` (TEXT).
- **`finance_entries` & `upcoming_payments`**
  - `finance_entries`: `id` (UUID PK), `entry_date` (DATE), `entry_type` (`INCOME` | `EXPENSE` | `SAVINGS`), `category` (TEXT), `amount_inr` (NUMERIC(12,2)), `notes` (TEXT).
  - `upcoming_payments`: `id` (UUID PK), `title` (TEXT), `amount_inr` (NUMERIC(12,2)), `due_date` (DATE), `is_recurring` (BOOLEAN), `status` (`UPCOMING` | `PAID` | `OVERDUE`).
- **`personal_ops_items`**
  - `id` (UUID PK), `item_type` (`TASK` | `APPOINTMENT` | `COMMITMENT` | `RECURRING` | `REFERENCE_NOTE`), `title` (TEXT), `due_at` (TIMESTAMPTZ NULLABLE), `recurrence_rule` (TEXT NULLABLE), `status` (`PENDING` | `COMPLETED`), `reference_data` (JSONB).
- **`growth_reflections` & `cadence_reviews`**
  - `id` (UUID PK), `review_type` (`DAILY` | `WEEKLY` | `MONTHLY` | `REFLECTION`), `period_start` (DATE), `period_end` (DATE), `planned_items` (JSONB), `completed_items` (JSONB), `pending_carried_forward` (JSONB), `delays_and_interruptions` (TEXT), `neglected_domains` (JSONB), `continue_doing` (TEXT), `stop_doing` (TEXT), `change_next` (TEXT), `created_at` (TIMESTAMPTZ).

### 3.4 Gemini Personal Advisor & Approval Gate Tables
- **`approval_queue_actions`**
  - `id` (UUID PK), `action_type` (`SEND_GMAIL` | `CREATE_GMAIL_DRAFT` | `SUBMIT_APPLICATION` | `SCHEDULE_FOLLOWUP`), `target_entity_id` (UUID), `summary_title` (TEXT), `payload_json` (JSONB), `ai_rationale` (TEXT), `status` (`PENDING_APPROVAL` | `APPROVED` | `EXECUTED` | `REJECTED`), `created_at` (TIMESTAMPTZ), `approved_by_user_at` (TIMESTAMPTZ NULLABLE), `executed_at` (TIMESTAMPTZ NULLABLE).

---

## 4. API Specification

| Endpoint | Method | Purpose | Auth & Guardrails |
| :--- | :--- | :--- | :--- |
| `/api/dashboard/morning` | `GET` | Fetch Top 3 priorities, today's schedule, job follow-ups, planned habits, and neglected-area alerts | Authenticated Owner Session |
| `/api/dashboard/overview` | `GET` | Fetch all 7 domain summary cards, momentum indicators, and recent shifts | Authenticated Owner Session |
| `/api/career/applications` | `GET` / `POST` | List applications (`?view=list\|status\|timeline\|responses\|weekly`) or log/update an application | Authenticated Owner Session |
| `/api/sync/google` | `POST` | Trigger read-only Gmail recruiter thread snippet sync and Google Calendar event sync | OAuth 2.0 Scoped Token |
| `/api/approvals` | `GET` | List all pending Gemini-prepared external actions | Authenticated Owner Session |
| `/api/approvals/:id/approve` | `POST` | Explicitly approve and execute a pending external action | Requires explicit human POST + CSRF/Session verification |
| `/api/projects/ideas/:id/promote` | `POST` | Promote an evaluated idea from `idea_sandbox` to `projects` | Authenticated Owner Session |
| `/api/reviews/:type` | `GET` / `POST` | Pre-populate and save `daily`, `weekly`, or `monthly` review records + carry-forward items | Authenticated Owner Session |
| `/api/advisor/ask` | `POST` | Ask Gemini Personal Advisor a question grounded in live PostgreSQL context | Read-only DB snapshot; writes only to `PENDING_APPROVAL` queue |

---

## 5. Security, Privacy & Architecture Decision Records (ADRs)
- **ADR-001 (Modular Monolith over Microservices):** Use a single Next.js + Supabase codebase so all 7 life areas share strong foreign-key relationships and sub-second joins without inter-service network latency.
- **ADR-002 (Deterministic Neglect & Pattern Engine):** Compute neglect flags deterministically via SQL (`NOW() - last_activity_at > neglect_threshold_days`) and pass those exact facts to Gemini Advisor so AI insights are 100% factual and never hallucinated.
- **ADR-003 (Hard Database-Enforced Approval Gate):** The AI advisor service role cannot set `approval_queue_actions.status = 'APPROVED'`; only the authenticated user handler can transition an item from `PENDING_APPROVAL` to `APPROVED` and trigger external execution.
