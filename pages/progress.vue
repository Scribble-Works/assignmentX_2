<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuizProgress } from "~/composables/useQuizProgress";

const route = useRoute();

const {
  getAllQuizScores,
  getSubstrandScores,
  getAggregatedScores,
  getProficiencyLevel,
  loadStateFromStorage,
} = useQuizProgress();

// Get topic info from query params
const topicName = computed(() =>
  route.query.topic ? decodeURIComponent(route.query.topic) : null,
);
const substrandId = computed(() => route.query.substrandId || null);

// Reactive data
const allScores = ref([]);
const currentScores = ref(null);
const isLoading = ref(true);

// Computed values for display - use specific substrand scores if available, otherwise aggregated
const preQuizScore = computed(() => {
  if (currentScores.value?.preQuiz) {
    return currentScores.value.preQuiz.score;
  }
  return 0;
});

const postQuizScore = computed(() => {
  if (currentScores.value?.postQuiz) {
    return currentScores.value.postQuiz.score;
  }
  return 0;
});

const hasPreQuiz = computed(() => currentScores.value?.preQuiz !== undefined);
const hasPostQuiz = computed(() => currentScores.value?.postQuiz !== undefined);

const preQuizProficiency = computed(() =>
  getProficiencyLevel(hasPreQuiz.value ? preQuizScore.value : null),
);
const postQuizProficiency = computed(() =>
  getProficiencyLevel(hasPostQuiz.value ? postQuizScore.value : null),
);

// Get color based on proficiency level (spectrum from red to green)
const getProficiencyColor = (proficiencyCode) => {
  switch (proficiencyCode) {
    case "HP": // Highly Proficient - Green
      return "#16a34a"; // green-600
    case "P": // Proficient - Yellow-Green
      return "#84cc16"; // lime-500
    case "AP": // Approaching Proficiency - Yellow
      return "#eab308"; // yellow-500
    case "D": // Developing - Orange
      return "#f97316"; // orange-500
    case "E": // Emerging - Red
      return "#dc2626"; // red-600
    default:
      return "#6b7280"; // gray-500
  }
};

// Get text color based on proficiency level
const getProficiencyTextColor = (proficiencyCode) => {
  switch (proficiencyCode) {
    case "HP": // Highly Proficient - Green
      return "text-green-600";
    case "P": // Proficient - Yellow-Green
      return "text-lime-600";
    case "AP": // Approaching Proficiency - Yellow
      return "text-yellow-600";
    case "D": // Developing - Orange
      return "text-orange-600";
    case "E": // Emerging - Red
      return "text-red-600";
    default:
      return "text-slate-600";
  }
};

// Final proficiency interpretation:
// - If post-quiz exists: use post-quiz score and interpretation
// - If only pre-quiz exists (no post-quiz): use pre-quiz score and interpretation
// - If neither exists: show N/A
const finalProficiency = computed(() => {
  // Priority 1: Use post-quiz if available
  if (hasPostQuiz.value && currentScores.value?.postQuiz) {
    return getProficiencyLevel(currentScores.value.postQuiz.score);
  }
  // Priority 2: Use pre-quiz if available (when post-quiz hasn't been taken yet)
  if (hasPreQuiz.value && currentScores.value?.preQuiz) {
    return getProficiencyLevel(currentScores.value.preQuiz.score);
  }
  // Priority 3: No data available
  return getProficiencyLevel(null);
});

// Check if there's any data
const hasData = computed(() => {
  return hasPreQuiz.value || hasPostQuiz.value;
});

// Display title - use topic name from query or stored topic name
const displayTitle = computed(() => {
  if (topicName.value) {
    return topicName.value;
  }
  if (currentScores.value?.topicName) {
    return currentScores.value.topicName;
  }
  return "Your Learning Progress";
});

// Download report as PDF
const downloadReport = async () => {
  // Create a printable version of the report
  const reportContent = generateReportHTML();

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(reportContent);
  printWindow.document.close();

  // Wait for content to load then trigger print
  printWindow.onload = () => {
    printWindow.print();
  };
};

