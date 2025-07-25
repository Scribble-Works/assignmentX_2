<template>
  <!-- Main Content -->
  <main class="flex-1 flex flex-col items-center justify-center px-6 py-12">
    <!-- Illustration -->
    <div class="mb-12 max-w-xl w-full">
      <img
        src="/img/onboarding_done.png"
        alt="Illustration of a person at a desk with a 'DONE' stamp, signifying completion"
        class="w-full h-auto"
      />
    </div>

    <!-- Content Text -->
    <div class="text-center max-w-2xl mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        You're All Set! Let the Learning Begin!
      </h1>

      <p class="text-gray-600 leading-relaxed">
        Thank you for helping us understand your needs better. We're excited for
        you to explore math in a whole new way with AssignmentX!
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <v-btn
        to="/"
        @click="handleStartLearning"
        size="large"
        class="start-btn flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        elevation="0"
      >
        Start Learning
      </v-btn>

      <v-btn
        to="/"
        @click="handleGoToDashboard"
        size="large"
        class="next-btn flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        elevation="0"
      >
        Go to Dashboard
      </v-btn>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  layout: "onboarding",
});

const handleStartLearning = () => {
  console.log("Starting learning journey...");
  // Add navigation logic to the learning content
};

const handleGoToDashboard = () => {
  console.log("Navigating to dashboard...");
  // Add navigation logic to the user dashboard
};
</script>

<style scoped>
/* Custom styles for v-btn if needed */
.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
}

.start-btn {
  background-color: #4c9f38;
}

.next-btn {
  background-color: #2096f3;
}
</style>
