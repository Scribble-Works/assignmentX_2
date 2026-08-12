<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Quiz Header -->
      <div
        v-if="
          !loading &&
          questions &&
          Array.isArray(questions) &&
          questions.length > 0
        "
        class="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div class="flex justify-between items-center mb-4">
          <button
            @click="goBackToSubstrand"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
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
              <svg
                v-if="isAudioPlaying"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clip-rule="evenodd"
                />
                <path
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="flex flex-col items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
          ></div>
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
              You got {{ correctAnswers }} out of
              {{ questions.length }} questions correct
            </p>
          </div>

          <!-- Performance Message -->
          <div class="mb-8">
            <p v-if="score >= 80" class="text-green-600 font-semibold text-lg">
              Excellent! You've mastered this problem set.
            </p>
            <p
              v-else-if="score >= 60"
              class="text-yellow-600 font-semibold text-lg"
            >
              Good work! You have a solid understanding.
            </p>
            <p v-else class="text-red-600 font-semibold text-lg">
              Keep practicing! Review the material and try again.
            </p>
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
      <div
        v-else-if="questions.length > 0"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <!-- Question -->
        <div class="mb-8" v-if="currentQuestion">
          <h2
            class="text-xl font-semibold text-gray-800 mb-4 prose-quiz"
            v-html="renderMarkdown(currentQuestion.question)"
            v-math
          ></h2>

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
        <div v-if="currentQuestion" class="space-y-3 mb-6">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(index)"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
            ]"
          >
            <div class="flex items-center">
              <div
                :class="[
                  'w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center',
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300',
                ]"
              >
                <span v-if="selectedAnswer === index" class="text-white text-sm"
                  >✓</span
                >
              </div>
              <span
                class="text-gray-800 prose-quiz"
                v-html="renderMarkdown(option)"
                v-math
              ></span>
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
            v-if="
              questions &&
              Array.isArray(questions) &&
              currentQuestionIndex < questions.length - 1
            "
            @click="nextQuestion"
            :disabled="!isAnswerValid"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              !isAnswerValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700',
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
                : 'bg-green-600 text-white hover:bg-green-700',
            ]"
          >
            Complete Problem Set
          </button>
        </div>
      </div>

      <!-- No Questions Available -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center py-12">
          <p class="text-gray-600 mb-4">
            No problem set questions available for this content.
          </p>
          <button
            @click="goBackToSubstrand"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Topics
          </button>
        </div>
      </div>
    </div>

    <!-- Background Audio -->
    <!-- <audio
      ref="backgroundAudio"
      loop
      preload="auto"
      muted
      style="display: none"
    >
      <source
        src="/audio/Afro-Pop-Summer-Chill_AdobeStock_1614197958_preview.m4a"
        type="audio/mp4"
      />
      Your browser does not support the audio element.
    </audio> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStrapiQuiz, capQuestionsEvenly } from "~/composables/useStrapiQuiz";
import { useQuizProgress } from "~/composables/useQuizProgress";
import { marked } from "marked";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

// Same markdown + LaTeX rendering pattern as components/SubstrandQuiz.vue —
// see that file for why bare LaTeX gets wrapped in "$...$" instead of "\(...\)".
marked.use({ breaks: true, gfm: true });
const wrapBareLatex = (text) =>
  text.replace(/\\[a-zA-Z]+(?:\s*\{[^{}]*\})*/g, (match) => `$${match}$`);
// Trim first: a stray leading tab/4-spaces in the source text (seen in some
// DB rows) reads as a CommonMark indented code block otherwise, rendering
// the whole line in a <pre><code> box instead of plain text.
const renderMarkdown = (text) =>
  text ? marked.parse(wrapBareLatex(text.trim())) : "";

// Some DB rows duplicate the same question text under both quiz_type
// 'pre-quiz' and 'post-quiz' for a given indicator. Normalize prompts so we
// can filter those duplicates out of the post-quiz pool below.
const normalizePrompt = (text) =>
  (text || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

const katexOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
};
const vMath = {
  mounted: (el) => renderMathInElement(el, katexOptions),
  updated: (el) => renderMathInElement(el, katexOptions),
};

const route = useRoute();
const router = useRouter();
const client = useSupabaseClient();
const { fetchProblemSetQuestions, fetchQuizQuestions, fetchAllQuestionsDebug } =
  useStrapiQuiz();
