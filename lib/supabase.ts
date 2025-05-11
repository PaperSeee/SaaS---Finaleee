import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire application
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      // Add performance headers to all fetch requests
      const [url, options] = args;
      const headers = {
        ...options?.headers,
        'Cache-Control': 'no-cache',
        'x-client-info': 'supabase-js',
      };
      return fetch(url, { ...options, headers });
    },
  },
});

export default supabase;
