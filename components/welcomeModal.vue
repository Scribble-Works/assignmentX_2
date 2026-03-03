<template>
  <v-dialog v-model="isActive" max-width="600" persistent>
    <v-card>
      <v-card-title
        class="bg-gradient-to-r bg-green-500 text-white pa-6 text-center"
      >
        <div class="w-100">
          <v-icon size="60" class="mb-2">mdi-party-popper</v-icon>
          <h2 class="text-h4">Welcome to AssignmentX!</h2>
        </div>
      </v-card-title>

      <v-card-text class="pa-6 text-center">
        <v-img
          src="/img/onboarding_welcome.png"
          alt="Welcome"
          max-height="200"
          contain
          class="mb-4"
        ></v-img>

        <h3 class="text-h5 mb-3 text-green-700">🎉 You're All Set!</h3>

        <p class="text-body-1 mb-4">
          Your account has been successfully created. Before you dive in, would
          you like a quick tour of the platform?
        </p>

        <v-card variant="outlined" class="pa-4 mb-4 text-left">
          <p class="text-subtitle-2 mb-2">
            <strong>The tour will show you:</strong>
          </p>
          <v-list density="compact">
            <v-list-item density="compact">
              <template v-slot:prepend>
                <v-icon size="small" color="green">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >How to navigate learning modules</v-list-item-title
              >
            </v-list-item>
            <v-list-item density="compact">
              <template v-slot:prepend>
                <v-icon size="small" color="green">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Interactive features like quizzes and videos</v-list-item-title
              >
            </v-list-item>
            <v-list-item density="compact">
              <template v-slot:prepend>
                <v-icon size="small" color="green">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Progress tracking and bookmarks</v-list-item-title
              >
            </v-list-item>
            <v-list-item density="compact">
              <template v-slot:prepend>
                <v-icon size="small" color="green">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Tips for getting the most out of AssignmentX</v-list-item-title
              >
            </v-list-item>
          </v-list>
          <v-chip size="small" color="blue" class="mt-2">
            <v-icon start>mdi-clock-outline</v-icon>
            Only 2 minutes
          </v-chip>
        </v-card>

        <v-alert
          color="info"
          variant="tonal"
          density="compact"
          class="text-left"
        >
          <v-icon class="mr-2">mdi-information</v-icon>
          Don't worry, you can access this tour anytime from your profile!
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              @click="handleSkip"
              block
              variant="outlined"
              color="grey"
              size="large"
            >
              Skip Tour
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              @click="handleStartTour"
              block
              color="green"
              size="large"
              prepend-icon="mdi-compass"
            >
              Start Tour
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["start-tour", "skip"]);

const isActive = ref(props.show);

watch(
  () => props.show,
  (newVal) => {
    isActive.value = newVal;
  },
);

const handleStartTour = () => {
  isActive.value = false;
  emit("start-tour");
};

const handleSkip = () => {
  isActive.value = false;
  emit("skip");
};
</script>
