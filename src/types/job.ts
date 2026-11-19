export type JobStage = 
  | 'Wishlist' 
  | 'Reached out' 
  | 'Applied' 
  | 'Screening' 
  | 'Interview' 
  | 'Offer' 
  | 'Closed';

export type JobOutcome = 'Rejected' | 'Withdrawn' | 'No response' | 'Accepted';

export type OutreachChannel = 
  | 'Email' 
  | 'LinkedIn' 
  | 'X (Twitter)' 
  | 'Referral' 
  | 'Job board' 
  | 'Other';

export interface ApplicationTimelineEvent {
  id: string;
  date: string;
  type: string;
  notes: string;
}

export interface InterviewRound {
  id: string;
  roundName: string;
  date: string;
  questions: string[];
  notes: string;
  outcome?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  roleType: 'Full-time' | 'Contract' | 'Founding Engineer';
  stage: JobStage;
  outcome?: JobOutcome;
  source: OutreachChannel;
  jobUrl?: string;
  location: string;
  remote: boolean;
  compensation?: string;
  appliedAt: string;
  resumeVersionId: string;
  nextAction: string;
  nextActionDue: string; // ISO date or YYYY-MM-DD
  lastActivityAt: string;
  whyFit?: string;
  notes?: string;
  linkedProjectIds: string[]; // Cross-module links to Projects
  timeline: ApplicationTimelineEvent[];
  interviewRounds: InterviewRound[];
}

export interface TargetCompany {
  id: string;
  name: string;
  website: string;
  whatTheyBuild: string;
  stack: string[];
  founderOrContact: string;
  contactChannel: OutreachChannel;
  outreachStatus: 'Not contacted' | 'Contacted' | 'Replied' | 'No response';
  lastContactedAt?: string;
}

export interface OutreachLog {
  id: string;
  contactName: string;
  companyName: string;
  channel: OutreachChannel;
  message: string;
  sentAt: string;
  followUpDue: string;
  responseStatus: 'Pending' | 'Replied' | 'Ghosted' | 'Closed';
}

export interface ResumeVersion {
  id: string;
  name: string; // e.g. "Full Stack - Startups", "Frontend Specialist"
  targetRole: string;
  fileOrUrl: string;
  updatedAt: string;
}
