import { ref, computed, readonly } from 'vue'

// Create a reactive bookmarks array
const bookmarks = ref([])

// Initialize bookmarks from localStorage on client side
if (process.client) {
  const savedBookmarks = localStorage.getItem('bookmarks')
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks)
  }
}

// Function to add a bookmark
const addBookmark = (item) => {
  if (!bookmarks.value.includes(item)) {
    bookmarks.value.push(item)
    saveToStorage()
  }
}

// Function to remove a bookmark
const removeBookmark = (item) => {
  const index = bookmarks.value.indexOf(item)
  if (index > -1) {
    bookmarks.value.splice(index, 1)
    saveToStorage()
  }
}

// Function to toggle a bookmark
const toggleBookmark = (item) => {
  const index = bookmarks.value.indexOf(item)
  if (index > -1) {
    removeBookmark(item)
  } else {
    addBookmark(item)
  }
}

// Function to check if an item is bookmarked
const isBookmarked = (item) => {
  return bookmarks.value.includes(item)
}

// Function to save bookmarks to localStorage
const saveToStorage = () => {
  if (process.client) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value))
  }
}

// Computed property for bookmark count
const bookmarkCount = computed(() => bookmarks.value.length)

// Function to clear all bookmarks
const clearBookmarks = () => {
  bookmarks.value = []
  saveToStorage()
}

export function useBookmarks() {
  return {
    bookmarks: readonly(bookmarks),
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    bookmarkCount,
    clearBookmarks
  }
} 