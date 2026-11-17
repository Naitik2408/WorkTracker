import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/career?auth_error=cancelled', req.url));
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens in personal_ops_items or a secure integrations configuration record
    await supabase.from('personal_ops_items').upsert(
      {
        item_type: 'REFERENCE_NOTE',
        title: 'Google Workspace Integration Credentials',
        status: 'COMPLETED',
        reference_data: {
          has_oauth_token: true,
          expiry_date: tokens.expiry_date,
          connected_at: new Date().toISOString()
        }
      },
      { onConflict: 'title' }
    );

    return NextResponse.redirect(new URL('/career?auth_success=google_connected', req.url));
  } catch (err) {
    console.error('Error exchanging Google OAuth code:', err);
    return NextResponse.redirect(new URL('/career?auth_error=token_exchange_failed', req.url));
  }
}
