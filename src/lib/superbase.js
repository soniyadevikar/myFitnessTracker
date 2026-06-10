import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseUrl = rawSupabaseUrl
  ?.replace(/\/rest\/v1\/?$/, "")
  .replace(/\/$/, "");

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );