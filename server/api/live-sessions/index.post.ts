/**
 * POST /api/live-sessions
 *
 * Uses the Google Meet REST API (meet.googleapis.com/v2) to create a meeting
 * space, then persists the session in Supabase.
 *
 * Required env vars:
 *   SUPABASE_URL                       - Supabase project URL
 *   SUPABASE_SERVICE_KEY               - Supabase service role key
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL       - service account email
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY - PEM private key (\n as literal backslash-n in .env)
 *
 * Google Cloud setup:
 *   1. Enable the "Google Meet REST API" on your project
 *   2. Create a service account and grant it no special roles (Meet API needs none)
 *   3. Download the JSON key; copy client_email and private_key into .env
 */

import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, description, startTime, endTime, createdBy } = body ?? {};

  if (!title?.trim() || !startTime || !endTime) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: title, startTime, endTime",
    });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!email || !privateKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Google service account credentials are not configured on the server.",
    });
  }

  // Use the Google Meet REST API — no Calendar conference type needed
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/meetings.space.created"],
    clientOptions: { subject: "mails@scribbleworks.tech" },
  });

  const meet = google.meet({ version: "v2", auth });

  let meetLink: string | null = null;
  let meetSpaceId: string | null = null;

  try {
    const space = await meet.spaces.create({
      requestBody: {
        config: {
          accessType: "OPEN",
          entryPointAccess: "ALL",
          moderation: "OFF",
        },
      },
    });
    meetLink = space.data.meetingUri ?? null;
    meetSpaceId = space.data.name ?? null; // e.g. "spaces/abc123"
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: `Google Meet API error: ${err?.message ?? "Unknown error"}`,
    });
  }

  // Persist session in Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  const { data, error } = await supabase
    .from("live_sessions")
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      start_time: startTime,
      end_time: endTime,
      meet_link: meetLink,
      google_event_id: meetSpaceId,
      created_by: createdBy ?? null,
    })
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
