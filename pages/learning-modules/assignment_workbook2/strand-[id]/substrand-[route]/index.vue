<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuizProgress } from "~/composables/useQuizProgress";

const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const substrand_ref = route.params.route;

// Use the quiz progress composable
const {
  completedQuizzes,
  contentStatus,
  markQuizInProgress,
  isQuizCompleted,
  getContentStatus,
  getStatusInfo,
  loadStateFromStorage,
} = useQuizProgress();

const { data: substrand } = await client
  .from("book1_strand_substrands_lists")
  .select()
  .eq("route", substrand_ref);
const strand_ref_id = substrand[0].strand_ref;
const substrand_ref_id = substrand[0].id;

const { data: strands } = await client
  .from("book2_strands")
  .select()
  .eq("substrand_ref", substrand_ref_id);

const { data: unsortedSubstrand_ls } = await client
  .from("book2_substrand_indicators")
  .select()
  .eq("substrand_ref", substrand_ref_id);

const title = substrand[0].title;
const conceptNote = strands[0].concept_notes;
const bece = strands[0].BECE_Qquestions;

// Canonical completion key must match what the quiz page writes
// (quiz/[contentId].vue stores completion as `substrand-<id>`).
const quizKey = (id) => `substrand-${id}`;

// All indicators are done once each one has been started (quiz taken).
const allQuizzesCompleted = computed(() =>
  substrand_ls.value.length > 0 &&
  substrand_ls.value.every(
    (content) => getContentStatus(quizKey(content.id)) !== "not-started",
  ),
);

