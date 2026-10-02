<script setup>
const props = defineProps({
  lesson: { type: Object, required: true },
  completed: { type: Boolean, default: false },
});
const std = computed(() => props.lesson.standard || props.lesson.mpap_standards || {});
</script>

<template>
  <NuxtLink :to="`/mpap/lesson-${lesson.id}`" class="no-underline">
    <v-card class="mpap-lesson-card h-100" rounded="lg" elevation="1">
      <v-container>
        <div class="d-flex align-center justify-space-between mb-2">
          <v-chip size="x-small" color="indigo" variant="flat">{{ std.code }}</v-chip>
          <v-icon v-if="completed" color="green" size="20">mdi-check-circle</v-icon>
        </div>
        <h4 class="text-subtitle-1 font-weight-bold mb-1">{{ lesson.title }}</h4>
        <p class="text-caption text-grey mb-0">{{ std.strand }}<span v-if="std.sub_strand"> · {{ std.sub_strand }}</span></p>
      </v-container>
    </v-card>
  </NuxtLink>
</template>

<style scoped>
.no-underline { text-decoration: none; }
.mpap-lesson-card { transition: transform .15s ease, box-shadow .15s ease; }
.mpap-lesson-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
</style>
