<script setup>
definePageMeta({ layout: "default" });
const route = useRoute();
const grade = route.params.grade;
useHead({ title: `MPAP — Grade ${grade}` });

const { getLessonsByGrade, getMyProgress } = useMpap();
const lessons = ref([]);
const progress = ref([]);

onMounted(async () => {
  [lessons.value, progress.value] = await Promise.all([
    getLessonsByGrade(grade),
    getMyProgress(),
  ]);
});

const completedIds = computed(() => new Set(progress.value.filter((p) => p.completed).map((p) => p.lesson_id)));

// Group lessons by strand for a clear package structure.
const byStrand = computed(() => {
  const groups = {};
  for (const l of lessons.value) {
    const strand = l.mpap_standards?.strand || "Other";
    (groups[strand] ||= []).push(l);
  }
  return groups;
});
</script>

<template>
  <v-container class="py-6">
    <NuxtLink to="/mpap" class="no-underline text-caption text-indigo">&larr; All grades</NuxtLink>
    <h1 class="text-h5 font-weight-bold mt-2 mb-1">Grade {{ grade }} — MPAP Lessons</h1>
    <p class="text-body-2 text-grey mb-6">Ready-to-teach packages aligned to NaCCA minimum standards.</p>

    <div v-if="!lessons.length" class="text-body-2 text-grey">
      No lessons published for this grade yet.
    </div>

    <div v-for="(group, strand) in byStrand" :key="strand" class="mb-8">
      <h2 class="text-subtitle-1 font-weight-bold mb-3">{{ strand }}</h2>
      <v-row>
        <v-col v-for="lesson in group" :key="lesson.id" cols="12" sm="6" md="4">
          <MpapLessonCard :lesson="lesson" :completed="completedIds.has(lesson.id)" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.no-underline { text-decoration: none; }
</style>
