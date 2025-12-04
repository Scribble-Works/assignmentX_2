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
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600">
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </div>
            <!-- Audio Control Button -->
            <button
              @click="toggleAudio"
              class="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
              :title="isAudioPlaying ? 'Mute audio' : 'Unmute audio'"
            >
              <svg v-if="isAudioPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
              </svg>
            </button>
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
          <p class="text-gray-600">Loading problem set questions...</p>
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
            Problem Set Completed!
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
              Excellent! You've mastered this problem set.
            </p>
            <p v-else-if="score >= 60" class="text-yellow-600 font-semibold text-lg">
              Good work! You have a solid understanding.
            </p>
            <p v-else class="text-red-600 font-semibold text-lg">
              Keep practicing! Review the material and try again.
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
                Mark problem set as completed
              </span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              @click="goBackToSubstrand"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Topics
            </button>
            
            <button
              @click="retakeQuiz"
              class="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Retake Problem Set
            </button>
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

        <!-- Multiple Choice / True-False Answer Options -->
        <div v-if="currentQuestion && isMultipleChoiceQuestion" class="space-y-3 mb-6">
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

        <!-- Fill in the Blank - Single Input -->
        <div v-else-if="currentQuestion && currentQuestion.questionType === 'Fill in the blank'" class="mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter your answer:
            </label>
            <input
              type="text"
              v-model="manualAnswer"
              @input="updateManualAnswer"
              placeholder="Type your answer here..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-lg"
            />
          </div>
        </div>

        <!-- Multiple Blanks - Multiple Inputs -->
        <div v-else-if="currentQuestion && currentQuestion.questionType === 'Multiple blanks'" class="mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Fill in all the blanks:
            </label>
            <div class="space-y-3">
              <div v-for="(blank, index) in blankCount" :key="index" class="flex items-center gap-3">
                <span class="text-gray-600 font-medium min-w-[80px]">Blank {{ index + 1 }}:</span>
                <input
                  type="text"
                  v-model="multipleAnswers[index]"
                  @input="updateMultipleAnswers"
                  :placeholder="`Answer for blank ${index + 1}`"
                  class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                />
              </div>
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
            :disabled="!isAnswerValid"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              !isAnswerValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Next
          </button>
          <button
            v-else
            @click="completeQuiz"
            :disabled="!isAnswerValid"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              !isAnswerValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
          >
            Complete Problem Set
          </button>
        </div>
      </div>

      <!-- No Questions Available -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center py-12">
          <p class="text-gray-600 mb-4">No problem set questions available for this content.</p>
          <div class="text-sm text-gray-500 mb-4">
            <p>Debug Info:</p>
            <p>Loading: {{ loading }}</p>
            <p>Questions length: {{ questions.length }}</p>
            <p>Substrand ID: {{ substrandRefId }}</p>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <button
              @click="debugFetchAllProblemSetQuestions"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔍 Debug: Fetch All Problem Set Questions
            </button>
            <button
              @click="goBackToSubstrand"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Background Audio -->
    <audio
      ref="backgroundAudio"
      loop
      preload="auto"
      style="display: none;"
    >
      <source src="/audio/Afro-Pop-Summer-Chill_AdobeStock_1614197958_preview.m4a" type="audio/mp4">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import { useStrapiQuiz } from '~/composables/useStrapiQuiz';
import { getTopicIdFromSubstrand } from '~/composables/useSubstrandTopicMapping';

const route = useRoute();
const router = useRouter();
const { markQuizCompleted, unmarkQuizCompleted, isQuizCompleted, completedQuizzes } = useQuizProgress();
const { fetchProblemSetQuestions } = useStrapiQuiz();

// Note: contentId in route params is the substrand_ref_id
const substrandRefId = route.params.contentId;
const substrandRoute = route.query.substrand || 'substrand-number-and-numeration-system';
const strandId = route.query.strand || '1';

// Validate substrandRefId exists
if (!substrandRefId) {
  console.error('Substrand ID is missing from route params');
}

