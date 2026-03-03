import { ref, computed } from 'vue';

export const useOnboardingGuide = () => {
  const isGuideActive = ref(false);
  const currentStep = ref(0);
  const hasCompletedGuide = ref(false);
  
  // Check if user has completed the guide before
  const checkGuideStatus = () => {
    if (process.client) {
      const completed = localStorage.getItem('onboarding_guide_completed');
      const skipped = localStorage.getItem('onboarding_guide_skipped');
      hasCompletedGuide.value = completed === 'true' || skipped === 'true';
      return !hasCompletedGuide.value;
    }
    return false;
  };

  // Start the guide
  const startGuide = () => {
    isGuideActive.value = true;
    currentStep.value = 0;
  };

  // Go to next step
  const nextStep = () => {
    currentStep.value++;
  };

  // Go to previous step
  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  // Skip the guide
  const skipGuide = () => {
    isGuideActive.value = false;
    if (process.client) {
      localStorage.setItem('onboarding_guide_skipped', 'true');
    }
    hasCompletedGuide.value = true;
  };

  // Complete the guide
  const completeGuide = () => {
    isGuideActive.value = false;
    if (process.client) {
      localStorage.setItem('onboarding_guide_completed', 'true');
    }
    hasCompletedGuide.value = true;
  };

  // Reset the guide (for testing or if user wants to see it again)
  const resetGuide = () => {
    if (process.client) {
      localStorage.removeItem('onboarding_guide_completed');
      localStorage.removeItem('onboarding_guide_skipped');
    }
    hasCompletedGuide.value = false;
    currentStep.value = 0;
  };

  // Check if it's user's first visit
  const isFirstVisit = computed(() => {
    return !hasCompletedGuide.value;
  });

  return {
    isGuideActive,
    currentStep,
    hasCompletedGuide,
    isFirstVisit,
    checkGuideStatus,
    startGuide,
    nextStep,
    previousStep,
    skipGuide,
    completeGuide,
    resetGuide
  };
};
