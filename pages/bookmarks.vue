<template>
  <div class="w-[80%] mx-auto px-4 py-10">
    <!-- Top bar: search THEN bookmarks -->
    <div class="flex flex-col gap-4 mb-6">
      <!-- Search input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search chapters and topics..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Bookmarks badge aligned right -->
      <div class="w-full flex justify-end">
        <button
          class="flex items-center gap-2 bg-yellow-200 border border-yellow-900 transition-colors px-3 py-3 rounded-md text-white font-medium text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="#FFA807"
          >
            <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
          </svg>
          <p class="text-black">Bookmarks</p>
          <span
            class="bg-yellow-500 text-black rounded-full px-2 py-1 text-xs font-bold"
          >
            {{ filteredBookmarks.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredBookmarks.length === 0"
      class="text-center text-gray-500 mt-20"
    >
      <p>No bookmarks found.</p>
    </div>

    <!-- Bookmarked items list -->
    <ul v-else class="space-y-4">
      <li v-for="(file, index) in filteredBookmarks" :key="index">
        <NuxtLink
          :to="`/workbookdetail/${encodeURIComponent(file)}`"
          class="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:bg-gray-50 transition"
        >
          <div class="flex items-center space-x-4">
            <!-- Image Icon -->
            <div class="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-5.828-5.828A2 2 0 0014.172 1H5zm9 1.414L20.586 9H15a1 1 0 01-1-1V4.414z"
                />
              </svg>
            </div>

            <!-- File name -->
            <span class="text-sm text-gray-800">{{ file }}</span>
          </div>

          <!-- Bookmark icon -->
          <div class="text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Simulated bookmarked list
const bookmarks = ref([
  "1_Identifying even, odd, prime and composite numbers_1.png",
  "2_Finding prime factors of natural numbers_2.png",
  "3_Finding the HCF of natural numbers_3.png",
  "4_Finding the LCM of natural numbers_4.png",
  "5_Addition and subtraction of whole numbers_5.png",
  "6_Addition and subtraction of whole numbers_5.png",
  "7_Addition and subtraction of whole numbers_5.png",
]);

const searchQuery = ref("");

const filteredBookmarks = computed(() =>
  bookmarks.value.filter((file) =>
    file.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
</script>
