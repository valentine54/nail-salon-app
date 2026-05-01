// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxoplunosdgexyagmvkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4b3BsdW5vc2RnZXh5YWdtdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTg0MzgsImV4cCI6MjA5MjczNDQzOH0.X_B9KHXpkgaPWqzZm1cYmeVlUE56Zfn3Cx5uYhh_VH4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);