const { saveQuizScore } = useQuizProgress();

const moduleSlug = "preassignment_workbook1";
const TARGET_QUESTION_COUNT = 10;

// The contentId route segment is the substrand's numeric DB id (same entity
// the pre-quiz gate and progress report key off), not a single indicator id —
// the problem set spans every indicator in the substrand, just like the
// pre-quiz does.
const substrandDbId = route.params.contentId;
const strandId = route.params.id;
const substrandRoute = route.params.route;

// Validate required params
if (!substrandDbId || !strandId || !substrandRoute) {
  console.error("Missing required route parameters");
}

const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null); // Selected option index
const answers = ref([]); // Store all answers
const quizCompleted = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
const loading = ref(true);

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

// Post-quiz only ever contains MCQ / True-False rows (filtered at the
// composable query level), so an answer is valid once an option is picked.
const isAnswerValid = computed(() => selectedAnswer.value !== null);

const selectAnswer = (index) => {
  selectedAnswer.value = index;
  answers.value[currentQuestionIndex.value] = { type: "choice", value: index };
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
  selectedAnswer.value =
    savedAnswer && savedAnswer.type === "choice" ? savedAnswer.value : null;
};

const completeQuiz = () => {
  if (!isAnswerValid.value) return;

  // Calculate score — compare the selected option index with the correct one.
  let correct = 0;
  answers.value.forEach((answer, index) => {
    const question = questions.value[index];
    if (!question || !answer) return;
    if (answer.type === "choice" && answer.value === question.correct) {
      correct++;
    }
  });

  correctAnswers.value = correct;
  score.value = Math.round((correct / questions.value.length) * 100);
  quizCompleted.value = true;

  // Save post-quiz score to localStorage, keyed the same way the pre-quiz
  // and progress report key off this substrand.
  saveQuizScore(`${moduleSlug}-substrand-${substrandDbId}`, "post-quiz", {
    score: score.value,
    correctAnswers: correct,
    totalQuestions: questions.value.length,
  });
};

const goBackToSubstrand = () => {
  router.push(
    `/learning-modules/preassignment_workbook1/strand-${strandId}/substrand-${substrandRoute}`,
  );
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = new Array(questions.value.length).fill(null);
  quizCompleted.value = false;
  score.value = 0;
  correctAnswers.value = 0;
  resetCurrentAnswer();
};

// Fetch post-quiz questions for every indicator in this substrand and spread
// TARGET_QUESTION_COUNT evenly across them, mirroring components/SubstrandQuiz.vue.
const loadQuestions = async () => {
  loading.value = true;

  try {
    await fetchAllQuestionsDebug();

    console.log(
      `[Problem Set] 🚀 Starting to load questions for substrand: ${substrandDbId}`,
    );
    console.log(`[Problem Set] 📍 Current route:`, route.path);

    const { data: indRows, error: indErr } = await client
      .from("preassignment_workbook1_substrand_indicators")
      .select("indicators")
      .eq("substrand_ref", substrandDbId);
    if (indErr) console.error("[Problem Set] indicator lookup failed:", indErr);

    const indicatorTexts = (indRows || [])
      .map((r) => (r.indicators != null ? String(r.indicators).trim() : ""))
      .filter((t) => t.length > 0);

    if (indicatorTexts.length === 0) {
      console.error(
        `[Problem Set] ❌ No indicators found for substrand ${substrandDbId}`,
      );
      questions.value = [];
      loading.value = false;
      return;
    }

    // Collect every prompt the pre-quiz could show for these indicators, so
    // the post-quiz never repeats a question the user may have already seen.
    const preQuizPrompts = new Set();
    for (const ind of indicatorTexts) {
      const preQs = await fetchQuizQuestions(ind);
      if (preQs) {
        for (const q of preQs) preQuizPrompts.add(normalizePrompt(q.question));
      }
    }

    const pools = [];
    for (const ind of indicatorTexts) {
      const qs = await fetchProblemSetQuestions(ind);
      if (qs && qs.length) {
        const nonRepeated = qs.filter(
          (q) => !preQuizPrompts.has(normalizePrompt(q.question)),
        );
        pools.push(...nonRepeated.map((q) => ({ ...q })));
      }
    }

    let chosen = [];
    if (pools.length > 0) {
      const byIndicator = new Map();
      for (const q of pools) {
        const k = q.indicators != null ? String(q.indicators).trim() : "";
        if (!byIndicator.has(k)) byIndicator.set(k, []);
        byIndicator.get(k).push(q);
      }
      chosen = capQuestionsEvenly(
        Array.from(byIndicator.values()),
        TARGET_QUESTION_COUNT,
      );
    }

    if (chosen.length > 0) {
      questions.value = chosen;
      console.log(
        `[Problem Set] ✅ Loaded ${chosen.length} problem set questions across ${indicatorTexts.length} indicators`,
      );
    } else {
      console.error(
        `[Problem Set] ❌ No problem set questions found for substrand: ${substrandDbId}`,
      );
      questions.value = [];
    }
  } catch (error) {
    console.error("[Problem Set] ❌ ❌ ❌ UNEXPECTED ERROR ❌ ❌ ❌");
    console.error(
      "[Problem Set] ❌ Unexpected error loading questions:",
      error,
    );
    console.error("[Problem Set] Error stack:", error.stack);
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
      console.log(
        `[Problem Set] ✅ Initialized problem set with ${questions.value.length} questions`,
      );

      // Audio is muted by default - user can toggle it on if they want
    } else {
      console.warn(
        `[Problem Set] ⚠️ No questions available for substrand: ${substrandDbId}`,
      );
    }
  }
};

