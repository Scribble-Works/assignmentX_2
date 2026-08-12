<script setup>
import { computed } from "vue";
import { useQuizProgress } from "~/composables/useQuizProgress";

const route = useRoute();
const { getQuizScore, loadStateFromStorage } = useQuizProgress();

// Query params set by the "View Progress Report" link on each substrand page
// (pages/learning-modules/assignment_workbook1/strand-[id]/substrand-[route]/index.vue).
const moduleSlug = route.query.module ?? "";
const substrandId = route.query.substrandId ?? "";
const strandTitle = route.query.strandTitle ?? "";
const substrandTitle = route.query.substrandTitle ?? "";

// Same substrand-level key used everywhere scores/gates are stored:
// `${moduleSlug}-substrand-${substrandId}`.
const scoreKey = `${moduleSlug}-substrand-${substrandId}`;

// NaCCA/GES-style proficiency bands (20-point spread). Not sourced from any
// rubric already in this codebase — adjust the min/max cut points here if
// the curriculum spec calls for different thresholds.
const PROFICIENCY_BANDS = [
  {
    min: 80,
    max: 100,
    code: "HP",
    label: "Highly Proficient",
    interpretation:
      "Learner shows a high level of proficiency in knowledge, skills and values and can transfer them automatically and flexibly through authentic performance tasks.",
  },
  {
    min: 60,
    max: 79,
    code: "P",
    label: "Proficient",
    interpretation:
      "Learner shows proficiency in the knowledge, skills and values expected and can transfer them independently through authentic performance tasks.",
  },
  {
    min: 40,
    max: 59,
    code: "AP",
    label: "Approaching Proficiency",
    interpretation:
      "Learner shows a considerable level of knowledge, skills and values and needs some support to transfer them through authentic performance tasks.",
  },
  {
    min: 20,
    max: 39,
    code: "D",
    label: "Developing",
    interpretation:
      "Learner shows some level of knowledge, skills and values and needs support to transfer them through authentic performance tasks.",
  },
  {
    min: 0,
    max: 19,
    code: "B",
    label: "Beginning",
    interpretation:
      "Learner shows minimal knowledge, skills and values and needs considerable support to transfer them through authentic performance tasks.",
  },
];

const getProficiency = (percent) =>
  PROFICIENCY_BANDS.find((b) => percent >= b.min && percent <= b.max) ??
  PROFICIENCY_BANDS[PROFICIENCY_BANDS.length - 1];

// loadStateFromStorage() is a no-op if state is already loaded (e.g. the user
// navigated here from within the app); it matters when /progress is loaded
// directly/refreshed, since the composable's state starts empty per page load.
loadStateFromStorage();

const preResult = computed(() => getQuizScore(scoreKey, "pre-quiz"));
const postResult = computed(() => getQuizScore(scoreKey, "post-quiz"));

const preProficiency = computed(() =>
  preResult.value ? getProficiency(preResult.value.score) : null,
);
const postProficiency = computed(() =>
  postResult.value ? getProficiency(postResult.value.score) : null,
);

// Overall proficiency reflects understanding AFTER the lesson, so it's based
// on the post-quiz. Fall back to the pre-quiz band only if the post-quiz
// hasn't been taken yet, so the page still shows something meaningful.
const overallProficiency = computed(
  () => postProficiency.value ?? preProficiency.value,
);
const overallBasis = computed(() =>
  postProficiency.value ? "post-quiz" : preProficiency.value ? "pre-quiz" : null,
);

const hasAnyResult = computed(() => !!preResult.value || !!postResult.value);

const downloadReport = () => {
  if (process.client) window.print();
};
</script>

