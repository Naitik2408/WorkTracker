# 00 — Document Register, Stage Tracker, Decision Log & Risk Register

- **Project Name:** Personal Life Dashboard (Personal Life Operating Dashboard)
- **Root Google Drive Folder:** [Personal Life Dashboard](https://drive.google.com/drive/folders/1VlkXTKMtW2SP_Getbai3yWfgedXjX82P)
- **Gemini Notebook Workspace:** [Personal Life Dashboard — Project Knowledge Base](https://gemini.google.com/notebook/2ef8b573-e3ed-4286-9f63-71312d55e253)
- **Master Google Sheet:** [00 - Document Register, Status, Risk & Decision Log](https://docs.google.com/spreadsheets/d/12IRuj2L8iXZckx3QuoPJwXcIiz32pPMYHtvh-a3Ne3s/edit)

---

## 1. Document Register

| Doc ID | Document Title | Framework Candidate Coverage | Owning Skill | Selection Decision | Version | Status | Canonical Drive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DOC-00** | `00-Document-Register-Status-Risk-and-Decision-Log.md` | Document Register, Risk Register, Decision Records, Project Status Report | Project Orchestrator | Required now (Created) | v1.0 | Active | [Google Sheet](https://docs.google.com/spreadsheets/d/12IRuj2L8iXZckx3QuoPJwXcIiz32pPMYHtvh-a3Ne3s/edit) |
| **DOC-01** | `01-Project-Brief-and-Discovery-Summary.md` | Project Brief, Problem Statement, User Context, Feasibility & Assumptions | Discovery & Research | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/1SYFFaVE12v2tZ6qqqbmZyLx-8zU_SYcCXa6dts2Voyc/edit) |
| **DOC-02** | `02-PRD-User-Stories-and-Acceptance-Criteria.md` | PRD, Functional Requirements (`FR-001`–`FR-015`), Non-Functional Requirements (`NFR-001`–`NFR-005`), User Stories & Acceptance Criteria (`US/AC-001`–`010`), MVP Scope | Product Planning | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/19b8yKqV8rydVud3-9aJjB9kH9aneCLBJS3mK8RDPG3I/edit) |
| **DOC-03** | `03-UI-UX-Specifications-and-User-Flows.md` | UI/UX Specifications, Information Architecture, User Flows, Screen Specs, Interaction States & Accessibility | UI/UX Design | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/12XoGxpMxys8yCorVCIebmTlp7l3JvE4RXKMNrDyKMNE/edit) |
| **DOC-04** | `04-System-Architecture-Data-Model-API-and-Security.md` | System Architecture, PostgreSQL Database Schema, API Specifications, Security Requirements & Threat Model, ADRs | System Architecture | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/1lR7MH3mSYCXfgYtsm3RfFAChxGfO5Tbgr7OrXKbQ-fI/edit) |
| **DOC-05** | `05-Test-Strategy-and-Quality-Gates.md` | Test Strategy, Core Test Cases (`TC-001`–`TC-008`), CI Quality Gates | Engineering & QA | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/1Bacqn5KDnV0_uJ3wmUMvx9EEEhC2Po7bhAD2T4EaKGk/edit) |
| **DOC-06** | `06-Deployment-and-Operations-Plan.md` | Deployment Plan, Git Branching Policy, Environment Map, Rollback & Backup Plan | Release & Operations | Required now (Created) | v1.0 | Draft — Awaiting User Approval | [Google Doc](https://docs.google.com/document/d/1jNaj_pNuKzGBpwjcTJzzxox7KhGRu9lrUHfYv7zjR9U/edit) |
| **DOC-NA-01** | Commercial Business Model & Revenue Analysis | Business Model, Pricing, Monetization | Discovery & Research | Not Applicable (Personal & Portfolio project; not a commercial SaaS) | N/A | Omitted by Policy | N/A |

**Summary Metrics:** Total Candidate Groups Evaluated: `8` | Created & Populated: `7` (`1` Active Governance Register, `6` Stage Specification Docs Awaiting User Approval) | Omitted as Not Applicable: `1`.

---

## 2. Stage & Progress Tracker

| Stage ID | Skill / Lifecycle Stage | Current Status | Key Deliverables Completed | Next Action / Gate |
| :--- | :--- | :--- | :--- | :--- |
| **STG-00** | Project Orchestrator | In Progress | Drive folder hierarchy, Gemini Notebook, Document Register, Risk & Decision logs | Obtain user approval on Scope, MVP Phasing, and Architecture before Antigravity handoff |
| **STG-01** | Discovery & Research | Completed (Awaiting Approval) | `01-Project-Brief-and-Discovery-Summary.md` | User review of assumptions and 7-domain scope |
| **STG-02** | Product Planning | Completed (Awaiting Approval) | `02-PRD-User-Stories-and-Acceptance-Criteria.md` (`FR-001`–`FR-015`, `NFR-001`–`NFR-005`, `US-001`–`US-010`) | User approval of Phase 1 MVP vs. Phase 2 scope boundary |
| **STG-03** | UI/UX Design | Completed (Awaiting Approval) | `03-UI-UX-Specifications-and-User-Flows.md` (Light-mode minimal command center) | User confirmation of Morning View & 95/5 Job-Hunting layout |
| **STG-04** | System Architecture | Completed (Awaiting Approval) | `04-System-Architecture-Data-Model-API-and-Security.md` (Next.js + Supabase Modular Monolith) | User approval of stack & schema before coding |
| **STG-05** | Engineering & QA | Planned (Test Strategy Ready) | `05-Test-Strategy-and-Quality-Gates.md` (`TC-001`–`TC-008`) | Hand off approved specs to Antigravity for repo setup & Sprint 1 implementation |
| **STG-06** | Release & Operations | Planned (Deployment Plan Ready) | `06-Deployment-and-Operations-Plan.md` (Trunk-based Git + Vercel/Supabase) | Configure repo branches and environments after architecture sign-off |

---

## 3. Decision Log

| Decision ID | Date | Decision Summary | Category | Status | Rationale | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-11-17 | Primary Purpose = Personal (CEO Life Control Center) with Secondary = Portfolio | Classification | Approved (Per Source Doc) | Prevents unnecessary commercial/monetization bloat while keeping engineering quality high | Naitik Kumar |
| **DEC-002** | 2026-11-17 | Consolidate 17 candidate docs into 6 cohesive Docs + 1 Master Governance Register | Governance | Implemented | Avoids thin duplicate files while covering 100% of required specifications | Project Orchestrator |
| **DEC-003** | 2026-11-17 | 95% Viewing/Monitoring & 5% Lightweight Action rule for Job Hunting | Product / UX | Approved (Per Source Doc) | Prevents dashboard from becoming a high-friction manual spreadsheet tracker | Naitik Kumar |
| **DEC-004** | 2026-11-17 | Hard Server-Side Human Approval Gate for all external actions (Gmail/Applications) | Security / Governance | Approved (Per Source Doc) | Ensures Gemini never sends emails or submits applications without explicit review & approval | Naitik Kumar |
| **DEC-005** | 2026-11-17 | Idea Evaluation Sandbox before promoting concepts to Active Projects | Product Scope | Approved (Per Source Doc) | Stops passing ideas from cluttering active project tracking | Naitik Kumar |
| **DEC-006** | 2026-11-17 | Proposed Tech Stack: Next.js (TypeScript) + Tailwind + Supabase PostgreSQL + Vercel | Architecture | Proposed — Awaiting Approval | Matches user's established stack, provides relational integrity across 7 domains, and keeps cost low | System Architecture / User |

---

## 4. Risk Register

| Risk ID | Risk Description | Affected Domain / Stage | Severity | Likelihood | Mitigation Strategy | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Dashboard maintenance fatigue (spending more time logging data than living life) | Product / UX | High | Medium | Enforce 95/5 observation-to-action ratio, <2 min daily review, and automated Gmail/Calendar sync | Mitigated in Design |
| **RSK-002** | Unintended external action (sending unreviewed email or application) | Career / Security | Critical | Low | Enforce database-level `PENDING_APPROVAL` state machine requiring explicit user approval click | Mitigated in Architecture |
| **RSK-003** | Scope overload from building all 7 life domains + deep analytics simultaneously | Engineering / Delivery | High | High | Phase delivery into Phase 1 Core MVP (Morning View, Career 95/5, Ventures, Goals/Projects, Daily/Weekly Review) and Phase 2 | Proposed for Approval |
| **RSK-004** | Gmail/Calendar OAuth token expiration causing stale recruiter/schedule data | Integrations | Medium | Medium | Surface clear 'Last Synced' badge and non-blocking 1-click OAuth reconnect banner | Mitigated in UX/Arch |
| **RSK-005** | Sensitive financial and personal reflection data exposure | Security / Privacy | High | Low | Enforce PostgreSQL Row-Level Security (RLS), encrypted tokens at rest, and zero PII logging | Mitigated in Architecture |
| **RSK-006** | Context drift between Gemini planning workspace and Antigravity GitHub repo | Operations | Medium | Medium | Maintain canonical specs in shared Google Drive folder and require verified test/PR evidence on handoff | Active Governance |
