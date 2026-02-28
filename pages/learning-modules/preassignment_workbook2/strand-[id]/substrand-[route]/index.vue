<script setup>
import {
  ref,
  computed,
  onMounted,
  onActivated,
  watch,
  onBeforeUnmount,
} from "vue";
import { useQuizProgress } from "~/composables/useQuizProgress";
import ConceptNotes from "~/components/conceptNotes.vue";
import QuizModal from "~/components/QuizModal.vue";
import ProblemSetModal from "~/components/ProblemSetModal.vue";

const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const substrand_ref = route.params.route;

// Quiz modal state
const showQuizModal = ref(false);
const selectedContentId = ref(null);

// Problem set modal state
const showProblemSetModal = ref(false);

// Use the quiz progress composable
const {
  completedQuizzes,
  contentStatus,
  markQuizInProgress,
  markQuizCompleted,
  isQuizCompleted,
  getContentStatus,
  getStatusInfo,
  loadStateFromStorage,
} = useQuizProgress();

const { data: substrand } = await client
  .from("preassignment_workbook1_strand_substrands_lists")
  .select()
  .eq("route", substrand_ref);
const strand_ref_id = substrand[0].strand_ref;
const substrand_ref_id = substrand[0].id;

const { data: strands } = await client
  .from("preassignment_workbook2_substrands_contents")
  .select()
  .eq("substrand_ref", substrand_ref_id);

const { data: unsortedSubstrand_ls } = await client
  .from("preassignment_workbook2_substrand_indicators")
  .select()
  .eq("substrand_ref", substrand_ref_id);

const title = substrand[0].title;
const conceptNote = strands[0].concept_notes;
const bece = strands[0].BECE_Qquestions;

// Sort substrand list by ID
const substrand_ls = computed(() => {
  if (unsortedSubstrand_ls) {
    return [...unsortedSubstrand_ls].sort((a, b) => a.id - b.id);
  }
  return [];
});

// Check if all lessons are completed (for showing Problem Set section)
const allQuizzesCompleted = computed(() => {
  const list = substrand_ls.value;
  if (!list || list.length === 0) return false;
  return list.every((content) => {
    const contentIdStr = String(content.id);
    return isQuizCompleted(contentIdStr) || isQuizCompleted(content.id);
  });
});

function openNotes() {
  navigateTo(conceptNote, {
    open: {
      windowFeatures: {
        width: 500,
        height: 500,
      },
    },
  });
}

