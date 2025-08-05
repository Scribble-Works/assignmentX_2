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
            {{ bookmarkCount }}
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
        <div class="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:bg-gray-50 transition">
          <NuxtLink
            :to="`/workbookdetail/${encodeURIComponent(file)}`"
            class="flex items-center space-x-4 flex-1"
          >
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
          </NuxtLink>

          <!-- Remove bookmark button -->
          <button 
            @click="removeBookmarkItem(file)"
            class="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Remove bookmark"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBookmarks } from "~/composables/useBookmarks";

const { bookmarks, removeBookmark, bookmarkCount } = useBookmarks();

const searchQuery = ref("");

const filteredBookmarks = computed(() =>
  bookmarks.value.filter((file) =>
    file.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const removeBookmarkItem = (file) => {
  removeBookmark(file);
};
</script>
