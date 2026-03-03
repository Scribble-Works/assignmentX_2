<template>
  <div class="video-ratings-section">
    <v-card variant="flat" class="pa-4">
      <v-row align="center" justify="space-between">
        <!-- Like Section -->
        <v-col cols="12" sm="6" md="4">
          <div class="d-flex align-center">
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

        <!-- Rating Section -->
        <v-col cols="12" sm="6" md="8">
          <div class="d-flex align-center justify-end">
            <span class="text-subtitle-2 mr-3">Rate this video:</span>
            <v-rating
              v-model="userRating"
              @update:model-value="handleRating"
              :length="5"
              :size="32"
              color="amber"
              active-color="amber"
              hover
              :loading="ratingLoading"
            ></v-rating>
            <div class="ml-3 text-center">
              <div class="text-h6 font-weight-bold">
                {{ averageRating.toFixed(1) }}
              </div>
              <div class="text-caption text-grey">
                ({{ formatNumber(totalRatings) }}
                {{ totalRatings === 1 ? "rating" : "ratings" }})
              </div>
            </div>
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
        <template v-else>
          <v-icon class="mr-2">mdi-star</v-icon>
          Thanks for rating this video!
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

const { getVideoRating, toggleLike, rateVideo, generateVideoId } =
  useVideoRatings();

// State
const likes = ref(0);
const averageRating = ref(0);
const totalRatings = ref(0);
const userLiked = ref(false);
const userRating = ref(0);
const likeLoading = ref(false);
const ratingLoading = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");
const justLiked = ref(false);

// Generate or use provided video ID
const videoIdentifier = props.videoId || generateVideoId(props.videoUrl);

// Load initial data
const loadRatings = async () => {
  const data = await getVideoRating(videoIdentifier);
  likes.value = data.likes;
  averageRating.value = data.rating;
  totalRatings.value = data.totalRatings || 0;
  userLiked.value = data.userLiked;
  userRating.value = data.userRating;
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
    const newLikedStatus = await toggleLike(videoIdentifier);
    userLiked.value = newLikedStatus;

    // Update likes count
    if (newLikedStatus) {
      likes.value += 1;
      successMessage.value = "liked";
    } else {
      likes.value = Math.max(likes.value - 1, 0);
      successMessage.value = "unliked";
    }

    showSuccess.value = true;

    // Reload to sync with database
    setTimeout(() => loadRatings(), 500);
  } catch (error) {
    console.error("Error liking video:", error);
  } finally {
    likeLoading.value = false;
    setTimeout(() => {
      justLiked.value = false;
    }, 600);
  }
};

// Handle rating change
const handleRating = async (newRating) => {
  if (newRating === userRating.value) return;

  ratingLoading.value = true;

  try {
    await rateVideo(videoIdentifier, newRating);
    successMessage.value = "rated";
    showSuccess.value = true;

    // Reload to get updated average
    setTimeout(() => loadRatings(), 500);
  } catch (error) {
    console.error("Error rating video:", error);
  } finally {
    ratingLoading.value = false;
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