function openBece() {
  const link = document.createElement("a");
  link.href = bece;
  link.download = "BECE_Questions.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Quiz modal functions
const openQuizModal = (contentId) => {
  selectedContentId.value = contentId;
  showQuizModal.value = true;
};

const closeQuizModal = () => {
  showQuizModal.value = false;
  selectedContentId.value = null;
};

const startQuiz = (contentId) => {
  // Close modal first before navigating
  showQuizModal.value = false;
  selectedContentId.value = null;

  // Navigate to the quiz within this module
  // Use substrand_ref_id as the quiz identifier since quiz is per substrand
  navigateTo(
    `/learning-modules/preassignment_workbook2/strand-${strand_ref_id}/substrand-${substrand_ref}/quiz/${substrand_ref_id}?contentId=${contentId}`,
  );
};

const handleContentClick = (contentId) => {
  loadStateFromStorage();

  // Check if pre-quiz for this topic (substrand) is already completed
  const substrandQuizKey = `substrand-${substrand_ref_id}`;
  const isQuizCompletedForTopic = isQuizCompleted(substrandQuizKey);

  selectedContentId.value = contentId;

  if (isQuizCompletedForTopic) {
    // Quiz already taken for this topic - go directly to lesson
    const substrandRoute = `substrand-${substrand_ref}`;
    navigateTo(
      `/learning-modules/preassignment_workbook1/strand-${strand_ref_id}/${substrandRoute}/${contentId}`,
    );
  } else {
    // Quiz NOT taken yet - show modal
    showQuizModal.value = true;
  }
};

const handleSkipQuiz = (contentId) => {
  // Close modal first
  showQuizModal.value = false;
  selectedContentId.value = null;

  // DON'T mark as completed - user skipped, so modal will show again for other lessons
  // Just navigate to the lesson content page
  const substrandRoute = `substrand-${substrand_ref}`;
  navigateTo(
    `/learning-modules/preassignment_workbook2/strand-${strand_ref_id}/${substrandRoute}/${contentId}`,
  );
};

// Check if pre-quiz is completed for this substrand (quiz is per substrand, not per lesson)
const isSubstrandQuizCompleted = computed(() => {
  // Use the same key format as when marking completion: `substrand-${substrand_ref_id}`
  const substrandQuizKey = `substrand-${substrand_ref_id}`;

  const isCompleted = isQuizCompleted(substrandQuizKey);

  return isCompleted;
});

const totalCount = computed(() => {
  return substrand_ls.value ? substrand_ls.value.length : 0;
});

const solveProblem = () => {
  // Only allow access if all quizzes are completed
  if (allQuizzesCompleted.value) {
    // Show the problem set modal
    showProblemSetModal.value = true;
  }
};

const closeProblemSetModal = () => {
  showProblemSetModal.value = false;
};

const startProblemSetQuiz = () => {
  // Navigate to problem set quiz page
  // You can customize this navigation based on your routing structure
  const substrandRoute = `substrand-${substrand_ref}`;
  navigateTo(
    `/quiz/problem-set/${substrand_ref_id}?substrand=${substrandRoute}&strand=${strand_ref_id}`,
  );
};

const skipProblemSetQuiz = () => {
  // Handle skip action - you can customize this behavior
  // For now, just close the modal
  showProblemSetModal.value = false;
};

// Load state when page mounts
onMounted(() => {
  loadStateFromStorage();
  console.log("Loaded quiz progress state:", {
    completedQuizzes: Array.from(completedQuizzes.value),
    contentStatus: Array.from(contentStatus.value.entries()),
  });
});

// Watch for changes in completion status
watch(
  completedQuizzes,
  (newCompleted) => {
    console.log("Completed quizzes updated:", Array.from(newCompleted));
  },
  { deep: true },
);

watch(
  contentStatus,
  (newStatus) => {
    console.log("Content status updated:", Array.from(newStatus.entries()));
  },
  { deep: true },
);

// Reload state when page is activated (e.g., when navigating back from course detail)
onActivated(() => {
  loadStateFromStorage();
});

// Cleanup modals before unmount to prevent ref access errors
onBeforeUnmount(() => {
  showQuizModal.value = false;
  showProblemSetModal.value = false;
  selectedContentId.value = null;
});
</script>
<template>
  <div class="mt-15" style="height: auto; background-color: #f6f6f6">
    <!-- Main content with consistent alignment -->
    <div class="container mx-auto p-4">
      <v-row>
        <v-col cols="8">
          <h1 class="text-left text-uppercase text-bold" style="font-size: 2em">
            {{ title }}
          </h1>
          <!-- Progress Indicator -->
          <div class="mt-2 flex items-center">
            <div class="flex items-center text-sm text-gray-600">
              <span class="mr-2">Progress:</span>
              <span class="font-semibold text-green-600"
                >{{ completedCount }}/{{ totalCount }}</span
              >
              <span class="ml-2">courses completed</span>
            </div>
            <div class="ml-4 w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all duration-300"
                :style="{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                }"
              ></div>
            </div>
          </div>
        </v-col>
        <v-col cols="4" align="right">
          <v-btn
            :to="`/progress?topic=${encodeURIComponent(title)}&substrandId=${substrand_ref_id}`"
            color="primary"
            >View Progress Report</v-btn
          >
        </v-col>
      </v-row>
      <ConceptNotes :concept-note="conceptNote" />

      <v-row v-for="content in substrand_ls" :key="content.id">
        <v-col>
          <v-card class="mb-4">
            <v-card-text class="pa-6">
              <!-- Topic Title -->
              <div
                @click="handleContentClick(content.id)"
                class="cursor-pointer hover:text-gray-600 transition-colors mb-4"
              >
                <!-- <div class="text-sm text-gray-500 mb-1">{{ content.id }}</div> -->
                <div class="text-lg font-medium">{{ content.indicators }}</div>
              </div>

              <!-- Three Action Elements -->
              <div class="flex items-center justify-between">
                <!-- Concept Note (Blue) -->
                <button
                  @click="openNotes"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  CONCEPT NOTE
                </button>

                <!-- BECE Questions (Green) -->
                <button
                  @click="openBece"
                  class="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                >
                  BECE QUESTIONS
                </button>

                <!-- Completed Status (Green) -->
                <div class="flex items-center">
                  <span
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1',
                      isQuizCompleted(content.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500',
                    ]"
                    style="border-radius: 10px"
                  >
                    <span v-if="isQuizCompleted(content.id)">✓</span>
                    <span v-else>○</span>
                    {{
                      isQuizCompleted(content.id) ? "COMPLETED" : "NOT STARTED"
                    }}
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Problem Set Section - Only shown when all quizzes are completed -->
      <div v-if="allQuizzesCompleted" class="mt-10">
        <div class="text-h3 font-bold mb-2">Problem Set</div>
        <p class="text-lg mb-6">Time to apply and show the Wow!</p>

        <v-row>
          <v-col cols="12" md="6">
            <v-img src="/img/problem.png" class="rounded-lg"></v-img>
          </v-col>
          <v-col cols="12" md="6" class="d-flex flex-column justify-center">
            <p class="text-gray-700 mb-6">
              Now it's your turn to apply what you've learned. These problems
              challenge you to think, connect ideas, and solve real-world
              situations using math. There might be more than one way — so be
              bold, be creative, and show the wow!
            </p>
            <v-btn
              @click="solveProblem"
              class="mt-5 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              size="large"
            >
              Solve Problem Set
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Quiz Modal -->
      <QuizModal
        :is-open="showQuizModal"
        :content-id="selectedContentId"
        :substrand-route="`substrand-${substrand_ref}`"
        :strand-id="strand_ref_id"
        @close="closeQuizModal"
        @start-quiz="startQuiz"
      />
    </div>
  </div>
</template>
