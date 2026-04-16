<script setup>
import { useVideoRatings } from "~/composables/useVideoRatings";
import { computed, ref } from "vue";

const { generateVideoId } = useVideoRatings();
const client = useSupabaseClient();
const user = useSupabaseUser();

const props = defineProps({
  intro: String,
  showRating: {
    type: Boolean,
    default: true,
  },
  videoId: {
    type: String,
    default: null,
  },
});

const videoIdentifier = computed(
  () => props.videoId || generateVideoId(props.intro),
);

// Issue dialog state
const showIssueDialog = ref(false);
const issueText = ref("");
const issueLoading = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const handleRaiseIssue = () => {
  showIssueDialog.value = true;
};

const submitIssue = async () => {
  if (!issueText.value.trim()) return;
  issueLoading.value = true;

  try {
    const { error } = await client.from("video_issues").insert({
      video_id: videoIdentifier.value,
      video_url: props.intro,
      user_id: user.value?.id || null,
      issue_description: issueText.value.trim(),
    });

    if (error) throw error;

    showIssueDialog.value = false;
    issueText.value = "";
    showSuccess.value = true;
  } catch (err) {
    console.error("Error submitting issue:", err);
    errorMessage.value = "Failed to submit issue. Please try again.";
    showError.value = true;
  } finally {
    issueLoading.value = false;
  }
};
</script>
<template>
  <div>
    <div
      style="
        position: relative;
        width: 100%;
        height: 80%;
        padding-top: 46.25%;
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
        :src="intro"
        frameborder="0"
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
      ></iframe>
    </div>

    <!-- Video Rating Component -->
    <!-- <VideoRating
      v-if="showRating && intro"
      :videoUrl="intro"
      :videoId="videoId"
    /> -->
    <v-card variant="flat" class="pa-4 mt-n2 vid-note-rating">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="auto">
          <thumbs-rating
            v-if="showRating && intro"
            :contentId="videoIdentifier"
            :initialThumbsUp="0"
            :initialThumbsDown="0"
          />
        </v-col>
        <v-col cols="12" md="auto" class="text-md-right text-left">
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
    </v-card>

    <!-- Raise Issue Dialog -->
    <v-dialog v-model="showIssueDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-flag-outline</v-icon>
          Report an Issue
        </v-card-title>
        <v-card-text>
          <p class="mb-3 text-body-2 text-grey-darken-1">
            Describe the issue you encountered with this video.
          </p>
          <v-textarea
            v-model="issueText"
            label="Describe the issue"
            placeholder="e.g. Video not loading, audio out of sync, incorrect content..."
            rows="4"
            variant="outlined"
            counter="500"
            maxlength="500"
            :disabled="issueLoading"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showIssueDialog = false"
            :disabled="issueLoading"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            @click="submitIssue"
            :loading="issueLoading"
            :disabled="!issueText.trim()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccess"
      :timeout="3000"
      color="success"
      location="bottom"
    >
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Issue reported successfully. Thank you!
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="3000"
      color="error"
      location="bottom"
    >
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>
<style>
/* .vid-note-rating {
  background-color: #F6F6F6;
} */
</style>