<template>
  <div class="min-h-screen bg-grey-100">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-left mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          Progress Report<span v-if="strandTitle"> - {{ strandTitle }}</span>
        </h1>
        <h2
          v-if="substrandTitle"
          class="text-xl md:text-2xl font-semibold text-slate-700 mb-6 text-uppercase"
        >
          {{ substrandTitle }}
        </h2>
        <p class="text-sm text-slate-600 max-w-4xl">
          Look how far you've come! This page shows how much you've improved
          by comparing what you knew before the lesson and what you know now.
          It's proof that learning is happening — one topic at a time.
        </p>
      </div>

      <!-- No data yet -->
      <div
        v-if="!hasAnyResult"
        class="bg-white py-10 px-6 rounded-lg shadow-sm text-center mb-16"
      >
        <p class="text-slate-700 font-medium mb-2">No quiz results yet.</p>
        <p class="text-sm text-slate-600">
          Take the pre-quiz and the problem set for this topic to see your
          progress report here.
        </p>
      </div>

      <template v-else>
        <!-- Pre-Lesson -->
        <v-sheet
          class="d-flex flex-column align-center px-4 py-8 mx-auto bg-white mb-16 shadow-lg"
          max-width="503m"
          rounded="lg"
        >
          <div class="flex w-full justify-between items-center mb-4">
            <div class="ms-4 text-h6">Pre-Lesson</div>
            <div v-if="preResult" class="text-right">
              <div class="ms-4 text-h6">{{ preResult.score }}%</div>
              <div class="ms-4 text-h6">
                {{ preProficiency.label }}({{ preProficiency.code }})
              </div>
            </div>
            <div v-else class="ms-4 text-body-2 text-medium-emphasis">
              Not taken yet
            </div>
          </div>
          <v-progress-linear
            :model-value="preResult ? preResult.score : 0"
            bg-color="#e0e7f7"
            color="#fcc30c"
            height="40"
            max="100"
            min="0"
            rounded
          ></v-progress-linear>
        </v-sheet>

        <!-- Post-Lesson -->
        <v-sheet
          class="d-flex flex-column align-center px-4 py-8 mx-auto bg-white mb-16 shadow-lg"
          max-width="503m"
          rounded="lg"
        >
          <div class="flex w-full justify-between items-center mb-4">
            <div class="ms-4 text-h6">Post-Lesson</div>
            <div v-if="postResult" class="text-right">
              <div class="ms-4 text-h6">{{ postResult.score }}%</div>
              <div class="ms-4 text-h6">
                {{ postProficiency.label }}({{ postProficiency.code }})
              </div>
            </div>
            <div v-else class="ms-4 text-body-2 text-medium-emphasis">
              Not taken yet
            </div>
          </div>
          <v-progress-linear
            :model-value="postResult ? postResult.score : 0"
            bg-color="#e0e7f7"
            color="#12512a"
            height="40"
            max="100"
            min="0"
            rounded
          ></v-progress-linear>
        </v-sheet>

        <div class="bg-white py-8 px-6 rounded-lg shadow-sm">
          <h4 v-if="overallProficiency">
            Your proficiency level is: {{ overallProficiency.label }}({{
              overallProficiency.code
            }})
            <span
              v-if="overallBasis === 'pre-quiz'"
              class="text-body-2 text-medium-emphasis"
              >(based on the pre-quiz — take the problem set for a full
              result)</span
            >
          </h4>
          <p v-if="overallProficiency" class="text-sm text-slate-600 max-w-4xl">
            Interpretation: {{ overallProficiency.interpretation }}
          </p>

          <v-btn
            @click="downloadReport"
            size="large"
            class="text-white rounded-sm text-subtitle-1 mt-6"
            style="background-color: #2563eb"
          >
            Download Report
          </v-btn>
        </div>
      </template>

      <div class="flex flex-col md:flex-row gap-8 items-center mt-16">
        <div class="">
          <img
            src="/img/cuate.png"
            alt="Banner"
            class="w-full object-cover h-64 md:h-[600px]"
          />
        </div>
        <div class="">
          <p>Need a push?</p>
          <v-btn
            to="/livesession/"
            size="large"
            class="text-white rounded-sm text-subtitle-1 mt-6"
            style="background-color: #4c9f38"
          >
            Join a live session
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
