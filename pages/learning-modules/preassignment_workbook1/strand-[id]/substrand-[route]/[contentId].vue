<script setup>
import compare from '~/components/flipcards/compare.vue';
import { useQuizProgress } from '~/composables/useQuizProgress';
import { ref, onMounted } from 'vue';

// import strand1 from '~/strand1.json';
// definePageMeta({
//     layout: 'dash',
// });
const client = useSupabaseClient();
const route = useRoute();
const contentIdParam = route.params.contentId;
const strand_ref = route.params.route;
const substrand = route.params.substrand;

const courseContentId = Array.isArray(contentIdParam) ? contentIdParam[0] : contentIdParam;

// Quiz progress management
const { markQuizCompleted, unmarkQuizCompleted, isQuizCompleted, loadStateFromStorage } = useQuizProgress();
const courseCompleted = ref(false);

// Check if course is already completed on mount
onMounted(() => {
    loadStateFromStorage();
    if (courseContentId) {
        courseCompleted.value = isQuizCompleted(String(courseContentId)) || isQuizCompleted(courseContentId);
    }
});

const { data: substrands } = await client.from('preassignment_workbook1_strand_substrands_lists').select().eq('route', strand_ref);

const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;
const { data: files } = await client.from('preassignment_workbook1_substrands_contents').select().eq('id', substrand_ref_id);

const { data: indicators_content } = await client.from('preassignment_workbook1_substrand_indicators').select().eq('id', courseContentId);

const heading = indicators_content[0].indicators;
const vid1 = indicators_content[0].vid1;
const vid2 = indicators_content[0].vid2;
const vid3 = indicators_content[0].vid3;

const conceptNote = files[0].concept_notes;
const bece = files[0].BECE_Qquestions;

console.log(indicators_content);
// console.log(substrand_ref_id);
const relatedVids = ref([vid2, vid3]);



function openNotes() {
    navigateTo(conceptNote, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    })
};

function openBece() {
    navigateTo(bece, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    });
};

function openTranscript() {
    // For now, we'll show an alert. In a real implementation, this would open a transcript modal or page
    alert('Video transcript feature coming soon!');
};

// Course completion function
const toggleCourseCompletion = () => {
    if (!courseContentId) return;
    
    const courseKey = String(courseContentId);
    
    if (courseCompleted.value) {
        // Checked - mark as completed
        markQuizCompleted(courseKey);
        console.log(`Course ${courseKey} marked as completed`);
    } else {
        // Unchecked - unmark as completed
        unmarkQuizCompleted(courseKey);
        console.log(`Course ${courseKey} unmarked as completed`);
    }
};

function swapVideo(video) {
    const oldMain = mainVideo.value
    mainVideo.value = video
    relatedVideos.value = relatedVideos.value.map(v =>
        v === video ? oldMain : v
    )
};

// Navigate back to substrand list (topics page)
const goBackToSubstrand = () => {
    // Clear the returnFromQuiz sessionStorage to prevent modal from showing
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('returnFromQuiz');
    }
    const substrandRoute = `substrand-${strand_ref}`;
    navigateTo(`/learning-modules/preassignment_workbook1/strand-${strand_ref_id}/${substrandRoute}`);
};



