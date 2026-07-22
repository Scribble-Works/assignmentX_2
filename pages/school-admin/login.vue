<script setup>
import { useMediaQuery } from "@vueuse/core";

definePageMeta({
  layout: "auth",
});

const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const mobile = useMediaQuery("(max-width: 600px)");
const tablet = useMediaQuery("(min-width: 601px) and (max-width: 1024px)");

const email = ref("");
const password = ref("");
const show = ref(false);
const alert = ref(false);
const text = ref("");
const loading = ref(false);

const rules = {
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 8 || "Min 8 characters",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
};

const login = async () => {
  try {
    loading.value = true;

    const { data, error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      alert.value = true;
      text.value = "Invalid email or password!";
      loading.value = false;
      return;
    }

    if (user.value) {
      // Check if user is a school admin
      const { data: profile } = await client
        .from("profiles")
        .select("*, school_id")
        .eq("id", user.value.id)
        .single();

      if (!profile) {
        alert.value = true;
        text.value = "Profile not found. Please contact support.";
        await auth.signOut();
        loading.value = false;
        return;
      }

      // Verify user has school admin role
      if (profile.role !== "school_admin") {
        alert.value = true;
        text.value =
          "Access denied. This portal is for school administrators only.";
        await auth.signOut();
        loading.value = false;
        return;
      }

      // Redirect to admin dashboard
      router.push("/school-admin/dashboard");
    } else {
      alert.value = true;
      text.value = "Login failed. Please try again.";
      loading.value = false;
    }
  } catch (error) {
    alert.value = true;
    text.value = "An error occurred. Please try again later.";
    console.error(error);
    loading.value = false;
  }
};
</script>

<template>
  <div class="school-auth-shell">
    <div class="school-auth-bg school-auth-bg--one"></div>
    <div class="school-auth-bg school-auth-bg--two"></div>
    <v-container fluid class="school-auth-container fill-height">
      <v-row align="center" justify="center" class="w-100">
        <v-col cols="12" lg="10" xl="9">
          <v-row class="school-auth-grid" align="stretch">
            <v-col cols="12" md="5" class="d-flex">
              <div class="brand-panel w-100">
                <img
                  src="/img/logo.png"
                  alt="AssignmentX logo"
                  class="brand-logo"
                />
                <div class="brand-copy">
                  <p class="brand-kicker">AssignmentX for Schools</p>
                  <h1 class="brand-title">
                    Teacher and school management in one place
                  </h1>
                  <p class="brand-text">
                    Sign in to manage your school classes, teachers, and student
                    enrolment with the same AssignmentX experience.
                  </p>
                </div>

                <div class="feature-list">
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff"
                      >mdi-account-group-outline</v-icon
                    >
                    <span>School class rosters</span>
                  </div>
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff"
                      >mdi-school-outline</v-icon
                    >
                    <span>Teacher assignments</span>
                  </div>
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff">mdi-chart-line</v-icon>
                    <span>Learning progress tracking</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="7" class="d-flex">
              <v-card class="auth-card w-100" elevation="10">
                <div class="text-center mb-6">
                  <v-avatar size="72" class="mb-4 auth-avatar">
                    <v-icon size="36" color="#1b5e20">mdi-login-variant</v-icon>
                  </v-avatar>
                  <h1 class="text-h4 font-weight-bold mb-2">
                    School Admin Login
                  </h1>
                  <p class="text-body-2 text-grey-darken-1">
                    Access your AssignmentX school dashboard
                  </p>
                </div>

                <v-alert
                  v-if="alert"
                  type="error"
                  variant="tonal"
                  closable
                  class="mb-4"
                  @click:close="alert = false"
                >
                  {{ text }}
                </v-alert>

                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    label="Email Address"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                    class="mb-3"
                    prepend-inner-icon="mdi-email"
                    required
                  />

                  <v-text-field
                    v-model="password"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    label="Password"
                    :rules="[rules.required, rules.min]"
                    variant="outlined"
                    class="mb-3"
                    prepend-inner-icon="mdi-lock"
                    @click:append-inner="show = !show"
                    required
                  />

                  <div class="text-right mb-4">
                    <NuxtLink to="/forget" class="auth-link text-body-2">
                      Forgot password?
                    </NuxtLink>
                  </div>

                  <v-btn
                    type="submit"
                    color="green-darken-2"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-4 auth-primary-btn"
                  >
                    Sign In
                  </v-btn>

                  <div class="text-center">
                    <p class="text-body-2 mb-2">
                      Don't have a school account?
                      <NuxtLink
                        to="/school-admin/register"
                        class="auth-link font-weight-bold"
                      >
                        Register your school
                      </NuxtLink>
                    </p>
                    <v-divider class="my-4" />
                    <p class="text-body-2">
                      Are you a student?
                      <NuxtLink to="/login" class="auth-link font-weight-bold">
                        Student Login
                      </NuxtLink>
                    </p>
                  </div>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.school-auth-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top left,
      rgba(76, 159, 56, 0.18),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(33, 150, 243, 0.16),
      transparent 26%
    ),
    linear-gradient(135deg, #f7fbf4 0%, #eef7fd 48%, #ffffff 100%);
}

.school-auth-bg {
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
  opacity: 0.55;
}

.school-auth-bg--one {
  width: 280px;
  height: 280px;
  background: rgba(76, 159, 56, 0.2);
  top: -70px;
  right: -80px;
}

.school-auth-bg--two {
  width: 220px;
  height: 220px;
  background: rgba(32, 150, 243, 0.16);
  bottom: -70px;
  left: -60px;
}

.school-auth-container {
  position: relative;
  z-index: 1;
  padding-top: 48px;
  padding-bottom: 48px;
}

.school-auth-grid {
  gap: 24px;
}

.brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  border-radius: 28px;
  color: white;
  background: linear-gradient(160deg, #1b5e20 0%, #2e7d32 45%, #1565c0 100%);
  box-shadow: 0 24px 70px rgba(11, 59, 24, 0.22);
}

.brand-logo {
  width: 84px;
  height: 84px;
  object-fit: contain;
  margin-bottom: 28px;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.18));
}

.brand-kicker {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

.brand-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  font-weight: 800;
  margin-bottom: 16px;
}

.brand-text {
  max-width: 30rem;
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.94;
}

.feature-list {
  display: grid;
  gap: 12px;
  margin-top: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
}

.auth-card {
  border-radius: 28px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
}

.auth-avatar {
  background: linear-gradient(
    135deg,
    rgba(76, 159, 56, 0.15),
    rgba(33, 150, 243, 0.12)
  );
}

.auth-primary-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 700;
}

.auth-link {
  color: #1b5e20;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
