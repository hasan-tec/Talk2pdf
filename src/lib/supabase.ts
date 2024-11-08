import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vptmjtrnpznuaxblbssr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdG1qdHJucHpudWF4Ymxic3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTIxMDAsImV4cCI6MjA0NjU2ODEwMH0.yPUKFfAW3j6FP_iXaFHwWlKg0Jk-LKkvHkDGWI38fmM';

export const supabase = createClient(supabaseUrl, supabaseKey);