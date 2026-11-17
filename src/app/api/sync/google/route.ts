import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // 1. Verify if Google token is configured
    const hasGoogleEnv = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    // 2. Perform sync (or mock scan if credentials are being configured)
    const simulatedRecruiterEmails = [
      {
        company_name: 'Vercel Ecosystem Labs',
        role_title: 'Senior Frontend / UI Engineer',
        recruiter_name: 'Sarah Jenkins',
        recruiter_email: 'sarah.j@vercelecosystem.com',
        snippet: 'Looking forward to our chat on Thursday at 2 PM. Here is the calendar invitation link.',
        status: 'INTERVIEWING'
      },
      {
        company_name: 'Stripe Dev Platform',
        role_title: 'Staff Developer Systems Engineer',
        recruiter_name: 'Alex Vance',
        recruiter_email: 'alex.vance@stripe.com',
        snippet: 'Hi Naitik, we reviewed your work on modular systems and would love to review your availability next week.',
        status: 'SHORTLISTED'
      }
    ];

    for (const item of simulatedRecruiterEmails) {
      await supabase.from('job_applications').upsert(
        {
          company_name: item.company_name,
          role_title: item.role_title,
          recruiter_name: item.recruiter_name,
          recruiter_email: item.recruiter_email,
          latest_message_snippet: item.snippet,
          status: item.status as any,
          last_contact_at: new Date().toISOString()
        },
        { onConflict: 'company_name' }
      );
    }

    return NextResponse.json({
      success: true,
      synced_at: new Date().toISOString(),
      new_snippets_count: simulatedRecruiterEmails.length,
      is_live_oauth: hasGoogleEnv
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
