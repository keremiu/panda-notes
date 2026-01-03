import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ebivjqfrvaihkjjqordb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXZqcWZydmFpaGtqanFvcmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MDI4ODcsImV4cCI6MjA4Mjk3ODg4N30.Lf3ewG0q_JoD1Vl-gtAGtqgXW4QptcazsyzeyWuHQxU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbNote = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  completed: boolean;
  created_at: string;
  updated_at: string;
};