// Background audio functions (kept for potential future use)
const playBackgroundAudio = async () => {
  if (backgroundAudio.value && process.client) {
    try {
      // Set volume (0.0 to 1.0, adjust as needed)
      backgroundAudio.value.volume = 0.3; // 30% volume - adjust to your preference
      backgroundAudio.value.muted = false; // Unmute before playing

      // Play the audio
      await backgroundAudio.value.play();
      isAudioPlaying.value = true;
      console.log("[Problem Set] 🎵 Background audio started");
    } catch (error) {
      // Some browsers require user interaction before playing audio
      console.warn("[Problem Set] ⚠️ Could not autoplay audio:", error);
      console.warn("[Problem Set] Audio will play after user interaction");
      isAudioPlaying.value = false;
    }
  }
};

const pauseBackgroundAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    backgroundAudio.value.muted = true; // Mute when pausing
    isAudioPlaying.value = false;
    console.log("[Problem Set] 🎵 Background audio paused");
  }
};

const stopBackgroundAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.pause();
    backgroundAudio.value.currentTime = 0;
    backgroundAudio.value.muted = true; // Mute when stopping
    isAudioPlaying.value = false;
    console.log("[Problem Set] 🎵 Background audio stopped");
  }
};

const toggleAudio = async () => {
  if (!backgroundAudio.value) return;

  if (isAudioPlaying.value) {
    // Mute and pause audio
    backgroundAudio.value.muted = true;
    pauseBackgroundAudio();
  } else {
    try {
      // Unmute and play audio
      backgroundAudio.value.muted = false;
      backgroundAudio.value.volume = 0.3; // Set volume to 30%
      await backgroundAudio.value.play();
      isAudioPlaying.value = true;
      console.log("[Problem Set] 🎵 Background audio started");
    } catch (error) {
      console.warn("[Problem Set] ⚠️ Could not play audio:", error);
    }
  }
};

// Check if problem set is already completed on mount
onMounted(() => {
  console.log(
    `[Problem Set] 🚀 Component mounted for substrand: ${substrandDbId}`,
  );
  console.log(`[Problem Set] 📍 Route path:`, route.path);
  console.log(`[Problem Set] 📝 Route params:`, route.params);
  console.log(`[Problem Set] 🔍 Route query:`, route.query);

  loadQuestions();
});

// Clean up audio when component unmounts
onUnmounted(() => {
  stopBackgroundAudio();
});
</script>

<style scoped>
/* Markdown-rendered quiz content (question text + options). Mirrors
   components/SubstrandQuiz.vue so pre-quiz and post-quiz render consistently. */
.prose-quiz :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}
.prose-quiz :deep(p) {
  margin: 0;
}
.prose-quiz :deep(ul),
.prose-quiz :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}
.prose-quiz :deep(strong) {
  font-weight: 600;
}
.prose-quiz :deep(code) {
  background-color: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
</style>