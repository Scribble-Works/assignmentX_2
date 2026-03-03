<template>
  <div>
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
          Thank you for helping us understand your needs better. We're excited
          for you to explore math in a whole new way with AssignmentX!
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <v-btn
          @click="handleStartLearning"
          size="large"
          class="start-btn flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          elevation="0"
        >
          Start Learning
        </v-btn>

        <v-btn
          @click="handleGoToDashboard"
          size="large"
          class="next-btn flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          elevation="0"
        >
          Home
        </v-btn>
      </div>
    </main>

    <!-- Welcome Modal -->
    <WelcomeModal
      :show="showWelcomeModal"
      @start-tour="showOnboardingGuide"
      @skip="handleSkipTour"
    />

    <!-- Onboarding Guide -->
    <OnboardingGuide
      :show="showGuide"
      @close="handleGuideClose"
      @complete="handleGuideComplete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOnboardingGuide } from "~/composables/useOnboardingGuide";

definePageMeta({
  layout: "onboarding",
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const { checkGuideStatus, startGuide } = useOnboardingGuide();

const showWelcomeModal = ref(false);
const showGuide = ref(false);

onMounted(() => {
  // Check if this is first time user
  const shouldShowGuide = checkGuideStatus();
  if (shouldShowGuide) {
    // Show welcome modal first
    setTimeout(() => {
      showWelcomeModal.value = true;
    }, 500);
  }
});

const showOnboardingGuide = () => {
  showWelcomeModal.value = false;
  showGuide.value = true;
  startGuide();
};

const handleSkipTour = () => {
  showWelcomeModal.value = false;
};

const handleGuideClose = () => {
  showGuide.value = false;
};

const handleGuideComplete = () => {
  showGuide.value = false;
  // Optional: navigate to learning modules
  router.push("/learning-modules/");
};

const handleStartLearning = () => {
  console.log("Starting learning journey...");
  router.push("/learning-modules/");
};

const handleGoToDashboard = () => {
  console.log("Navigating to dashboard...");
  router.push("/");
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
