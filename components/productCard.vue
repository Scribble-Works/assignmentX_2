<script>
import AppButton from "~/components/button.vue";
export default {
  name: "ProductCard",
  props: {
    title: String,
    level: String,
    description: String,
    price: String,
    image: String,
    reverse: Boolean,
  },
};
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center"
    :class="reverse ? 'md:flex-row-reverse' : 'md:flex-row'"
  >
    <!-- Image -->
    <div class="flex-none w-full md:w-5/12" :class="reverse ? 'md:w-5/12' : ''">
      <img :src="image" alt="book" class="w-full h-auto object-cover rounded" />
    </div>

    <!-- Text -->
    <div class="flex-1 mt-6 md:mt-0">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <p class="text-gray-600">{{ level }}</p>
      <p class="mt-4 text-sm text-gray-700">{{ description }}</p>
      <p class="mt-4 font-semibold">Price: GHC {{ price }}</p>

      <div class="mt-4 flex gap-4">
        <!-- <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buy now
        </button> -->

        <v-btn
          to="/workbook/"
          size="large"
          class="text-white rounded-lg text-subtitle-1"
          style="background-color: #2563eb"
        >
          Buy Now
        </v-btn>

        <v-btn
          to="/preview/"
          size="large"
          class="text-white rounded-lg text-subtitle-1"
          style="background-color: #fcc30c"
        >
          Preview
        </v-btn>
      </div>
    </div>
  </div>
</template>
