<script setup>
definePageMeta({
  layout: "onboarding",
});

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const client = useSupabaseClient();


const profile = await client.from("profiles")
  .select("*")
  .eq("id", user.value.id)
  .single();

const firstName = profile.data.firstName;


</script>
<template>
  <!-- Main Content -->
  <main class="flex-1 flex flex-col items-center justify-center px-6 py-12">
    <!-- Welcome Illustration -->
    <div class="mb-12 max-w-lg w-full">
      <img
        src="/img/onboarding_welcome.png"
        alt="Welcome illustration showing three people holding a welcome banner with balloons"
        class="w-full"
      />
    </div>

    <!-- Welcome Text -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Welcome to AssignmentX! Let's Personalize Your Learning Journey
      </h1>

      <p class="welcome-text text-gray-600 leading-relaxed">
        Hi {{ firstName }}, now that you're here, a few quick questions will
        help us tailor AssignmentX to your unique learning needs. This helps us
        provide the most relevant content, features, and support just for you.
        It'll only take a moment!
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <v-btn
        to="/role"
        size="large"
        color="green"
        elevation="5"
        class="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Let's Start</v-btn
      >
      <v-btn
        to="/"
        size="large"
        color="blue"
        class="bg-green-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Skip For Now</v-btn
      >
    </div>
  </main>
</template>

<style scoped>
.logo {
  width: 4em;
}

.welcome-text {
  width: 60%;
  margin: auto;
}
</style>
