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
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
          ></div>
          <p class="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>

      <!-- Quiz Results -->
      <div v-else-if="quizCompleted" class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center">
          <div class="mb-6">
            <img
              src="/img/modalImg1.png"
              alt="Quiz completion"
              class="w-32 h-32 mx-auto"
            />
          </div>

          <h2 class="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>

          <div class="mb-6 flex items-center justify-center gap-6">
            <div>
              <div class="text-6xl font-bold text-blue-600 mb-2">
                {{ score }}%
              </div>
              <p class="text-gray-600">
                You got {{ correctAnswers }} out of
                {{ questions.length }} questions correct
              </p>
            </div>

            <div class="flex items-center">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="markAsCompleted"
                  @change="handleMarkAsCompleted"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span class="ml-3 text-gray-700 font-medium text-sm">
                  Mark as completed
                </span>
              </label>
            </div>
          </div>

          <div class="mb-8">
            <p v-if="score >= 80" class="text-green-600 font-semibold text-lg">
              Excellent! You have a strong foundation in this topic.
            </p>
            <p
              v-else-if="score >= 60"
              class="text-yellow-600 font-semibold text-lg"
            >
              Good work! You have a decent understanding of this topic.
            </p>
            <p v-else class="text-red-600 font-semibold text-lg">
              Keep learning! Review the material to strengthen your
              understanding.
            </p>
          </div>

          <div class="space-y-4">
            <button
              @click="goToContent"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Course Content
            </button>

            <button
              @click="goBackToSubstrand"
              class="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div
        v-else-if="questions.length > 0"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="mb-8" v-if="currentQuestion">
          <h2
            class="text-xl font-semibold text-gray-800 mb-4 prose-quiz"
            v-html="renderMarkdown(currentQuestion.question)"
            v-math
          ></h2>

          <div v-if="currentQuestion.image" class="mb-6">
            <img
              :src="currentQuestion.image"
              :alt="currentQuestion.question"
              class="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div class="space-y-3" v-if="currentQuestion">
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
            :disabled="selectedAnswer === null"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700',
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
                : 'bg-green-600 text-white hover:bg-green-700',
            ]"
          >
            Complete Quiz
          </button>
        </div>
      </div>

      <!-- No Questions Available -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center py-12">
          <p class="text-gray-600 mb-4">
            No questions available for this content.
          </p>
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
import { ref, computed, onMounted } from "vue";
import { useQuizProgress } from "~/composables/useQuizProgress";
import { useStrapiQuiz } from "~/composables/useStrapiQuiz";
import { marked } from "marked";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

// Render quiz text (questions + options) as markdown so embedded images,
// bold/italic, lists, etc. display correctly. Mirrors the pattern already used
// in pages/facilitator-resources/ai-assistant/index.vue.
marked.use({ breaks: true, gfm: true });
const renderMarkdown = (text) => (text ? marked.parse(text) : "");

// KaTeX auto-render: scans the element's innerHTML (set via v-html above) and
// typesets $...$, $$...$$, \(...\), \[...\] math delimiters. Runs on mount and
// every update so it re-typesets when the current question changes.
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

// Props injected by each module's thin quiz-page wrapper. Kept as props (no
// top-level await in this component) so it can render nested inside a page
// that performs its own async data loading.
const props = defineProps({
  // Route segment for the module, e.g. "assignment_workbook1"
  moduleSlug: { type: String, required: true },
  // Supabase table holding this module's indicators (column: indicators)
  indicatorsTable: { type: String, required: true },
  // Supabase table mapping substrand route -> id (column: id, route)
  substrandsTable: { type: String, required: true },
  strandId: { type: [String, Number], required: true },
  substrandRoute: { type: [String, Number], required: true },
  // The indicator whose card was clicked -> gets marked "in progress" (and,
  // on completion, stays as the single progressed indicator).
  selectedContentId: { type: [String, Number], required: true },
});

const route = useRoute();
const router = useRouter();
const client = useSupabaseClient();

const {
  markQuizCompleted,
  markQuizInProgress,
  unmarkQuizCompleted,
  isQuizCompleted,
  getContentStatus,
  completedQuizzes,
  saveQuizScore,
} = useQuizProgress();
const { fetchQuizQuestions, fetchAllQuestionsDebug } = useStrapiQuiz();

// Completion key for the single SELECTED indicator. This is what the list page
// also uses (quizKey = `substrand-<id>`), so only the clicked indicator is
// marked; the rest stay "not started".
const selectedKey = `substrand-${props.selectedContentId}`;

const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const answers = ref([]);
const quizCompleted = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
const loading = ref(true);
const markAsCompleted = ref(false);

const TARGET_QUESTION_COUNT = 10;

const questions = ref([]);

