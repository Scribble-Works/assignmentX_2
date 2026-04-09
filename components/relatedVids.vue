<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useVideoRatings } from "~/composables/useVideoRatings";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["play"]);

const { getVideoRating, generateVideoId } = useVideoRatings();

// Live like/dislike counts from DB
const likes = ref(0);
const dislikes = ref(0);

// Generate video identifier from URL
const videoIdentifier = computed(
  () => props.videoId || generateVideoId(props.url),
);

// Load ratings from database
const loadRatings = async () => {
  try {
    const data = await getVideoRating(videoIdentifier.value);
    likes.value = data.likes;
    dislikes.value = data.dislikes;
  } catch (error) {
    console.error("Error loading related video ratings:", error);
  }
};

onMounted(() => {
  loadRatings();
});

watch(
  () => props.url,
  () => {
    loadRatings();
  },
);

// Extract video ID from YouTube URL to get thumbnail
const extractYoutubeId = (url) => {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/watch\?.*v=([^&\?\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const youtubeId = computed(() => extractYoutubeId(props.url));
const thumbnailUrl = computed(() => {
  if (youtubeId.value) {
    // Using maxresdefault for highest quality, fallback to hqdefault
    return `https://img.youtube.com/vi/${youtubeId.value}/hqdefault.jpg`;
  }
  return "/img/video-placeholder.png"; // Fallback placeholder
});

const isHovered = ref(false);

const handlePlay = () => {
  emit("play", props.url);
};
</script>

<template>
  <div
    class="related-video-container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handlePlay"
  >
    <!-- Video Thumbnail -->
    <div class="thumbnail-wrapper">
      <img
        :src="thumbnailUrl"
        :alt="`Video thumbnail`"
        class="video-thumbnail"
      />

      <!-- Play Button Overlay -->
      <div class="play-overlay" :class="{ hovered: isHovered }">
        <div class="play-button-wrapper">
          <v-btn
            icon
            size="x-large"
            color="white"
            class="play-button"
            elevation="8"
          >
            <v-icon size="48" color="red">mdi-play-circle</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Duration Badge (optional - you can remove if not needed) -->
      <!-- <div class="duration-badge">
        <span>5:30</span>
      </div> -->
    </div>

    <!-- Likes/Dislikes Display -->
    <div class="likes-bar">
      <div class="likes-info">
        <v-icon size="16" color="grey-darken-1">mdi-thumb-up-outline</v-icon>
        <span>{{ likes }}</span>
      </div>
      <div class="likes-info">
        <v-icon size="16" color="grey-darken-1">mdi-thumb-down-outline</v-icon>
        <span>{{ dislikes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.related-video-container {
  position: relative;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
  transition: all 0.3s ease;
}

.related-video-container:hover {
  box-shadow: 0 4px 12px 0 rgba(63, 69, 81, 0.24);
  transform: translateY(-2px);
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-color: #000;
}

.video-thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-overlay.hovered {
  background: rgba(0, 0, 0, 0.4);
}

.play-button-wrapper {
  transition: transform 0.3s ease;
}

.play-overlay.hovered .play-button-wrapper {
  transform: scale(1.15);
}

.play-button {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.play-button:hover {
  background: rgba(255, 255, 255, 1) !important;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .play-button {
    transform: scale(0.9);
  }
}

@media (max-width: 600px) {
  .play-button {
    transform: scale(0.8);
  }
}

.likes-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 10px;
  background: #f5f5f5;
  font-size: 13px;
  color: #616161;
}

.likes-info {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
