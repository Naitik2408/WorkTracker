export type ProjectStatus = 'Active' | 'Paused' | 'Maintenance' | 'Idea' | 'Archived';

export interface NextStepItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectResume {
  currentState: string;
  nextSteps: NextStepItem[];
  blockers: string[];
  runLocally: string;
}

export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tooling' | 'Other';
}

export interface ThirdPartyService {
  id: string;
  name: string;
  category: 'auth' | 'payments' | 'email' | 'analytics' | 'storage' | 'ai' | 'other';
  purpose: string;
  plan: string;
  monthlyCost?: string;
  dashboardUrl?: string;
  accountUsed?: string;
  linkedEnvKeys?: string[];
}

export type DeploymentComponent = 'Frontend' | 'Backend' | 'Database' | 'Workers' | 'Other';
export type DeploymentEnvironment = 'Production' | 'Preview' | 'Staging' | 'Development';
export type DeploymentStatus = 'live' | 'down' | 'building' | 'not deployed';

export interface DeploymentItem {
  id: string;
  component: DeploymentComponent;
  platform: string; // Vercel, Railway, Supabase, Render, AWS, Cloudflare, etc.
  url?: string;
  branch?: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  lastDeployedAt?: string;
  notes?: string;
}

export interface EnvVarItem {
  id: string;
  key: string;
  environment: 'Development' | 'Preview' | 'Production';
  component: string;
  whereSet: string; // e.g. "Vercel", "Railway", "Local .env"
  serviceId?: string;
  required: boolean;
  description: string;
  value?: string;
  isMasked?: boolean;
  updatedAt?: string;
}

export interface NoteItem {
  id: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
  repoUrl?: string;
  liveUrl?: string;
  docsUrl?: string;
  lastWorkedAt: string;
  createdAt: string;
  attentionGaps?: string[];
  resume: ProjectResume;
  techStack: TechItem[];
  services: ThirdPartyService[];
  deployments: DeploymentItem[];
  envVars: EnvVarItem[];
  notes: NoteItem[];
}