// Generate HTML content for the report
const generateReportHTML = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Progress Report - ${displayTitle.value}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 40px; 
          color: #1e293b;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 { 
          font-size: 28px; 
          color: #1e293b; 
          margin-bottom: 8px;
        }
        .header h2 { 
          font-size: 18px; 
          color: #475569; 
          font-weight: 500;
          text-transform: uppercase;
        }
        .header .date { 
          font-size: 14px; 
          color: #64748b; 
          margin-top: 10px;
        }
        .section { 
          margin-bottom: 30px; 
          padding: 20px; 
          background: #f8fafc; 
          border-radius: 8px;
        }
        .section-title { 
          font-size: 18px; 
          font-weight: 600; 
          margin-bottom: 15px; 
          color: #334155;
        }
        .score-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .score-row:last-child { border-bottom: none; }
        .score-label { font-weight: 500; color: #475569; }
        .score-value { 
          font-weight: 700; 
          font-size: 18px;
          color: #1e293b;
        }
        .proficiency-box {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin-top: 30px;
        }
        .proficiency-box h3 { 
          font-size: 16px; 
          opacity: 0.9; 
          margin-bottom: 8px;
        }
        .proficiency-box .level { 
          font-size: 24px; 
          font-weight: 700;
          margin-bottom: 10px;
        }
        .proficiency-box p { 
          font-size: 14px; 
          opacity: 0.9;
          max-width: 500px;
          margin: 0 auto;
        }
        .progress-bar-container {
          margin: 15px 0;
        }
        .progress-bar {
          height: 20px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 8px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s;
        }
        .improvement {
          text-align: center;
          padding: 20px;
          background: #ecfdf5;
          border-radius: 8px;
          margin-top: 20px;
        }
        .improvement .value {
          font-size: 32px;
          font-weight: 700;
          color: #16a34a;
        }
        .improvement .label {
          color: #166534;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
        @media print {
          body { padding: 20px; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Progress Report</h1>
        <h2>${displayTitle.value}</h2>
        <div class="date">Generated on ${currentDate}</div>
      </div>
      
      <div class="section">
        <div class="section-title">📝 Pre-Lesson Assessment</div>
        <div class="score-row">
          <span class="score-label">Score</span>
          <span class="score-value" style="color: ${hasPreQuiz.value ? getProficiencyColor(preQuizProficiency.value.code) : "#6b7280"}">${hasPreQuiz.value ? preQuizScore.value + "%" : "Not taken"}</span>
        </div>
        <div class="score-row">
          <span class="score-label">Proficiency Level</span>
          <span class="score-value" style="color: ${hasPreQuiz.value ? getProficiencyColor(preQuizProficiency.value.code) : "#6b7280"}">${preQuizProficiency.value.level} (${preQuizProficiency.value.code})</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill pre" style="width: ${hasPreQuiz.value ? preQuizScore.value : 0}%; background: ${hasPreQuiz.value ? getProficiencyColor(preQuizProficiency.value.code) : "#9ca3af"}"></div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">✅ Post-Lesson Assessment</div>
        <div class="score-row">
          <span class="score-label">Score</span>
          <span class="score-value" style="color: ${hasPostQuiz.value ? getProficiencyColor(postQuizProficiency.value.code) : "#6b7280"}">${hasPostQuiz.value ? postQuizScore.value + "%" : "Not taken"}</span>
        </div>
        <div class="score-row">
          <span class="score-label">Proficiency Level</span>
          <span class="score-value" style="color: ${hasPostQuiz.value ? getProficiencyColor(postQuizProficiency.value.code) : "#6b7280"}">${postQuizProficiency.value.level} (${postQuizProficiency.value.code})</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill post" style="width: ${hasPostQuiz.value ? postQuizScore.value : 0}%; background: ${hasPostQuiz.value ? getProficiencyColor(postQuizProficiency.value.code) : "#9ca3af"}"></div>
          </div>
        </div>
      </div>
      
      ${
        hasPreQuiz.value && hasPostQuiz.value
          ? `
      <div class="improvement">
        <div class="value">+${Math.max(0, postQuizScore.value - preQuizScore.value)}%</div>
        <div class="label">Improvement from Pre to Post Assessment</div>
      </div>
      `
          : ""
      }
      
      <div class="proficiency-box" style="background: linear-gradient(135deg, ${getProficiencyColor(finalProficiency.value.code)} 0%, ${getProficiencyColor(finalProficiency.value.code)}dd 100%);">
        <h3>Overall Proficiency Level</h3>
        <div class="level">${finalProficiency.value.level} (${finalProficiency.value.code})</div>
        <p>${finalProficiency.value.description}</p>
      </div>
      
      <div class="footer">
        <p>This report was generated by Assignment X Learning Platform</p>
      </div>
    </body>
    </html>
  `;
};

// Load data on mount
onMounted(() => {
  loadStateFromStorage();

  // Small delay to ensure localStorage is loaded
  setTimeout(() => {
    allScores.value = getAllQuizScores();

    // If we have a specific substrandId, get scores for that substrand
    if (substrandId.value) {
      currentScores.value = getSubstrandScores(substrandId.value);
    } else {
      // Otherwise, try to get the first available scores
      if (allScores.value.length > 0) {
        currentScores.value = allScores.value[0];
      }
    }

    isLoading.value = false;
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-left mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
          Progress Report - {{ displayTitle }}
        </h1>
        <h2
          class="text-lg md:text-xl font-semibold text-slate-700 mb-4 uppercase"
        >
          {{ displayTitle }}
        </h2>
        <p class="text-sm text-slate-600 max-w-3xl">
          Look how far you've come! This page shows how much you've improved by
          comparing what you knew before the lesson and what you know now. It's
          proof that learning is happening — one topic at a time.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- No Data State -->
      <div
        v-else-if="!hasData"
        class="bg-white rounded-xl shadow-lg p-8 text-center mb-8"
      >
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">
          No Quiz Data Yet
        </h3>
        <p class="text-slate-600 mb-2">
          <span v-if="topicName"
            >You haven't completed any quizzes for
            <strong>{{ topicName }}</strong> yet.</span
          >
          <span v-else
            >Complete a pre-quiz or post-quiz to see your progress report
            here.</span
          >
        </p>
        <p class="text-slate-500 text-sm mb-6">
          Take a pre-quiz before your lesson and a post-quiz (problem set) after
          to track your improvement!
        </p>
        <v-btn
          to="/learning-modules/preassignment_workbook1/"
          color="primary"
          size="large"
        >
          Start Learning
        </v-btn>
      </div>

      <!-- Progress Data -->
      <div v-else>
        <!-- Pre-Lesson Score Card -->
        <v-sheet
          class="d-flex flex-column px-6 py-6 mx-auto bg-white mb-8 shadow-lg"
          rounded="xl"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-semibold text-slate-800">Pre-Lesson</div>
            <div class="text-right">
              <div
                v-if="hasPreQuiz"
                class="text-2xl font-bold"
                :class="getProficiencyTextColor(preQuizProficiency.code)"
              >
                {{ preQuizScore }}%
              </div>
              <div v-else class="text-xl font-bold text-slate-400">N/A</div>
              <div
                v-if="hasPreQuiz"
                class="text-sm font-medium"
                :class="getProficiencyTextColor(preQuizProficiency.code)"
              >
                {{ preQuizProficiency.level }}({{ preQuizProficiency.code }})
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <v-progress-linear
            :model-value="hasPreQuiz ? preQuizScore : 0"
            height="40"
            rounded
            bg-color="#e5e7eb"
            :color="
              hasPreQuiz
                ? getProficiencyColor(preQuizProficiency.code)
                : '#9ca3af'
            "
          ></v-progress-linear>
        </v-sheet>

        <!-- Post-Lesson Score Card -->
        <v-sheet
          class="d-flex flex-column px-6 py-6 mx-auto bg-white mb-8 shadow-lg"
          rounded="xl"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-semibold text-slate-800">Post-Lesson</div>
            <div class="text-right">
              <div
                v-if="hasPostQuiz"
                class="text-2xl font-bold"
                :class="getProficiencyTextColor(postQuizProficiency.code)"
              >
                {{ postQuizScore }}%
              </div>
              <div v-else class="text-xl font-bold text-slate-400">N/A</div>
              <div
                v-if="hasPostQuiz"
                class="text-sm font-medium"
                :class="getProficiencyTextColor(postQuizProficiency.code)"
              >
                {{ postQuizProficiency.level }}({{ postQuizProficiency.code }})
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <v-progress-linear
            :model-value="hasPostQuiz ? postQuizScore : 0"
            height="40"
            rounded
            bg-color="#e5e7eb"
            :color="
              hasPostQuiz
                ? getProficiencyColor(postQuizProficiency.code)
                : '#9ca3af'
            "
          ></v-progress-linear>
        </v-sheet>

        <!-- Final Proficiency Level -->
        <div class="bg-white py-8 px-6 rounded-xl shadow-lg mb-8">
          <h4 class="text-lg font-semibold text-slate-800 mb-3">
            Your proficiency level is:
            <span :class="getProficiencyTextColor(finalProficiency.code)"
              >{{ finalProficiency.level }}({{ finalProficiency.code }})</span
            >
          </h4>
          <p class="text-sm text-slate-600 mb-6">
            <span class="font-semibold">Interpretation:</span>
            {{ finalProficiency.description }}
          </p>

          <v-btn
            @click="downloadReport"
            size="large"
            class="text-white rounded-sm text-subtitle-1"
            style="background-color: #2563eb"
          >
            Download Report
          </v-btn>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="flex flex-col md:flex-row gap-8 items-center mt-8">
        <div class="">
          <img
            src="/img/cuate.png"
            alt="Banner"
            class="w-full object-cover h-64 md:h-[400px]"
          />
        </div>
        <div class="">
          <p class="text-slate-600 mb-2">Need a push?</p>
          <v-btn
            to="/livesession/"
            size="large"
            class="text-white rounded-lg text-subtitle-1"
            style="background-color: #4c9f38"
          >
            Join a live session
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
