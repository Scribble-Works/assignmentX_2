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

// Form fields
const email = ref("");
const password = ref("");
const confPassword = ref("");
const schoolName = ref("");
const adminFirstName = ref("");
const adminLastName = ref("");
const phone = ref("");
const schoolAddress = ref("");
const numberOfStudents = ref("");
const schoolType = ref("");
const district = ref("");

// UI state
const alert = ref(false);
const text = ref("");
const loading = ref(false);
const show = ref(false);
const show2 = ref(false);

const schoolTypes = [
  "Public School",
  "Private School",
  "Charter School",
  "International School",
  "Other",
];

const rules = {
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 8 || "Min 8 characters",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  phone: (v) => /^[0-9]{10,}$/.test(v) || "Phone number must be valid",
};

const signUp = async () => {
  try {
    loading.value = true;

    if (password.value !== confPassword.value) {
      alert.value = true;
      text.value = "Passwords do not match";
      loading.value = false;
      return;
    }

    // Create school admin account
    const { data: signUpData, error } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          email: email.value,
          role: "school_admin",
          firstName: adminFirstName.value,
          lastName: adminLastName.value,
          schoolName: schoolName.value,
        },
      },
    });

    if (error) {
      alert.value = true;
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists")
      ) {
        text.value =
          "This email is already registered. Please try logging in instead.";
        setTimeout(() => {
          router.push("/school-login");
        }, 2000);
      } else {
        text.value =
          error.message || "An error occurred. Please try again later.";
      }
      console.error(error);
      loading.value = false;
      return;
    }

    if (signUpData?.user?.id) {
      // Create school profile
      const { data: schoolData, error: schoolError } = await client
        .from("schools")
        .insert({
          name: schoolName.value,
          admin_id: signUpData.user.id,
          address: schoolAddress.value,
          district: district.value,
          school_type: schoolType.value,
          estimated_students: parseInt(numberOfStudents.value),
          contact_email: email.value,
          contact_phone: phone.value,
        })
        .select()
        .single();

      if (schoolError) {
        console.error("School creation error:", schoolError);
        alert.value = true;
        text.value = "Error creating school profile. Please contact support.";
        loading.value = false;
        return;
      }

      // Create admin profile
      const { error: profileError } = await client.from("profiles").insert({
        id: signUpData.user.id,
        firstName: adminFirstName.value,
        lastName: adminLastName.value,
        email: email.value,
        phone: phone.value,
        role: "school_admin",
        school_id: schoolData.id,
        school: schoolName.value,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      alert.value = true;
      text.value =
        "School account created successfully! Please check your email for confirmation.";

      setTimeout(() => {
        router.push("/school-admin/dashboard");
      }, 2000);
    }

    loading.value = false;
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
        <v-col cols="12" lg="11" xl="10">
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
                  <h1 class="brand-title">Create your school workspace</h1>
                  <p class="brand-text">
                    Set up your school on AssignmentX and connect teachers and
                    students to the right classes.
                  </p>
                </div>

                <div class="feature-list">
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff"
                      >mdi-account-tie-outline</v-icon
                    >
                    <span>School admin control</span>
                  </div>
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff"
                      >mdi-account-multiple-outline</v-icon
                    >
                    <span>Teacher & student management</span>
                  </div>
                  <div class="feature-item">
                    <v-icon size="18" color="#ffffff"
                      >mdi-book-open-page-variant-outline</v-icon
                    >
                    <span>Class progress and learning access</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="7" class="d-flex">
              <v-card class="auth-card w-100" elevation="10">
                <div class="text-center mb-6">
                  <v-avatar size="72" class="mb-4 auth-avatar">
                    <v-icon size="36" color="#1b5e20"
                      >mdi-school-outline</v-icon
                    >
                  </v-avatar>
                  <h1 class="text-h4 font-weight-bold mb-2">
                    School Admin Signup
                  </h1>
                  <p class="text-body-2 text-grey-darken-1">
                    Create an account to manage your school's teachers and
                    students
                  </p>
                </div>

                <v-alert
                  v-if="alert"
                  type="info"
                  variant="tonal"
                  closable
                  class="mb-4"
                  @click:close="alert = false"
                >
                  {{ text }}
                </v-alert>

                <v-form @submit.prevent="signUp">
                  <div class="mb-6">
                    <h3
                      class="text-h6 font-weight-bold mb-4 d-flex align-center"
                    >
                      <v-icon class="mr-2" color="#1b5e20">mdi-school</v-icon>
                      School Information
                    </h3>

                    <v-text-field
                      v-model="schoolName"
                      label="School Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      class="mb-3"
                      prepend-inner-icon="mdi-school"
                      required
                    />

                    <v-text-field
                      v-model="schoolAddress"
                      label="School Address"
                      :rules="[rules.required]"
                      variant="outlined"
                      class="mb-3"
                      prepend-inner-icon="mdi-map-marker"
                      required
                    />

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="district"
                          label="District"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-city"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="schoolType"
                          :items="schoolTypes"
                          label="School Type"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-format-list-bulleted"
                          required
                        />
                      </v-col>
                    </v-row>

                    <v-text-field
                      v-model="numberOfStudents"
                      label="Estimated Number of Students"
                      type="number"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account-group"
                      required
                    />
                  </div>

                  <div class="mb-6">
                    <h3
                      class="text-h6 font-weight-bold mb-4 d-flex align-center"
                    >
                      <v-icon class="mr-2" color="#1b5e20"
                        >mdi-account-tie</v-icon
                      >
                      Administrator Information
                    </h3>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="adminFirstName"
                          label="First Name"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="adminLastName"
                          label="Last Name"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          required
                        />
                      </v-col>
                    </v-row>

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
                      v-model="phone"
                      label="Phone Number"
                      :rules="[rules.required, rules.phone]"
                      variant="outlined"
                      class="mb-3"
                      prepend-inner-icon="mdi-phone"
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

                    <v-text-field
                      v-model="confPassword"
                      :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      label="Confirm Password"
                      :rules="[rules.required, rules.min]"
                      variant="outlined"
                      prepend-inner-icon="mdi-lock-check"
                      @click:append-inner="show2 = !show2"
                      required
                    />
                  </div>

                  <v-btn
                    type="submit"
                    color="green-darken-2"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-4 auth-primary-btn"
                  >
                    Create School Account
                  </v-btn>

                  <div class="text-center">
                    <p class="text-body-2 mb-2">
                      Already have a school account?
                      <NuxtLink
                        to="/school-admin/login"
                        class="auth-link font-weight-bold"
                      >
                        Sign in here
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
  background: rgba(33, 150, 243, 0.16);
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