const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null); // For multiple choice
const manualAnswer = ref(''); // For fill in the blank (single)
const multipleAnswers = ref([]); // For multiple blanks
const answers = ref([]); // Store all answers
const quizCompleted = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
const loading = ref(true);
const markAsCompleted = ref(false);

// Initialize questions as empty array
const questions = ref([]);

// Background audio ref
const backgroundAudio = ref(null);
const isAudioPlaying = ref(false);

const currentQuestion = computed(() => {
  if (!questions.value || questions.value.length === 0) {
    return null;
  }
  return questions.value[currentQuestionIndex.value] || null;
});

// Check if question is multiple choice type (MCQ or True/False)
const isMultipleChoiceQuestion = computed(() => {
  if (!currentQuestion.value) return false;
  const type = currentQuestion.value.questionType;
  return !type || type === 'MCQ' || type === 'True/False' || type === 'multiple-choice';
});

// Count number of blanks for multiple blanks questions
const blankCount = computed(() => {
  if (!currentQuestion.value || currentQuestion.value.questionType !== 'Multiple blanks') {
    return 0;
  }
  // Count underscores in the question or use correctAnswer format (comma-separated)
  const correctAnswer = currentQuestion.value.correctAnswer || '';
  if (correctAnswer.includes(',')) {
    return correctAnswer.split(',').length;
  }
  // Count underscores in the prompt
  const prompt = currentQuestion.value.question || '';
  const underscoreCount = (prompt.match(/_/g) || []).length;
  return Math.max(underscoreCount, 2); // At least 2 blanks for multiple blanks
});

// Check if current answer is valid
const isAnswerValid = computed(() => {
  if (!currentQuestion.value) return false;
  
  const questionType = currentQuestion.value.questionType || 'MCQ';
  
  // MCQ or True/False - need selected answer
  if (questionType === 'MCQ' || questionType === 'True/False' || questionType === 'multiple-choice') {
    return selectedAnswer.value !== null;
  }
  
  // Fill in the blank - need text input
  if (questionType === 'Fill in the blank') {
    return manualAnswer.value.trim() !== '';
  }
  
  // Multiple blanks - all blanks must be filled
  if (questionType === 'Multiple blanks') {
    return multipleAnswers.value.length >= blankCount.value && 
           multipleAnswers.value.slice(0, blankCount.value).every(a => a && a.trim() !== '');
  }
  
  return false;
});

const selectAnswer = (index) => {
  selectedAnswer.value = index;
  answers.value[currentQuestionIndex.value] = { type: 'choice', value: index };
};

const updateManualAnswer = () => {
  // Store the manual answer for fill in the blank
  answers.value[currentQuestionIndex.value] = { type: 'text', value: manualAnswer.value.trim() };
};

const updateMultipleAnswers = () => {
  // Store all answers for multiple blanks
  answers.value[currentQuestionIndex.value] = { 
    type: 'multiple', 
    value: [...multipleAnswers.value].map(a => (a || '').trim())
  };
};

const nextQuestion = () => {
  if (isAnswerValid.value) {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      resetCurrentAnswer();
    }
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    resetCurrentAnswer();
  }
};

const resetCurrentAnswer = () => {
  const savedAnswer = answers.value[currentQuestionIndex.value];
  const question = questions.value[currentQuestionIndex.value];
  
  // Reset all input types first
  selectedAnswer.value = null;
  manualAnswer.value = '';
  multipleAnswers.value = [];
  
  if (question) {
    const questionType = question.questionType || 'MCQ';
    
    if (questionType === 'MCQ' || questionType === 'True/False' || questionType === 'multiple-choice') {
      if (savedAnswer && savedAnswer.type === 'choice') {
        selectedAnswer.value = savedAnswer.value;
      }
    } else if (questionType === 'Fill in the blank') {
      if (savedAnswer && savedAnswer.type === 'text') {
        manualAnswer.value = savedAnswer.value || '';
      }
    } else if (questionType === 'Multiple blanks') {
      if (savedAnswer && savedAnswer.type === 'multiple') {
        multipleAnswers.value = savedAnswer.value || [];
      } else {
        // Initialize with empty strings for each blank
        multipleAnswers.value = new Array(blankCount.value).fill('');
      }
    }
  }
};

