import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wjitflgomrydkjersqaf.supabase.co";

const supabaseAnonKey =
  "sb_publishable_oP6SL-ndOIchtWhJ-5NeDw_0yyR3j6I";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
