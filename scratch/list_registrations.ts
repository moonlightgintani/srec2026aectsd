import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: any = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '');
    envVars[key] = value;
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function listRegistrations() {
  const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching registrations:', error);
    return;
  }
  console.log('=== REGISTRATIONS ===');
  data.forEach((r: any) => {
    console.log(`- Author: ${r.author_name}, File: ${r.screenshot_name}`);
  });
}

listRegistrations();
