# WorkTracker — Personal Life Operating Dashboard

> **Manage your life like the CEO of your own life.** High-clarity observation across 7 life areas with Vercel-inspired monochrome design language, light-mode default, and Gemini Personal Advisor.

[![Deploy with Vercel](https://vercel.com/button)](https://work-tracker-blush.vercel.app)

- **Live Production URL:** [https://work-tracker-blush.vercel.app](https://work-tracker-blush.vercel.app)
- **Vercel Project:** `work-tracker` (under `Naitik Kumar's projects`)
- **Database:** Supabase PostgreSQL (`xjttydmfgohtavjcgqxu`)
- **Repository:** [Naitik2408/WorkTracker](https://github.com/Naitik2408/WorkTracker)

---

## Key Features

1. **Vercel Design Language**:
   - Default **Light Mode** with class-based `.dark` toggle.
   - Anti-flash blocking script in `<head>`.
   - Geist Sans for UI, Geist Mono for metrics/code/timestamps.
   - 8px grid hierarchy, hairline borders (`#eaeaea`), no heavy decoration.

2. **The 7 Life Areas**:
   - **Career & Income**: 95/5 job-hunting observation model across 5 views (Status Board, List, Activity Stream, Recruiter Replies, Trends).
   - **Business & Ventures**: Isolated venture tracker (e.g. Klarone).
   - **Learning & Skills**: Real capability matrix over hours logged.
   - **Health & Fitness**: Movement, workout consistency, hydration, and sleep.
   - **Personal Finance**: Cashflow, runway, operating expenses, and recurring payments.
   - **Personal Operations**: Central administrative task vault and commitments.
   - **Personal Growth**: Trajectory reflection without punitive scoring.

3. **Gemini Personal Advisor & 5% Action Guardrail**:
   - Slide-over executive advice drawer.
   - Strict approval queue: AI drafts recruiter follow-ups and submissions, but **never executes external actions without your explicit sign-off**.

4. **Production Architecture**:
   - Next.js 15 (App Router, Turbopack, TypeScript)
   - Tailwind CSS
   - Radix UI Primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `@radix-ui/react-tabs`)
   - Framer Motion micro-interactions
   - Lucide Icons

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Naitik2408/WorkTracker.git
cd WorkTracker

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard locally.
