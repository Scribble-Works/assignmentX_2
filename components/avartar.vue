<script setup>
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const router = useRouter();

const profile = await client
  .from("profiles")
  .select("fullName, school, DOB")
  .eq("id", user.value.id)
  .single();
const signout = async () => {
  try {
    const { error } = await auth.signOut();
    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
  } catch (error) {
    alert("An error occurred. Please try again later.");
    console.error(error);
  }
};
</script>
<template>
  <div>
    <v-menu min-width="250px">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          <v-icon style="font-size: 2em">mdi-account-circle</v-icon>
          <div v-if="profile.data == null">
            <h3>Fill Bio Data</h3>
          </div>
          <div v-else>
            <span class="ml-2"
              >{{ profile.data.fullName }} <v-icon>mdi-menu-down</v-icon></span
            >
          </div>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avartar>
              <v-icon style="font-size: 3em">mdi-account-circle</v-icon>
            </v-avartar>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded>
              <NuxtLink
                to="/edit-profile"
                class="text-sm text-blue-600 hover:text-blue-800 transition"
              >
                Edit Account
              </NuxtLink>
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn @click="signout" variant="text" rounded> Sign Out </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
