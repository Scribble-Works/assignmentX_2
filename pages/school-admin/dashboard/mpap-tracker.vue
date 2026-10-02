<script setup>
// Facilitator Tracker — how the school's TEACHERS are implementing MPAP.
// Gated by middleware/school-admin-auth.global.ts (/school-admin/dashboard).
definePageMeta({ layout: "default" });
useHead({ title: "MPAP — Facilitator Tracker" });

const user = useSupabaseUser();
const loading = ref(true);
const errorMsg = ref("");
const school = ref(null);
const totalLessons = ref(0);
const teachers = ref([]);

const load = async () => {
  if (!user.value?.id) return;
  loading.value = true; errorMsg.value = "";
  try {
    const data = await $fetch("/api/mpap/facilitator-tracker", { query: { userId: user.value.id } });
    school.value = data.school;
    totalLessons.value = data.totalLessons;
    teachers.value = data.teachers || [];
  } catch (e) {
    errorMsg.value = e?.statusMessage || e?.data?.statusMessage || "Could not load the Facilitator Tracker.";
  } finally { loading.value = false; }
};
onMounted(load);
watch(() => user.value?.id, load);

const startedCount = computed(() => teachers.value.filter((t) => t.started).length);
</script>

<template>
  <v-container class="py-6">
    <NuxtLink to="/school-admin/dashboard" class="no-underline text-caption text-indigo">&larr; Dashboard</NuxtLink>
    <h1 class="text-h5 font-weight-bold mt-2 mb-1">Facilitator Tracker</h1>
    <p class="text-body-2 text-grey mb-5">
      Monitor MPAP implementation across your teachers{{ school?.name ? ` at ${school.name}` : "" }}.
    </p>

    <v-alert v-if="errorMsg" type="warning" variant="tonal" class="mb-4">{{ errorMsg }}</v-alert>
    <div v-if="loading" class="py-10 text-center"><v-progress-circular indeterminate color="indigo" /></div>

    <template v-else>
      <v-row class="mb-2">
        <v-col cols="6" md="3"><v-card variant="tonal" color="indigo" class="pa-4"><div class="text-h5 font-weight-bold">{{ teachers.length }}</div><div class="text-caption">Teachers</div></v-card></v-col>
        <v-col cols="6" md="3"><v-card variant="tonal" color="green" class="pa-4"><div class="text-h5 font-weight-bold">{{ startedCount }}</div><div class="text-caption">Actively using MPAP</div></v-card></v-col>
        <v-col cols="6" md="3"><v-card variant="tonal" color="deep-purple" class="pa-4"><div class="text-h5 font-weight-bold">{{ totalLessons }}</div><div class="text-caption">Lessons available</div></v-card></v-col>
      </v-row>

      <v-card rounded="lg" elevation="1" class="pa-2 mt-3">
        <v-table density="comfortable">
          <thead>
            <tr><th>Teacher</th><th class="text-center">Classes</th><th class="text-center">Learners</th><th class="text-center">Active</th><th class="text-center">Lessons delivered</th><th style="min-width:140px;">Coverage</th><th class="text-center">Status</th></tr>
          </thead>
          <tbody>
            <tr v-if="!teachers.length"><td colspan="7" class="text-center text-grey py-4">No teachers linked to this school yet.</td></tr>
            <tr v-for="row in teachers" :key="row.teacher.id">
              <td><div class="font-weight-medium">{{ row.teacher.firstName }} {{ row.teacher.lastName }}</div><div class="text-caption text-grey">{{ row.teacher.email }}</div></td>
              <td class="text-center">{{ row.classes }}</td>
              <td class="text-center">{{ row.students }}</td>
              <td class="text-center">{{ row.activeLearners }}</td>
              <td class="text-center">{{ row.lessonsDelivered }}</td>
              <td><v-progress-linear :model-value="row.coveragePct" color="indigo" height="16" rounded><span class="text-caption">{{ row.coveragePct }}%</span></v-progress-linear></td>
              <td class="text-center">
                <v-chip size="x-small" :color="row.started ? 'green' : 'grey'" variant="flat">{{ row.started ? 'Active' : 'Not started' }}</v-chip>
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
</style>
