<script setup>
const previewImages = [
  "/img/1_Identifying even, odd, prime and composite numbers_1.png",
  "/img/2_Finding prime factors of natural numbers_2.png",
  "/img/3_Finding the HCF of natural numbers_3.png",
  "/img/4_Finding the LCM of natural numbers_4.png",
  "/img/5_Addition and subtraction of whole numbers_5.png",
];
</script>

<template>
  <div class="min-h-screen bg-grey-100">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div className="text-left mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          Progress Report - Numbers
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
          NUMBER AND NUMERATION SYSTEMS
        </h2>
        <p className="text-sm text-slate-600 max-w-4xl ">
          Look how far you’ve come!This page shows how much you’ve improved by
          comparing what you knew before the lesson and what you know now. It’s
          proof that learning is happening — one topic at a time.
        </p>
      </div>

      <!-- Progress Bar -->
      <v-sheet
        class="d-flex flex-column align-center px-4 py-8 mx-auto bg-white mb-16 shadow-lg"
        color="#181a1b"
        max-width="503m"
        rounded="lg"
      >
        <div class="flex w-full justify-between items-center mb-4">
          <div class="ms-4 text-h6">Pre-Lesson</div>
          <div>
            <div class="ms-4 text-h6">40%</div>
            <div class="ms-4 text-h6">Developing(D)</div>
          </div>
        </div>
        <v-progress-linear
          :location="null"
          bg-color="#92aed9"
          buffer-color="#fcc30c"
          buffer-opacity="1"
          buffer-value="3"
          color="#12512a"
          height="40"
          max="9"
          min="0"
          model-value="4"
          rounded
        ></v-progress-linear>
      </v-sheet>

      <v-sheet
        class="d-flex flex-column align-center px-4 py-8 mx-auto bg-white mb-16 shadow-lg"
        color="#181a1b"
        max-width="503m"
        rounded="lg"
      >
        <div class="flex w-full justify-between items-center mb-4">
          <div class="ms-4 text-h6">Post Lesson</div>
          <div>
            <div class="ms-4 text-h6">80%</div>
            <div class="ms-4 text-h6">Highly Proficient(P)</div>
          </div>
        </div>
        <v-progress-linear
          :location="null"
          bg-color="#92aed9"
          buffer-color="#6a3e0b"
          buffer-opacity="1"
          buffer-value="3"
          color="#12512a"
          height="40"
          max="9"
          min="0"
          model-value="8"
          rounded
        ></v-progress-linear>
      </v-sheet>

      <div class="bg-white py-8 px-6 rounded-lg shadow-sm">
        <h4>Your proficiency level is: Highly Proficient(HP)</h4>
        <p class="text-sm text-slate-600 max-w-4xl">
          Interpretation: Learner shows a high level of proficiency in
          knowledge, skills and values and can transfer them automatically and
          flexibly through authentic performance tasks.
        </p>

        <v-btn
          to="/workbook/"
          size="large"
          class="text-white rounded-sm text-subtitle-1 mt-6"
          style="background-color: #2563eb"
        >
          Download Report
        </v-btn>
      </div>

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
