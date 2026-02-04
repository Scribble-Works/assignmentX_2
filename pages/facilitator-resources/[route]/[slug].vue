<script setup>
const client = useSupabaseClient();
const route = useRoute();
const slug = route.params.slug;

const { data: files } = await client.from('facilitator-resources').select('files->files').eq("route", route.params.route);
const decodedId = Object.keys(files[0].files).find(key => key === 'id');
const file = files[0].files[Object.keys(files[0].files).find(key => files[0].files[key].slug === slug)];

const fileKeys = Object.keys(files[0].files[decodedId] || {});

console.log(file);


</script>
<template>
  <div class="flex flex-col items-center py-10">
    <img
      :src="file.link"
      :alt="decodedId"
      class="max-w-2xl w-full mb-6 rounded shadow"
    />
    <!-- <a
      :href="file.link"
      download
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Download
    </a> -->
  </div>
</template>
