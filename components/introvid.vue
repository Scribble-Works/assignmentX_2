<script setup>
import { useVideoRatings } from "~/composables/useVideoRatings";
import { computed } from "vue";

const { generateVideoId } = useVideoRatings();

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

// Handle raise issue button
const handleRaiseIssue = () => {
  // TODO: Implement issue reporting functionality
  console.log("Raise issue clicked for video:", videoIdentifier.value);
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
  </div>
</template>
<style>
/* .vid-note-rating {
  background-color: #F6F6F6;
} */
</style>
