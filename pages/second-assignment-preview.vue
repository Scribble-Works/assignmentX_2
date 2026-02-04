<script setup>
const client = useSupabaseClient();
const { data: previewImages } = await client
  .from("book-preview")
  .select()
  .eq("id", 2);

const imagesArray = previewImages[0].files.img;
console.log(imagesArray);
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div className="text-left mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          The Second Assignment Preview
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
          Take a Peek Inside the Workbook
        </h2>
        <p className="text-sm text-slate-600 max-w-4xl ">
          Explore a few sample pages from our math workbook. Get a feel for how
          the Assignment Maths Workbooks brings math to life through real-world
          examples, storytelling, and guided practice.
        </p>
      </div>

      <!-- Carousel -->
      <v-carousel hide-delimiters height="950">
        <v-carousel-item v-for="img in imagesArray" :key="img.id">
            <img
            :src="img.link"
            alt="Preview"
            class="w-full h-full rounded-l shadow-lg object-contain"
            />
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
