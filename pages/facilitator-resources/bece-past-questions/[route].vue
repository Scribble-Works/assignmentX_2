<script setup>
definePageMeta({
  layout: "resources",
});

const route = useRoute();
const client = useSupabaseClient();

const { data } = await client
  .from("bece_past_questions")
  .select("*")
  .eq("route", route.params.route)
  .single();
</script>

<template>
  <div>
    <h2
      class="text-h5 font-weight-bold mb-4"
      style="font-family: &quot;Inter&quot;, sans-serif"
    >
      {{ data?.title }}
    </h2>
    <p v-if="data?.description" class="text-body-2 text-grey mb-6">
      {{ data?.description }}
    </p>

    <div v-if="data?.src">
      <iframe
        :src="data.src"
        style="width: 100%; height: 85vh; border: none; border-radius: 8px"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div v-else class="text-center py-16 text-grey">
      <v-icon size="48" class="mb-3">mdi-file-pdf-box</v-icon>
      <p>No file available for this entry.</p>
    </div>
  </div>
</template>
