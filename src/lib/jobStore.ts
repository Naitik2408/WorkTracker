import { Application, TargetCompany, OutreachLog, ResumeVersion } from '@/types/job';

export const INITIAL_RESUMES: ResumeVersion[] = [
  {
    id: 'res-fullstack',
    name: 'Fullstack Engineer (Startups)',
    targetRole: 'Founding Engineer / Fullstack SDE',
    fileOrUrl: 'https://naitik.work/resume.pdf',
    updatedAt: '2026-11-06T00:00:00.000Z'
  },
  {
    id: 'res-frontend',
    name: 'Frontend Specialist (React/Next.js)',
    targetRole: 'Senior Frontend Engineer',
    fileOrUrl: 'https://naitik.work/resume.pdf',
    updatedAt: '2026-10-20T00:00:00.000Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-acme',
    company: 'Acme AI',
    role: 'Founding Fullstack Engineer',
    roleType: 'Founding Engineer',
    stage: 'Screening',
    source: 'X (Twitter)',
    jobUrl: 'https://acme.ai/careers/founding-engineer',
    location: 'Remote (Global)',
    remote: true,
    compensation: '$120k - $160k + 1.0% equity',
    appliedAt: '2026-11-12T00:00:00.000Z',
    resumeVersionId: 'res-fullstack',
    nextAction: 'Prep demo and live architecture discussion for screening call with CTO',
    nextActionDue: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(), // Tomorrow
    lastActivityAt: '2026-11-17T18:00:00.000Z',
    whyFit: 'Fast-moving LLM observability startup. My experience building WorkTracker and LaunchFast aligns directly with their edge Next.js stack.',
    notes: 'CTO loved the clean monochrome design of WorkTracker shared in DM.',
    linkedProjectIds: ['prj-work-tracker', 'prj-launchfast'],
    timeline: [
      { id: 't-1', date: '2026-11-12', type: 'Cold Outreach', notes: 'Sent DM to founder with WorkTracker demo link.' },
      { id: 't-2', date: '2026-11-14', type: 'Reply Received', notes: 'Founder asked to schedule a technical chat.' },
      { id: 't-3', date: '2026-11-17', type: 'Screening Scheduled', notes: 'Invite confirmed for Thursday 3:00 PM.' }
    ],
    interviewRounds: [
      {
        id: 'r-1',
        roundName: 'Round 1: Screening & Architecture',
        date: '2026-11-19T15:00:00.000Z',
        questions: ['How do you handle SSR partial prerendering in Turbopack?', 'Describe a time you shipped an MVP in under 48 hours.'],
        notes: 'Emphasize fast iteration and clean component architecture.'
      }
    ]
  },
  {
    id: 'app-linear',
    company: 'DevFlow (YC W26)',
    role: 'Full Stack Engineer',
    roleType: 'Full-time',
    stage: 'Reached out',
    source: 'Referral',
    location: 'San Francisco / Remote',
    remote: true,
    appliedAt: '2026-11-14T00:00:00.000Z',
    resumeVersionId: 'res-fullstack',
    nextAction: 'Send follow-up DM on X asking if they had a chance to review repo',
    nextActionDue: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Overdue 5h
    lastActivityAt: '2026-11-14T10:00:00.000Z',
    whyFit: 'Developer productivity tool with high craft UI standards.',
    linkedProjectIds: ['prj-work-tracker'],
    timeline: [
      { id: 't-df-1', date: '2026-11-14', type: 'Outreach', notes: 'Introduced via alumni network referral.' }
    ],
    interviewRounds: []
  },
  {
    id: 'app-resend',
    company: 'HyperMail',
    role: 'Frontend Systems Engineer',
    roleType: 'Full-time',
    stage: 'Applied',
    source: 'Job board',
    jobUrl: 'https://hypermail.dev/jobs',
    location: 'Remote',
    remote: true,
    appliedAt: '2026-11-10T00:00:00.000Z',
    resumeVersionId: 'res-frontend',
    nextAction: 'Check job portal for application status update',
    nextActionDue: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    lastActivityAt: '2026-11-10T00:00:00.000Z',
    linkedProjectIds: ['prj-web'],
    timeline: [
      { id: 't-hm-1', date: '2026-11-10', type: 'Application Submitted', notes: 'Direct application through website.' }
    ],
    interviewRounds: []
  }
];

export const INITIAL_TARGETS: TargetCompany[] = [
  {
    id: 'tgt-1',
    name: 'Supabase Ecosystem Ventures',
    website: 'https://supabase.com',
    whatTheyBuild: 'Developer-first database tools and realtime integrations',
    stack: ['PostgreSQL', 'TypeScript', 'Next.js', 'Go'],
    founderOrContact: 'Paul Copplestone / Team',
    contactChannel: 'X (Twitter)',
    outreachStatus: 'Not contacted'
  },
  {
    id: 'tgt-2',
    name: 'Raycast Community Extensions',
    website: 'https://raycast.com',
    whatTheyBuild: 'Supercharged desktop launcher and extension store',
    stack: ['React', 'TypeScript', 'Node.js', 'Rust'],
    founderOrContact: 'Thomas Paul Mann',
    contactChannel: 'LinkedIn',
    outreachStatus: 'Not contacted'
  }
];

export const INITIAL_OUTREACH: OutreachLog[] = [
  {
    id: 'out-1',
    contactName: 'Sarah Lin',
    companyName: 'Acme AI',
    channel: 'X (Twitter)',
    message: 'Hey Sarah, loved your post on low-latency state caching. Built WorkTracker recently using Turbopack and thought our ideas on developer dashboard UX align closely.',
    sentAt: '2026-11-12T14:30:00.000Z',
    followUpDue: '2026-11-18T14:30:00.000Z',
    responseStatus: 'Replied'
  }
];

const JOB_STORAGE_KEY = 'worktracker_jobs_store_v1';

export interface JobsStoreState {
  applications: Application[];
  targets: TargetCompany[];
  outreach: OutreachLog[];
  resumes: ResumeVersion[];
}

export function getStoredJobs(): JobsStoreState {
  if (typeof window === 'undefined') {
    return {
      applications: INITIAL_APPLICATIONS,
      targets: INITIAL_TARGETS,
      outreach: INITIAL_OUTREACH,
      resumes: INITIAL_RESUMES
    };
  }

  try {
    const raw = localStorage.getItem(JOB_STORAGE_KEY);
    if (!raw) {
      const initial = {
        applications: INITIAL_APPLICATIONS,
        targets: INITIAL_TARGETS,
        outreach: INITIAL_OUTREACH,
        resumes: INITIAL_RESUMES
      };
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse jobs store:', err);
    return {
      applications: INITIAL_APPLICATIONS,
      targets: INITIAL_TARGETS,
      outreach: INITIAL_OUTREACH,
      resumes: INITIAL_RESUMES
    };
  }
}

export function saveStoredJobs(state: JobsStoreState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save jobs store:', err);
  }
}
