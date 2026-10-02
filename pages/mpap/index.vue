<script setup>
definePageMeta({ layout: "default" });
useHead({ title: "MPAP — Maths Practical Application Package" });

const { getStandards, getMyProgress } = useMpap();
const standards = ref([]);
const progress = ref([]);

onMounted(async () => {
  [standards.value, progress.value] = await Promise.all([getStandards(), getMyProgress()]);
});

const grades = [7, 8, 9];
const countForGrade = (g) => standards.value.filter((s) => s.grade === g).length;
const totalStandards = computed(() => standards.value.length || 60);
const completedCount = computed(() => progress.value.filter((p) => p.completed).length);
</script>

<template>
  <div class="mpap-wrap">
    <section class="mpap-hero">
      <v-container>
        <v-chip color="white" variant="flat" size="small" class="mb-3 text-indigo font-weight-bold">PREMIUM</v-chip>
        <h1 class="text-h4 font-weight-bold text-white mb-2">Maths Practical Application Package</h1>
        <p class="text-body-1 text-white" style="max-width: 640px; opacity: .92;">
          A complete, ready-to-teach maths package for Grades 7–9, built around NaCCA's
          60 minimum standards — worksheets, practical videos, answer guides and progress trackers.
        </p>
        <div class="d-flex ga-6 mt-5 flex-wrap">
          <div><div class="text-h5 text-white font-weight-bold">{{ totalStandards }}</div><div class="text-caption text-white">NaCCA standards</div></div>
          <div><div class="text-h5 text-white font-weight-bold">3</div><div class="text-caption text-white">Grades covered</div></div>
          <div><div class="text-h5 text-white font-weight-bold">{{ completedCount }}</div><div class="text-caption text-white">Lessons you've completed</div></div>
        </div>
      </v-container>
    </section>

    <v-container class="py-8">
      <h2 class="text-h6 font-weight-bold mb-4">Choose a grade</h2>
      <v-row>
        <v-col v-for="g in grades" :key="g" cols="12" md="4">
          <NuxtLink :to="`/mpap/grade-${g}`" class="no-underline">
            <v-card class="grade-card" rounded="lg" elevation="1">
              <v-container class="d-flex align-center">
                <v-avatar color="indigo" size="52" class="mr-4"><span class="text-h6 text-white">B{{ g }}</span></v-avatar>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Grade {{ g }}</h3>
                  <p class="text-caption text-grey mb-0">{{ countForGrade(g) }} standards</p>
                </div>
                <v-spacer />
                <v-icon color="indigo">mdi-chevron-right</v-icon>
              </v-container>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>

      <div class="mt-8">
        <NuxtLink to="/mpap/tracker/learner" class="no-underline">
          <v-btn color="indigo" variant="tonal" prepend-icon="mdi-chart-line">Open Learner Tracker</v-btn>
        </NuxtLink>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.no-underline { text-decoration: none; }
.mpap-hero { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 3rem 0; }
.grade-card { transition: transform .15s ease, box-shadow .15s ease; }
.grade-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
</style>
