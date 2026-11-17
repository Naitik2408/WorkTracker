# 02 — Product Requirements Document (PRD), User Stories & Acceptance Criteria

- **Google Doc Link:** [02 - PRD, User Stories & Acceptance Criteria](https://docs.google.com/document/d/19b8yKqV8rydVud3-9aJjB9kH9aneCLBJS3mK8RDPG3I/edit)
- **Owning Skill:** Product Planning (Stage 02)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. Product Vision, Objectives & Success Criteria
- **Product Vision:** Deliver a unified **Personal Life Operating Dashboard** that empowers the user to manage life like a CEO—providing immediate morning clarity, multi-horizon goal alignment, 95/5 job-search visibility, venture isolation, cross-domain pattern recognition, and grounded AI advisory support.
- **Traceability to User Success Criteria (Section 15 of Source Document):**
  1. **SC-01:** Open one place and understand the overall condition of life.
  2. **SC-02:** Clearly see current priorities and the top 3 focus items for today.
  3. **SC-03:** Monitor career and job search without manually checking many separate places.
  4. **SC-04:** Understand the progress, stage, and next action of active projects and ventures.
  5. **SC-05:** Track learning and verify actual capability improvement aligned with career goals.
  6. **SC-06:** Observe health, fitness, and financial habits and trends.
  7. **SC-07:** Automatically identify neglected areas, delays, and repeated problems.
  8. **SC-08:** Compare progress over time (daily, weekly, monthly) and discover useful patterns.
  9. **SC-09:** Receive grounded, explainable recommendations from Gemini acting as a Personal Advisor.
  10. **SC-10:** Conduct structured Daily, Weekly, and Monthly reviews that drive decisions.
  11. **SC-11:** Feel organized, intentional, and in full control of external commitments and actions.

---

## 2. Scope & Phased MVP Delivery Plan

### In-Scope: Phase 1 — Core MVP ("Morning CEO & Career/Venture Command")
- **Main "My Life at a Glance" Executive Overview** across all 7 life domains.
- **Morning Daily Dashboard:** Date, Top 3 Priorities, today's tasks/commitments, upcoming deadlines/follow-ups, active project work, job-hunting actions needing attention, planned learning/fitness check-ins, and neglected-area alerts.
- **Domain 4.1 — Career & Income (95/5 Job-Hunting Experience):** Target companies/roles, submitted applications & statuses, recruiter reply snippets, last-contact date, follow-up needed flags, Gmail deep links, and the **Human Approval Queue** for Gemini-prepared outreach/applications.
- **Domain 4.2 — Business & Ventures:** Dedicated tracking for active ventures (e.g., Klarone, Krishna Infotech Solutions), stage, milestones, pending decisions, and neglect detection.
- **Goals, Milestones & Projects Hub:** Long-Term → Monthly → Weekly → Daily goal hierarchy, Active Projects overview (Personal, Learning, Portfolio, Business), and the **Idea Evaluation Sandbox** (preventing raw ideas from automatically becoming active projects).
- **Daily & Weekly Review Workflows** + **Gemini Personal Advisor** contextual Q&A drawer.

### In-Scope: Phase 2 — Full 7-Domain Depth & Long-Horizon Analytics
- Full dedicated modules for **4.3 Learning & Skills** (capability checkpoints & topic pipeline), **4.4 Health & Fitness** (workout & habit streaks), **4.5 Finance** (income/expense breakdown, savings goals, upcoming payment alerts), **4.6 Personal Operations** (recurring tasks & personal reference vault), and **4.7 Personal Growth** (reflections & behavioral pattern tracking).
- **Monthly Review Workflow** (Continue / Stop / Change decisions) and multi-month cross-domain correlation charts.

### Out-of-Scope
- Unapproved autonomous external actions (sending emails, submitting job applications, modifying external records without explicit user approval).
- Clinical medical tracking or automated banking transactions.
- Multi-tenant SaaS billing, public user onboarding, or commercial monetization features.

---

## 3. Functional Requirements (`FR-001` – `FR-015`)

| Req ID | Requirement Title | Specification Details | Priority | Traceability |
| :--- | :--- | :--- | :--- | :--- |
| **FR-001** | **Main "My Life at a Glance" Dashboard** | Display summary cards for all 7 life areas showing current focus, momentum (improved vs. worse recently), pending alerts, and 1-click drill-down into each domain. | Must-Have (MVP) | SC-01, SC-07 |
| **FR-002** | **Morning Daily View** | Render today's date, Top 3 Priorities, today's calendar commitments, pending job follow-ups, active project tasks, planned learning/fitness activities, and overdue/neglected alerts. | Must-Have (MVP) | SC-02, SC-11 |
| **FR-003** | **95/5 Job-Hunting Monitor** | Display job applications with status (`Pending`, `Shortlisted`, `Interviewing`, `Offer`, `Rejected`), recruiter reply previews/snippets, last-contact timestamps, follow-up due badges, and direct links to the source Gmail thread or job portal. | Must-Have (MVP) | SC-03 |
| **FR-004** | **Human Approval Gate for External Actions** | Route all Gemini-prepared job shortlists, tailored resumes, and recruiter outreach emails into a `Pending Approval` queue requiring explicit user review, edit capability, and click-to-approve before execution. | Must-Have (MVP) | SC-03, SC-11 |
| **FR-005** | **Business & Ventures Tracker** | Track each active venture (e.g., Klarone, Krishna Infotech Solutions) with its purpose, current status, ongoing activities, pending work/decisions, milestone progress, and neglect indicator—strictly separated from career and personal tasks. | Must-Have (MVP) | SC-04, SC-07 |
| **FR-006** | **Learning & Skills Capability Tracker** | Track active skills, learning goals, topics (`Completed`, `In Progress`, `To Learn`), practice projects, revision consistency, struggling areas, and capability milestones ("what I could do before vs. what I can do now") linked to career goals. | Must-Have (Phase 1/2) | SC-05 |
| **FR-007** | **Health & Fitness Habit Monitor** | Track fitness goals, workout sessions, general daily movement, and key health habits, highlighting consistency streaks and changes over time. | Must-Have (Phase 1/2) | SC-06 |
| **FR-008** | **Personal Finance Overview** | Track income, categorized expenses, savings progress, financial goals, upcoming payments/bills, and month-over-month spending pattern changes. | Must-Have (Phase 1/2) | SC-06 |
| **FR-009** | **Personal Operations & Reference Hub** | Manage practical personal tasks, appointments, deadlines, recurring responsibilities, and a searchable personal reference vault. | Must-Have (Phase 1/2) | SC-11 |
| **FR-010** | **Personal Growth & Reflection Log** | Capture personal goals, milestones, habit consistency, achievements, self-reflections, and behavioral pattern observations without numeric judgment scores. | Must-Have (Phase 1/2) | SC-08, SC-10 |
| **FR-011** | **Multi-Horizon Goal Hierarchy** | Manage Long-Term, Monthly, Weekly, and Daily goals showing "why it matters," progress made, remaining milestones, next action, and health state (`On Track`, `Delayed`, `Reconsider`). | Must-Have (MVP) | SC-02, SC-08 |
| **FR-012** | **Projects Overview & Idea Staging Gate** | Provide a central view of active projects classified by purpose (`Personal`, `Learning`, `Portfolio`, `Business`), stage, recent progress, pending decisions, and next action. Hold new raw ideas in an **Idea Evaluation Sandbox** until explicitly approved into active projects; support auditing existing projects from their current state. | Must-Have (MVP) | SC-04, SC-07 |
| **FR-013** | **Multi-View Analytics & Neglect Detection** | Allow viewing domain records across multiple perspectives (e.g., List, Grouped by Status, Timeline, Response Summary, Week/Month Comparison) and automatically flag neglected areas and priority-vs-time mismatches. | Must-Have (MVP) | SC-07, SC-08 |
| **FR-014** | **Daily, Weekly & Monthly Review Workflows** | Guide the user through Daily Reviews (planned vs. completed, blockers, carry-forward to tomorrow), Weekly Reviews (achievements, goal/job/learning/project/fitness progress, neglected areas, next week's priorities), and Monthly Reviews (life changes, milestones, patterns, Continue/Stop/Change decisions). | Must-Have (MVP) | SC-10 |
| **FR-015** | **Gemini Personal Advisor** | Answer natural-language advisory questions ("What should I focus on today?", "What have I been neglecting?", "What should I follow up on?") grounded strictly in actual dashboard data, explaining the reasoning behind every recommendation. | Must-Have (MVP) | SC-09 |

---

## 4. Non-Functional Requirements (`NFR-001` – `NFR-005`)

- **NFR-001 (Low Maintenance Effort):** Daily morning orientation must require `< 3 minutes`; end-of-day review and task carry-forward must require `< 2 minutes`.
- **NFR-002 (Light-Mode Minimal UI):** Default to a clean, high-contrast light-mode design with generous whitespace, clear visual hierarchy, and zero decorative chart clutter.
- **NFR-003 (Security & Approval Enforcement):** Encrypt OAuth tokens and sensitive personal/financial data at rest; enforce server-side checks so no AI-prepared external action executes without `status = APPROVED` by the authenticated user.
- **NFR-004 (Performance):** Render the Morning Daily Dashboard and Life at a Glance summary in `< 1.5 seconds` (p95).
- **NFR-005 (Data Ownership & Exportability):** Support full 1-click JSON/CSV backup export of all user data across all 7 domains.

---

## 5. User Stories & Acceptance Criteria (`US-001` – `US-010`)

| Story ID | User Story | Acceptance Criteria (`AC`) |
| :--- | :--- | :--- |
| **US-001** | As the user opening the dashboard every morning, I want a single Daily View with my Top 3 priorities, commitments, urgent follow-ups, and neglected areas so I can decide what to work on first. | **AC-001:** Opening `/dashboard/morning` displays today's date, 3 priority slots, today's calendar/task commitments, due job follow-ups, planned learning/fitness items, and any domain exceeding its neglect threshold. |
| **US-002** | As a job seeker, I want a 95%-viewing / 5%-action job-hunting view showing application statuses, recruiter reply snippets, last-contact dates, and Gmail links. | **AC-002:** In Career & Income, applications can be toggled across List, Status Group, Timeline, and Weekly Comparison views; each row displays status, last contact date, recruiter snippet, follow-up flag, and a working deep link to the Gmail thread or job post. |
| **US-003** | As the user, I want to review and explicitly approve any Gemini-prepared email or job application before it is sent. | **AC-003:** Any outreach or application prepared by Gemini is saved as `PENDING_APPROVAL`; the system blocks external sending until the user clicks `Approve` in the review modal. |
| **US-004** | As a venture builder, I want my ventures (such as Klarone and Krishna Infotech Solutions) tracked separately from my career and personal tasks. | **AC-004:** Business & Ventures lists only venture records with their purpose, status, milestones, pending decisions, and neglect badge, with zero cross-contamination from personal chores or job applications. |
| **US-005** | As a learner, I want to track skills by completed topics, practice projects, struggling areas, and concrete capability checkpoints aligned to my career goals. | **AC-005:** Each skill record displays topic counts (`Completed`, `In Progress`, `To Learn`), linked practice projects, a "Before vs. Now Capability" log, and a link to the career goal it supports. |
| **US-006** | As a project owner, I want to evaluate new ideas before they become active projects, and track active projects from their actual lifecycle stage. | **AC-006:** New ideas enter the `Idea Sandbox` first and only appear on the Active Projects board after clicking `Promote to Project` (with Purpose classification and lifecycle stage assigned). |
| **US-007** | As the user, I want clear, non-medical fitness consistency tracking and at-a-glance personal finance tracking with upcoming payment alerts. | **AC-007:** Health & Fitness shows workout/habit consistency streaks over 7/30/90 days; Finance shows monthly income vs. expenses, category breakdown, savings goal progress, and upcoming payments due within 14 days. |
| **US-008** | As the user, I want my daily and weekly tasks connected to monthly and long-term goals with transparent status indicators. | **AC-008:** Every goal displays its horizon (`Long-Term`, `Monthly`, `Weekly`, `Daily`), parent goal link, "why it matters", remaining milestones, next action, and status (`On Track`, `Delayed`, `Reconsider`). |
| **US-009** | As the user, I want guided Daily, Weekly, and Monthly review workflows that pre-fill my actual activity and let me carry pending work forward. | **AC-009:** Daily Review compares planned vs. completed items and offers 1-click `Carry Forward to Tomorrow`; Weekly and Monthly Reviews auto-summarize domain progress, neglected areas, and capture `Continue / Stop / Change` decisions. |
| **US-010** | As the user, I want to ask Gemini what to focus on or what I've been neglecting and receive answers grounded in my actual dashboard data with clear reasoning. | **AC-010:** Every Gemini Advisor recommendation cites the specific goals, overdue follow-ups, or neglected domain timestamps that triggered the advice. |
