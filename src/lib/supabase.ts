import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-project-id.supabase.co' &&
  !supabaseUrl.includes('your-supabase-project-id')
);

if (isSupabaseConfigured) {
  console.log('[Supabase Client Initialized]: Project URL:', supabaseUrl);
} else {
  console.warn('[Supabase Client Warning]: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set or using placeholder values.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