const completeQuiz = () => {
  if (!isAnswerValid.value) return;
  
  // Calculate score
  let correct = 0;
  answers.value.forEach((answer, index) => {
    const question = questions.value[index];
    if (!question || !answer) return;
    
    const questionType = question.questionType || 'MCQ';
    
    // MCQ or True/False - compare selected index with correct index
    if (questionType === 'MCQ' || questionType === 'True/False' || questionType === 'multiple-choice') {
      if (answer.type === 'choice' && answer.value === question.correct) {
        correct++;
      }
    }
    // Fill in the blank - compare text with correctAnswer field
    else if (questionType === 'Fill in the blank') {
      const correctAnswer = question.correctAnswer || '';
      if (answer.type === 'text' && answer.value) {
        // Case-insensitive comparison, trim whitespace
        if (answer.value.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
          correct++;
        }
      }
    }
    // Multiple blanks - compare each blank answer
    else if (questionType === 'Multiple blanks') {
      const correctAnswers = (question.correctAnswer || '').split(',').map(a => a.trim().toLowerCase());
      if (answer.type === 'multiple' && answer.value) {
        const userAnswers = answer.value.map(a => (a || '').toLowerCase().trim());
        // Check if all answers match
        const allCorrect = correctAnswers.every((ca, i) => userAnswers[i] === ca);
        if (allCorrect) {
          correct++;
        }
      }
    }
  });
  
  correctAnswers.value = correct;
  score.value = Math.round((correct / questions.value.length) * 100);
  quizCompleted.value = true;
};

// Handle checkbox change to mark/unmark problem set as completed
const handleMarkAsCompleted = () => {
  const problemSetKey = `problem-set-${substrandRefId}`;
  
  if (markAsCompleted.value) {
    markQuizCompleted(problemSetKey);
    console.log(`Problem set marked as completed for substrand: ${substrandRefId}`);
  } else {
    unmarkQuizCompleted(problemSetKey);
    console.log(`Problem set unmarked as completed for substrand: ${substrandRefId}`);
  }
  console.log(`Current completed quizzes:`, Array.from(completedQuizzes.value));
};

const goBackToSubstrand = () => {
  router.push(`/learning-modules/preassignment_workbook1/strand-${strandId}/${substrandRoute}`);
};

