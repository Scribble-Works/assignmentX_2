<script setup>
import compare from "~/components/flipcards/compare.vue";
import { useQuizProgress } from "~/composables/useQuizProgress";
import { ref, onMounted } from "vue";

// import strand1 from '~/strand1.json';
// definePageMeta({
//     layout: 'dash',
// });
const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const strand_ref = route.params.route;
const substrand = route.params.substrand;

const { data: indicators_content } = await client
  .from("book2_substrand_indicators")
  .select()
  .eq("id", id);
// Quiz progress management
const { markQuizCompleted, isQuizCompleted, loadStateFromStorage } =
  useQuizProgress();
const courseCompleted = ref(false);
const game = indicators_content[0].games;

// Check if course is already completed on mount
onMounted(() => {
  loadStateFromStorage();
  courseCompleted.value = isQuizCompleted(id);
});

const { data: substrands } = await client
  .from("book1_strand_substrands_lists")
  .select()
  .eq("route", strand_ref);

const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;
const { data: files } = await client
  .from("book2_strands")
  .select()
  .eq("id", substrand_ref_id);

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
      },
    },
  });
}

function openBece() {
  navigateTo(bece, {
    open: {
      windowFeatures: {
        width: 500,
        height: 500,
      },
    },
  });
}

// Course completion function
const markCourseAsCompleted = () => {
  courseCompleted.value = true;
  markQuizCompleted(id);
  // Force update the status to completed
  console.log(`Course ${id} marked as completed`);
};

function swapVideo(video) {
  const oldMain = mainVideo.value;
  mainVideo.value = video;
  relatedVideos.value = relatedVideos.value.map((v) =>
    v === video ? oldMain : v
  );
}
</script>
<template>
  <div class="body">
    <v-container>
      <h2
        class="text-left text-uppercase text-bold mb-0 mt-0"
        style="font-weight: bold; font-size: 1.2rem"
      >
        {{ heading }}
      </h2>
      <v-row>
        <v-col cols="" lg="9" md="6" sm="12">
          <vids :url="vid1" />
        </v-col>
        <v-col cols="" lg="3" md="6" sm="12">
          <div v-for="(video, index) in relatedVids" :key="index">
            <vids
              class="mb-4 cursor-pointer"
              :url="video"
              @click="swapVideo(video)"
            />
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-n5 mr-10">
        <v-col cols="" lg="6" sm="12" md="3">
          <v-btn @click="openNotes" rounded color="grey-darken-3"
            >Concept Note</v-btn
          >
        </v-col>
        <v-col cols="" lg="6" sm="12" md="5">
          <v-btn @click="openBece" rounded color="grey-darken-3"
            >Sample Questions</v-btn
          >
        </v-col>
        <!-- <v-col cols="" lg="3" sm="12" md="4">
                    <v-btn rounded color="grey-darken-3">Video transcription</v-btn>
                </v-col> --> </v-row
      ><br />
      <div class="mt-10">
        <h3
          class="text-h3 mb-5"
          style="font-family: 'Inter', sans-serif; font-weight: bold"
        >
          Worked Exam<span
            style="text-decoration: underline; text-decoration-color: #fcc30c"
            >ples</span
          >
        </h3>
        <div style="background-color: #f3f4f6">
          <div v-if="worked_examples && worked_examples.length > 0">
            <div v-for="example in worked_examples" :key="example.id">
              <v-container>
                <v-img
                  class="mt-10 mb-10"
                  :src="example.url"
                  alt="Worked Example"
                ></v-img>
              </v-container>
            </div>
          </div>
          <div v-else>
            <v-container>
              <v-img
                class="mt-10 mb-10"
                src="/img/Worked_Examples.png"
                alt="No worked examples available"
              ></v-img>
            </v-container>
          </div>
        </div>
      </div>
      <v-container class="mt-10" style="background-color: #f3f4f6">
        <div class="mt-10">
          <h5
            class="text-h5 text-center"
            style="font-family: 'Inter', sans-serif; font-weight: bold"
          >
            Gamified Learning
          </h5>
          <br />
          <!-- <p class="text-center">Time Left: 20s</p> -->
          <br />
          <!-- <p class="text-center"><v-icon>mdi-clock</v-icon> Score: 2/4</p> -->
        </div>

        <iframe
          :src="game"
          style="width: 100%; height: 40em"
          frameborder="0"
        ></iframe>
      </v-container>

      <!-- <div class="mt-15">
                <h3 class="text-h3 mb-5" style="font-family: 'Inter', sans-serif; font-weight: bold;">Worked Exam<span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">ples</span></h3>
                <v-container style="background-color: #F3F4F6;">
                    <v-img class="mt-10 mb-10" src="/img/example.png"></v-img>
                    <v-img class="mb-10" src="/img/solution.png"></v-img>
            </div>

            <div class="mt-10">
                <h3 class="text-h3 mb-10" style="font-family: 'Inter', sans-serif;"> Now Let's have some math <span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">fun</span></h3>
                <v-container style="background-color: #F3F4F6;">
                    <div class="mt-10">
                        <h5 class="text-h5 text-center" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Flip Card Compare Game</h5><br>
                        <p class="text-center">Time Left: 20s</p><br>
                        <p class="text-center"><v-icon>mdi-clock</v-icon> Score: 2/4</p>
                    </div>


                    <div class="mt-5 mb-10"> -->
      <!-- <compare /> -->
      <!-- </div> -->
    </v-container>
  </div>

  <!-- Course Completion Section -->
  <!-- <div class="mt-15">
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
                            Mark Course as Completed
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
            </div> -->
</template>
<style>
.body {
  background: white;
}
</style>
