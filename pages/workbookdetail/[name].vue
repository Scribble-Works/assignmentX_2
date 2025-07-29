<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 py-12"
  >
    <div class="max-w-2xl w-full bg-white p-6 rounded-md shadow-md">
      <img
        :src="imageSrc"
        :alt="decodedName"
        class="w-full object-contain mb-6"
      />
    </div>

    <div class="text-center mt-15">
      <a
        :href="imageSrc"
        download
        class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Download
      </a>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const decodedName = decodeURIComponent(route.params.name);
const imageSrc = `/img/${decodedName}`;
</script>
