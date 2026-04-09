<script setup>
import { ref, onMounted, watch } from "vue";
import { useVideoRatings } from "~/composables/useVideoRatings";

const props = defineProps({
  conceptNote: String,
  conceptNoteId: {
    type: String,
    default: null,
  },
});

const { getVideoRating, rateVideo, generateVideoId } = useVideoRatings();

// State
const averageRating = ref(0);
const totalRatings = ref(0);
const userRating = ref(0);
const ratingLoading = ref(false);
const showSuccess = ref(false);
const showIssueDialog = ref(false);

// Generate or use provided concept note ID (computed for reactivity)
const noteIdentifier = computed(
  () => props.conceptNoteId || generateVideoId(props.conceptNote),
);

// Load initial data
const loadRatings = async () => {
  const id = noteIdentifier.value;
  if (!id) return;
  const data = await getVideoRating(id);
  averageRating.value = data.rating;
  totalRatings.value = data.totalRatings || 0;
  userRating.value = data.userRating;
};

onMounted(() => {
  loadRatings();
});

// Watch for concept note changes
watch(
  () => props.conceptNote,
  () => {
    loadRatings();
  },
);

// Handle rating change
const handleRating = async (newRating) => {
  if (ratingLoading.value) return;
  ratingLoading.value = true;

  try {
    await rateVideo(noteIdentifier.value, newRating);
    userRating.value = newRating;
    showSuccess.value = true;

    // Reload to get updated average
    await loadRatings();
  } catch (error) {
    console.error("Error rating concept note:", error);
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

// Handle raise issue button
const handleRaiseIssue = () => {
  showIssueDialog.value = true;
  // TODO: Implement issue reporting functionality
  console.log("Raise issue clicked for:", noteIdentifier.value);
};
</script>
<template>
  <div>
    <div
      style="
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 56.25%;
        padding-bottom: 0;
        box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
        margin-top: 1.6em;
        margin-bottom: 0.9em;
        overflow: hidden;
        border-radius: 8px;
        will-change: transform;
      "
    >
      <iframe
        :src="conceptNote"
        frameborder="0"
        height="80%"
        width="100%"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        style="
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border: none;
          padding: 0;
          margin: 0;
        "
      ></iframe
      ><br />
    </div>

    <!-- Star Rating Section -->
    <v-card variant="flat" class="pa-4 concept-note-rating">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="auto">
          <div class="d-flex align-center flex-wrap">
            <span style="font-size: 1.2em" class="mr-3"
              >Rate this concept note:</span
            >
            <v-rating
              :model-value="userRating"
              @update:model-value="handleRating"
              :length="5"
              :size="32"
              color="amber"
              active-color="amber"
              hover
              :readonly="ratingLoading"
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

        <v-col cols="12" md="auto" class="text-right">
          <v-btn
            color="error"
            variant="outlined"
            @click="handleRaiseIssue"
            prepend-icon="mdi-flag-outline"
          >
            Raise an Issue
          </v-btn>
        </v-col>
      </v-row>

      <!-- Success Message -->
      <v-snackbar
        v-model="showSuccess"
        :timeout="2000"
        color="success"
        location="bottom"
      >
        <v-icon class="mr-2">mdi-star</v-icon>
        Thanks for rating this concept note!
      </v-snackbar>
    </v-card>
  </div>
</template>

<style scoped>
.concept-note-rating {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.concept-note-rating :deep(.v-rating) {
  cursor: pointer;
}

.concept-note-rating :deep(.v-rating .v-icon) {
  transition: all 0.2s ease;
}

.concept-note-rating :deep(.v-rating .v-icon:hover) {
  transform: scale(1.2);
}

@media (max-width: 600px) {
  .concept-note-rating .text-subtitle-2 {
    margin-right: 0 !important;
  }

  .concept-note-rating .text-right {
    text-align: left !important;
    margin-top: 1rem;
  }
}
</style>
