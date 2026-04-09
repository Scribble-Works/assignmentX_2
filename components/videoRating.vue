<template>
  <div class="video-ratings-section">
    <v-card variant="flat" class="pa-4">
      <v-row align="center" justify="center">
        <!-- Like Section Only -->
        <v-col cols="12" sm="auto">
          <div class="d-flex align-center justify-center">
            <v-btn
              :color="userLiked ? 'red' : 'grey'"
              :variant="userLiked ? 'flat' : 'outlined'"
              @click="handleLike"
              :loading="likeLoading"
              size="large"
              class="mr-2"
            >
              <v-icon :class="{ 'animate-like': justLiked }">
                {{ userLiked ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
              <span class="ml-2">{{ userLiked ? "Liked" : "Like" }}</span>
            </v-btn>
            <span class="text-subtitle-1 font-weight-medium">
              {{ formatNumber(likes) }} {{ likes === 1 ? "like" : "likes" }}
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- Success Message -->
      <v-snackbar
        v-model="showSuccess"
        :timeout="2000"
        color="success"
        location="bottom"
      >
        <template v-if="successMessage === 'liked'">
          <v-icon class="mr-2">mdi-heart</v-icon>
          Thanks for liking this video!
        </template>
        <template v-else-if="successMessage === 'unliked'">
          <v-icon class="mr-2">mdi-heart-outline</v-icon>
          Like removed
        </template>
      </v-snackbar>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useVideoRatings } from "~/composables/useVideoRatings";

const props = defineProps({
  videoUrl: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    default: null,
  },
});

const { getVideoRating, toggleLike, generateVideoId } = useVideoRatings();

// State
const likes = ref(0);
const userLiked = ref(false);
const likeLoading = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");
const justLiked = ref(false);

// Generate or use provided video ID
const videoIdentifier = props.videoId || generateVideoId(props.videoUrl);

// Load initial data
const loadRatings = async () => {
  const data = await getVideoRating(videoIdentifier);
  likes.value = data.likes;
  userLiked.value = data.userLiked;
};

onMounted(() => {
  loadRatings();
});

// Watch for video URL changes
watch(
  () => props.videoUrl,
  () => {
    loadRatings();
  },
);

// Handle like button click
const handleLike = async () => {
  likeLoading.value = true;
  justLiked.value = true;

  try {
    const result = await toggleLike(videoIdentifier);

    if (result) {
      likes.value = result.likes;
      userLiked.value = result.liked;
    }

    successMessage.value = userLiked.value ? "liked" : "unliked";
    showSuccess.value = true;
  } catch (error) {
    console.error("Error liking video:", error);
  } finally {
    likeLoading.value = false;
    setTimeout(() => {
      justLiked.value = false;
    }, 600);
  }
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
</script>

<style scoped>
.video-ratings-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@keyframes like-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.animate-like {
  animation: like-animation 0.6s ease;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .video-ratings-section :deep(.v-rating) {
    transform: scale(0.8);
  }
}
</style>
