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

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllMembers() {
  const { data, error } = await supabase.from('committee').select('*').order('id');
  if (error) { console.error('Error:', error); return; }
  console.log('=== ALL COMMITTEE MEMBERS ===');
  console.log('Total:', data.length);
  const byCategory: any = {};
  data.forEach((m: any) => {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push({ name: m.name, role: m.role });
  });
  for (const [cat, members] of Object.entries(byCategory)) {
    console.log(`\n--- ${cat.toUpperCase()} (${(members as any[]).length}) ---`);
    (members as any[]).forEach(m => console.log(`  [${m.role}] ${m.name}`));
  }
}

listAllMembers();
