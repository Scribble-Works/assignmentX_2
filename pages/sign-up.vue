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
const confPassword = ref("");
const alert = ref(false);
const text = ref("");
const menu = ref(false);

// Bio fields
const fName = ref("");
const lName = ref("");
const school = ref("");
const dob = ref(new Date().toISOString().substring(0, 10));
const gender = ref("");
const phone = ref("");

const show = ref(false);
const show2 = ref(false);
const rules = {
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 8 || "Min 8 characters",
  emailMatch: () => `The email and password you entered don't match`,
};

const checkUserExists = async (emailToCheck) => {
  try {
    // Try to sign in with a dummy password
    const { error } = await auth.signInWithPassword({
      email: emailToCheck,
      password: "dummy_crheck_12345!@#$%",
    });

    // If we get specific errors, it means the user exists
    if (
      error?.message.includes("Invalid login credentials") ||
      error?.message.includes("Email not confirmed")
    ) {
      return true; // User exists
    }

    return false; // User doesn't exist
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};

const signUp = async () => {
  try {
    if (password.value !== confPassword.value) {
      alert.value = true;
      text.value = "Passwords do not match";
      return;
    }

    // Check if user already exists
    // const userExists = await checkUserExists(email.value);
    // if (userExists) {
    //   alert.value = true;
    //   text.value =
    //     "This email is already registered. Please try logging in instead.";
    //   setTimeout(() => {
    //     router.push("/login");
    //   }, 2000);
    //   return;
    // }

    const { data: signUpData, error } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          email: email.value,
          firstName: fName.value,
          lastName: lName.value,
          school: school.value,
          dob: dob.value,
          gender: gender.value,
          phone: phone.value,
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
          router.push("/login");
        }, 2000);
      } else {
        text.value =
          error.message || "An error occurred. Please try again later.";
      }
      console.error(error);
    } else {
      // Also insert into profiles table
      if (signUpData?.user?.id) {
        // Check if profile already exists
        const { data: existingProfile } = await client
          .from("profiles")
          .select("id")
          .eq("id", signUpData.user.id)
          .single();

        // Only insert if profile doesn't exist
        if (!existingProfile) {
          const { error: profileError } = await client
            .from("profiles")
            .insert({
              firstName: fName.value,
              lastName: lName.value,
              school: school.value,
              DOB: dob.value,
              gender: gender.value,
              phone: phone.value,
              email: email.value,
              id: signUpData.user.id,
            })
            .single();

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        }
      }

      text.value =
        "Sign up successful! Please check your email for confirmation.";
      router.push("/complete-signup");
    }
  } catch (error) {
    // alert('An error occurred. Please try again later.');
    alert.value = true;
    text.value = "An error occurred. Please try again later.";
    console.error(error);
  }
};

const googleSignUP = async () => {
  try {
    const { data, error } = await auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/bio",
      },
    });
    if (error) {
      // alert('An error occurred while signing up with Google.');
      alert.value = true;
      text.value = "An error occurred while signing up with Google.";
      console.error(error);
    }
  } catch (error) {
    // alert('An error occurred. Please try again later.');
    alert.value = true;
    text.value = "An error occurred. Please try again later.";
    console.error(error);
  }
};
// const appleSignUP = async () => {
//     try {
//         const { data, error } = await auth.signInWithOAuth({
//             provider: 'apple',
//             options: {
//                 redirectTo: window.location.origin + '/auth'
//             }
//         });
//         if (error) {
//             alert.value = true;
//             text.value = 'An error occurred while signing up with Apple.';
//             console.error(error);
//         }
//     } catch (error) {
//         alert.value = true;
//         text.value = 'An error occurred. Please try again later.';
//         console.error(error);
//     }
// };

