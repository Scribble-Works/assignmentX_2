<template>
  <div class="thumbs-rating">
    <v-card variant="flat" class="pa-3">
      <div class="d-flex align-center gap-4">
        <!-- Thumbs Up Button -->
        <div class="d-flex align-center">
          <v-btn
            :color="userVote === 'up' ? 'success' : 'grey'"
            :variant="userVote === 'up' ? 'flat' : 'outlined'"
            @click="handleThumbsUp"
            :loading="loading"
            size="large"
            class="thumbs-btn"
            :class="{ 'pulse-animation': justVoted === 'up' }"
          >
            <v-icon size="28">
              {{ userVote === "up" ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}
            </v-icon>
          </v-btn>
          <span class="text-subtitle-1 font-weight-medium ml-2">
            {{ formatNumber(thumbsUp) }}
          </span>
        </div>

        <!-- Divider -->
        <v-divider vertical class="mx-2"></v-divider>

        <!-- Thumbs Down Button -->
        <div class="d-flex align-center">
          <v-btn
            :color="userVote === 'down' ? 'error' : 'grey'"
            :variant="userVote === 'down' ? 'flat' : 'outlined'"
            @click="handleThumbsDown"
            :loading="loading"
            size="large"
            class="thumbs-btn"
            :class="{ 'pulse-animation': justVoted === 'down' }"
          >
            <v-icon size="28">
              {{
                userVote === "down"
                  ? "mdi-thumb-down"
                  : "mdi-thumb-down-outline"
              }}
            </v-icon>
          </v-btn>
          <span class="text-subtitle-1 font-weight-medium ml-2">
            {{ formatNumber(thumbsDown) }}
          </span>
        </div>
      </div>

      <!-- Optional percentage display -->
      <div v-if="showPercentage && totalVotes > 0" class="text-center mt-3">
        <v-progress-linear
          :model-value="positivePercentage"
          height="8"
          color="success"
          bg-color="error"
          rounded
          class="mb-2"
        ></v-progress-linear>
        <div class="text-caption text-grey">
          {{ positivePercentage.toFixed(0) }}% positive ({{
            formatNumber(totalVotes)
          }}
          {{ totalVotes === 1 ? "vote" : "votes" }})
        </div>
      </div>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccess"
      :timeout="2000"
      :color="successColor"
      location="bottom"
    >
      <v-icon class="mr-2">{{ successIcon }}</v-icon>
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useVideoRatings } from "~/composables/useVideoRatings";

const props = defineProps({
  // Unique identifier for this content
  contentId: {
    type: String,
    required: true,
  },
  // Show percentage bar
  showPercentage: {
    type: Boolean,
    default: true,
  },
  // Initial thumbs up count
  initialThumbsUp: {
    type: Number,
    default: 0,
  },
  // Initial thumbs down count
  initialThumbsDown: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["vote-changed"]);

const { getVideoRating, toggleLike, toggleDislike, generateVideoId } =
  useVideoRatings();

// Generate video identifier
const videoIdentifier = computed(() => props.contentId || null);

// State
const thumbsUp = ref(props.initialThumbsUp);
const thumbsDown = ref(props.initialThumbsDown);
const userVote = ref(null); // null, 'up', or 'down'
const loading = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");
const successColor = ref("success");
const successIcon = ref("mdi-thumb-up");
const justVoted = ref(null);

// Computed
const totalVotes = computed(() => thumbsUp.value + thumbsDown.value);
const positivePercentage = computed(() => {
  if (totalVotes.value === 0) return 0;
  return (thumbsUp.value / totalVotes.value) * 100;
});

// Format numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Load ratings from database
const loadRatings = async () => {
  try {
    const data = await getVideoRating(videoIdentifier.value);
    thumbsUp.value = data.likes;
    thumbsDown.value = data.dislikes;
    if (data.userLiked) {
      userVote.value = "up";
    } else if (data.userDisliked) {
      userVote.value = "down";
    } else {
      userVote.value = null;
    }
  } catch (error) {
    console.error("Error loading ratings:", error);
  }
};

// Handle thumbs up click
const handleThumbsUp = async () => {
  if (loading.value) return;

  loading.value = true;
  justVoted.value = "up";

  try {
    const previousVote = userVote.value;
    const result = await toggleLike(videoIdentifier.value);

    if (result) {
      thumbsUp.value = result.likes;
      thumbsDown.value = result.dislikes;
      userVote.value = result.liked ? "up" : null;
    }

    if (userVote.value === "up") {
      successMessage.value = "Thanks for the thumbs up!";
      successColor.value = "success";
      successIcon.value = "mdi-thumb-up";
    } else {
      successMessage.value = "Vote removed";
      successColor.value = "grey";
      successIcon.value = "mdi-thumb-up-outline";
    }

    showSuccess.value = true;

    emit("vote-changed", {
      contentId: props.contentId,
      vote: userVote.value,
      previousVote,
      thumbsUp: thumbsUp.value,
      thumbsDown: thumbsDown.value,
    });
  } catch (error) {
    console.error("Error handling thumbs up:", error);
  } finally {
    loading.value = false;
    setTimeout(() => {
      justVoted.value = null;
    }, 600);
  }
};

// Handle thumbs down click
const handleThumbsDown = async () => {
  if (loading.value) return;

  loading.value = true;
  justVoted.value = "down";

  try {
    const previousVote = userVote.value;
    const result = await toggleDislike(videoIdentifier.value);

    if (result) {
      thumbsUp.value = result.likes;
      thumbsDown.value = result.dislikes;
      userVote.value = result.disliked ? "down" : null;
    }

    if (userVote.value === "down") {
      successMessage.value = "Thanks for your feedback";
      successColor.value = "info";
      successIcon.value = "mdi-thumb-down";
    } else {
      successMessage.value = "Vote removed";
      successColor.value = "grey";
      successIcon.value = "mdi-thumb-down-outline";
    }

    showSuccess.value = true;

    emit("vote-changed", {
      contentId: props.contentId,
      vote: userVote.value,
      previousVote,
      thumbsUp: thumbsUp.value,
      thumbsDown: thumbsDown.value,
    });
  } catch (error) {
    console.error("Error handling thumbs down:", error);
  } finally {
    loading.value = false;
    setTimeout(() => {
      justVoted.value = null;
    }, 600);
  }
};

// Load on mount
onMounted(() => {
  loadRatings();
});

// Watch for content ID changes
watch(
  () => props.contentId,
  () => {
    loadRatings();
  },
);
</script>

<style scoped>
.thumbs-rating {
  width: auto;
}

.thumbs-btn {
  transition: all 0.3s ease;
}

.thumbs-btn:hover {
  transform: scale(1.05);
}

.pulse-animation {
  animation: pulse 0.6s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.gap-4 {
  gap: 16px;
}
</style>
