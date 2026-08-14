// The @nuxtjs/supabase redirect middleware only supports a single global
// login page, but the school-admin dashboard has its own branded login
// (see pages/school-admin/login.vue), so it's gated separately here.
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/school-admin/dashboard")) return;

  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo({
      path: "/school-admin/login",
      query: { redirect: to.fullPath },
    });
  }
});
