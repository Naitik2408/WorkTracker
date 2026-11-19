import { Project } from '@/types/project';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-work-tracker',
    slug: 'work-tracker',
    name: 'work-tracker',
    description: 'Personal project management and 6-month re-entry monitoring dashboard.',
    status: 'Active',
    repoUrl: 'https://github.com/Naitik2408/WorkTracker',
    liveUrl: 'https://work-tracker-blush.vercel.app',
    docsUrl: '',
    lastWorkedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30m ago
    createdAt: '2026-11-15T00:00:00.000Z',
    attentionGaps: [],
    resume: {
      currentState: 'Phase 1 audit approved. Redesigning UI with minimal Vercel visual language, zero fake metrics, and 6-month re-entry cards.',
      nextSteps: [
        { id: 'wt-1', text: 'Build Project Detail Screen with 5 functional tabs', completed: false },
        { id: 'wt-2', text: 'Verify cross-environment diff in Environment tab', completed: false },
        { id: 'wt-3', text: 'Wire Command Palette with keyboard-first navigation', completed: false },
      ],
      blockers: [],
      runLocally: 'pnpm install && pnpm dev',
    },
    techStack: [
      { name: 'Next.js 16', category: 'Frontend' },
      { name: 'React 19', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'Tailwind CSS', category: 'Frontend' },
      { name: 'Framer Motion', category: 'Frontend' },
      { name: 'Supabase', category: 'Database' },
      { name: 'Vercel API', category: 'Tooling' }
    ],
    services: [
      {
        id: 'srv-vercel',
        name: 'Vercel',
        category: 'other',
        purpose: 'Production edge hosting and automated Git deployments',
        plan: 'Hobby ($0/mo)',
        dashboardUrl: 'https://vercel.com/naitik-kumars-projects/work-tracker',
        accountUsed: 'Naitik Kumar (Personal)',
        linkedEnvKeys: ['VERCEL_TOKEN', 'VERCEL_TEAM_ID']
      },
      {
        id: 'srv-supabase',
        name: 'Supabase',
        category: 'storage',
        purpose: 'PostgreSQL database and cloud storage',
        plan: 'Free tier',
        dashboardUrl: 'https://supabase.com/dashboard/project/xjttydmfgohtavjcgqxu',
        accountUsed: 'naitikkumar2408@gmail.com',
        linkedEnvKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
      }
    ],
    deployments: [
      {
        id: 'dep-wt-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://work-tracker-blush.vercel.app',
        branch: 'main',
        environment: 'Production',
        status: 'live',
        lastDeployedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        notes: 'Live with automatic GitHub CI on push to main'
      }
    ],
    envVars: [
      {
        id: 'env-wt-1',
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        environment: 'Production',
        component: 'Frontend',
        whereSet: 'Vercel',
        required: true,
        description: 'Supabase project endpoint URL',
        value: 'https://xjttydmfgohtavjcgqxu.supabase.co',
        isMasked: true
      },
      {
        id: 'env-wt-2',
        key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        environment: 'Production',
        component: 'Frontend',
        whereSet: 'Vercel',
        required: true,
        description: 'Supabase anonymous public API key',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        isMasked: true
      },
      {
        id: 'env-wt-3',
        key: 'VERCEL_TOKEN',
        environment: 'Production',
        component: 'Frontend',
        whereSet: 'Vercel',
        required: true,
        description: 'Vercel API token for querying live deployment statuses',
        value: 'vcp_••••••••••••••••••••••••••••••••',
        isMasked: true
      }
    ],
    notes: [
      {
        id: 'n-wt-1',
        body: 'Redesigned core data model around the 6-Month Test. Removed fake billing/logs/observability mocks.',
        pinned: true,
        createdAt: '2026-11-17T22:10:00.000Z'
      }
    ]
  },
  {
    id: 'prj-web',
    slug: 'web',
    name: 'web (naitik.work)',
    description: 'Personal portfolio, engineering resume, and creative sandbox.',
    status: 'Maintenance',
    repoUrl: 'https://github.com/Naitik2408/Naitik',
    liveUrl: 'https://naitik.work',
    docsUrl: '',
    lastWorkedAt: '2026-11-06T07:42:00.000Z',
    createdAt: '2026-05-18T00:00:00.000Z',
    attentionGaps: [],
    resume: {
      currentState: 'Live portfolio is stable. Resume PDF download and project showcase updated with recent fullstack work.',
      nextSteps: [
        { id: 'w-1', text: 'Add interactive case study for WorkTracker launch', completed: false }
      ],
      blockers: [],
      runLocally: 'npm install && npm run dev',
    },
    techStack: [
      { name: 'Vite', category: 'Frontend' },
      { name: 'React', category: 'Frontend' },
      { name: 'Tailwind CSS', category: 'Frontend' }
    ],
    services: [
      {
        id: 'srv-web-vercel',
        name: 'Vercel',
        category: 'other',
        purpose: 'Custom domain DNS and static web hosting',
        plan: 'Hobby',
        dashboardUrl: 'https://vercel.com/naitik-kumars-projects/web',
        accountUsed: 'Personal'
      }
    ],
    deployments: [
      {
        id: 'dep-web-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://naitik.work',
        branch: 'main',
        environment: 'Production',
        status: 'live',
        lastDeployedAt: '2026-11-06T07:42:00.000Z'
      }
    ],
    envVars: [],
    notes: []
  },
  {
    id: 'prj-launchfast',
    slug: 'launchfast',
    name: 'launchfast',
    description: 'Fullstack Next.js SaaS starter kit with Stripe, Supabase auth, and SEO schema.',
    status: 'Active',
    repoUrl: 'https://github.com/Naitik2408/launchfast',
    liveUrl: 'https://launchfast.naitik.work',
    docsUrl: '',
    lastWorkedAt: '2026-10-26T04:37:10.000Z',
    createdAt: '2026-10-20T00:00:00.000Z',
    attentionGaps: ['1 gap: STRIPE_WEBHOOK_SECRET missing in Production'],
    resume: {
      currentState: 'SEO schema, robots, and sitemap added. Core checkout flow working in staging; needs production webhook verification.',
      nextSteps: [
        { id: 'lf-1', text: 'Configure STRIPE_WEBHOOK_SECRET in production Vercel', completed: false },
        { id: 'lf-2', text: 'Verify checkout test order with receipt email via Resend', completed: false }
      ],
      blockers: ['Awaiting production Stripe merchant verification'],
      runLocally: 'pnpm install && cp .env.example .env.local && pnpm dev',
    },
    techStack: [
      { name: 'Next.js 15', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'Tailwind CSS', category: 'Frontend' },
      { name: 'Supabase', category: 'Database' },
      { name: 'Stripe', category: 'Backend' }
    ],
    services: [
      {
        id: 'srv-lf-stripe',
        name: 'Stripe',
        category: 'payments',
        purpose: 'Subscription payments & checkout sessions',
        plan: 'Pay-as-you-go',
        dashboardUrl: 'https://dashboard.stripe.com',
        accountUsed: 'Personal (Standard)',
        linkedEnvKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET']
      },
      {
        id: 'srv-lf-supabase',
        name: 'Supabase',
        category: 'auth',
        purpose: 'User authentication and PostgreSQL storage',
        plan: 'Free tier',
        dashboardUrl: 'https://supabase.com',
        accountUsed: 'Personal'
      }
    ],
    deployments: [
      {
        id: 'dep-lf-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://launchfast.naitik.work',
        branch: 'main',
        environment: 'Production',
        status: 'live',
        lastDeployedAt: '2026-10-26T04:37:10.000Z'
      }
    ],
    envVars: [
      {
        id: 'env-lf-1',
        key: 'STRIPE_SECRET_KEY',
        environment: 'Production',
        component: 'Backend',
        whereSet: 'Vercel',
        required: true,
        description: 'Live Stripe Secret API key',
        value: 'sk_live_51P...',
        isMasked: true
      },
      {
        id: 'env-lf-2',
        key: 'STRIPE_WEBHOOK_SECRET',
        environment: 'Production',
        component: 'Backend',
        whereSet: 'Vercel',
        required: true,
        description: 'Endpoint signing secret for /api/webhook/stripe',
        value: '',
        isMasked: true
      }
    ],
    notes: [
      {
        id: 'n-lf-1',
        body: 'Implemented structured data JSON-LD and GA4 tracking before deploying to launchfast.naitik.work.',
        pinned: true,
        createdAt: '2026-10-26T04:37:10.000Z'
      }
    ]
  },
  {
    id: 'prj-klarone',
    slug: 'klarone-staging',
    name: 'klarone-staging',
    description: 'Enterprise workflow and collaboration platform staging deployment.',
    status: 'Active',
    repoUrl: 'https://github.com/Naitik2408/klarone-staging',
    liveUrl: 'https://klarone-staging.vercel.app',
    docsUrl: '',
    lastWorkedAt: '2026-11-05T05:02:38.000Z',
    createdAt: '2026-11-01T00:00:00.000Z',
    attentionGaps: [],
    resume: {
      currentState: 'Staging environment deployed for client review. All core routes functioning.',
      nextSteps: [
        { id: 'kl-1', text: 'Gather client feedback on onboarding workflow', completed: false }
      ],
      blockers: [],
      runLocally: 'pnpm install && pnpm dev',
    },
    techStack: [
      { name: 'Next.js 15', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' }
    ],
    services: [],
    deployments: [
      {
        id: 'dep-kl-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://klarone-staging.vercel.app',
        branch: 'main',
        environment: 'Staging',
        status: 'live',
        lastDeployedAt: '2026-11-05T05:02:38.000Z'
      }
    ],
    envVars: [],
    notes: []
  },
  {
    id: 'prj-krishna',
    slug: 'krishna-infotech-solution',
    name: 'krishna-infotech-solution',
    description: 'Business website and IT service catalog for Krishna Infotech.',
    status: 'Maintenance',
    repoUrl: 'https://github.com/Naitik2408/KrishnaInfotechSolution',
    liveUrl: 'https://krishnainfotechsolution.com',
    docsUrl: '',
    lastWorkedAt: '2026-05-17T04:32:58.000Z',
    createdAt: '2026-05-10T00:00:00.000Z',
    attentionGaps: [],
    resume: {
      currentState: 'Services page updated with latest IT consultation offerings and WhatsApp contact link.',
      nextSteps: [],
      blockers: [],
      runLocally: 'npm install && npm start',
    },
    techStack: [
      { name: 'React', category: 'Frontend' },
      { name: 'CSS Modules', category: 'Frontend' }
    ],
    services: [],
    deployments: [
      {
        id: 'dep-kis-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://krishnainfotechsolution.com',
        branch: 'main',
        environment: 'Production',
        status: 'live',
        lastDeployedAt: '2026-05-17T04:32:58.000Z'
      }
    ],
    envVars: [],
    notes: []
  },
  {
    id: 'prj-naitik2',
    slug: 'naitik2',
    name: 'naitik2',
    description: 'Alternate personal portfolio and experimental UI concepts.',
    status: 'Paused',
    repoUrl: 'https://github.com/Naitik2408/Naitik2',
    liveUrl: 'https://naitik2-peach.vercel.app',
    docsUrl: '',
    lastWorkedAt: '2026-07-14T20:44:58.000Z',
    createdAt: '2026-07-01T00:00:00.000Z',
    attentionGaps: [],
    resume: {
      currentState: 'Paused in favor of naitik.work. Retained as reference for custom shader and canvas animations.',
      nextSteps: [],
      blockers: [],
      runLocally: 'npm install && npm run dev',
    },
    techStack: [
      { name: 'Next.js', category: 'Frontend' },
      { name: 'Three.js', category: 'Frontend' }
    ],
    services: [],
    deployments: [
      {
        id: 'dep-n2-fe',
        component: 'Frontend',
        platform: 'Vercel',
        url: 'https://naitik2-peach.vercel.app',
        branch: 'main',
        environment: 'Production',
        status: 'live',
        lastDeployedAt: '2026-07-14T20:44:58.000Z'
      }
    ],
    envVars: [],
    notes: []
  }
];

const STORAGE_KEY = 'worktracker_projects_store_v1';

export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored projects:', err);
    return INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to storage:', err);
  }
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getStoredProjects();
  return projects.find((p) => p.slug === slug || p.id === slug);
}

export function updateProject(updated: Project): Project[] {
  const projects = getStoredProjects();
  const next = projects.map((p) => (p.id === updated.id ? updated : p));
  saveStoredProjects(next);
  return next;
}
