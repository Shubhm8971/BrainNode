import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export const handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) return { statusCode: 400, body: JSON.stringify(error) };
  return { statusCode: 200, body: JSON.stringify(data) };
};