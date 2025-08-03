<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 pb-4">
        <h2 class="text-xl font-bold text-gray-800 text-center flex-1">Quick Check-In Before You Start</h2>
        <button 
          @click="closeModal" 
          class="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Illustration -->
      <div class="px-6 pb-4">
        <div class="text-center">
                      <img 
              src="/img/modalImg1.png" 
              alt="Quiz illustration" 
              class="w-full max-w-xs mx-auto"
            />
        </div>
      </div>

      <!-- Text Content -->
      <div class="px-6 pb-6 text-center">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Let's see what you already know!</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          This short quiz helps us understand your starting point before the lesson begins. 
          Don't worry — it's not for marks. Just try your best. Your results will help guide 
          your learning and show how much progress you make.
        </p>
      </div>

      <!-- Action Button -->
      <div class="px-6 pb-6">
        <button 
          @click="startQuiz"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          START QUIZ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  contentId: {
    type: String,
    default: ''
  },
  substrandRoute: {
    type: String,
    default: 'substrand-number-and-numeration-system'
  },
  strandId: {
    type: String,
    default: '1'
  }
});

const emit = defineEmits(['close', 'start-quiz']);

const closeModal = () => {
  emit('close');
};

const startQuiz = () => {
  // Navigate to the quiz page with substrand information
  // This should be passed from the parent component
  const substrandRoute = props.substrandRoute || 'substrand-number-and-numeration-system';
  const strandId = props.strandId || '1';
  navigateTo(`/quiz/${props.contentId}?substrand=${substrandRoute}&strand=${strandId}`);
};
</script> 