<template>
  <div class="flex flex-col items-center py-10">
    <img
      :src="`/img/${decodedId}`"
      :alt="decodedId"
      class="max-w-2xl w-full mb-6 rounded shadow"
    />
    <a
      :href="`/images/${decodedId}`"
      download
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Download
    </a>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const decodedId = decodeURIComponent(route.params.id);
</script>
