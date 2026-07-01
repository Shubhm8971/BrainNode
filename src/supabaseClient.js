import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// ADD THESE LOGS:
console.log("Supabase URL is:", SUPABASE_URL);
console.log("Supabase Key is:", SUPABASE_ANON_KEY);

if (!SUPABASE_URL || SUPABASE_URL === "undefined") {
  console.error("ALERT: The URL is not being loaded correctly.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);