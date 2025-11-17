<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="handleDialogUpdate"
    max-width="600"
    persistent
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center pa-6 pb-4">
        <h2 class="text-h6 font-weight-bold text-center flex-grow-1">Quick Check-In Before You Start</h2>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="closeModal"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Illustration -->
      <v-card-text class="pa-6 pb-4">
        <div class="text-center">
          <img 
            src="/img/modalImg1.png" 
            alt="Quiz illustration" 
            style="max-width: 300px; width: 100%; margin: 0 auto;"
          />
        </div>
      </v-card-text>

      <!-- Text Content -->
      <v-card-text class="pa-6 pb-6 text-center">
        <h3 class="text-h6 font-weight-semibold mb-3">Let's see what you already know!</h3>
        <p class="text-body-2" style="color: #666; line-height: 1.6;">
          This short quiz helps us understand your starting point before the lesson begins. 
          Don't worry — it's not for marks. Just try your best. Your results will help guide 
          your learning and show how much progress you make.
        </p>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions class="pa-6 pt-0 d-flex flex-column ga-3">
        <v-btn
          @click="startQuiz"
          color="primary"
          size="large"
          block
          class="text-none font-weight-bold"
        >
          START QUIZ
        </v-btn>
        <v-btn
          @click="skipQuiz"
          variant="outlined"
          size="large"
          block
          class="text-none font-weight-bold"
        >
          SKIP QUIZ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  contentId: {
    type: [String, Number],
    default: null
  },
  substrandRoute: {
    type: String,
    default: 'substrand-number-and-numeration-system'
  },
  strandId: {
    type: [String, Number],
    default: '1'
  }
});

const emit = defineEmits(['close', 'start-quiz', 'skip-quiz']);

const handleDialogUpdate = (value) => {
  if (!value) {
    closeModal();
  }
};

const closeModal = () => {
  emit('close');
};

const startQuiz = () => {
  // Emit the start-quiz event so the parent component can handle navigation
  // This allows the parent to store sessionStorage and handle the navigation properly
  emit('start-quiz', props.contentId);
};

const skipQuiz = () => {
  emit('skip-quiz', props.contentId);
  closeModal();
};
</script> 