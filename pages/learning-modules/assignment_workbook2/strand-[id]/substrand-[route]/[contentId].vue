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
const { markQuizCompleted, isQuizCompleted, loadStateFromStorage } = useQuizProgress();
const courseCompleted = ref(false);

// Check if course is already completed on mount
onMounted(() => {
  loadStateFromStorage();
  if (courseContentId) {
    courseCompleted.value = isQuizCompleted(String(courseContentId)) || isQuizCompleted(courseContentId);
  }
});

const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('route', strand_ref);

const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;
const { data: files } = await client.from('book2_strands').select().eq('id', substrand_ref_id);

const { data: indicators_content } = await client.from('book2_substrand_indicators').select().eq('id', courseContentId);

const heading = indicators_content[0].indicators;
const vid1 = indicators_content[0].vid1;
const vid2 = indicators_content[0].vid2;
const vid3 = indicators_content[0].vid3;

const conceptNote = files[0].concept_notes;
const bece = files[0].BECE_Qquestions;

console.log(files);
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

// Course completion function
const markCourseAsCompleted = () => {
    if (!courseContentId) {
        return;
    }
    const courseKey = String(courseContentId);
    if (!isQuizCompleted(courseKey)) {
        markQuizCompleted(courseKey);
        courseCompleted.value = true;
        console.log(`Course ${courseKey} marked as completed`);
    } else {
        // If already completed, uncheck it
        courseCompleted.value = false;
        console.log(`Course ${courseKey} already completed`);
    }
};

function swapVideo(video) {
  const oldMain = mainVideo.value
  mainVideo.value = video
  relatedVideos.value = relatedVideos.value.map(v =>
    v === video ? oldMain : v
  )
};



</script>
<template>
    <div class="body">
        <v-container>
            <h2 class="text-left text-uppercase text-bold mb-0 mt-0" style="font-weight: bold; font-size: 1.2rem;">{{
                heading
            }}</h2>
            <v-row>
                <v-col cols="" lg="9" md="6" sm="12">
                    <vids :url="vid1" />
                </v-col>
                <v-col  cols="" lg="3" md="6" sm="12">
                    <div v-for="(video, index) in relatedVids" :key="index">
                        <vids class="mb-4 cursor-pointer" :url="video" @click="swapVideo(video)" />
                    </div>
                </v-col>
            </v-row>
            <v-row class="mt-n5 mr-10">
                <v-col cols="" lg="6" sm="12" md="3">
                    <v-btn @click="openNotes" rounded color="grey-darken-3">Concept Note</v-btn>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="5">
                    <v-btn @click="openBece" rounded color="grey-darken-3">Sample Questions</v-btn>
                </v-col>
            </v-row>

            <!-- Course Completion Section -->
            <div class="mt-15">
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
            </div>
        </v-container>
    </div>
</template>
<style>
.body {
    background: white;
}
</style>