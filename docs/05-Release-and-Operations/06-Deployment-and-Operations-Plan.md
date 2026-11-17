# 06 — Deployment, Branching & Operations Plan: Personal Life Dashboard

- **Google Doc Link:** [06 - Deployment & Operations Plan](https://docs.google.com/document/d/1jNaj_pNuKzGBpwjcTJzzxox7KhGRu9lrUHfYv7zjR9U/edit)
- **Owning Skill:** Release & Operations (Stage 06)
- **Version:** 1.0 (Draft — Awaiting User Approval)

---

## 1. Git Branching & Release Policy
- **Selected Model:** **Lightweight Trunk-Based Workflow (`main` + short-lived feature branches)** per Release & Operations Skill Section 6 (optimized for a solo-owner product with Antigravity collaboration).
  - `main`: Protected production-ready branch. Direct pushes are disabled; changes enter via Pull Requests that pass CI Quality Gates.
  - `feat/<scope>`, `fix/<scope>`, `chore/<scope>`: Short-lived branches created by Antigravity for each approved implementation task.
- **Release Versioning:** Semantic tags (`v0.1.0-mvp`, `v0.2.0`, etc.) with concise release notes linking implemented Requirement IDs (`FR-*`) and verified Test Cases (`TC-*`).

---

## 2. Environment Strategy
1. **Local Development (`local`):**
   - Next.js local dev server (`localhost:3000`) + local Supabase stack (`supabase start`) with deterministic seed data covering all 7 life areas.
2. **Preview Environment (`preview`):**
   - Ephemeral **Vercel Preview Deployment** automatically generated for every PR opened by Antigravity.
   - Provides a live URL to inspect UI/UX flows and run Playwright E2E checks without maintaining a separate permanent staging server.
3. **Production Environment (`production`):**
   - **Web Application & API:** Hosted on **Vercel** (connected to `main`, requiring explicit user approval for production promotion).
   - **Database & Auth:** Hosted on **Supabase (Managed PostgreSQL + Auth)**.
   - **Optional Background Sync Service:** Hosted on **Render** or **Railway** if scheduled background Gmail/Calendar jobs exceed serverless cron windows.

---

## 3. Configuration & Secrets Management
- **Zero Secrets in Git:** `.env*` files are strictly git-ignored; only `.env.example` with variable names and descriptions is committed.
- **Required Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Server-only)
  - `GOOGLE_OAUTH_CLIENT_ID` & `GOOGLE_OAUTH_CLIENT_SECRET` (Server-only)
  - `TOKEN_ENCRYPTION_SECRET` (32-byte key for encrypting OAuth refresh tokens at rest)
  - `GEMINI_API_KEY` (Server-only, scoped to the Personal Advisor service)

---

## 4. Database Migrations, Backup & Rollback Runbook
- **Migrations:** Managed via declarative SQL migration files in `supabase/migrations/`. Every migration is tested against the local Supabase container in CI before running on production.
- **Application Rollback:** If post-deployment verification detects a regression, promote the previous known-good immutable deployment on Vercel in 1 click (`< 30 seconds` recovery time).
- **Data Backups & Portability:**
  - Automated daily Supabase PostgreSQL backups.
  - Built-in **1-Click Full Life Data Export (JSON/CSV)** inside the dashboard settings so Naitik can download a complete offline archive of all 7 domains at any time.

---

## 5. Gemini & Antigravity Collaboration Protocol
1. **Planning & Specification (Gemini):** Project Orchestrator and specialist skills maintain the canonical specifications in the shared [Personal Life Dashboard Google Drive Folder](https://drive.google.com/drive/folders/1VlkXTKMtW2SP_Getbai3yWfgedXjX82P) and [Gemini Notebook](https://gemini.google.com/notebook/2ef8b573-e3ed-4286-9f63-71312d55e253).
2. **Implementation Handoff (Gemini → Antigravity):** Once Naitik approves the Phase 1 MVP scope and architecture, Project Orchestrator generates a self-contained **Implementation Handoff Packet** specifying exact tasks, target files, schema migrations, and required test evidence.
3. **Execution & Git Operations (Antigravity):** Antigravity inspects the GitHub repository, implements the code on a `feat/*` branch, runs the test suite, opens a PR, and outputs the verification report.
4. **Verification & Sign-Off (Gemini + Naitik):** Project Orchestrator reviews the returned evidence against the Acceptance Criteria (`AC-001`–`AC-010`) and updates the Document & Stage Register.
