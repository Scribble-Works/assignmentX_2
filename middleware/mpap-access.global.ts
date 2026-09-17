// Gate the /mpap premium section: must be signed in AND hold an active
// MPAP entitlement. Enforcement runs on the client, where the Supabase
// session is reliably available (running during SSR reads a not-yet-hydrated
// user and false-redirects a signed-in user to login). Data itself is
// protected by Supabase RLS regardless.
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/mpap")) return;

  // Skip on the server render pass — the client pass below enforces access.
  if (process.server) return;

  const client = useSupabaseClient();
  // getSession() awaits session restoration, avoiding the hydration race
  // that made useSupabaseUser() momentarily null.
  const {
    data: { session },
  } = await client.auth.getSession();

  // ── DEBUG (remove once resolved) ──────────────────────────────────────────
  console.log("[MPAP guard] path:", to.fullPath);
  console.log("[MPAP guard] session user:", session?.user?.id || "(none)");
  // ──────────────────────────────────────────────────────────────────────────

  if (!session?.user) {
    console.log("[MPAP guard] NO SESSION → redirecting to /login");
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }

  const { check } = useEntitlement("mpap");
  const ok = await check();

  // ── DEBUG (remove once resolved) ──────────────────────────────────────────
  console.log("[MPAP guard] entitlement ok:", ok);
  // ──────────────────────────────────────────────────────────────────────────

  if (!ok) {
    console.log("[MPAP guard] NO ENTITLEMENT → redirecting to /pricing?feature=mpap");
    return navigateTo("/pricing?feature=mpap");
  }

  console.log("[MPAP guard] ACCESS GRANTED → rendering", to.fullPath);
});