const currentQuestion = computed(() => {
  if (!questions.value || questions.value.length === 0) return null;
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

// Mark the selected indicator as "in progress" the moment the quiz starts.
const markSelectedInProgress = () => {
  if (getContentStatus(selectedKey) === "not-started") {
    markQuizInProgress(selectedKey);
  }
};

// Mark the selected indicator as completed/in-progress when the quiz is done.
// (We intentionally do NOT touch the other indicators, so they remain
// "not started" until the user clicks each of them.)
const markSelectedDone = () => {
  if (markAsCompleted.value) {
    markQuizCompleted(selectedKey);
  } else {
    markQuizInProgress(selectedKey);
  }
};

const completeQuiz = () => {
  if (selectedAnswer.value !== null) {
    let correct = 0;
    answers.value.forEach((answer, index) => {
      if (answer === questions.value[index].correct) correct++;
    });

    correctAnswers.value = correct;
    score.value = Math.round((correct / questions.value.length) * 100);
    quizCompleted.value = true;

    saveQuizScore(props.selectedContentId, "pre-quiz", {
      score: score.value,
      correctAnswers: correct,
      totalQuestions: questions.value.length,
    });

    // The clicked indicator is now done; lock it so it won't re-route to the
    // quiz. The remaining indicators stay "not started".
    markSelectedDone();
    markAsCompleted.value = true;
  }
};

const handleMarkAsCompleted = () => {
  // Manual toggle on the results screen.
  if (markAsCompleted.value) {
    markQuizCompleted(selectedKey);
  } else {
    unmarkQuizCompleted(selectedKey);
    markQuizInProgress(selectedKey);
  }
};

const goToContent = () => {
  // Ensure the selected indicator is marked done before leaving.
  if (!isQuizCompleted(selectedKey) && getContentStatus(selectedKey) !== "completed") {
    markSelectedDone();
  }
  router.push(
    `/learning-modules/${props.moduleSlug}/strand-${props.strandId}/substrand-${props.substrandRoute}/${props.selectedContentId}`,
  );
};

const goBackToSubstrand = () => {
  router.push(
    `/learning-modules/${props.moduleSlug}/strand-${props.strandId}/substrand-${props.substrandRoute}`,
  );
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = new Array(questions.value.length).fill(null);
  quizCompleted.value = false;
  score.value = 0;
  correctAnswers.value = 0;
};

// Spread `count` questions evenly across the supplied per-indicator pools.
const capQuestionsEvenly = (pools, count) => {
  const result = [];
  let added = true;
  while (result.length < count && added) {
    added = false;
    for (const pool of pools) {
      if (pool.length > 0 && result.length < count) {
        result.push(pool.shift());
        added = true;
      }
    }
  }
  return result;
};

const loadQuestions = async () => {
  loading.value = true;
  try {
    await fetchAllQuestionsDebug();

    // 1) Resolve the numeric substrand id.
    const { data: substrandRows, error: subErr } = await client
      .from(props.substrandsTable)
      .select("id, route")
      .eq("route", props.substrandRoute)
      .limit(1);
    if (subErr) console.error("[Quiz] substrand lookup failed:", subErr);
    const substrandRefId = substrandRows?.[0]?.id ?? null;

    // 2) Gather every indicator TEXT for this substrand.
    const { data: indRows, error: indErr } = await client
      .from(props.indicatorsTable)
      .select("indicators")
      .eq("substrand_ref", substrandRefId);
    if (indErr) console.error("[Quiz] indicator lookup failed:", indErr);

    const indicatorTexts = (indRows || [])
      .map((r) => (r.indicators != null ? String(r.indicators).trim() : ""))
      .filter((t) => t.length > 0);

    // 3) Fetch pre-quiz questions per indicator (transform handled by
    //    useStrapiQuiz). Pools preserve per-indicator grouping so we can
    //    spread the 10 questions across the whole substrand.
    const pools = [];
    for (const ind of indicatorTexts) {
      const qs = await fetchQuizQuestions(ind);
      if (qs && qs.length) pools.push(...qs.map((q) => ({ ...q })));
    }

    let chosen = [];
    if (pools.length > 0) {
      // Group by source indicator text to spread evenly.
      const byIndicator = new Map();
      for (const q of pools) {
        const k = q.indicators != null ? String(q.indicators).trim() : "";
        if (!byIndicator.has(k)) byIndicator.set(k, []);
        byIndicator.get(k).push(q);
      }
      chosen = capQuestionsEvenly(Array.from(byIndicator.values()), TARGET_QUESTION_COUNT);
    }

    if (chosen.length > 0) {
      questions.value = chosen;
    } else {
      console.error(
        `[Quiz] ❌ NO pre-quiz questions found for substrand: ${props.substrandRoute}`,
      );
      questions.value = [];
    }
  } catch (error) {
    console.error("[Quiz] ❌ Unexpected error loading questions:", error);
    questions.value = [];
  } finally {
    loading.value = false;
    if (!Array.isArray(questions.value)) questions.value = [];
    if (questions.value.length > 0) {
      answers.value = new Array(questions.value.length).fill(null);
    } else {
      console.warn(
        `[Quiz] ⚠️ No questions available for substrand: ${props.substrandRoute}`,
      );
    }
  }
};

onMounted(() => {
  loadQuestions();
  markSelectedInProgress();
  markAsCompleted.value = isQuizCompleted(selectedKey);
});
</script>

<style scoped>
/* Markdown-rendered quiz content (question text + options). Keeps inline
   images/lists/tables readable inside the quiz cards. */
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
