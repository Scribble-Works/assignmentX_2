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
const id = route.params.id;
const strand_ref = route.params.route;
const substrand = route.params.substrand;

// Quiz progress management
const { markQuizCompleted, isQuizCompleted, loadStateFromStorage } = useQuizProgress();
const courseCompleted = ref(false);

// Check if course is already completed on mount
onMounted(() => {
  loadStateFromStorage();
  courseCompleted.value = isQuizCompleted(id);
});

const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('route', strand_ref);

const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;
const { data: files } = await client.from('book1_strands').select().eq('id', substrand_ref_id);

const { data: indicators_content } = await client.from('book1_substrand_indicators').select().eq('id', id);

const heading = indicators_content[0].indicators;
const vid1 = indicators_content[0].vid1;
const vid2 = indicators_content[0].vid2;
const vid3 = indicators_content[0].vid3;

const conceptNote = files[0].concept_notes;
const bece = files[0].BECE_Qquestions;

console.log(files);
// console.log(substrand_ref_id);





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
    if (!isQuizCompleted(id)) {
        markQuizCompleted(id);
        courseCompleted.value = true;
        console.log(`Course ${id} marked as completed`);
    } else {
        // If already completed, uncheck it
        courseCompleted.value = false;
        console.log(`Course ${id} already completed`);
    }
};




</script>
<template>
    <div class="body">
        <div class="container mx-auto p-4">
            <h2 class="text-center text-h4 text-uppercase text-bold mb-10 mt-15" style="font-weight: bold;">{{
                heading
            }}</h2>
            
            <!-- Video Section -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8 items-end">
                <div class="lg:col-span-8">
                    <introvid :intro="vid1" />
                </div>
                <div class="lg:col-span-4">
                    <div class="flex flex-col space-y-1 h-full justify-end">
                        <div class="h-1/2">
                            <introvid :intro="vid2" />
                        </div>
                        <div class="h-1/2">
                            <introvid :intro="vid3" />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 mb-8">
                <v-btn @click="openNotes" rounded color="grey-darken-3">Concept Note</v-btn>
                <v-btn @click="openBece" rounded color="grey-darken-3">Sample Questions</v-btn>
                <v-btn rounded color="grey-darken-3">Video transcription</v-btn>
                
                <!-- Course Completion Checkbox -->
                <div class="flex items-center gap-2 ml-auto">
                    <input 
                        type="checkbox" 
                        id="courseCompleted" 
                        :checked="isQuizCompleted(id)"
                        @change="markCourseAsCompleted"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="courseCompleted" class="text-sm text-gray-700 font-medium">
                        Mark Course as completed
                    </label>
                </div>
            </div>

            <div class="mt-15">
                <h3 class="text-h3 mb-5" style="font-family: 'Inter', sans-serif; font-weight: bold;">Worked Exam<span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">ples</span></h3>
                <div class="bg-gray-100 rounded-lg px-12 py-8">
                    <v-img class="mt-10 mb-10" src="/img/example.png"></v-img>
                    <v-img class="mb-10" src="/img/solution.png"></v-img>
                </div>
            </div>

            <div class="mt-10">
                <h3 class="text-h3 mb-10" style="font-family: 'Inter', sans-serif;"> Now Let's have some math <span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">fun</span></h3>
                <div class="bg-gray-100 rounded-lg">
                    <div class="mt-10">
                        <h5 class="text-h5 text-center" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Flip Card Compare Game</h5><br>
                        <p class="text-center">Time Left: 20s</p><br>
                        <p class="text-center"><v-icon>mdi-clock</v-icon> Score: 2/4</p>
                    </div>

                    <div class="mt-5 mb-10">
                        <!-- <compare /> -->
                    </div>
                </div>
            </div>

            <!-- Course Completion Section -->
            <div class="mt-15">
                <div class="bg-white rounded-lg shadow-md p-8 text-center">
                    <div v-if="!courseCompleted && !isQuizCompleted(id)" class="mb-6">
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
                            Mark Course as Completeds
                        </button>
                    </div>

                    <div v-else-if="courseCompleted || isQuizCompleted(id)" class="mb-6">
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
        </div>
    </div>
</template>
<style>
.body {
    background: white;
}
</style>