import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | Record<string, unknown> = {};

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true },
      global: {
        fetch: (...args) => {
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
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    supabase = {};
  }
} else {
  console.warn(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY, supabase client is a no-op.'
  );
}

export default supabase;
