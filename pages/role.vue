<template>
  <!-- Main Content -->
  <main class="flex-1 flex flex-col items-center justify-center px-6 py-12">
    <!-- Illustration -->
    <div class="mb-12 max-w-2xl w-full">
      <img
        src="/img/onboarding_students.png"
        alt="Illustration of four diverse students in a school setting"
        class="w-full h-auto"
      />
    </div>

    <!-- Content Text -->
    <div class="intro-container text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        What's your role?
      </h1>

      <p class="intro-text text-gray-600 leading-relaxed">
        Hi [User's First Name], now that you're here, a few quick questions will
        help us tailor AssignmentX to your unique learning needs. This helps us
        provide the most relevant content, features, and support just for you.
        It'll only take a moment!
      </p>
    </div>

    <!-- Role Selection Radio Buttons -->
    <div class="flex flex-col items-start space-y-4 mb-12">
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="userRole"
          value="student"
          v-model="selectedRole"
          checked
        />
        <span class="ml-3 text-lg text-gray-800">Student</span>
      </label>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="userRole"
          value="educator"
          v-model="selectedRole"
        />
        <span class="ml-3 text-lg text-gray-800">Educator</span>
      </label>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="radio"
          class="form-radio h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
          name="userRole"
          value="parent_guardian"
          v-model="selectedRole"
        />
        <span class="ml-3 text-lg text-gray-800">Parent / Guardian</span>
      </label>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between w-full max-w-3xl px-4">
      <v-btn
        to="/"
        @click="handleSkip"
        size="large"
        class="skip-btn bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        elevation="0"
      >
        Skip
      </v-btn>

      <div class="flex gap-4">
        <v-btn
          @click="handlePrevious"
          size="large"
          class="previous-btn bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          elevation="0"
        >
          Previous
        </v-btn>
        <v-btn
          to="/accessibility"
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
definePageMeta({
  layout: "onboarding",
});
import { ref } from "vue";

const selectedRole = ref("student"); // Default to 'student' as per image

const handleSkip = () => {
  console.log("Skipping role selection...");
  // Add skip logic here
};

const handlePrevious = () => {
  console.log("Going to previous step...");
  // Add previous step navigation logic here
};

const handleNext = () => {
  console.log("Selected role:", selectedRole.value);
  console.log("Going to next step...");
  // Add next step navigation logic here, passing selectedRole.value
};
</script>

<style scoped>
/* Custom styles for v-btn if needed */
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
