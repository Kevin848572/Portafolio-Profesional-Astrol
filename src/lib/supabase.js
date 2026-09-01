import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.PUBLIC_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  (typeof process !== 'undefined' ? process.env?.PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL : '');

const supabaseAnonKey = 
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.PUBLIC_SUPABASE_KEY ||
  import.meta.env.SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_KEY ||
  (typeof process !== 'undefined' ? process.env?.PUBLIC_SUPABASE_ANON_KEY || process.env?.PUBLIC_SUPABASE_KEY || process.env?.SUPABASE_ANON_KEY || process.env?.SUPABASE_KEY : '');

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
