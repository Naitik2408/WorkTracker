# 03 — UI/UX Specifications & User Flows: Personal Life Dashboard

- **Google Doc Link:** [03 - UI-UX Specifications & User Flows](https://docs.google.com/document/d/12XoGxpMxys8yCorVCIebmTlp7l3JvE4RXKMNrDyKMNE/edit)
- **Owning Skill:** UI/UX Design (Stage 03)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. UX Strategy & Design Principles
1. **Morning-First Executive Clarity:** The interface is designed for a calm, 2-to-3 minute morning scan that immediately answers: *Where do I stand? What are my Top 3 priorities today? Which areas need attention?*
2. **95% Observation / 5% Lightweight Action:** Screens prioritize high-signal summaries, status groupings, recruiter snippets, and trend comparisons over tedious form filling.
3. **Clean Light-Mode Minimal Aesthetic:**
   - **Backgrounds:** Soft Alabaster canvas (`#F8FAFC`) with pure white elevated cards (`#FFFFFF`) and subtle borders (`#E2E8F0`), avoiding heavy dark tones or harsh dividing lines.
   - **Typography:** Inter / Plus Jakarta Sans for clean hierarchy (`24px` page titles, `16px` card headers, `14px` body, `12px` metadata badges).
   - **Semantic Accents:** Deep Indigo (`#4F46E5`) for primary focus actions, Emerald (`#10B981`) for On-Track/Progressing, Amber (`#F59E0B`) for Needs Attention/Follow-Up Due, and Rose (`#F43F5E`) for Delayed/Neglected alerts.
4. **Progressive Disclosure:** The Main and Morning dashboards show concise summary cards; clicking any card or domain opens the full multi-view domain workspace.
5. **Non-Judgmental Reflection:** Never display arbitrary "life scores"; surface factual streaks, time/attention alignment, and supportive reflection prompts.

---

## 2. Information Architecture & Navigation Structure

```
Personal Life Dashboard (App Shell)
├── Top Utility Bar: Date & Morning Pulse | Quick Add (+ Task / Log / Idea) | Cmd+K Search | Sync Status Badge | Gemini Advisor Toggle
├── Primary Left Navigation:
│   ├── 1. Command Center
│   │   ├── Morning Daily View (Default Home)
│   │   └── My Life at a Glance (7-Domain Executive Grid)
│   ├── 2. The Seven Life Areas
│   │   ├── Career & Income (95/5 Job-Hunting Monitor & Approval Queue)
│   │   ├── Business & Ventures (Klarone, Krishna Infotech Solutions)
│   │   ├── Learning & Skills (Capability Matrix & Topic Pipeline)
│   │   ├── Health & Fitness (Workout & Habit Consistency)
│   │   ├── Finance (Cashflow, Categories, Savings & Upcoming Payments)
│   │   ├── Personal Operations (Tasks, Commitments, Recurring & Reference Vault)
│   │   └── Personal Growth (Milestones, Habits, Reflections & Patterns)
│   ├── 3. Execution & Strategy
│   │   ├── Goals & Milestones (Long-Term → Monthly → Weekly → Daily Tree)
│   │   ├── Projects & Idea Sandbox (Active Projects Board + Idea Evaluation Gate)
│   │   ├── Analytics & Observations (Cross-Domain Trends & Neglect Matrix)
│   │   └── Reviews (Daily, Weekly & Monthly Guided Reviews)
└── Right Slide-Over Panel:
    └── Gemini Personal Advisor & Pending External Action Approvals
```

---

## 3. Core User Flows

### Flow 1: Morning Daily Briefing & Priority Lock-In
1. User opens the app in the morning and lands on **Morning Daily View**.
2. Top banner displays today's date, a 2-sentence Gemini situational summary, and any **Attention Needed / Neglected Area** pills.
3. User reviews the **Top 3 Priorities for Today** (pre-suggested from yesterday's carry-forward, urgent job follow-ups, and active project milestones) and clicks `Confirm Top 3` or swaps an item in 1 click.
4. Below the Top 3, user scans compact cards for **Today's Commitments**, **Job-Hunting Follow-Ups**, **Active Venture/Project Next Steps**, and **Today's Learning & Fitness Habits**.

### Flow 2: 95/5 Job-Hunting Observation & Human-Approved Action
1. User clicks **Career & Income** (or clicks a follow-up alert from the Morning View).
2. User switches effortlessly between **5 Observation Modes** via a segmented control:
   - `Status Board` (Pending | Shortlisted | Interviewing | Offer | Rejected)
   - `Application List` (Sortable table with last-contact age & follow-up badge)
   - `Activity Timeline` (Chronological stream of applications & recruiter replies)
   - `Responses & Follow-Ups` (Filtered strictly to recruiter replies & overdue follow-ups)
   - `Weekly/Monthly Trend` (Application velocity & response rate comparison)
3. Each card shows the recruiter's latest email snippet and a `View in Gmail ↗` deep link.
4. If Gemini has prepared a follow-up email or shortlisted role, a badge appears in the **Pending Approval Queue** (`5% Action`). User clicks `Review Draft`, inspects/edits the recipient, subject, and body, and explicitly clicks `Approve & Send` or `Discard`.

### Flow 3: Idea Evaluation Sandbox to Active Project Promotion
1. When a new project idea arises, user logs it via `+ Quick Add → New Idea` into the **Idea Evaluation Sandbox** (keeping it out of Active Projects).
2. User opens the idea card, reviews purpose/feasibility notes with Gemini Advisor, and decides whether to proceed.
3. Clicking `Promote to Active Project` prompts the user to select its **Primary Purpose** (`Personal`, `Learning`, `Portfolio`, `Business`) and initial lifecycle stage (`Discovery`, `Planning`, `UI/UX`, `Architecture`, `Engineering`, `Release`, or `Audit Existing`), moving it onto the **Active Projects Overview**.

### Flow 4: Guided Daily, Weekly & Monthly Reviews
1. At end of day, user opens **Reviews → Daily Review**.
2. Screen displays a side-by-side comparison of **Planned Today** vs. **Completed Today**, plus a 1-line prompt for *What interrupted or delayed me?*
3. User clicks `Carry Forward Unfinished to Tomorrow` in a single action.
4. On Sundays/month-end, **Weekly** and **Monthly** tabs auto-compile domain progress, neglected areas, and prompt for `Continue / Stop / Change` decisions.

---

## 4. Interaction States, Error Handling & Accessibility
- **Loading States:** Calm light-gray skeleton cards matching exact component dimensions.
- **Empty States:** Clear, encouraging copy with a single optional action (e.g., *"No overdue recruiter follow-ups today — all caught up."*).
- **Integration Sync / Error States:** Non-intrusive top-right status pill (`Gmail & Calendar Synced 4m ago`). If an OAuth token expires, display a soft amber inline banner with a `Reconnect Google Account` button while keeping all cached dashboard data readable.
- **Approval Confirmation State:** Every external action displays a high-visibility review modal with a clear warning boundary (*"This action will send an external email via your Gmail account"*), requiring an explicit click on `Approve & Execute`.
- **Responsive & Accessibility Standards:**
  - **Desktop (1280px+):** 3-column command center layout with collapsible sidebar and advisor drawer.
  - **Tablet/Mobile (< 1024px):** Single-column priority stack optimized for quick morning reading on the go.
  - **Accessibility:** WCAG 2.1 AA contrast compliance (`>= 4.5:1` on all text/badges), full keyboard navigation (`Cmd/Ctrl + K` command bar), visible focus rings, and semantic ARIA roles.
