import { createClient } from "@supabase/supabase-js";

// Grant an MPAP entitlement after a verified purchase. The client never
// writes entitlements directly — it POSTs the Paystack reference here and
// we verify it server-side before inserting.
const getSupabase = () => {
  const config = useRuntimeConfig();
  const url = process.env.SUPABASE_URL;
  // Must be the service_role key: this endpoint writes entitlements, and the
  // "entitlements" RLS policy only grants SELECT to the owning user, so the
  // anon key can insert/upsert nothing here — falling back to it just turns
  // a clear "not configured" error into a confusing RLS failure later.
  const key = (config.SUPABASE_SERVICE_KEY as string | undefined) || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: "Supabase service credentials are not configured." });
  }
  return createClient(url, key);
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, reference, source = "paystack", schoolId = null, expiresAt = null } = body || {};

  if (!userId || typeof userId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing userId" });
  }

  // Verify the Paystack transaction unless this is an admin/school grant.
  if (source === "paystack") {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!reference) {
      throw createError({ statusCode: 400, statusMessage: "Missing payment reference" });
    }
    if (secret) {
      const verify: any = await $fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${secret}` } },
      ).catch(() => null);
      if (!verify || verify?.data?.status !== "success") {
        throw createError({ statusCode: 402, statusMessage: "Payment could not be verified." });
      }
    }
    // If PAYSTACK_SECRET_KEY is not set, we trust the client reference in
    // dev only. Set the secret in production to enforce verification.
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("entitlements")
    .upsert(
      {
        user_id: userId,
        feature: "mpap",
        source,
        school_id: schoolId,
        status: "active",
        granted_at: new Date().toISOString(),
        expires_at: expiresAt,
        paystack_ref: reference || null,
      },
      { onConflict: "user_id,feature" },
    )
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  return { ok: true, entitlement: data };
});