const substrand_ls = computed(() => {
  if (unsortedSubstrand_ls) {
    return [...unsortedSubstrand_ls].sort((a, b) => a.id - b.id);
  }
  return [];
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

// Quiz modal functions removed — routing now goes straight to the shared
// SubstrandQuiz page (components/SubstrandQuiz.vue) on first click.

const handleContentClick = (contentId) => {
  // First click routes to the whole-substrand pre-quiz; once that indicator is
  // started/completed it opens content directly. Only the selected indicator
  // advances; the rest stay "not started".
  const key = quizKey(contentId);
  if (getContentStatus(key) === "not-started") {
    markQuizInProgress(key);
    navigateTo(
      `/learning-modules/assignment_workbook2/strand-${strand_ref_id}/substrand-${substrand_ref}/quiz/${contentId}`,
    );
  } else {
    navigateTo(
      `/learning-modules/assignment_workbook2/strand-${strand_ref_id}/substrand-${substrand_ref}/${contentId}`,
    );
  }
};

// Progress: count every indicator that has been started (in-progress or
// completed). Per-indicator, so only the quizzed indicator advances.
const completedCount = computed(() => {
  return substrand_ls.value.filter(
    (content) => getContentStatus(quizKey(content.id)) !== "not-started",
  ).length;
});

const totalCount = computed(() => {
  return substrand_ls.value.length;
});

const solveProblem = () => {
  // Only allow access if all quizzes are completed
  if (allQuizzesCompleted.value) {
    console.log("Opening problem set...");
  }
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
</script>
<template>
  <div class="mt-5" style="height: auto">
    <div class="container mx-auto p-4">
      <div
        style="
          font-family: Inter, sans-serif;
          font-weight: bold;
          background-color: #2096f3;
          color: white;
          border-radius: 8px;
          padding: 7px 24px;
          display: inline-block;
        "
        class="text-h6 text-muted text-uppercase mb-5"
      >
        Discover
      </div>
      <br />
      <v-row>
        <v-col cols="" lg="8" sm="12">
          <h1
            class="text-left font-weight-bold text-uppercase text-bold"
            style="font-size: 1.4em"
          >
            {{ title }}
          </h1>
          <!-- Progress Indicator -->
          <!-- <div class="mt-2 flex items-center">
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="mr-2">Progress:</span>
                            <span class="font-semibold text-green-600">{{ completedCount }}/{{ totalCount }}</span>
                            <span class="ml-2">courses completed</span>
                        </div>
                        <div class="ml-4 w-32 bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full transition-all duration-300"
                                :style="{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }">
                            </div>
                        </div>
                    </div> -->
        </v-col>
        <!-- <v-col cols="" lg="4" sm="12" align="right">
                    <v-btn to="/progress" color="primary">View Progress Report</v-btn>
                </v-col> -->
      </v-row>
      <ConceptNotes :concept-note="conceptNote" />
      <div class="mt-10" style="height: auto">
        <div class="container mx-auto p-4">
          <div
            style="
              font-family: Inter, sans-serif;
              font-weight: bold;
              background-color: #4c9f38;
              color: white;
              border-radius: 8px;
              padding: 7px 24px;
              display: inline-block;
            "
            class="text-h6 text-muted text-uppercase mb-5"
          >
            practice
          </div>
          <v-row v-for="content in substrand_ls" :key="content.id">
            <v-col>
              <v-card>
                <v-card-title>
                  <div
                    @click="handleContentClick(content.id)"
                    class="cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    <div>
                      <strong
                        style="
                          font-size: 0.9em;
                          max-width: 100%;
                          white-space: normal;
                          word-break: break-word;
                        "
                        class="d-inline-block"
                      >
                        {{ content.indicators }}
                      </strong>
                    </div>
                  </div>
                </v-card-title>
                <!-- <v-card-actions class="flex items-center justify-between"> -->
                <!-- <div class="gap-2">
                                        <v-btn @click="openNotes" color="primary">concept note</v-btn>
                                        <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                                    </div> -->

                <!-- Status Indicator -->
                <div class="flex items-center">
                  <span
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1',
                      getStatusInfo(getContentStatus(quizKey(content.id))).bgColor,
                      getStatusInfo(getContentStatus(quizKey(content.id))).color,
                    ]"
                    style="border-radius: 10px"
                  >
                    <span>{{
                      getStatusInfo(getContentStatus(quizKey(content.id))).icon
                    }}</span>
                    {{ getStatusInfo(getContentStatus(quizKey(content.id))).text }}
                  </span>
                </div>
                <!-- </v-card-actions> -->
              </v-card>

              <v-spacer></v-spacer>
              <br />
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <br />

          <!-- Problem Set Section - Only shown when all quizzes are completed -->
          <div v-if="allQuizzesCompleted" class="mt-10">
            <div class="text-h3">Problem Set</div>
            <p>Time to apply and show the Wow!</p>
            <br />
            <v-row>
              <v-col>
                <v-img src="/img/problem.png"></v-img>
              </v-col>
              <v-col class="mt-15">
                <p>
                  Now it’s your turn to apply what you’ve learned. These
                  problems challenge you to think, connect ideas, and solve
                  real-world situations using math. There might be more than one
                  way — so be bold, be creative, and show the wow!
                </p>
                <v-btn
                  @click="solveProblem"
                  class="mt-5"
                  color="blue-grey-darken-4"
                  >Solve Problem Set</v-btn
                >
              </v-col>
            </v-row>
          </div>
          <!-- Problem Set Section - Only shown when all quizzes are completed -->
          <div v-if="allQuizzesCompleted" class="mt-10">
            <div class="text-h3">Problem Set</div>
            <p>Time to apply and show the Wow!</p>
            <br />
            <v-row>
              <v-col>
                <v-img src="/img/problem.png"></v-img>
              </v-col>
              <v-col class="mt-15">
                <p>
                  Now it’s your turn to apply what you’ve learned. These
                  problems challenge you to think, connect ideas, and solve
                  real-world situations using math. There might be more than one
                  way — so be bold, be creative, and show the wow!
                </p>
                <v-btn
                  @click="solveProblem"
                  class="mt-5"
                  color="blue-grey-darken-4"
                  >Solve Problem Set</v-btn
                >
              </v-col>
            </v-row>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
