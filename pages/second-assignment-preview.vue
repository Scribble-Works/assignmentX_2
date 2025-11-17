<script setup>
// const previewImages = [
//   "/img/1_Identifying even, odd, prime and composite numbers_1.png",
//   "/img/2_Finding prime factors of natural numbers_2.png",
//   "/img/3_Finding the HCF of natural numbers_3.png",
//   "/img/4_Finding the LCM of natural numbers_4.png",
//   "/img/5_Addition and subtraction of whole numbers_5.png",
// ];
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div className="text-left mb-16">
        <h1
          className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
        >
          The Second Assignment Preview
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
          Take a Peek Inside the Workbook
        </h2>
        <p className="text-sm text-slate-600 max-w-4xl ">
          Explore a few sample pages from our math workbook. Get a feel for how the
          Assignment Maths Workbooks brings math to life through real-world examples,
          storytelling, and guided practice.
        </p>
      </div>

      <!-- Carousel -->
      <!-- <v-carousel hide-delimiters height="950"> -->
        <!-- <v-carousel-item v-for="(img, index) in previewImages" :key="index"> -->
          <div class="h-full w-full flex justify-center items-center">
            <iframe height="650" width="900" src="https://yvzftzhtqcddqadufjue.supabase.co/storage/v1/object/public/book-preview/Second%20Assignment%202025%20first%2030%20pages.pdf" frameborder="0"></iframe>
            <!-- <img
              :src="img"
              alt="Preview"
              class="h-[800px] w-auto rounded-l shadow-lg object-contain"
            /> -->
          </div>
        <!-- </v-carousel-item> -->
      <!-- </v-carousel> -->
    </div>
  </div>
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
