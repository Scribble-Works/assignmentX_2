<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import ConceptNotes from '~/components/conceptNotes.vue';
import QuizModal from '~/components/QuizModal.vue';
import ProblemSetModal from '~/components/ProblemSetModal.vue';

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
    loadStateFromStorage
} = useQuizProgress();

const { data: substrand } = await client
    .from("preassignment_workbook1_strand_substrands_lists")
    .select()
    .eq("route", substrand_ref);
const strand_ref_id = substrand[0].strand_ref;
const substrand_ref_id = substrand[0].id;

const { data: strands } = await client
    .from("preassignment_workbook1_substrands_contents")
    .select()
    .eq("substrand_ref", substrand_ref_id);

const { data: substrand_ls } = await client
    .from("preassignment_workbook1_substrand_indicators")
    .select()
    .eq("substrand_ref", substrand_ref_id);

const title = substrand[0].title;
const conceptNote = strands[0].concept_notes;
const bece = strands[0].BECE_Qquestions;

// Check if all lessons are completed (for showing Problem Set section)
const allQuizzesCompleted = computed(() => {
    return substrand_ls ? substrand_ls.every(content => {
        const contentIdStr = String(content.id);
        return isQuizCompleted(contentIdStr) || isQuizCompleted(content.id);
    }) : false;
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
    // Navigate to the quiz page with substrand and strand query params
    // Use substrand_ref_id as the quiz identifier since quiz is per substrand
    const substrandRoute = `substrand-${substrand_ref}`;
    navigateTo(`/quiz/${substrand_ref_id}?substrand=${substrandRoute}&strand=${strand_ref_id}&contentId=${contentId}`);
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
        navigateTo(`/learning-modules/preassignment_workbook1/strand-${strand_ref_id}/${substrandRoute}/${contentId}`);
    } else {
        // Quiz NOT taken yet - show modal
        showQuizModal.value = true;
    }
};

const handleSkipQuiz = (contentId) => {
    // DON'T mark as completed - user skipped, so modal will show again for other lessons
    // Just navigate to the lesson content page
    const substrandRoute = `substrand-${substrand_ref}`;
    navigateTo(`/learning-modules/preassignment_workbook1/strand-${strand_ref_id}/${substrandRoute}/${contentId}`);
};

// Check if pre-quiz is completed for this substrand (quiz is per substrand, not per lesson)
const isSubstrandQuizCompleted = computed(() => {
    // Use the same key format as when marking completion: `substrand-${substrand_ref_id}`
    const substrandQuizKey = `substrand-${substrand_ref_id}`;
    
    const isCompleted = isQuizCompleted(substrandQuizKey);
    
    return isCompleted;
});

const totalCount = computed(() => {
    return substrand_ls ? substrand_ls.length : 0;
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
    navigateTo(`/quiz/problem-set/${substrand_ref_id}?substrand=${substrandRoute}&strand=${strand_ref_id}`);
};

const skipProblemSetQuiz = () => {
    // Handle skip action - you can customize this behavior
    // For now, just close the modal
    showProblemSetModal.value = false;
};


// Load state when page mounts
onMounted(() => {
    loadStateFromStorage();
});

// Reload state when page is activated (e.g., when navigating back from course detail)
onActivated(() => {
    loadStateFromStorage();
});
</script>
<template>
    <div class="mt-5" style="height: auto; background-color: #f6f6f6">
        <div class="container mx-auto p-4">
            <v-row>
                <v-col cols="" lg="8" sm="12">
                    <h1 class="text-left font-weight-bold text-uppercase text-bold" style="font-size: 1.4em">
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
                <v-col cols="" lg="4" sm="12" align="right">
                    <v-btn :to="`/progress?topic=${encodeURIComponent(title)}&substrandId=${substrand_ref_id}`" color="primary">View Progress Report</v-btn>
                </v-col>
            </v-row>
            <ConceptNotes :concept-note="conceptNote" />
            
            
            <div class="mt-10" style="height: auto; background-color: #f6f6f6">
                <div class="container mx-auto p-4">
                    <v-row v-for="content in substrand_ls" :key="content.id">
                        <v-col>
                            <v-card class="mb-4">
                                <v-card-text>
                                    <!-- Topic Title -->
                                    <div @click.stop="handleContentClick(content.id)"
                                        class="cursor-pointer mb-4">
                                        <h3 class="text-h6 font-weight-bold">{{ content.indicators }}</h3>
                                    </div>
                                    
                                    <!-- Action Elements -->
                                    <div class="d-flex align-center justify-space-between">
                                        <!-- Left Side: Concept Note and BECE Questions -->
                                        <div class="d-flex align-center gap-3" @click.stop>
                                            <v-btn @click.stop="openNotes" 
                                                variant="text"
                                                color="blue-darken-2"
                                                class="text-none font-weight-medium">
                                                CONCEPT NOTE
                                            </v-btn>
                                            
                                            <v-btn @click.stop="openBece" 
                                                variant="text"
                                                color="green-darken-2"
                                                class="text-none font-weight-medium">
                                                BECE QUESTIONS
                                            </v-btn>
                                        </div>
                                        
                                        <!-- Right Side: Course Completion Status (per lesson) -->
                                        <div v-if="isQuizCompleted(String(content.id)) || isQuizCompleted(content.id)" 
                                            class="d-flex align-center text-green-darken-2 font-weight-medium">
                                            <v-icon size="small" class="mr-1">mdi-check</v-icon>
                                            COURSE COMPLETED
                                        </div>
                                        <div v-else 
                                            class="d-flex align-center text-grey-darken-1 font-weight-medium">
                                            <v-icon size="small" class="mr-1">mdi-circle-outline</v-icon>
                                            NOT STARTED
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                    <br />


                    <!-- Problem Set Section - Only shown when all quizzes are completed -->
                    <div v-if="allQuizzesCompleted" class="mt-10">
                        <div class="text-h3 font-weight-bold mb-2">Problem Set</div>
                        <p class="text-h6 mb-6">Time to apply and show the Wow!</p>
                        
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-img src="/img/problem.png" class="rounded-lg"></v-img>
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
                                <p class="text-body-1 mb-6">
                                    Now it's your turn to apply what you've learned. These problems
                                    challenge you to think, connect ideas, and solve real-world
                                    situations using math. There might be more than one way — so be
                                    bold, be creative, and show the wow!
                                </p>
                                <v-btn 
                                    @click="solveProblem" 
                                    color="grey-darken-3"
                                    size="large"
                                    class="mt-5"
                                >
                                    Solve Problem Set
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Quiz Modal - Moved outside container for proper z-index -->
        <QuizModal 
            :is-open="showQuizModal" 
            :content-id="selectedContentId ? String(selectedContentId) : null"
            :substrand-route="'substrand-' + substrand_ref" 
            :strand-id="String(strand_ref_id)"
            @close="closeQuizModal" 
            @start-quiz="startQuiz" 
            @skip-quiz="handleSkipQuiz" />
        
        <!-- Problem Set Modal -->
        <ProblemSetModal 
            :is-open="showProblemSetModal"
            @close="closeProblemSetModal"
            @start-quiz="startProblemSetQuiz"
            @skip-quiz="skipProblemSetQuiz" />
    </div>
</template>
