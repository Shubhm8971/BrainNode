import { createClient } from '@supabase/supabase-js';

// TEMPORARY: Paste your actual keys here directly just to test the connection
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);