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
        <h2 class="text-h5 font-weight-bold text-center flex-grow-1" style="color: #333;">
          A Quick Note Before You Begin
        </h2>
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
            src="/img/modal2.png" 
            alt="Problem set illustration" 
            style="max-width: 400px; width: 100%; margin: 0 auto;"
          />
        </div>
      </v-card-text>

      <!-- Text Content -->
      <v-card-text class="pa-6 pb-6 text-center">
        <p class="text-body-1 mb-4" style="color: #333; line-height: 1.6;">
          This quiz is an important part of your learning journey. Please answer the questions honestly and on your own—this helps us truly understand how well the lessons worked for you. Remember, it's okay to make mistakes. What matters most is giving it your best effort.
        </p>
        <p class="text-body-1 font-weight-bold mb-4" style="color: #333; line-height: 1.6;">
          Let's keep it real. Let's keep it honest.
        </p>
        <p class="text-body-1" style="color: #333; line-height: 1.6;">
          When you're ready, click Start to begin.
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
          style="text-transform: uppercase;"
        >
          START QUIZ
        </v-btn>
        <v-btn
          @click="skipQuiz"
          variant="outlined"
          size="large"
          block
          class="text-none font-weight-bold"
          style="text-transform: uppercase;"
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
  emit('start-quiz');
  closeModal();
};

const skipQuiz = () => {
  emit('skip-quiz');
  closeModal();
};
</script>

