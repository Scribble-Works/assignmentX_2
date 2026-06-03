/**
 * GET /api/live-sessions
 *
 * Required env vars:
 *   SUPABASE_URL         - your Supabase project URL
 *   SUPABASE_SERVICE_KEY - Supabase service role key (server-only, never expose to client)
 *
 * Required Supabase table (run once in Supabase SQL editor):
 *
 *   CREATE TABLE live_sessions (
 *     id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
 *     title            TEXT        NOT NULL,
 *     description      TEXT,
 *     start_time       TIMESTAMPTZ NOT NULL,
 *     end_time         TIMESTAMPTZ NOT NULL,
 *     meet_link        TEXT,
 *     google_event_id  TEXT,
 *     created_by       UUID        REFERENCES auth.users(id),
 *     created_at       TIMESTAMPTZ DEFAULT NOW()
 *   );
 *
 *   ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Service role bypasses RLS" ON live_sessions USING (true);
 */

import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (_event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  const { data, error } = await supabase
    .from("live_sessions")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
