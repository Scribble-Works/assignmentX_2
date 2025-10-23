<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Quiz Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ quizTitle }}</h1>
          <div class="text-sm text-gray-600">
            Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-if="!quizCompleted" class="bg-white rounded-lg shadow-md p-6">
        <!-- Question -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            {{ currentQuestion.question }}
          </h2>
          
          <!-- Question Image (if exists) -->
          <div v-if="currentQuestion.image" class="mb-6">
            <img 
              :src="currentQuestion.image" 
              :alt="currentQuestion.question"
              class="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <!-- Answer Options -->
        <div class="space-y-3">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(index)"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedAnswer === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center">
              <div 
                :class="[
                  'w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center',
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                ]"
              >
                <span v-if="selectedAnswer === index" class="text-white text-sm">✓</span>
              </div>
              <span class="text-gray-800">{{ option }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentQuestionIndex < questions.length - 1"
            @click="nextQuestion"
            :disabled="selectedAnswer === null"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Next
          </button>
          <button
            v-else
            @click="completeQuiz"
            :disabled="selectedAnswer === null"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
          >
            Complete Quiz
          </button>
        </div>
      </div>

      <!-- Quiz Results -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center">
          <!-- Result Image -->
          <div class="mb-6">
            <img 
              src="/img/modalImg1.png" 
              alt="Quiz completion" 
              class="w-32 h-32 mx-auto"
            />
          </div>

          <!-- Score Display -->
          <h2 class="text-3xl font-bold text-gray-800 mb-4">
            Quiz Completed!
          </h2>
          
          <div class="mb-6">
            <div class="text-6xl font-bold text-blue-600 mb-2">
              {{ score }}%
            </div>
            <p class="text-gray-600">
              You got {{ correctAnswers }} out of {{ questions.length }} questions correct
            </p>
          </div>

          <!-- Performance Message -->
          <div class="mb-8">
            <p v-if="score >= 80" class="text-green-600 font-semibold text-lg">
              Excellent! You have a strong foundation in this topic.
            </p>
            <p v-else-if="score >= 60" class="text-yellow-600 font-semibold text-lg">
              Good work! You have a decent understanding of this topic.
            </p>
            <p v-else class="text-red-600 font-semibold text-lg">
              Keep learning! Review the material to strengthen your understanding.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              @click="goToContent"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Course Content
            </button>
            
            <button
              @click="retakeQuiz"
              class="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import { getQuestionsForContent } from '~/data/quizQuestions.js';

const route = useRoute();
const router = useRouter();
const { markQuizCompleted } = useQuizProgress();

const contentId = route.params.contentId;
const substrandRoute = route.query.substrand || 'substrand-number-and-numeration-system';
const strandId = route.query.strand || '1';
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const answers = ref([]);
const quizCompleted = ref(false);
const score = ref(0);
const correctAnswers = ref(0);

const questions = ref(getQuestionsForContent(contentId));
const quizTitle = computed(() => `Pre-Course Quiz - Content ${contentId}`);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const selectAnswer = (index) => {
  selectedAnswer.value = index;
  answers.value[currentQuestionIndex.value] = index;
};

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      selectedAnswer.value = answers.value[currentQuestionIndex.value] || null;
    }
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    selectedAnswer.value = answers.value[currentQuestionIndex.value] || null;
  }
};

const completeQuiz = () => {
  if (selectedAnswer.value !== null) {
    // Calculate score
    let correct = 0;
    answers.value.forEach((answer, index) => {
      if (answer === questions.value[index].correct) {
        correct++;
      }
    });
    
    correctAnswers.value = correct;
    score.value = Math.round((correct / questions.value.length) * 100);
    quizCompleted.value = true;
    
    // Mark quiz as completed
    markQuizCompleted(contentId);
  }
};

const goToContent = () => {
  // Navigate to the actual course content page with worked examples and videos
  // Using the correct route structure for preassignment_workbook1
  router.push(`/learning-modules/preassignment_workbook1/strand-${strandId}/${substrandRoute}/${contentId}`);
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = [];
  quizCompleted.value = false;
  score.value = 0;
  correctAnswers.value = 0;
};

onMounted(() => {
  // Initialize answers array
  answers.value = new Array(questions.value.length).fill(null);
});
</script> 