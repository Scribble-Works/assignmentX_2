<script setup>
// Renders the practical-maths videos for an MPAP lesson.
// Built now: when video_url is null / status is 'coming_soon' we show a
// placeholder. When the URL is filled in later, it renders via <vids>.
const props = defineProps({
  videos: { type: Array, default: () => [] },
});
const isReady = (v) => v.status === "published" && !!v.video_url;
</script>

<template>
  <div>
    <div v-if="!videos.length" class="text-body-2 text-grey">
      Practical video lessons for this package will appear here.
    </div>

    <v-row v-else>
      <v-col v-for="v in videos" :key="v.id" cols="12" md="6">
        <template v-if="isReady(v)">
          <p class="text-subtitle-1 font-weight-medium mb-1">{{ v.title }}</p>
          <vids :url="v.video_url" :videoId="v.id" :showSampleQuestions="false" />
        </template>

        <!-- Coming-soon placeholder -->
        <v-card v-else variant="tonal" color="blue-grey" class="video-placeholder">
          <div class="d-flex flex-column align-center justify-center text-center pa-8">
            <v-icon size="48" color="blue-grey-darken-1">mdi-play-circle-outline</v-icon>
            <p class="text-subtitle-1 font-weight-medium mt-3 mb-1">{{ v.title }}</p>
            <p class="text-caption text-grey mb-2" v-if="v.description">{{ v.description }}</p>
            <v-chip size="small" color="amber-darken-2" variant="flat">Coming soon</v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.video-placeholder { border: 1px dashed rgba(120, 144, 156, 0.5); border-radius: 12px; }
</style>
