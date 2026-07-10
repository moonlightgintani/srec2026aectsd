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

async function listImageUrls() {
  const { data, error } = await supabase.from('committee').select('name, image_url').not('image_url', 'is', null).order('id');
  if (error) { console.error('Error:', error); return; }
  const withUrls = data.filter((m: any) => m.image_url && m.image_url.trim() !== '');
  console.log('Members with image_url set:', withUrls.length);
  withUrls.forEach((m: any) => console.log(`  ${m.name}: ${m.image_url}`));
}

listImageUrls();
