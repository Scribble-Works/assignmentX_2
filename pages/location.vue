<template>
  <main class="min-h-screen flex-1 flex flex-col items-center justify-center">
    <!-- Illustration -->
    <div class="mb-12 max-w-md w-full">
      <img
        src="/img/onboarding_location.png"
        alt="Illustration of diverse people with various disabilities"
        class="w-full h-auto"
      />
    </div>

    <!-- Content Text -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Where Are You Learning From?
      </h1>

      <p class="intro-text text-gray-600">
        This helps us provide more localized examples, relevant problem-solving
        scenarios, and tailored resources that best fit your environment." (This
        aligns with Scribble Works' goal of localized content and meeting
        learners where they are)
      </p>
    </div>

    <!-- Accessibility Selection Radio Buttons -->
    <div class="flex flex-col items-start space-y-4 mb-12">
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="accessibilityOption"
          value="yes"
          v-model="selectedAccessibility"
          checked
        />
        <span class="ml-3 text-lg text-gray-800"
          >Urban(e.g., Major city or large town)</span
        >
      </label>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="accessibilityOption"
          value="no"
          v-model="selectedAccessibility"
        />
        <span class="ml-3 text-lg text-gray-800"
          >Peri-Urban(e.g., Town or community on the outskirts of a city)</span
        >
      </label>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="accessibilityOption"
          value="prefer_not_to_say"
          v-model="selectedAccessibility"
        />
        <span class="ml-3 text-lg text-gray-800"
          >Rural(e.g. Village or remote area)</span
        >
      </label>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between w-full max-w-3xl px-4">
      <v-btn
        @click="handleSkip"
        size="large"
        class="skip-btn bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        elevation="0"
      >
        Skip
      </v-btn>

      <div class="flex gap-4">
        <v-btn
          to="/"
          @click="handlePrevious"
          size="large"
          class="previous-btn bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          elevation="0"
        >
          Previous
        </v-btn>
        <v-btn
          to="/location"
          @click="handleNext"
          size="large"
          class="next-btn bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          elevation="0"
        >
          Next
        </v-btn>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "onboarding",
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const selectedAccessibility = ref(""); // Default to 'yes' as per image

const handleSkip = () => {
  console.log("Skipping accessibility question...");
  router.push("/");
};

const handlePrevious = () => {
  console.log("Going to previous step...");
  // Add previous step navigation logic here
  router.push('/role');
};

const handleNext = async() => {
  try {
   const {data, error} = await client
     .from("onboarding")
     .update({
       location: selectedAccessibility.value
     })
     .eq('id', user.value.id);
     router.push('/accessibility');
  } catch (error) {
    console.log("Error updating location:", error);
  }
};
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
}

.skip-btn {
  background-color: #3e4f5c;
}

.previous-btn {
  background-color: #2096f3;
}

.next-btn {
  background-color: #4c9f38;
}
</style>
