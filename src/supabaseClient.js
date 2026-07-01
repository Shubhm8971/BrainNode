import { createClient } from '@supabase/supabase-js';

// TEMPORARY: Paste your actual keys here directly just to test the connection
const supabaseUrl = https://bnckdvybltzwvcspekos.supabase.co;
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuY2tkdnlibHR6d3Zjc3Bla29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzY0OTgsImV4cCI6MjA5NzUxMjQ5OH0.gKUXFVzTy4Rh21eJjdyuUeDbQkDIHxsxORbNgGKjoG0;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);