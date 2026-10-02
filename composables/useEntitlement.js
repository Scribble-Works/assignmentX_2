// Generic premium-access check. UX-only: real enforcement is Supabase RLS
// (see db/mpap_schema.sql). Reuse for any future premium feature.
export function useEntitlement(feature) {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const hasAccess = useState(`entitlement-${feature}`, () => false);
  const checked = useState(`entitlement-${feature}-checked`, () => false);

  const check = async () => {
    // Prefer the reactive user, but fall back to the restored session so the
    // check works even when called from route middleware before hydration.
    let uid = user.value?.id;
    if (!uid) {
      const { data: sess } = await client.auth.getSession();
      uid = sess?.session?.user?.id;
    }
    if (!uid) {
      hasAccess.value = false;
      checked.value = true;
      return false;
    }
    const { data, error } = await client
      .from("entitlements")
      .select("id, expires_at, status")
      .eq("user_id", uid)
      .eq("feature", feature)
      .eq("status", "active")
      .maybeSingle();

    // ── DEBUG (remove once resolved) ────────────────────────────────
    if (error) console.log("[MPAP entitlement] query error:", error.message);
    else console.log("[MPAP entitlement] row:", data || "(no row)");
    // ────────────────────────────────────────────────────────────────
    hasAccess.value =
      !error &&
      !!data &&
      (!data.expires_at || new Date(data.expires_at) > new Date());
    checked.value = true;
    return hasAccess.value;
  };

  return { hasAccess, checked, check };
}
