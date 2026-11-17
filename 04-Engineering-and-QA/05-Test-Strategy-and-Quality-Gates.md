# 05 — Test Strategy, Test Cases & Quality Gates: Personal Life Dashboard

- **Google Doc Link:** [05 - Test Strategy & Quality Gates](https://docs.google.com/document/d/1Bacqn5KDnV0_uJ3wmUMvx9EEEhC2Po7bhAD2T4EaKGk/edit)
- **Owning Skill:** Engineering & QA (Stage 05)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. Engineering & QA Principles
- **Requirement Traceability:** Every implementation PR and test suite maps directly to approved Functional Requirements (`FR-001`–`FR-015`), Non-Functional Requirements (`NFR-001`–`NFR-005`), and Acceptance Criteria (`AC-001`–`AC-010`).
- **Evidence-Based QA:** A feature is only marked `Verified` when automated test logs and build checks are executed and recorded.
- **Strict Layer Separation:**
  - Product Planning defines expected behavior (`02-PRD`).
  - UI/UX Design defines user-visible states and recovery (`03-UI-UX`).
  - System Architecture defines API/DB contracts and security boundaries (`04-Architecture`).
  - Engineering & QA implements validation, error handling, automated tests, and CI gates (`05-Test-Strategy`).

---

## 2. Testing Strategy by Layer
1. **Unit Tests (Vitest):**
   - Domain neglect calculation (`last_activity_at` vs. `neglect_threshold_days`).
   - Job-hunting follow-up due detector (`last_contact_at` aging rules).
   - Goal hierarchy roll-up status (`DAILY` → `WEEKLY` → `MONTHLY` → `LONG_TERM`).
   - Morning Top-3 candidate ranking algorithm.
2. **Integration & Database Tests (Vitest + Local Supabase):**
   - Row-Level Security (RLS) policy enforcement across all tables.
   - `approval_queue_actions` state-machine guardrails (verifying unapproved actions cannot execute).
   - Idea Sandbox → Active Project promotion transaction integrity.
   - Multi-view query transformers (`list`, `status`, `timeline`, `responses`, `weekly`).
3. **End-to-End (E2E) Browser Tests (Playwright):**
   - Morning Daily View rendering, Top 3 selection, and domain drill-down.
   - Career 95/5 Job-Hunting view switching, Gmail deep-link rendering, and Approval Queue modal flow.
   - Daily Review completion and 1-click `Carry Forward to Tomorrow`.
4. **Performance & Accessibility Checks:**
   - Playwright + `@axe-core/playwright` WCAG AA contrast and keyboard navigation verification.
   - Morning Dashboard p95 load check (`< 1.5s`).

---

## 3. Core Test Cases (`TC-001` – `TC-008`)

| Test ID | Linked Req / AC | Scenario | Expected Verification Result |
| :--- | :--- | :--- | :--- |
| **TC-001** | `FR-002`, `AC-001` | Open Morning Daily Dashboard with seeded priorities, commitments, job follow-ups, and 1 neglected domain. | All sections render in `< 1.5s`; the neglected domain badge is visibly highlighted in the Attention Needed banner. |
| **TC-002** | `FR-003`, `AC-002` | Switch Career & Income job tracker across List, Status Board, Timeline, Responses, and Weekly Comparison views. | All 5 views render the exact same underlying application records accurately with working Gmail deep links. |
| **TC-003** | `FR-004`, `AC-003` | Attempt to execute a `SEND_GMAIL` action in `approval_queue_actions` while `status = 'PENDING_APPROVAL'`. | Server rejects execution with `403 Forbidden`, sends zero external requests, and preserves the item in the queue. |
| **TC-004** | `FR-005`, `AC-004` | Seed venture `Klarone` with `last_activity_at = 10 days ago` alongside career job applications. | `Klarone` appears exclusively in Business & Ventures with a Neglect Flag and never mixes into Career or Personal task lists. |
| **TC-005** | `FR-006`, `AC-005` | Log a new Learning Checkpoint with `capability_before` and `capability_now` linked to a career goal. | Skill view displays the capability progression milestone and career-goal link rather than only hours spent. |
| **TC-006** | `FR-012`, `AC-006` | Add a new raw idea to the Idea Sandbox, verify it is absent from Active Projects, then click `Promote to Project`. | Idea remains isolated in Sandbox until promoted, then transitions cleanly into `projects` with its selected Purpose type. |
| **TC-007** | `FR-014`, `AC-009` | Complete Daily Review with 2 completed tasks and 1 pending task, then click `Carry Forward to Tomorrow`. | The 1 pending task is automatically queued in tomorrow's candidate Top 3 priorities. |
| **TC-008** | `FR-015`, `AC-010` | Query Gemini Personal Advisor: *"What should I focus on today and what have I been neglecting?"* | Response explicitly cites the overdue job follow-ups, today's top priorities, and the neglected domain from the database. |

---

## 4. CI Quality Gates (Pre-Merge Requirements for Antigravity)
Every pull request opened by Antigravity must pass these automated gates before merge:
1. **Formatting & Linting:** `npm run lint` and `prettier --check` pass with 0 errors.
2. **Type Safety:** `tsc --noEmit` passes with strict TypeScript checking enabled.
3. **Unit & Integration Suite:** `npm run test:ci` passes 100% of unit and integration tests.
4. **E2E Smoke Suite:** Playwright E2E tests (`TC-001` through `TC-008`) pass against the preview build.
5. **Security Scan:** `npm audit --audit-level=high` and secret-scanning checks pass with 0 leaked credentials.
