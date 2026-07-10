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

async function inspectStorage() {
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error('Error listing buckets:', bError);
    return;
  }
  console.log('=== BUCKETS ===');
  buckets.forEach((b: any) => {
    console.log(`- ${b.name} (Public: ${b.public})`);
  });

  for (const bucket of buckets) {
    const { data: files, error: fError } = await supabase.storage.from(bucket.name).list();
    if (fError) {
      console.error(`Error listing files in ${bucket.name}:`, fError);
      continue;
    }
    console.log(`\n=== FILES IN ${bucket.name} ===`);
    files.forEach((f: any) => {
      const publicUrl = supabase.storage.from(bucket.name).getPublicUrl(f.name).data?.publicUrl;
      console.log(`- ${f.name} (Size: ${f.metadata?.size} bytes)`);
      console.log(`  Public URL: ${publicUrl}`);
    });
  }
}

inspectStorage();