</script>
<template>
    <div class="body">
        <v-container>
            <!-- Back Button -->
            <div class="mb-4">
                <v-btn 
                    @click="goBackToSubstrand" 
                    variant="text" 
                    color="grey-darken-1"
                    class="text-none"
                >
                    <v-icon left>mdi-arrow-left</v-icon>
                    Back to Topics
                </v-btn>
            </div>
            
            <h2 class="text-left text-uppercase text-bold mb-0 mt-0" style="font-weight: bold; font-size: 1.2rem;">{{
                heading
                }}</h2>
            <v-row>
                <v-col cols="" lg="9" md="6" sm="12">
                    <vids :url="vid1" />
                </v-col>
                <v-col cols="" lg="3" md="6" sm="12">
                    <div v-for="(video, index) in relatedVids" :key="index">
                        <vids class="mb-4 cursor-pointer" :url="video" @click="swapVideo(video)" />
                    </div>
                </v-col>
            </v-row>
            
            <!-- Action Buttons Row -->
            <v-row class="mt-4">
                <v-col cols="12" lg="6" md="6" sm="12">
                    <div class="d-flex gap-3">
                        <v-btn @click="openNotes" rounded color="grey-darken-3" height="40">
                            <v-icon left>mdi-file-document</v-icon>
                            Concept Note
                        </v-btn>
                        <v-btn @click="openBece" rounded color="grey-darken-3" height="40">
                            <v-icon left>mdi-help-circle</v-icon>
                            Sample Questions
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                    <div class="d-flex align-center gap-3 ml-16">
                        <v-btn @click="openTranscript" rounded color="grey-darken-3" height="40">
                            <v-icon left>mdi-text</v-icon>
                            Video Transcript
                        </v-btn>
                        
                        <div class="d-flex align-center">
                            <v-checkbox
                                v-model="courseCompleted"
                                @change="toggleCourseCompletion"
                                color="green"
                                hide-details
                                class="mr-2"
                                size="small"
                            ></v-checkbox>
                            <span class="text-body-2 font-weight-medium">Mark Complete</span>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- Worked Examples Section -->
            <div class="mt-15">
                <h3 class="text-h3 mb-5" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                    Worked <span style="position: relative; text-decoration: none;">
                        Examples
                        <svg style="position: absolute; bottom: -3px; right: 0; width: 40%; height: 6px;" viewBox="0 0 100 6" preserveAspectRatio="none">
                            <path d="M0,6 Q50,-2 100,6" stroke="#FCC30C" stroke-width="3" fill="none"/>
                        </svg>
                    </span>
                </h3>
                <v-container style="background-color: #F3F4F6; min-height: 800px; padding: 3rem;">
                    <!-- Fun Activity Image -->
                    <div class="mb-6">
                        <v-img 
                            src="/img/example.png" 
                            alt="Fun Activity"
                            class="rounded-lg elevation-2"
                            max-height="400"
                        ></v-img>
                    </div>

                    <!-- Solution Image -->
                    <div>
                        <v-img 
                            src="/img/solution.png" 
                            alt="Solution"
                            class="rounded-lg elevation-2"
                            max-height="400"
                        ></v-img>
                    </div>
                </v-container>
            </div>

            <!-- Flashcard Game Section -->
            <div class="mt-10">
                <h3 class="text-h3 mb-10 font-weight-bold" style="font-family: 'Inter', sans-serif;">
                    Now Let's have some math <span style="position: relative; text-decoration: none;">
                        fun
                        <svg style="position: absolute; bottom: -3px; left: 0; width: 100%; height: 6px;" viewBox="0 0 100 6" preserveAspectRatio="none">
                            <path d="M0,6 Q50,-2 100,6" stroke="#FCC30C" stroke-width="3" fill="none"/>
                        </svg>
                    </span>
                </h3>
                <v-container style="background-color: #F3F4F6;">
                    <div class="mt-10">
                        <h5 class="text-h5 text-center mb-4" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Flip Card Compare Game
                        </h5>
                        
                        <!-- Instructions -->
                        <div class="text-center mb-4">
                            <p class="text-body-1" style="color: #666; max-width: 600px; margin: 0 auto;">
                                Click on the card below to reveal the answer to the math equation. 
                                Try to solve it in your head first, then flip to check your answer!
                            </p>
                        </div>
                        
                        <div class="d-flex justify-center align-center mt-4 mb-6">
                            <v-chip color="orange" class="mr-4">
                                <v-icon left>mdi-clock</v-icon>
                                Time Left: 20s
                            </v-chip>
                            <v-chip color="green">
                                <v-icon left>mdi-trophy</v-icon>
                                Score: 2/4
                            </v-chip>
                        </div>
                    </div>

                    <div class="mt-5 mb-10">
                        <compare />
                    </div>
                </v-container>
            </div>

            <!-- Course Completion Section -->
            <!-- <div class="mt-15">
                <div class="bg-white rounded-lg shadow-md p-8 text-center">
                    <div v-if="!courseCompleted && !isQuizCompleted(courseContentId)" class="mb-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">
                            🎯 Ready to Complete This Course?
                        </h3>
                        <p class="text-gray-600 mb-6">
                            You've reviewed all the materials. Click the button below to mark this course as completed.
                        </p>
                        <button
                            @click="markCourseAsCompleted"
                            class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center mx-auto"
                        >
                            <span class="mr-2">✓</span>
                            Mark Course as Completed
                        </button>
                    </div>

                    <div v-else-if="courseCompleted || isQuizCompleted(courseContentId)" class="mb-6">
                        <div class="text-green-600 text-6xl mb-4">🎉</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">
                            Course Completed!
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Congratulations! You've successfully completed this course. You can now return to the course list or continue with other topics.
                        </p>
                        <div class="flex justify-center space-x-4">
                            <button
                                @click="navigateTo('/workbook/workbook1/strand-1/substrand-number-and-numeration-system')"
                                class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                                Back to Course List
                            </button>
                            <button
                                @click="navigateTo('/progress')"
                                class="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                            >
                                View Progress
                            </button>
                        </div>
                    </div>
                </div>
            </div> -->
        </v-container>
    </div>
</template>
<style>
.body {
    background: white;
}
</style>