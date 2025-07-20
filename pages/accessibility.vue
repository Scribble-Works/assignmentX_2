<template>
  <main class="min-h-screen flex-1 flex flex-col items-center justify-center">
    <!-- Illustration -->
    <div class="mb-12 max-w-2xl w-full">
      <img
        src="/img/onboarding_disability.png"
        alt="Illustration of diverse people with various disabilities"
        class="w-full h-auto"
      />
    </div>

    <!-- Content Text -->
    <div class="intro-text text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Accessibility Matters (Optional)
      </h1>

      <p class="text-gray-600 leading-relaxed">
        At AssignmentX, we are committed to making math accessible to all
        learners. Letting us know about any disability helps us provide
        appropriate tools, features, or support that enhance your experience.
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
          >Yes, I have a disability.</span
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
          >No, I do not have a disability.</span
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
        <span class="ml-3 text-lg text-gray-800">Prefer not to say.</span>
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

const selectedAccessibility = ref("yes"); // Default to 'yes' as per image

const handleSkip = () => {
  console.log("Skipping accessibility question...");
  // Add skip logic here
};

const handlePrevious = () => {
  console.log("Going to previous step...");
  // Add previous step navigation logic here
};

const handleNext = () => {
  console.log("Selected accessibility option:", selectedAccessibility.value);
  console.log("Going to next step...");
  // Add next step navigation logic here, passing selectedAccessibility.value
};
</script>

<style scoped>

.intro-container {
  width: 100%;
  margin: auto;
}

.intro-text {
  width: 70%;
  margin: auto;
}

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
