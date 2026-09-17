<script setup>
import { marked } from "marked";
definePageMeta({ layout: "default" });

const route = useRoute();
const { getLesson, markProgress, getMyProgress } = useMpap();

const lesson = ref(null);
const tab = ref("worksheet");
const saving = ref(false);
const done = ref(false);

onMounted(async () => {
  lesson.value = await getLesson(route.params.id);
  useHead({ title: lesson.value ? `MPAP — ${lesson.value.title}` : "MPAP Lesson" });
  const prog = await getMyProgress();
  done.value = prog.some((p) => p.lesson_id === route.params.id && p.completed);
});

const std = computed(() => lesson.value?.standard || {});
const objectives = computed(() => {
  const o = lesson.value?.objectives;
  return Array.isArray(o) ? o : [];
});

// Defensive renderer: worksheet/guide `content` may be markdown string,
// { blocks: [...] }, or an array of question strings.
const renderBlocks = (content) => {
  if (!content) return [];
  if (typeof content === "string") return [{ type: "html", html: marked.parse(content) }];
  if (Array.isArray(content)) return content.map((c) => ({ type: "text", text: typeof c === "string" ? c : JSON.stringify(c) }));
  if (Array.isArray(content.blocks)) return content.blocks;
  if (typeof content.body === "string") return [{ type: "html", html: marked.parse(content.body) }];
  return [{ type: "text", text: "Content will appear here." }];
};

const complete = async () => {
  if (!lesson.value) return;
  saving.value = true;
  const { error } = await markProgress(lesson.value.id, std.value?.id, { completed: true });
  saving.value = false;
  if (!error) done.value = true;
};
</script>

<template>
  <v-container v-if="lesson" class="py-6" style="max-width: 960px;">
    <NuxtLink :to="`/mpap/grade-${std.grade}`" class="no-underline text-caption text-indigo">&larr; Grade {{ std.grade }} lessons</NuxtLink>

    <div class="d-flex align-center ga-2 mt-2 mb-1">
      <v-chip size="x-small" color="indigo" variant="flat">{{ std.code }}</v-chip>
      <v-chip v-if="done" size="x-small" color="green" variant="flat" prepend-icon="mdi-check">Completed</v-chip>
    </div>
    <h1 class="text-h5 font-weight-bold mb-1">{{ lesson.title }}</h1>
    <p class="text-body-2 text-grey">{{ std.strand }}<span v-if="std.sub_strand"> · {{ std.sub_strand }}</span></p>

    <p v-if="lesson.overview" class="text-body-1 mt-3">{{ lesson.overview }}</p>
    <div v-if="objectives.length" class="mt-3">
      <p class="text-subtitle-2 font-weight-bold mb-1">Learning indicators</p>
      <ul class="pl-5"><li v-for="(o, i) in objectives" :key="i" class="text-body-2">{{ o }}</li></ul>
    </div>

    <v-tabs v-model="tab" color="indigo" class="mt-5">
      <v-tab value="worksheet">Worksheet</v-tab>
      <v-tab value="videos">Practical Videos</v-tab>
      <v-tab value="guide">Answer Guide</v-tab>
    </v-tabs>
    <v-divider />

    <v-window v-model="tab" class="mt-5">
      <!-- WORKSHEET -->
      <v-window-item value="worksheet">
        <div v-if="!lesson.worksheets.length" class="text-body-2 text-grey">No worksheet uploaded yet.</div>
        <div v-for="ws in lesson.worksheets" :key="ws.id" class="mb-6">
          <p v-if="ws.title" class="text-subtitle-1 font-weight-medium mb-2">{{ ws.title }}</p>
          <div v-for="(b, i) in renderBlocks(ws.content)" :key="i" class="mb-2">
            <div v-if="b.type === 'html'" v-html="b.html"></div>
            <p v-else class="text-body-2">{{ b.text }}</p>
          </div>
          <v-btn v-if="ws.file_url" :href="ws.file_url" target="_blank" size="small" variant="tonal" color="indigo" prepend-icon="mdi-download" class="mt-2">Download worksheet (PDF)</v-btn>
        </div>
      </v-window-item>

      <!-- VIDEOS (placeholders now, real videos later) -->
      <v-window-item value="videos">
        <MpapVideoSection :videos="lesson.videos" />
      </v-window-item>

      <!-- ANSWER GUIDE -->
      <v-window-item value="guide">
        <div v-if="!lesson.guides.length" class="text-body-2 text-grey">Answer guide coming with this package.</div>
        <div v-for="g in lesson.guides" :key="g.id" class="mb-6">
          <div v-for="(b, i) in renderBlocks(g.content)" :key="i" class="mb-2">
            <div v-if="b.type === 'html'" v-html="b.html"></div>
            <p v-else class="text-body-2">{{ b.text }}</p>
          </div>
          <v-btn v-if="g.file_url" :href="g.file_url" target="_blank" size="small" variant="tonal" color="indigo" prepend-icon="mdi-download" class="mt-2">Download answer guide (PDF)</v-btn>
        </div>
      </v-window-item>
    </v-window>

    <v-divider class="my-6" />
    <v-btn :color="done ? 'green' : 'indigo'" :loading="saving" :variant="done ? 'tonal' : 'flat'" @click="complete" :prepend-icon="done ? 'mdi-check-circle' : 'mdi-checkbox-marked-circle-outline'">
      {{ done ? "Marked complete" : "Mark lesson complete" }}
    </v-btn>
  </v-container>

  <v-container v-else class="py-16 text-center">
    <v-progress-circular indeterminate color="indigo" />
    <p class="text-body-2 text-grey mt-3">Loading lesson…</p>
  </v-container>
</template>

<style scoped>
.no-underline { text-decoration: none; }
:deep(.katex) { font-size: 1.05em; }
</style>
