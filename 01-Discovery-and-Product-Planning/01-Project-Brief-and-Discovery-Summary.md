# 01 — Project Brief & Discovery Summary: Personal Life Dashboard

- **Google Doc Link:** [01 - Project Brief & Discovery Summary](https://docs.google.com/document/d/1SYFFaVE12v2tZ6qqqbmZyLx-8zU_SYcCXa6dts2Voyc/edit)
- **Owning Skill:** Discovery & Research (Stage 01)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. Project Classification & Governance
- **Project Name:** Personal Life Dashboard (Personal Life Operating Dashboard)
- **Primary Purpose:** **Personal** (CEO-style daily control center for Naitik Kumar's own life, career, ventures, learning, health, finance, operations, and growth)
- **Secondary Purpose:** **Portfolio / Engineering Flagship**
- **Process Depth:** **Standard** (with Rigorous privacy and external-action safety controls for Gmail, financial data, and job outreach)
- **Primary Source of Truth:** `Personal-Life-Dashboard-Complete-Idea.md`
- **Shared Documentation Workspace:** [Personal Life Dashboard Drive Folder](https://drive.google.com/drive/folders/1VlkXTKMtW2SP_Getbai3yWfgedXjX82P) & [Personal Life Dashboard Gemini Notebook](https://gemini.google.com/notebook/2ef8b573-e3ed-4286-9f63-71312d55e253)

---

## 2. Problem Statement & Core Vision
- **Core Problem (Verified from Source Doc):** Important life areas—career and job-hunting, business ventures (such as Klarone/Claron and Krishna Infotech Solutions), skill development, fitness, personal finances, practical operations, and personal growth—are scattered across separate apps, email threads, notes, and memory. This fragmentation makes it hard to see what is progressing, what is being neglected, and whether daily time spent actually aligns with stated goals.
- **Core Vision:** Build a **Personal Life Operating Dashboard**—the single place opened every morning to understand where life stands, identify patterns and neglected areas, choose the Top 3 daily priorities, and make grounded decisions like the CEO of one's own life without spending more time managing the dashboard than living life.

---

## 3. Target User & Context
- **Primary User:** Naitik Kumar (single-user personal system; Bangalore-based full-stack software developer, July 2026 B.Tech CSE graduate, operating Krishna Infotech Solutions and building Klarone/Claron while actively pursuing full-time software engineering roles).
- **Key Interaction Preferences:**
  - **95% viewing/monitoring and 5% taking small actions** in job hunting (outcomes and visibility over manual spreadsheet-style data entry).
  - **Strict Human-in-the-Loop Control:** Gemini can research roles, shortlist opportunities, tailor resumes/emails, and surface insights, but every consequential external action (sending emails, submitting applications, financial/commitment decisions) requires explicit user review and approval first.
  - **Non-Judgmental Clarity:** Observe habits, capabilities, and patterns honestly without gamified "life scores."

---

## 4. The Seven Life Domains (Discovery Scope)

| Domain # | Life Area | Core User Needs & Scope | Key Anti-Goals / Boundaries |
| :--- | :--- | :--- | :--- |
| **4.1** | **Career & Income** | Track career direction, target companies/roles, submitted applications & statuses, recruiter reply snippets, last-contact timestamps, follow-up alerts, interview schedule, and Gmail/Gemini-assisted outreach with explicit approval. | Not a heavy, high-maintenance ATS; keep to ~95% viewing/monitoring and ~5% small actions. |
| **4.2** | **Business & Ventures** | Track active ventures (e.g., Klarone, Krishna Infotech Solutions), purpose, stage, ongoing work, milestones, pending decisions, and neglect flags. | Never mix venture tasks with career/job-hunting or personal chores. |
| **4.3** | **Learning & Skills** | Track skills in progress, topics (completed, in-progress, queued), practice projects, revision consistency, struggling areas, and concrete capability growth ("what I can do now vs. earlier") aligned with career goals. | Do not measure learning solely by raw hours logged. |
| **4.4** | **Health & Fitness** | Track fitness goals, workout consistency, daily movement, and health habits over time. | Not a clinical or medical diagnostic system. |
| **4.5** | **Finance** | Track income, expenses, category breakdown, savings goals, upcoming payments, and spending shifts at a glance with drill-down detail. | Not a complex double-entry accounting or automated trading tool. |
| **4.6** | **Personal Operations** | Centralize personal tasks, appointments, deadlines, recurring responsibilities, and important personal reference information. | Eliminate scattered reminders across notes and chat threads. |
| **4.7** | **Personal Growth** | Observe personal goals, milestones, habit consistency, achievements, reflections, behavioral patterns, and alignment with long-term direction. | No judgmental numerical scoring of personal worth. |

---

## 5. Key Assumptions & Feasibility Assessment
- **Single-User Architecture (Assumption):** Built initially for a single authenticated owner (Naitik), avoiding multi-tenant billing, subscription tiers, or commercial market analysis (`DOC-NA-01`).
- **External App Integration (Feasibility):**
  - **Gmail & Google Calendar:** Fully feasible via Google OAuth 2.0 (`gmail.readonly`, `gmail.compose`, `calendar.readonly`) to surface recruiter replies, application threads, and interview/personal commitments with deep links back to Gmail/Calendar.
  - **External Action Safety:** Technically enforced via a server-side `approval_queue_actions` state machine so Gemini-prepared drafts cannot dispatch without an authenticated human approval click.
- **Low-Friction Data Capture (Assumption):** To prevent maintenance fatigue, Finance, Health, and Learning entries will support 10-second quick logging, structured imports, and conversational logging via Gemini Advisor rather than mandatory long forms.

---

## 6. Discovery Quality Gate & Decisions Needed for Approval
Before moving from planning to code implementation with Antigravity, please review and confirm:
1. **Tech Stack Confirmation:** Proceed with **Next.js (TypeScript) + Tailwind CSS + Supabase (PostgreSQL & Auth) + Vercel/Render**?
2. **MVP Phasing:** Approve **Phase 1 Core MVP** (Morning Daily Dashboard, Life at a Glance, Career 95/5 + Gmail Sync + Approval Queue, Business & Ventures, Multi-Level Goals & Projects + Idea Sandbox, Daily/Weekly Reviews, and Gemini Advisor) followed by **Phase 2** (deep modules for Learning, Health, Finance, Personal Ops, Growth, and Monthly Reviews)?
3. **Initial Data Sources:** Start Finance and Health with lightweight quick-entry + CSV/structured import in MVP before adding external banking/wearable APIs?
