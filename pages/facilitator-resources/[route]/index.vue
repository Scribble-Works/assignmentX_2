<script setup>
import { ref, computed } from "vue";
import { useBookmarks } from "~/composables/useBookmarks";

definePageMeta({
  layout: "default",
});
const route = useRoute();
const client = useSupabaseClient();
// const { data: resources } = await client
//   .from("facilitator-resources")
//   .select("*");

const { data: files } = await client
  .from("facilitator-resources")
  .select("route, files->files")
  .eq("route", route.params.route);

const fileDisp = files[0].files;

const { bookmarks, toggleBookmark, isBookmarked, bookmarkCount } =
  useBookmarks();

const searchQuery = ref("");

// const filteredFiles = computed(() =>
//   files.value.filter((file) =>
//     file.toLowerCase().includes(searchQuery.value.toLowerCase())
//   )
// );
console.log(files);
console.log(fileDisp);
</script>

<template>
  <div class="w-[80%] mx-auto px-4 py-10">
    <!-- Search -->
    <div class="mb-6">
      <input
        type="text"
        placeholder="Search chapters and topics..."
        v-model="searchQuery"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Bookmarks Count -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/bookmarks"
        class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
          />
        </svg>
        Bookmarks
        <span class="bg-yellow-400 text-white rounded-full px-2 py-0.5 text-xs">
          {{ bookmarkCount }}
        </span>
      </NuxtLink>
    </div>

    <!-- File List -->
    <ul class="space-y-4">
      <li
        v-for="file in fileDisp"
        :key="file"
        class="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-100"
      >
        <div class="flex items-center space-x-4">
          <!-- File Icon -->
          <div class="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0012.586 1H4zm7 1.414L16.586 8H13a2 2 0 01-2-2V3.414z"
              />
            </svg>
          </div>

          <!-- Filename as link -->
          <NuxtLink
<<<<<<<< HEAD:pages/individual/index.vue
            :to="`/individual/${encodeURIComponent(file)}`"
========
            :to="`/facilitator-resources/`+files[0].route+`/`+file.slug"
>>>>>>>> 6c60c38f26915ca5d4a45b1aba38645376269a0e:pages/facilitator-resources/[route]/index.vue
            class="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            {{ file.name }}
          </NuxtLink>
        </div>

        <!-- Bookmark Icon -->
        <button @click="toggleBookmark(file)">
          <svg
            v-if="isBookmarked(file)"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<<<<<<<< HEAD:pages/individual/index.vue
<script setup>
import { ref, computed } from "vue";
import { useBookmarks } from "~/composables/useBookmarks";

definePageMeta({
  layout: "default",
});

const files = ref([
  "1_Identifying even, odd, prime and composite numbers_1.png",
  "2_Finding prime factors of natural numbers_2.png",
  "3_Finding the HCF of natural numbers_3.png",
  "4_Finding the LCM of natural numbers_4.png",
  "5_Addition and subtraction of whole numbers_5.png",
  "6_Multiplication of whole numbers_6.png",
  "7_Division of whole numbers_7.png",
]);

const { bookmarks, toggleBookmark, isBookmarked, bookmarkCount } =
  useBookmarks();

const searchQuery = ref("");

const filteredFiles = computed(() =>
  files.value.filter((file) =>
    file.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
</script>

========
>>>>>>>> 6c60c38f26915ca5d4a45b1aba38645376269a0e:pages/facilitator-resources/[route]/index.vue
<style scoped>
/* Optional styles */
</style>


curl -X 'GET' \   'http://localhost:5000/api/v1/companies/6f2b3bce-52c8-4b56-9e7c-d9b5d2b70f16/personnel-company?PageNumber=1&PageSize=10&SearchTerm=Abena' \   -H 'accept: text/plain; x-api-version=1.0' \   -H 'Authorization: Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ikpvc2VwaGluZSIsInBob25lTnVtYmVyIjoiMDU1NjQwMjcyNyIsImdoYW5hQ2FyZElkIjoiR0hBLTAwMjE1MDQ1NS02IiwiZW1haWwiOiJqa3dha3llMDAxQGdtYWlsLmNvbSIsInVzZXJJZCI6InVzZXIxIiwicmVnaW9uIjoiR3JlYXRlciBBY2NyYSIsImRpc3RyaWN0IjoiR3JlYXRlciBBY2NyYSIsImNvbXBhbnlJZCI6IjZmMmIzYmNlLTUyYzgtNGI1Ni05ZTdjLWQ5YjVkMmI3MGYxNiIsImNvbXBhbnlOYW1lIjoiSHVidGVsIEx0ZCIsIm5iZiI6MTc1NTE4MjU0MSwiZXhwIjoxNzU1Nzg3MzQxLCJpc3MiOiJodHRwczovL2FwaS1hdXRoLmdvdi1naC5jb20iLCJhdWQiOiJodHRwczovL2FwcC1tb2JpbGUuZ292LWdoLmNvbSJ9.0nudkILreQiuGP42-rSUSR5PWZvs_4XSBYQiyEkv8ZQ'