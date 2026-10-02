/**
 * Password-recovery link router.
 *
 * Supabase only honours a `redirectTo` that is present in the project's
 * "Redirect URLs" allowlist (Dashboard → Authentication → URL Configuration).
 * When the requested URL is NOT allowlisted, Supabase silently falls back to the
 * project's Site URL — so a recovery link drops the user on the HOME PAGE with the
 * token still attached (`/#access_token=...&type=recovery`). The user then has no
 * way to set a new password, which is exactly how the reset flow "stopped working".
 *
 * This plugin makes the flow self-healing: wherever a recovery token lands, the
 * user is forwarded to /newpassword with the token preserved.
 *
 * Two detection paths, because the token can arrive in either shape:
 *   1. Implicit flow  -> tokens in the URL hash (#access_token=…&type=recovery)
 *   2. PKCE / OTP     -> ?code=… or ?token_hash=…&type=recovery in the query
 * Plus an onAuthStateChange listener for the case where the Supabase plugin has
 * already consumed and scrubbed the URL before this code runs.
 */
export default defineNuxtPlugin({
  name: "password-recovery-redirect",
  // Run before the Supabase plugin so the raw hash is still readable.
  enforce: "pre",
  setup() {
    if (import.meta.server) return;

    const TARGET = "/newpassword";

    const hashParams = () => {
      const raw = window.location.hash?.replace(/^#/, "") || "";
      return new URLSearchParams(raw);
    };

    const isRecoveryUrl = () => {
      const h = hashParams();
      if (h.get("type") === "recovery" && h.get("access_token")) return true;
      const q = new URLSearchParams(window.location.search);
      if (q.get("type") === "recovery" && (q.get("token_hash") || q.get("token"))) return true;
      // An expired/invalid recovery link reports itself via error params.
      if (h.get("error_code") || h.get("error_description")) {
        return h.get("error_description")?.toLowerCase().includes("link") ?? false;
      }
      return false;
    };

    const alreadyThere = () => window.location.pathname.replace(/\/+$/, "") === TARGET;

    // Path 1+2: token is still in the URL — forward immediately, preserving it.
    if (isRecoveryUrl() && !alreadyThere()) {
      const { search, hash } = window.location;
      window.location.replace(`${TARGET}${search}${hash}`);
      return;
    }

    // Path 3: the Supabase client consumed the URL itself; it emits
    // PASSWORD_RECOVERY once the recovery session is live.
    const nuxtApp = useNuxtApp();
    nuxtApp.hook("app:mounted", () => {
      const client = useSupabaseClient();
      client.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY" && !alreadyThere()) {
          navigateTo(TARGET);
        }
      });
    });
  },
});
