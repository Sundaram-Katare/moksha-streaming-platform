const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase URL:', url);
const sbAdmin = createClient(url, serviceKey);

async function test() {
  try {
    const { data: users, error: uErr } = await sbAdmin.auth.admin.listUsers();
    console.log('Auth users count:', users?.users?.length, 'Error:', uErr ? uErr.message : 'none');
    if (users?.users) {
      users.users.forEach(u => {
        console.log(`User: ${u.email} | id: ${u.id} | confirmed: ${Boolean(u.email_confirmed_at)} | role: ${u.app_metadata?.role || u.user_metadata?.role || 'default'}`);
      });
    }

    const { data: profiles, error: pErr } = await sbAdmin.from('profiles').select('*');
    if (pErr) {
      console.log('Profiles table ERROR:', pErr.message);
    } else {
      console.log('Profiles table count:', profiles.length);
      profiles.forEach(p => console.log('Profile:', p.id, p.display_name, 'role:', p.role));
    }

    const { data: songs, error: sErr } = await sbAdmin.from('songs').select('*');
    if (sErr) {
      console.log('Songs table ERROR:', sErr.message);
    } else {
      console.log('Songs table count:', songs.length);
    }
  } catch (e) {
    console.error('Fatal test error:', e.message);
  }
}

test();
