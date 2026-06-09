/**
 * DELETE /api/live-sessions/:id
 * Removes the session from Supabase.
 * Note: Google Meet spaces cannot be deleted via API; they expire automatically.
 */

import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing session ID" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase.from("live_sessions").delete().eq("id", id);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { success: true };
});
