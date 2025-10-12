import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://minswminvxbyyebosefo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbnN3bWludnhieXllYm9zZWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjgwMjcsImV4cCI6MjA3NTgwNDAyN30.HqcecU5SnGxArS0aomVbR7swQ_QJ7VMSY_0dGlRVIKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);