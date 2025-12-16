<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import ConceptNotes from '~/components/conceptNotes.vue';
import QuizModal from '~/components/QuizModal.vue';

const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const substrand_ref = route.params.route;

// Quiz modal state
const showQuizModal = ref(false);
const selectedContentId = ref(null);

// Use the quiz progress composable
const {
    completedQuizzes,
    contentStatus,
    markQuizInProgress,
    isQuizCompleted,
    getContentStatus,
    getStatusInfo,
    loadStateFromStorage
} = useQuizProgress();

const { data: substrand } = await client
    .from("book1_strand_substrands_lists")
    .select()
    .eq("route", substrand_ref);
const strand_ref_id = substrand[0].strand_ref;
const substrand_ref_id = substrand[0].id;

const { data: strands } = await client
    .from("book1_strands")
    .select()
    .eq("substrand_ref", substrand_ref_id);

const { data: substrand_ls } = await client
    .from("book1_substrand_indicators")
    .select()
    .eq("substrand_ref", substrand_ref_id);

const title = substrand[0].title;
const conceptNote = strands[0].concept_notes;
const bece = strands[0].BECE_Qquestions;

// Check if all quizzes are completed
const allQuizzesCompleted = computed(() => {
    return substrand_ls && completedQuizzes.value.size === substrand_ls.length;
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
    // Quiz is now handled by the separate quiz page
    // This function is no longer needed as the modal navigates directly
    console.log(`Quiz started for content: ${contentId}`);
};

const handleContentClick = (contentId) => {
    navigateTo(`/learning-modules/assignment_workbook1/strand-${strand_ref_id}/substrand-${substrand_ref}/${contentId}`);
    // Check if quiz is already completed
    // if (!isQuizCompleted(contentId)) {
    //     // Set status to in progress when starting
    //     markQuizInProgress(contentId);
    //     openQuizModal(contentId);
    // } else {
    //     // Navigate to content if quiz is completed
    //     navigateTo(`/workbook/workbook1/strand-${strand_ref_id}/substrand-${substrand_ref}/${contentId}`);
    // }
};

// Add a completion indicator to the title
const completedCount = computed(() => {
    return substrand_ls ? substrand_ls.filter(content => isQuizCompleted(content.id)).length : 0;
});

const totalCount = computed(() => {
    return substrand_ls ? substrand_ls.length : 0;
});

const solveProblem = () => {
    // Only allow access if all quizzes are completed
    if (allQuizzesCompleted.value) {
        console.log('Opening problem set...');
        // Add your problem set logic here
    }
};

// Load state when page mounts
onMounted(() => {
    loadStateFromStorage();
    console.log('Loaded quiz progress state:', {
        completedQuizzes: Array.from(completedQuizzes.value),
        contentStatus: Array.from(contentStatus.value.entries())
    });
});

// Watch for changes in completion status
watch(completedQuizzes, (newCompleted) => {
    console.log('Completed quizzes updated:', Array.from(newCompleted));
}, { deep: true });

watch(contentStatus, (newStatus) => {
    console.log('Content status updated:', Array.from(newStatus.entries()));
}, { deep: true });
</script>
<template>
    <div class="mt-5 bg-red-500" style="height: auto; background-color: #f6f6f6">
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
                <!-- <v-col cols="" lg="4" sm="12" align="right">
                    <v-btn :to="`/progress?topic=${encodeURIComponent(title)}&substrandId=${substrand_ref_id}`" color="primary">View Progress Report</v-btn>
                </v-col> -->
            </v-row>
            <ConceptNotes :concept-note="conceptNote" />
            <div class="mt-10" style="height: auto; background-color: #f6f6f6">
                <div class="container mx-auto p-4">
                    <v-row v-for="content in substrand_ls" :key="content.id">
                        <v-col>
                            <v-card class="mb-4">
                                <v-card-text>
                                    <!-- Topic ID -->
                                    <div class="text-caption text-grey-darken-1 mb-1">{{ content.id }}</div>
                                    
                                    <!-- Topic Title -->
                                    <div @click="handleContentClick(content.id)"
                                        class="cursor-pointer mb-4">
                                        <h3 class="text-h6 font-weight-bold">{{ content.indicators }}</h3>
                                    </div>
                                    
                                    <!-- Three Action Elements -->
                                    <div class="d-flex align-center justify-space-between">
                                        <!-- Concept Note Button -->
                                        <v-btn @click="openNotes" 
                                            variant="text"
                                            color="blue-darken-2"
                                            class="text-none font-weight-medium">
                                            CONCEPT NOTE
                                        </v-btn>
                                        
                                        <!-- BECE Questions Button -->
                                        <v-btn @click="openBece" 
                                            variant="text"
                                            color="green-darken-2"
                                            class="text-none font-weight-medium">
                                            BECE QUESTIONS
                                        </v-btn>
                                        
                                        <!-- Completed Status -->
                                        <div v-if="isQuizCompleted(content.id)" 
                                            class="d-flex align-center text-green-darken-2 font-weight-medium">
                                            <v-icon size="small" class="mr-1">mdi-check</v-icon>
                                            COMPLETED
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

                    <!-- Quiz Modal -->
                    <QuizModal :is-open="showQuizModal" :content-id="selectedContentId"
                        :substrand-route="`substrand-${substrand_ref}`" :strand-id="strand_ref_id"
                        @close="closeQuizModal" @start-quiz="startQuiz" />
                </div>
            </div>
        </div>
    </div>
</template>
