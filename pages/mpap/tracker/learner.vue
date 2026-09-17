<script setup>
definePageMeta({ layout: "default" });
useHead({ title: "MPAP — Learner Tracker" });

const user = useSupabaseUser();
const loading = ref(true);
const errorMsg = ref("");
const lessons = ref([]);
const learners = ref([]);

const load = async () => {
  if (!user.value?.id) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    const data = await $fetch("/api/mpap/learner-progress", { query: { userId: user.value.id } });
    lessons.value = data.lessons || [];
    learners.value = data.learners || [];
  } catch (e) {
    errorMsg.value = e?.statusMessage || e?.data?.statusMessage || "Could not load learner progress.";
  } finally {
    loading.value = false;
  }
};
onMounted(load);
watch(() => user.value?.id, load);

const isDone = (learner, lessonId) => learner.completedLessonIds.includes(lessonId);
const pct = (learner) => learner.totalLessons ? Math.round((learner.completedCount / learner.totalLessons) * 100) : 0;
</script>

<template>
  <v-container class="py-6">
    <NuxtLink to="/mpap" class="no-underline text-caption text-indigo">&larr; MPAP home</NuxtLink>
    <h1 class="text-h5 font-weight-bold mt-2 mb-1">Learner Tracker</h1>
    <p class="text-body-2 text-grey mb-5">Monitor how your learners are progressing through the MPAP lessons.</p>

    <v-alert v-if="errorMsg" type="warning" variant="tonal" class="mb-4">{{ errorMsg }}</v-alert>
    <div v-if="loading" class="py-10 text-center"><v-progress-circular indeterminate color="indigo" /></div>

    <template v-else>
      <div v-if="!learners.length" class="text-body-2 text-grey">
        No learners linked to your classes yet. Enrol learners from the school dashboard first.
      </div>

      <v-card v-else rounded="lg" elevation="1" class="pa-2">
        <v-table density="comfortable" class="mpap-grid">
          <thead>
            <tr>
              <th class="sticky-col">Learner</th>
              <th class="text-center">Progress</th>
              <th v-for="l in lessons" :key="l.id" class="text-center lesson-head">
                <span :title="l.title">{{ l.mpap_standards?.code || l.title }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="learner in learners" :key="learner.student.id">
              <td class="sticky-col">
                <div class="font-weight-medium">{{ learner.student.firstName }} {{ learner.student.lastName }}</div>
                <div class="text-caption text-grey">{{ learner.student.email }}</div>
              </td>
              <td class="text-center" style="min-width: 120px;">
                <v-progress-linear :model-value="pct(learner)" color="indigo" height="16" rounded>
                  <span class="text-caption">{{ pct(learner) }}%</span>
                </v-progress-linear>
              </td>
              <td v-for="l in lessons" :key="l.id" class="text-center">
                <v-icon v-if="isDone(learner, l.id)" color="green" size="18">mdi-check-circle</v-icon>
                <v-icon v-else color="grey-lighten-1" size="18">mdi-circle-outline</v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </template>
  </v-container>
</template>

<style scoped>
.no-underline { text-decoration: none; }
.mpap-grid .lesson-head { font-size: .72rem; white-space: nowrap; }
.sticky-col { position: sticky; left: 0; background: var(--v-theme-surface, #fff); z-index: 1; }
</style>
