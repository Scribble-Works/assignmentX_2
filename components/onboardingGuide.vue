<template>
  <v-dialog v-model="isActive" max-width="900" persistent scrollable>
    <v-card>
      <!-- Header -->
      <v-card-title
        class="bg-green-500 text-white d-flex justify-space-between align-center pa-4"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="white">mdi-compass</v-icon>
          <span class="text-h5">Welcome to AssignmentX!</span>
        </div>
        <v-btn icon @click="handleSkip" variant="text" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Progress indicator -->
      <v-progress-linear
        :model-value="((step + 1) / totalSteps) * 100"
        color="green"
        height="6"
      ></v-progress-linear>

      <!-- Content -->
      <v-card-text class="pa-6" style="min-height: 400px">
        <!-- Step 0: Welcome -->
        <div v-if="step === 0" class="text-center">
          <v-img
            src="/img/onboarding_welcome.png"
            alt="Welcome"
            max-height="250"
            contain
            class="mb-4"
          ></v-img>
          <h2 class="text-h4 mb-4 text-green-700">Let's Get You Started!</h2>
          <p class="text-body-1 mb-4">
            We're excited to have you here. This quick tour will show you how to
            make the most of AssignmentX.
          </p>
          <p class="text-body-1">
            <v-icon color="green" class="mr-2">mdi-clock-outline</v-icon>
            Takes about 2 minutes
          </p>
        </div>

        <!-- Step 1: Learning Modules -->
        <div v-if="step === 1">
          <v-img
            src="/img/understand.png"
            alt="Learning Modules"
            max-height="200"
            contain
            class="mb-4"
          ></v-img>
          <h2 class="text-h4 mb-4 text-green-700">
            <v-icon color="green" class="mr-2">mdi-book-open-variant</v-icon>
            Learning Modules
          </h2>
          <p class="text-body-1 mb-3">
            Your main learning hub! Here you'll find:
          </p>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="blue">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>
                <strong>Workbooks:</strong> Choose from Grade 4, 5, or 6 aligned
                with the Ghanaian curriculum
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="blue">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>
                <strong>Strands:</strong> Major topics like Numbers, Algebra,
                and Geometry
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="blue">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>
                <strong>Substrands:</strong> Specific lessons with examples and
                explanations
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Step 2: Interactive Features -->
        <div v-if="step === 2">
          <div class="d-flex justify-center mb-4">
            <v-icon size="120" color="orange">mdi-puzzle</v-icon>
          </div>
          <h2 class="text-h4 mb-4 text-green-700">
            <v-icon color="green" class="mr-2">mdi-lightbulb</v-icon>
            Interactive Learning Features
          </h2>
          <p class="text-body-1 mb-3">Make learning fun and engaging with:</p>
          <v-row>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="purple" class="mr-2">mdi-help-circle</v-icon>
                  <strong>Quizzes</strong>
                </div>
                <p class="text-body-2">
                  Test your knowledge after each lesson to reinforce learning
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="red" class="mr-2">mdi-cards</v-icon>
                  <strong>Flip Cards</strong>
                </div>
                <p class="text-body-2">
                  Practice concepts with interactive flashcards
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="blue" class="mr-2">mdi-video</v-icon>
                  <strong>Videos</strong>
                </div>
                <p class="text-body-2">
                  Watch explanatory videos with real-world examples
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="green" class="mr-2">mdi-notebook</v-icon>
                  <strong>Concept Notes</strong>
                </div>
                <p class="text-body-2">
                  Detailed explanations to understand the "why" behind math
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Step 3: Progress & Bookmarks -->
        <div v-if="step === 3">
          <div class="d-flex justify-center mb-4">
            <v-icon size="120" color="green">mdi-chart-line</v-icon>
          </div>
          <h2 class="text-h4 mb-4 text-green-700">
            <v-icon color="green" class="mr-2">mdi-bookmark</v-icon>
            Track Your Progress
          </h2>
          <v-alert color="blue" variant="tonal" class="mb-4">
            <v-icon class="mr-2">mdi-information</v-icon>
            Keep track of your learning journey
          </v-alert>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="orange">
                  <v-icon>mdi-bookmark-multiple</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="mb-1"
                ><strong>Bookmarks</strong></v-list-item-title
              >
              <v-list-item-subtitle>
                Save your favorite lessons and resources for quick access later.
                Click the bookmark icon on any page to save it.
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-3"></v-divider>

            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="green">
                  <v-icon>mdi-chart-box</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="mb-1"
                ><strong>Progress Tracking</strong></v-list-item-title
              >
              <v-list-item-subtitle>
                See which quizzes you've completed and monitor your learning
                progress through each strand and substrand.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <!-- Step 4: Facilitator Resources -->
        <div v-if="step === 4">
          <v-img
            src="/img/strug.png"
            alt="Teaching Resources"
            max-height="200"
            contain
            class="mb-4"
          ></v-img>
          <h2 class="text-h4 mb-4 text-green-700">
            <v-icon color="green" class="mr-2">mdi-account-group</v-icon>
            For Educators & Parents
          </h2>
          <p class="text-body-1 mb-3">
            If you're a teacher or parent, explore our
            <strong>Facilitator Resources</strong>:
          </p>
          <v-card variant="outlined" class="pa-4">
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-file-document">
                Teaching guides and lesson plans
              </v-list-item>
              <v-list-item prepend-icon="mdi-clipboard-text">
                Worksheets and printable materials
              </v-list-item>
              <v-list-item prepend-icon="mdi-lightbulb-on">
                Tips for making math engaging
              </v-list-item>
              <v-list-item prepend-icon="mdi-video-box">
                Instructional videos and resources
              </v-list-item>
            </v-list>
          </v-card>
          <v-alert color="info" variant="tonal" class="mt-4">
            <v-icon class="mr-2">mdi-navigation</v-icon>
            Find these in the navigation menu under "Facilitator Resources"
          </v-alert>
        </div>

        <!-- Step 5: Navigation Tips -->
        <div v-if="step === 5">
          <div class="d-flex justify-center mb-4">
            <v-icon size="120" color="blue">mdi-map</v-icon>
          </div>
          <h2 class="text-h4 mb-4 text-green-700">
            <v-icon color="green" class="mr-2">mdi-navigation</v-icon>
            Quick Navigation Tips
          </h2>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 mb-3" color="blue-lighten-5">
                <v-icon size="40" color="blue" class="mb-2">mdi-menu</v-icon>
                <h3 class="text-h6 mb-2">Header Menu</h3>
                <p class="text-body-2">
                  Access all main sections: Learning Modules, Store, Resources,
                  Bookmarks, and your Profile
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4 mb-3" color="green-lighten-5">
                <v-icon size="40" color="green" class="mb-2"
                  >mdi-magnify</v-icon
                >
                <h3 class="text-h6 mb-2">Search Function</h3>
                <p class="text-body-2">
                  Quickly find specific topics, lessons, or resources using the
                  search bar
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4" color="orange-lighten-5">
                <v-icon size="40" color="orange" class="mb-2">mdi-home</v-icon>
                <h3 class="text-h6 mb-2">Breadcrumbs</h3>
                <p class="text-body-2">
                  Use the breadcrumb trail to navigate back through sections
                  easily
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4" color="purple-lighten-5">
                <v-icon size="40" color="purple" class="mb-2"
                  >mdi-help-circle</v-icon
                >
                <h3 class="text-h6 mb-2">Help & Support</h3>
                <p class="text-body-2">
                  Need help? Check the footer for support links and FAQs
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Step 6: Get Started -->
        <div v-if="step === 6" class="text-center">
          <div class="d-flex justify-center mb-4">
            <v-icon size="120" color="green">mdi-check-circle</v-icon>
          </div>
          <h2 class="text-h3 mb-4 text-green-700">You're All Set!</h2>
          <p class="text-h6 mb-4">Ready to start your math learning journey?</p>
          <v-card variant="outlined" class="pa-4 mb-4 mx-auto" max-width="500">
            <h3 class="text-h6 mb-3">Here's what to do next:</h3>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <span class="text-h5 mr-3">1️⃣</span>
                </template>
                <v-list-item-title>Choose your grade level</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <span class="text-h5 mr-3">2️⃣</span>
                </template>
                <v-list-item-title>Pick a strand to explore</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <span class="text-h5 mr-3">3️⃣</span>
                </template>
                <v-list-item-title
                  >Start learning and take quizzes!</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card>
          <v-alert
            color="success"
            variant="tonal"
            class="mx-auto"
            max-width="500"
          >
            <v-icon class="mr-2">mdi-information</v-icon>
            You can replay this guide anytime from your profile settings
          </v-alert>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <div class="d-flex justify-space-between align-center w-100">
          <v-btn
            v-if="step > 0"
            @click="handlePrevious"
            variant="outlined"
            color="grey"
            prepend-icon="mdi-arrow-left"
          >
            Previous
          </v-btn>
          <v-spacer v-else></v-spacer>

          <div class="text-center flex-grow-1">
            <span class="text-subtitle-2"
              >Step {{ step + 1 }} of {{ totalSteps }}</span
            >
            <div class="d-flex justify-center mt-2">
              <v-icon
                v-for="i in totalSteps"
                :key="i"
                :color="i - 1 <= step ? 'green' : 'grey-lighten-2'"
                class="mx-1"
                size="small"
              >
                {{
                  i - 1 === step
                    ? "mdi-circle"
                    : i - 1 < step
                      ? "mdi-check-circle"
                      : "mdi-circle-outline"
                }}
              </v-icon>
            </div>
          </div>

          <v-btn
            v-if="step < totalSteps - 1"
            @click="handleNext"
            color="green"
            append-icon="mdi-arrow-right"
          >
            Next
          </v-btn>
          <v-btn
            v-else
            @click="handleComplete"
            color="green"
            append-icon="mdi-check"
          >
            Get Started!
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useOnboardingGuide } from "~/composables/useOnboardingGuide";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "complete"]);

const { currentStep, nextStep, previousStep, skipGuide, completeGuide } =
  useOnboardingGuide();

const isActive = ref(props.show);
const step = ref(0);
const totalSteps = 7; // 0 to 6

watch(
  () => props.show,
  (newVal) => {
    isActive.value = newVal;
    if (newVal) {
      step.value = 0;
    }
  },
);

const handleNext = () => {
  if (step.value < totalSteps - 1) {
    step.value++;
    nextStep();
  }
};

const handlePrevious = () => {
  if (step.value > 0) {
    step.value--;
    previousStep();
  }
};

const handleSkip = () => {
  isActive.value = false;
  skipGuide();
  emit("close");
};

const handleComplete = () => {
  isActive.value = false;
  completeGuide();
  emit("complete");
};
</script>

<style scoped>
.v-card-text {
  overflow-y: auto;
}
</style>
