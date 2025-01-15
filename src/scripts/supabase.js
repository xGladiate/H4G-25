import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const supabaseUrl = 'https://qasxxxbzycxzpkumdzin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhc3h4eGJ6eWN4enBrdW1kemluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MTY3MzMsImV4cCI6MjA1MjQ5MjczM30.VgkZnNYydHSNkCA7PYN-ZXxqGlp7pjhrrBDVEUNLSEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;