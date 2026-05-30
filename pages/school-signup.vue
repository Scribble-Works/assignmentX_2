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
  <div class="body">
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="elevation-12 rounded-xl pa-6">
            <!-- Header -->
            <div class="text-center mb-6">
              <h1 class="text-h4 font-weight-bold mb-2">School Admin Signup</h1>
              <p class="text-subtitle-1 text-grey">
                Create an account to manage your school's students and track
                their learning progress
              </p>
            </div>

            <!-- Alert -->
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

            <!-- Form -->
            <v-form @submit.prevent="signUp">
              <!-- School Information Section -->
              <div class="mb-6">
                <h3 class="text-h6 font-weight-bold mb-4">
                  <v-icon class="mr-2">mdi-school</v-icon>
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
                ></v-text-field>

                <v-text-field
                  v-model="schoolAddress"
                  label="School Address"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="mb-3"
                  prepend-inner-icon="mdi-map-marker"
                  required
                ></v-text-field>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="district"
                      label="District"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-city"
                      required
                    ></v-text-field>
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
                    ></v-select>
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
                ></v-text-field>
              </div>

              <!-- Admin Information Section -->
              <div class="mb-6">
                <h3 class="text-h6 font-weight-bold mb-4">
                  <v-icon class="mr-2">mdi-account-tie</v-icon>
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
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="adminLastName"
                      label="Last Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                      required
                    ></v-text-field>
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
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  label="Phone Number"
                  :rules="[rules.required, rules.phone]"
                  variant="outlined"
                  class="mb-3"
                  prepend-inner-icon="mdi-phone"
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
                ></v-text-field>
              </div>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                Create School Account
              </v-btn>

              <!-- Login Link -->
              <div class="text-center">
                <p class="text-body-2">
                  Already have a school account?
                  <NuxtLink
                    to="/school-login"
                    class="text-primary font-weight-bold"
                  >
                    Sign in here
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
