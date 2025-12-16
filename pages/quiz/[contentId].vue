<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Quiz Header -->
      <div v-if="!loading && questions && Array.isArray(questions) && questions.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <button
            @click="goBackToSubstrand"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Topics
          </button>
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

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>

      <!-- Quiz Results -->
      <div v-else-if="quizCompleted" class="bg-white rounded-lg shadow-md p-6">
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

          <!-- Mark as Completed Checkbox -->
          <div class="mb-8 flex items-center justify-center">
            <label class="flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="markAsCompleted"
                @change="handleMarkAsCompleted"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span class="ml-3 text-gray-700 font-medium">
                Mark quiz as completed (won't need to retake)
              </span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              @click="goToContent"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Course Content
            </button>
            
            <div class="flex gap-4">
              <button
                @click="goBackToSubstrand"
                class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Topics
              </button>
              
              <button
                @click="retakeQuiz"
                class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-else-if="questions.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <!-- Question -->
        <div class="mb-8" v-if="currentQuestion">
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
        <div class="space-y-3" v-if="currentQuestion">
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
            v-if="questions && Array.isArray(questions) && currentQuestionIndex < questions.length - 1"
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

      <!-- No Questions Available -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center py-12">
          <p class="text-gray-600 mb-4">No questions available for this content.</p>
            <button
              @click="goToContent"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
            Go to Course Content
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import { useStrapiQuiz } from '~/composables/useStrapiQuiz';
import { getTopicIdFromSubstrand } from '~/composables/useSubstrandTopicMapping';

const route = useRoute();
const router = useRouter();
const { markQuizCompleted, unmarkQuizCompleted, isQuizCompleted, completedQuizzes, saveQuizScore } = useQuizProgress();
const { fetchQuizQuestions } = useStrapiQuiz();

// Note: contentId in route params is actually the substrand_ref_id (since quiz is per substrand)
const substrandRefId = route.params.contentId;
const substrandRoute = route.query.substrand || 'substrand-number-and-numeration-system';
const strandId = route.query.strand || '1';
const lessonContentId = route.query.contentId || null; // The actual lesson contentId for navigation

// Validate substrandRefId exists (dynamic route ensures it exists, but adding safety check)
if (!substrandRefId) {
  console.error('Substrand ID is missing from route params');
}
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const answers = ref([]);
const quizCompleted = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
const loading = ref(true);
const markAsCompleted = ref(false);

// Initialize questions as empty array, will be populated from Strapi or fallback
const questions = ref([]);
const quizTitle = computed(() => `Pre-Course Quiz - Substrand ${substrandRefId}`);

const currentQuestion = computed(() => {
  if (!questions.value || questions.value.length === 0) {
    return null;
  }
  return questions.value[currentQuestionIndex.value] || null;
});

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
    
    // Save pre-quiz score to localStorage
    saveQuizScore(substrandRefId, 'preQuiz', {
      score: score.value,
      correctAnswers: correct,
      totalQuestions: questions.value.length
    });
    
    // Only mark as completed if checkbox is checked (user will check it on results page)
    // Don't auto-mark here, let user decide on results page
  }
};

// Handle checkbox change to mark/unmark quiz as completed
const handleMarkAsCompleted = () => {
  const substrandQuizKey = `substrand-${substrandRefId}`;
  
  if (markAsCompleted.value) {
    // Mark pre-quiz as completed for this substrand (not per lesson)
    markQuizCompleted(substrandQuizKey);
    console.log(`Pre-quiz marked as completed for substrand: ${substrandRefId}`);
  } else {
    // Unmark pre-quiz as completed
    unmarkQuizCompleted(substrandQuizKey);
    console.log(`Pre-quiz unmarked as completed for substrand: ${substrandRefId}`);
  }
  console.log(`Current completed quizzes:`, Array.from(completedQuizzes.value));
};

const goToContent = () => {
  // Navigate to the actual course content page with worked examples and videos
  // Use lessonContentId if available, otherwise use substrandRefId as fallback
  const targetContentId = lessonContentId || substrandRefId;
  router.push(`/learning-modules/preassignment_workbook1/strand-${strandId}/${substrandRoute}/${targetContentId}`);
};