// Debug function to fetch all problem set questions
const debugFetchAllProblemSetQuestions = async () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.STRAPI_URL || 'http://localhost:1337';
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 DEBUG: FETCHING ALL PROBLEM SET QUESTIONS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 CONFIGURATION:');
  console.log('  - Strapi URL:', strapiUrl);
  console.log('  - Endpoint: /api/problem-set-questions');
  console.log('');
  
  try {
    console.log('⏳ Calling:', `${strapiUrl}/api/problem-set-questions`);
    const startTime = Date.now();
    
    const response = await $fetch(`${strapiUrl}/api/problem-set-questions`, {
      params: {
        'populate': '*'
      },
      timeout: 10000
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ FETCH COMPLETED in', duration, 'ms');
    console.log('');
    console.log('📊 RAW RESPONSE:');
    console.log(JSON.stringify(response, null, 2));
    console.log('');
    
    if (response?.data) {
      console.log('📦 DATA FOUND:');
      console.log('  - Is Array:', Array.isArray(response.data));
      console.log('  - Length:', response.data?.length || 0);
      
      if (response.data.length > 0) {
        console.log('');
        console.log('  - First raw item:');
        console.log(JSON.stringify(response.data[0], null, 2));
        console.log('');
        
        // Transform like the composable does
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🔄 TRANSFORMING QUESTIONS (like composable)');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        
        const transformedQuestions = response.data.map(item => {
          const questionData = item;
          
          // Build options array
          const options = [
            questionData.option1,
            questionData.option2,
            questionData.option3,
            questionData.option4
          ].filter(opt => opt !== null && opt !== undefined && opt !== '');
          
          // Convert correctOption enum to index
          const correctOptionMap = {
            'one': 0,
            'two': 1,
            'three': 2,
            'four': 3
          };
          const correctIndex = correctOptionMap[questionData.correctOption] ?? 0;
          
          // Get questionType
          const questionType = questionData.questionType || 'multiple-choice';
          
          return {
            question: questionData.prompt || questionData.question || '',
            options: options,
            correct: correctIndex,
            questionType: questionType,
            explanation: questionData.explanation || null
          };
        });
        
        console.log('✅ TRANSFORMED QUESTIONS:');
        console.log('  - Count:', transformedQuestions.length);
        console.log('');
        console.log('  - First transformed question:');
        console.log(JSON.stringify(transformedQuestions[0], null, 2));
        console.log('');
        console.log('  - ALL TRANSFORMED QUESTIONS:');
        console.log(JSON.stringify(transformedQuestions, null, 2));
        
        // Also try using the composable function
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🔍 TESTING fetchProblemSetQuestions() COMPOSABLE');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        
        // Get topic ID for testing
        const topicId = getTopicIdFromSubstrand(substrandRefId);
        console.log('  - Substrand ID:', substrandRefId);
        console.log('  - Mapped Topic ID:', topicId);
        console.log('');
        
        if (topicId) {
          console.log('⏳ Calling fetchProblemSetQuestions() with topic ID:', topicId);
          const composableResult = await fetchProblemSetQuestions(topicId);
          console.log('');
          console.log('📊 COMPOSABLE RESULT:');
          console.log('  - Is Null:', composableResult === null);
          console.log('  - Is Array:', Array.isArray(composableResult));
          console.log('  - Length:', composableResult?.length || 0);
          console.log('');
          if (composableResult && composableResult.length > 0) {
            console.log('  - First question:', JSON.stringify(composableResult[0], null, 2));
          }
        } else {
          console.log('⚠️ No topic ID mapping found');
        }
      } else {
        console.log('⚠️ Data array is empty');
      }
    } else {
      console.log('⚠️ No data property in response');
      console.log('Full response structure:', Object.keys(response || {}));
    }
  } catch (error) {
    console.log('');
    console.log('❌ FETCH FAILED');
    console.log('');
    console.log('📊 ERROR DETAILS:');
    console.error('  - Error:', error);
    console.error('  - Message:', error.message);
    if (error.statusCode) {
      console.error('  - Status Code:', error.statusCode);
    }
    if (error.data) {
      console.error('  - Error Data:', error.data);
    }
    if (error.response) {
      console.error('  - Response:', error.response);
    }
  }
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🏁 DEBUG FETCH - END');
  console.log('═══════════════════════════════════════════════════════════');
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  manualAnswer.value = '';
  multipleAnswers.value = [];
  answers.value = new Array(questions.value.length).fill(null);
  quizCompleted.value = false;
  score.value = 0;
  correctAnswers.value = 0;
  resetCurrentAnswer();
};

// Fetch problem set questions from Strapi
const loadQuestions = async () => {
  loading.value = true;
  
  try {
    console.log(`[Problem Set] 🚀 Starting to load questions for substrand: ${substrandRefId}`);
    console.log(`[Problem Set] 📍 Current route:`, route.path);
    
    // Map substrand ID to Strapi topic ID
    const topicId = getTopicIdFromSubstrand(substrandRefId);
    
    if (!topicId) {
      console.error(`[Problem Set] ❌ No topic ID mapping found for substrand ${substrandRefId}`);
      console.error(`[Problem Set] Please add mapping in useSubstrandTopicMapping.js`);
      questions.value = [];
      loading.value = false;
      return;
    }
    
    // Fetch problem set questions from Strapi
    console.log(`[Problem Set] 📡 Fetching problem set questions from Strapi for topic ID: ${topicId}`);
    const strapiQuestions = await fetchProblemSetQuestions(topicId);
    
    console.log(`[Problem Set] 📊 Strapi fetch result:`, {
      isNull: strapiQuestions === null,
      isEmpty: Array.isArray(strapiQuestions) && strapiQuestions.length === 0,
      hasQuestions: strapiQuestions && strapiQuestions.length > 0,
      length: strapiQuestions?.length || 0
    });
    
    if (strapiQuestions && strapiQuestions.length > 0) {
      questions.value = strapiQuestions;
      console.log(`[Problem Set] ✅ Successfully loaded ${strapiQuestions.length} problem set questions from Strapi`);
      console.log(`[Problem Set] Questions:`, questions.value);
    } else if (strapiQuestions === null) {
      // Strapi returned null (error occurred)
      console.error(`[Problem Set] ❌ ❌ ❌ STRAPI REQUEST FAILED ❌ ❌ ❌`);
      console.error(`[Problem Set] ❌ Strapi returned null - check Strapi connection and topic ID`);
      questions.value = [];
    } else {
      // Strapi returned empty array (no questions found)
      console.error(`[Problem Set] ❌ ❌ ❌ NO QUESTIONS FOUND IN STRAPI ❌ ❌ ❌`);
      console.error(`[Problem Set] ❌ No questions found in Strapi for topic ID: ${topicId}`);
      console.error(`[Problem Set] Make sure questions are added to this topic in Strapi`);
      questions.value = [];
    }
  } catch (error) {
    console.error('[Problem Set] ❌ ❌ ❌ UNEXPECTED ERROR ❌ ❌ ❌');
    console.error('[Problem Set] ❌ Unexpected error loading questions:', error);
    console.error('[Problem Set] Error stack:', error.stack);
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
      // Reset current answer after questions are loaded
      resetCurrentAnswer();
      console.log(`[Problem Set] ✅ Initialized problem set with ${questions.value.length} questions`);
      
      // Start playing background audio when questions are loaded
      playBackgroundAudio();
    } else {
      console.warn(`[Problem Set] ⚠️ No questions available for substrand: ${substrandRefId}`);
    }
  }
};

