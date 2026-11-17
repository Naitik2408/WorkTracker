export type MomentumState = 'IMPROVING' | 'STABLE' | 'SLIPPING' | 'NEGLECTED';

export interface LifeDomain {
  id: string;
  slug: 'career' | 'ventures' | 'learning' | 'health' | 'finance' | 'operations' | 'growth';
  name: string;
  description: string | null;
  icon: string | null;
  neglect_threshold_days: number;
  last_activity_at: string;
  current_summary: string | null;
  momentum_state: MomentumState;
  created_at: string;
}

export interface Goal {
  id: string;
  domain_id: string | null;
  parent_goal_id: string | null;
  horizon: 'LONG_TERM' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
  title: string;
  why_it_matters: string | null;
  status: 'ON_TRACK' | 'DELAYED' | 'RECONSIDER' | 'COMPLETED';
  progress_pct: number;
  next_action: string | null;
  target_date: string | null;
}

export interface DailyPriority {
  id: string;
  priority_date: string;
  rank: number;
  title: string;
  domain_id: string | null;
  linked_goal_id: string | null;
  linked_project_id: string | null;
  status: 'PLANNED' | 'COMPLETED' | 'CARRIED_FORWARD';
  blocker_notes: string | null;
}

export interface Venture {
  id: string;
  name: string;
  purpose: string | null;
  status: string;
  milestone_progress_pct: number;
  ongoing_activities: string[];
  pending_decisions: string[];
  last_activity_at: string;
}

export interface JobApplication {
  id: string;
  company_name: string;
  role_title: string;
  status: 'INTERESTED' | 'APPLIED' | 'PENDING' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';
  location: string | null;
  salary_range: string | null;
  applied_at: string;
  last_contact_at: string;
  follow_up_due_at: string | null;
  needs_follow_up: boolean;
  recruiter_name: string | null;
  recruiter_email: string | null;
  latest_message_snippet: string | null;
  notes: string | null;
}

export interface LearningSkill {
  id: string;
  skill_name: string;
  category: string | null;
  topics_completed: string[];
  topics_in_progress: string[];
  topics_to_learn: string[];
  capability_now: string | null;
  evidence_project_url: string | null;
  last_practiced_at: string;
}

export interface HealthFitnessLog {
  id: string;
  log_date: string;
  workout_type: string | null;
  duration_mins: number;
  movement_summary: string | null;
  habits_completed: string[];
  water_intake_liters: number | null;
  sleep_hours: number | null;
  notes: string | null;
}

export interface FinanceEntry {
  id: string;
  entry_date: string;
  entry_type: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  category: string;
  amount_inr: number;
  notes: string | null;
}

export interface UpcomingPayment {
  id: string;
  title: string;
  amount_inr: number;
  due_date: string;
  is_recurring: boolean;
  status: 'UPCOMING' | 'PAID' | 'OVERDUE';
}

export interface PersonalOpsItem {
  id: string;
  item_type: 'TASK' | 'APPOINTMENT' | 'COMMITMENT' | 'RECURRING' | 'REFERENCE_NOTE';
  title: string;
  due_at: string | null;
  recurrence_rule: string | null;
  status: 'PENDING' | 'COMPLETED';
  reference_data: Record<string, unknown>;
}

export interface IdeaItem {
  id: string;
  title: string;
  description: string | null;
  proposed_purpose: 'PERSONAL' | 'LEARNING' | 'PORTFOLIO' | 'BUSINESS';
  feasibility_notes: string | null;
  status: 'EVALUATING' | 'PROMOTED' | 'DEFERRED' | 'ARCHIVED';
  created_at: string;
}

export interface ApprovalAction {
  id: string;
  action_type: 'SEND_GMAIL' | 'CREATE_GMAIL_DRAFT' | 'SUBMIT_APPLICATION' | 'SCHEDULE_FOLLOWUP';
  summary_title: string;
  payload_json: {
    to?: string;
    subject?: string;
    body?: string;
    [key: string]: unknown;
  };
  ai_rationale: string | null;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  created_at: string;
}
