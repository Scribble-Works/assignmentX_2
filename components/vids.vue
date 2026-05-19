<script setup>
import { useVideoRatings } from "~/composables/useVideoRatings";
import { computed } from "vue";

const { generateVideoId } = useVideoRatings();

const props = defineProps({
  url: String,
  showRating: {
    type: Boolean,
    default: true,
  },
  videoId: {
    type: String,
    default: null,
  },
  sampleQuestions: {
    type: [Array, String, Object],
  },
  showSampleQuestions: {
    type: Boolean,
    default: true,
  },
});

const videoIdentifier = computed(
  () => props.videoId || generateVideoId(props.url),
);

const hasSampleQuestions = computed(() => {
  const value = props.sampleQuestions;

  if (Array.isArray(value)) {
    return value.some((item) => {
      if (typeof item === "string") {
        return item.trim().length > 0;
      }
      return !!item;
    });
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (value && typeof value === "object") {
    if (Array.isArray(value.questions)) {
      return value.questions.some(
        (item) => typeof item === "string" && item.trim().length > 0,
      );
    }

    if (typeof value.url === "string") {
      return value.url.trim().length > 0;
    }

    return false;
  }

  return false;
});

console.log("SampleQuestions:", props.sampleQuestions);
</script>
<template>
  <div>
    <div
      style="
        position: relative;
        width: 100%;
        height: 60%;
        padding-top: 52.25%;
        padding-bottom: 0;
        box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
        margin-top: 1.6em;
        overflow: hidden;
        border-radius: 8px;
        will-change: transform;
      "
    >
      <iframe
        :src="url"
        frameborder="0"
        width="100%"
        height="auto"
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

    <!-- Video Rating Component and sample questions -->
    <v-row>
      <v-col cols="" lg="6" sm="12" md="5">
        <thumbsRating
          class="mt-5"
          v-if="showRating && url"
          :contentId="videoIdentifier"
          :initialThumbsUp="0"
          :initialThumbsDown="0"
        />
      </v-col>
      <v-col
        cols=""
        lg="6"
        sm="12"
        md="5"
        align="right"
        v-if="showSampleQuestions && hasSampleQuestions"
      >
        <sampleQuestionsPopup class="mt-9" :pages="sampleQuestions" />
      </v-col>
    </v-row>
  </div>
</template>