// Background audio functions
const playBackgroundAudio = async () => {
  if (backgroundAudio.value && process.client) {
    try {
      // Set volume (0.0 to 1.0, adjust as needed)
      backgroundAudio.value.volume = 0.3; // 30% volume - adjust to your preference
      
      // Play the audio
      await backgroundAudio.value.play();
      isAudioPlaying.value = true;
      console.log('[Problem Set] 🎵 Background audio started');
    } catch (error) {
      // Some browsers require user interaction before playing audio
      console.warn('[Problem Set] ⚠️ Could not autoplay audio:', error);
      console.warn('[Problem Set] Audio will play after user interaction');
      isAudioPlaying.value = false;
    }
  }
};

const pauseBackgroundAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    isAudioPlaying.value = false;
    console.log('[Problem Set] 🎵 Background audio paused');
  }
};

const stopBackgroundAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    backgroundAudio.value.currentTime = 0;
    isAudioPlaying.value = false;
    console.log('[Problem Set] 🎵 Background audio stopped');
  }
};

const toggleAudio = async () => {
  if (!backgroundAudio.value) return;
  
  if (isAudioPlaying.value) {
    pauseBackgroundAudio();
  } else {
    try {
      await backgroundAudio.value.play();
      isAudioPlaying.value = true;
      console.log('[Problem Set] 🎵 Background audio resumed');
    } catch (error) {
      console.warn('[Problem Set] ⚠️ Could not play audio:', error);
    }
  }
};

// Check if problem set is already completed on mount
onMounted(() => {
  console.log(`[Problem Set] 🚀 Component mounted for substrand: ${substrandRefId}`);
  console.log(`[Problem Set] 📍 Route path:`, route.path);
  console.log(`[Problem Set] 📝 Route params:`, route.params);
  console.log(`[Problem Set] 🔍 Route query:`, route.query);
  
  loadQuestions();
  const problemSetKey = `problem-set-${substrandRefId}`;
  markAsCompleted.value = isQuizCompleted(problemSetKey);
});

// Clean up audio when component unmounts
onUnmounted(() => {
  stopBackgroundAudio();
});
</script>

