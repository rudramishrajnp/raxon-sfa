import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://jrenwqacdknuckdjqeiy.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZW53cWFjZGtudWNrZGpxZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDk3NDIsImV4cCI6MjEwMjcyNTc0Mn0.WqRVfal0btBabXHGvqrzNefyKI35zpjgphXwbHZqKhQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