const goBackToSubstrand = () => {
  // Navigate back to the substrand index page
  // The modal will automatically appear when the page loads (handled by sessionStorage)
  router.push(`/learning-modules/preassignment_workbook1/strand-${strandId}/${substrandRoute}`);
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = new Array(questions.value.length).fill(null);
  quizCompleted.value = false;
  score.value = 0;
  correctAnswers.value = 0;
};

// Fetch questions from Strapi or use fallback
// Note: Quiz is per substrand, so we map substrandRefId to Strapi topic ID
const loadQuestions = async () => {
  loading.value = true;
  
  try {
    console.log(`[Quiz] 🚀 Starting to load questions for substrand: ${substrandRefId}`);
    console.log(`[Quiz] 📍 Current route:`, route.path);
    console.log(`[Quiz] 📝 Route params:`, route.params);
    
    // Map substrand ID to Strapi topic ID
    const topicId = getTopicIdFromSubstrand(substrandRefId);
    
    if (!topicId) {
      console.error(`[Quiz] ❌ No topic ID mapping found for substrand ${substrandRefId}`);
      console.error(`[Quiz] Please add mapping in useSubstrandTopicMapping.js`);
      questions.value = [];
      loading.value = false;
      return;
    }
    
    // Try to fetch from Strapi using topic ID
    console.log(`[Quiz] 📡 Fetching questions from Strapi for topic ID: ${topicId}`);
    const strapiQuestions = await fetchQuizQuestions(topicId);
    
    console.log(`[Quiz] 📊 Strapi fetch result:`, {
      isNull: strapiQuestions === null,
      isEmpty: Array.isArray(strapiQuestions) && strapiQuestions.length === 0,
      hasQuestions: strapiQuestions && strapiQuestions.length > 0,
      length: strapiQuestions?.length || 0
    });
    
    if (strapiQuestions && strapiQuestions.length > 0) {
      questions.value = strapiQuestions;
      console.log(`[Quiz] ✅ ✅ ✅ USING STRAPI QUESTIONS ✅ ✅ ✅`);
      console.log(`[Quiz] ✅ Successfully loaded ${strapiQuestions.length} questions from Strapi`);
      console.log(`[Quiz] Questions:`, strapiQuestions);
    } else if (strapiQuestions === null) {
      // Strapi returned null (error occurred)
      console.error(`[Quiz] ❌ ❌ ❌ STRAPI REQUEST FAILED ❌ ❌ ❌`);
      console.error(`[Quiz] ❌ Strapi returned null - check Strapi connection and topic ID`);
      questions.value = [];
    } else {
      // Strapi returned empty array (no questions found)
      console.error(`[Quiz] ❌ ❌ ❌ NO QUESTIONS FOUND IN STRAPI ❌ ❌ ❌`);
      console.error(`[Quiz] ❌ No questions found in Strapi for topic ID: ${topicId}`);
      console.error(`[Quiz] Make sure questions are added to this topic in Strapi`);
      questions.value = [];
    }
  } catch (error) {
    console.error('[Quiz] ❌ ❌ ❌ UNEXPECTED ERROR ❌ ❌ ❌');
    console.error('[Quiz] ❌ Unexpected error loading questions:', error);
    console.error('[Quiz] Error stack:', error.stack);
    questions.value = [];
  } finally {
    loading.value = false;
    // Initialize answers array after questions are loaded
    // Ensure questions.value is always an array
    if (!Array.isArray(questions.value)) {
      questions.value = [];
    }
    if (questions.value.length > 0) {
      answers.value = new Array(questions.value.length).fill(null);
      console.log(`[Quiz] ✅ Initialized quiz with ${questions.value.length} questions`);
    } else {
      console.warn(`[Quiz] ⚠️ No questions available for substrand: ${substrandRefId}`);
    }
  }
};

// Check if quiz is already completed on mount
onMounted(() => {
  loadQuestions();
  // Check if pre-quiz is already marked as completed for this substrand
  const substrandQuizKey = `substrand-${substrandRefId}`;
  const substrandQuizKeyStr = String(substrandRefId);
  markAsCompleted.value = isQuizCompleted(substrandQuizKey) || isQuizCompleted(substrandQuizKeyStr);
});
</script> 