const closeAlert = () => {
  alert.value = false;
  if (
    text.value ===
    "Sign up successful! Please check your email for confirmation."
  ) {
    router.push("/bio");
  }
};
</script>
<template>
  <div
    class="d-flex flex-column fill-height justify-center align-center min-h-screen"
  >
    <v-row class="mt-n1">
      <v-col
        :class="
          mobile || tablet ? 'd-flex justify-center align-center mt-10' : ''
        "
        cols=""
        lg="6"
        sm="12"
        md="12"
      >
        <v-container
          class="w-auto"
          role="presentation"
          :style="mobile || tablet ? 'max-width: 100%;' : ''"
        >
          <h1
            class="text-h2"
            style="
              font-family: &quot;Inter&quot;, sans-serif;
              font-weight: bold;
            "
          >
            Get Started Now
          </h1>
          <!-- <p style="font-family: 'Inter', sans-serif;">Enter your credentials to access your account</p> -->
          <form class="mt-10" @submit.prevent="signUp">
            <v-row>
              <v-col cols="12" md="6">
                <v-label>First Name</v-label><br /><br />
                <v-text-field
                  v-model="fName"
                  placeholder="Enter your first name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Last Name</v-label><br /><br />
                <v-text-field
                  v-model="lName"
                  placeholder="Enter your last name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-label>Email Address</v-label><br /><br />
                <v-text-field
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Gender</v-label><br /><br />
                <v-select
                  v-model="gender"
                  :items="['Male', 'Female']"
                  placeholder="Select your gender"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-label>Password</v-label><br /><br />
                <v-text-field
                  v-model="password"
                  :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="show = !show"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  placeholder="Enter your password"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Confirm Password</v-label><br /><br />
                <v-text-field
                  v-model="confPassword"
                  :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="show2 = !show2"
                  :rules="[rules.required, rules.min]"
                  :type="show2 ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-label>Date of Birth</v-label><br /><br />
                <v-menu v-model="menu" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="dob"
                      placeholder="Select your date of birth"
                      readonly
                      v-bind="props"
                      variant="outlined"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dob"
                    @update:model-value="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <v-label>School</v-label><br /><br />
                <v-text-field
                  v-model="school"
                  placeholder="Enter your school name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-label>Phone Number</v-label><br /><br />
                <v-text-field
                  v-model="phone"
                  placeholder="Enter your phone number"
                  variant="outlined"
                ></v-text-field
                ><br />
              </v-col>
            </v-row>
            <v-btn style="width: 100%" type="submit" color="grey-darken-3"
              >Signup</v-btn
            >
          </form>
          <br />
          <v-spacer></v-spacer>
          <v-row align="center">
            <v-col>
              <v-divider :thickness="6" color="#3E4F5C"></v-divider>
            </v-col>
            <v-col class="text-center">
              <span>Or</span>
            </v-col>
            <v-col>
              <v-divider :thickness="6" color="#3E4F5C"></v-divider>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="" lg="12" md="12" sm="12">
              <v-btn
                style="width: 100%"
                @click="googleSignUP"
                variant="outlined"
                ><img
                  src="/icon/google.svg"
                  style="height: 2em"
                  class="mr-3"
                  alt=""
                />
                Signup with Google</v-btn
              >
            </v-col>
            <!-- <v-col cols="" lg="6" md="6" sm="12">
                            <v-btn style="width: 100%;" @click="appleSignUP"
                                variant="outlined"><v-icon>mdi-apple</v-icon> Signup with Apple</v-btn>
                        </v-col> --> </v-row
          ><br />
          <p class="text-center">
            Have an account?
            <NuxtLink
              style="color: #2096f3; text-decoration: underline"
              to="/login"
              >Sign In</NuxtLink
            >
          </p>
        </v-container>
      </v-col>
      <v-col class="mt-15" cols="" lg="6" sm="12" md="12">
        <img
          v-if="!mobile && !tablet"
          src="/img/signup.png"
          height="100"
          alt="Signup"
        />
      </v-col>
    </v-row>
    <!-- <v-btn @click="checkUser">User</v-btn> -->

    <v-dialog v-model="alert" max-width="400">
      <v-card>
        <v-card-title class="headline">Sign Up</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeAlert()">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
