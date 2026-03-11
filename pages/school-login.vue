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
  <div class="body">
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 rounded-xl pa-6">
            <!-- Header -->
            <div class="text-center mb-6">
              <v-icon size="64" color="primary" class="mb-4">mdi-school</v-icon>
              <h1 class="text-h4 font-weight-bold mb-2">School Admin Login</h1>
              <p class="text-subtitle-1 text-grey">
                Access your school's management dashboard
              </p>
            </div>

            <!-- Alert -->
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

            <!-- Form -->
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
              ></v-text-field>

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
              ></v-text-field>

              <div class="text-right mb-4">
                <NuxtLink to="/forget" class="text-primary text-body-2">
                  Forgot password?
                </NuxtLink>
              </div>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <!-- Signup Link -->
              <div class="text-center">
                <p class="text-body-2">
                  Don't have a school account?
                  <NuxtLink
                    to="/school-signup"
                    class="text-primary font-weight-bold"
                  >
                    Register your school
                  </NuxtLink>
                </p>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Regular Login Link -->
              <div class="text-center">
                <p class="text-body-2">
                  Are you a student?
                  <NuxtLink to="/login" class="text-primary font-weight-bold">
                    Student Login
                  </NuxtLink>
                </p>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  background: white;
}
</style>
