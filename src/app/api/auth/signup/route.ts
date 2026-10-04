import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && (serviceKey || anonKey)) {
      // Use service role if available to auto-confirm email for immediate login
      if (serviceKey) {
        const adminClient = createClient(url, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        // Create user with email confirmed
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: displayName,
          },
        });

        if (error) {
          // If user already registered, return friendly error or let them sign in
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        // Also upsert profile if profiles table exists
        try {
          if (data.user) {
            await adminClient.from('profiles').upsert({
              id: data.user.id,
              display_name: displayName || email.split('@')[0],
              role: 'user',
            } as any);
          }
        } catch {
          // Ignore if table not created
        }

        return NextResponse.json({ success: true, user: data.user });
      } else {
        // Fallback to anon client
        const client = createClient(url, anonKey!);
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName },
          },
        });
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, user: data.user, session: data.session });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
