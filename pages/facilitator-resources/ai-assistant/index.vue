<script setup>
import "katex/dist/katex.min.css";
import {
  renderMarkdown,
  vMathRender,
  LESSON_TEMPLATE_CSS,
} from "~/composables/useLessonTemplate";

definePageMeta({ layout: "resources" });
const user = useSupabaseUser();
const client = useSupabaseClient();

// ─── State ────────────────────────────────────────────────────────────────────
const activeTab = ref("chat");

// Chat
const chatInput = ref("");
const chatHistory = ref([]); // { role: 'user'|'assistant', text: string }
const chatLoading = ref(false);
const chatError = ref("");
const chatContainer = ref(null);
const chatViewMode = ref("rendered"); // 'rendered' | 'raw'

// Document generator
const docStrand = ref("");
const docLevel = ref("Basic 4");
const docIndicatorNumber = ref(1);
const docIndicatorText = ref("");
const docMode = ref(""); // 'lesson-notes' | 'lesson-plan'
const docData = ref(null);
const docTitle = ref("");
const docLoading = ref(false);
const docError = ref("");
const docHistory = ref([]);
const docViewMode = ref("rendered"); // 'rendered' | 'raw'

// Teacher profile (populates the template header)
const teacherName = ref("");
const schoolName = ref("");

const preparedDate = computed(() =>
  new Date().toLocaleDateString("en-GB"),
); // DD/MM/YYYY

const MAX_CHAT_MESSAGES = 100;
const MAX_DOC_HISTORY = 20;

const makeStorageKey = (suffix) =>
  `ai-assistant:${user.value?.id ?? "anonymous"}:${suffix}`;

const persistChatHistory = () => {
  if (typeof window === "undefined") return;
  const trimmed = chatHistory.value.slice(-MAX_CHAT_MESSAGES);
  localStorage.setItem(makeStorageKey("chat"), JSON.stringify(trimmed));
};

const persistDocHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    makeStorageKey("docs"),
    JSON.stringify(docHistory.value.slice(0, MAX_DOC_HISTORY)),
  );
};

const loadPersistedData = () => {
  if (typeof window === "undefined") return;
  try {
    const savedChat = localStorage.getItem(makeStorageKey("chat"));
    chatHistory.value = savedChat ? JSON.parse(savedChat) : [];
  } catch {
    chatHistory.value = [];
  }
  try {
    const savedDocs = localStorage.getItem(makeStorageKey("docs"));
    docHistory.value = savedDocs ? JSON.parse(savedDocs) : [];
  } catch {
    docHistory.value = [];
  }
};

const loadTeacherProfile = async () => {
  if (!user.value?.id) return;
  try {
    const { data: profile } = await client
      .from("profiles")
      .select("firstName, lastName, school, school_id")
      .eq("id", user.value.id)
      .single();
    if (!profile) return;
    teacherName.value = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    schoolName.value = (profile.school || "").trim();
    if (!schoolName.value && profile.school_id) {
      const { data: school } = await client
        .from("schools")
        .select("name")
        .eq("id", profile.school_id)
        .single();
      schoolName.value = school?.name || "";
    }
  } catch {
    /* profile is optional — the template falls back to blank placeholders */
  }
};

const saveGeneratedDoc = () => {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: docMode.value,
    strand: docStrand.value,
    level: docLevel.value,
    indicatorNumber: docIndicatorNumber.value,
    indicatorText: docIndicatorText.value,
    title: docTitle.value,
    data: docData.value,
    createdAt: new Date().toISOString(),
  };
  docHistory.value = [entry, ...docHistory.value].slice(0, MAX_DOC_HISTORY);
  persistDocHistory();
};

const openSavedDoc = (doc) => {
  if (!doc?.data) return;
  activeTab.value = "docs";
  docMode.value = doc.mode;
  docStrand.value = doc.strand || "";
  docLevel.value = doc.level || docLevel.value;
  docIndicatorNumber.value = doc.indicatorNumber || 1;
  docIndicatorText.value = doc.indicatorText || "";
  docTitle.value = doc.title || "";
  docData.value = doc.data;
  docError.value = "";
};

const clearDocHistory = () => {
  docHistory.value = [];
  persistDocHistory();
};

const formatHistoryDate = (isoDate) =>
  new Date(isoDate).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

onMounted(async () => {
  loadPersistedData();
  await loadTeacherProfile();
  await nextTick();
  scrollChat();
});

watch(
  () => user.value?.id,
  () => {
    loadPersistedData();
    loadTeacherProfile();
  },
);

const levels = [
  "Basic 4",
  "Basic 5",
  "Basic 6",
  "Basic 7 (JHS 1)",
  "Basic 8 (JHS 2)",
  "Basic 9 (JHS 3)",
];

const suggestedStrands = [
  "Number and Numeration Systems",
  "Number Operations",
  "Fractions, Decimals and Percentages",
  "Ratios and Proportion",
  "Patterns and Relationships",
  "Algebraic Expressions",
  "Variables and Equations",
  "Shape and Space",
  "Measurement",
  "Position and Transformation",
  "Data",
  "Chance or Probability",
];

// ─── Chat actions ──────────────────────────────────────────────────────────────
const sendMessage = async () => {
  const text = chatInput.value.trim();
  if (!text || chatLoading.value) return;

  chatHistory.value.push({ role: "user", text });
  persistChatHistory();
  chatInput.value = "";
  chatLoading.value = true;
  chatError.value = "";

  await nextTick();
  scrollChat();

  try {
    const { content } = await $fetch("/api/ai-assistant/chat", {
      method: "POST",
      body: {
        mode: "chat",
        message: text,
        history: chatHistory.value.slice(0, -1),
      },
    });
    chatHistory.value.push({ role: "assistant", text: content });
    persistChatHistory();
    await nextTick();
    scrollChat();
  } catch (err) {
    chatError.value =
      err?.data?.statusMessage || "Something went wrong. Please try again.";
    chatHistory.value.pop();
    persistChatHistory();
  } finally {
    chatLoading.value = false;
  }
};

const clearChat = () => {
  chatHistory.value = [];
  chatError.value = "";
  persistChatHistory();
};

const scrollChat = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// ─── Document generator ───────────────────────────────────────────────────────
const generateDoc = async (mode) => {
  if (!docStrand.value.trim()) {
    docError.value = "Please choose a strand or topic.";
    return;
  }
  docData.value = null;
  docError.value = "";
  docLoading.value = true;
  docMode.value = mode;
  docTitle.value =
    (mode === "lesson-notes" ? "Lesson Notes" : "Lesson Plan") +
    ` – ${docStrand.value} (${docLevel.value})`;

  try {
    const { data } = await $fetch("/api/ai-assistant/chat", {
      method: "POST",
      body: {
        mode,
        strand: docStrand.value,
        level: docLevel.value,
        indicatorNumber: Number(docIndicatorNumber.value) || 1,
        indicatorText: docIndicatorText.value,
      },
    });
    docData.value = data;
    saveGeneratedDoc();
  } catch (err) {
    docError.value =
      err?.data?.statusMessage || "Failed to generate document. Please retry.";
  } finally {
    docLoading.value = false;
  }
};

// ─── Print / PDF ──────────────────────────────────────────────────────────────
const printDoc = () => {
  if (!docData.value || typeof window === "undefined") return;
  const root = document.getElementById("lt-print-root");
  if (!root) return;

  const origin = window.location.origin;
  const inner = root.outerHTML.replace(/src="\/img\//g, `src="${origin}/img/`);
  const katexCss =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${docTitle.value}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
  <link rel="stylesheet" href="${katexCss}" />
  <style>
    body { margin: 24px; background: #fff; }
    ${LESSON_TEMPLATE_CSS}
  </style>
</head>
<body>
  ${inner}
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 400);
    });
  <\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center gap-3 mb-6">
      <v-icon size="36" color="green-darken-2">mdi-robot-excited-outline</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">AI Teaching Assistant</h2>
        <p class="text-grey text-body-2">
          Powered by Google Gemini · Aligned with Ghana's NaCCA Mathematics
          Curriculum
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="green-darken-2" class="mb-6">
      <v-tab value="chat" prepend-icon="mdi-chat-outline">Ask a Question</v-tab>
      <v-tab value="docs" prepend-icon="mdi-file-document-edit-outline">
        Generate Documents
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <!-- ── CHAT TAB ─────────────────────────────────────────────────────── -->
      <v-tabs-window-item value="chat">
        <v-card
          rounded="lg"
          elevation="1"
          class="d-flex flex-column"
          style="height: 350px"
        >
          <div
            ref="chatContainer"
            class="flex-grow-1 overflow-y-auto pa-4"
            style="scroll-behavior: smooth"
          >
            <div
              v-if="chatHistory.length === 0"
              class="text-center py-10 text-grey"
            >
              <v-icon size="56" color="green-lighten-3" class="mb-3">
                mdi-chat-question-outline
              </v-icon>
              <p class="text-body-1 font-weight-medium mb-1">
                Ask anything about Mathematics
              </p>
              <p class="text-body-2">
                Try: "Explain Pythagoras Theorem" or "How do I solve quadratic
                equations?"
              </p>
            </div>

            <div
              v-for="(msg, i) in chatHistory"
              :key="i"
              class="mb-4"
              :class="
                msg.role === 'user' ? 'd-flex justify-end' : 'd-flex justify-start'
              "
            >
              <div v-if="msg.role === 'assistant'" class="mr-2 mt-1">
                <v-avatar size="28" color="green-darken-2">
                  <v-icon size="16" color="white">mdi-robot-outline</v-icon>
                </v-avatar>
              </div>

              <v-card
                :color="msg.role === 'user' ? 'green-darken-2' : 'grey-lighten-4'"
                :class="msg.role === 'user' ? 'text-white' : ''"
                rounded="lg"
                elevation="0"
                style="max-width: 78%"
                class="pa-3"
              >
                <p
                  v-if="msg.role === 'user'"
                  class="text-body-2 mb-0"
                  style="white-space: pre-wrap; line-height: 1.6"
                >
                  {{ msg.text }}
                </p>
                <div
                  v-else-if="chatViewMode === 'rendered'"
                  class="text-body-2 mb-0 ai-markdown"
                  v-math-render
                  v-html="renderMarkdown(msg.text)"
                />
                <p
                  v-else
                  class="text-body-2 mb-0"
                  style="
                    white-space: pre-wrap;
                    line-height: 1.6;
                    font-family: monospace;
                  "
                >
                  {{ msg.text }}
                </p>
              </v-card>
            </div>

            <div v-if="chatLoading" class="d-flex align-center gap-2 mb-4">
              <v-avatar size="28" color="green-darken-2">
                <v-icon size="16" color="white">mdi-robot-outline</v-icon>
              </v-avatar>
              <v-card color="grey-lighten-4" rounded="lg" elevation="0" class="pa-3">
                <div class="d-flex align-center gap-1">
                  <v-progress-circular
                    indeterminate
                    size="14"
                    width="2"
                    color="green-darken-2"
                  />
                  <span class="text-body-2 text-grey ml-2">Thinking…</span>
                </div>
              </v-card>
            </div>
          </div>

          <v-divider />

          <v-alert
            v-if="chatError"
            type="error"
            density="compact"
            closable
            class="mx-4 mt-3"
            @click:close="chatError = ''"
            >{{ chatError }}</v-alert
          >

          <div class="pa-3 d-flex align-center gap-2">
            <v-text-field
              v-model="chatInput"
              placeholder="Ask about any maths concept…"
              variant="outlined"
              density="compact"
              hide-details
              class="flex-grow-1"
              :disabled="chatLoading"
              @keydown.enter.prevent="sendMessage"
            />
            <v-btn
              icon
              color="green-darken-2"
              variant="flat"
              :disabled="!chatInput.trim() || chatLoading"
              @click="sendMessage"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="grey"
              :disabled="chatHistory.length === 0"
              @click="clearChat"
            >
              <v-icon>mdi-delete-outline</v-icon>
              <v-tooltip activator="parent">Clear chat</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              :color="chatViewMode === 'rendered' ? 'green-darken-2' : 'grey'"
              @click="
                chatViewMode = chatViewMode === 'rendered' ? 'raw' : 'rendered'
              "
            >
              <v-icon>{{
                chatViewMode === "rendered" ? "mdi-format-text" : "mdi-code-tags"
              }}</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-tabs-window-item>

      <!-- ── DOCUMENTS TAB ───────────────────────────────────────────────── -->
      <v-tabs-window-item value="docs">
        <v-row>
          <!-- Left panel: form -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" elevation="1" class="pa-4">
              <v-select
                v-model="docLevel"
                :items="levels"
                label="Grade / Class"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-3"
              />

              <v-text-field
                v-model="docStrand"
                label="Strand / topic"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              />
              <p class="text-caption text-grey mb-1">Quick select:</p>
              <div class="d-flex flex-wrap gap-1 mb-3">
                <v-chip
                  v-for="t in suggestedStrands"
                  :key="t"
                  size="x-small"
                  variant="tonal"
                  color="green-darken-2"
                  class="cursor-pointer"
                  @click="docStrand = t"
                >
                  {{ t }}
                </v-chip>
              </div>

              <v-text-field
                v-model.number="docIndicatorNumber"
                label="Indicator number"
                type="number"
                min="1"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-3"
              />

              <v-textarea
                v-model="docIndicatorText"
                label="Learning indicator (optional)"
                placeholder="e.g. Add and subtract whole numbers up to 10,000 using appropriate strategies."
                variant="outlined"
                density="compact"
                rows="3"
                auto-grow
                hide-details
                class="mb-1"
              />
              <p class="text-caption text-grey mb-4">
                Leave blank to let the assistant fill in the NaCCA indicator for
                this strand and grade.
              </p>

              <v-alert
                v-if="docError"
                type="error"
                density="compact"
                closable
                class="mb-3"
                @click:close="docError = ''"
                >{{ docError }}</v-alert
              >

              <div class="d-flex flex-column gap-2">
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  prepend-icon="mdi-file-document-outline"
                  :loading="docLoading"
                  block
                  @click="generateDoc('lesson-notes')"
                >
                  Generate Lesson Notes
                </v-btn>
                <v-btn
                  color="green-darken-1"
                  variant="tonal"
                  prepend-icon="mdi-calendar-text-outline"
                  :loading="docLoading"
                  block
                  @click="generateDoc('lesson-plan')"
                >
                  Generate Lesson Plan
                </v-btn>
              </div>

              <v-divider class="my-4" />
              <div class="d-flex align-center justify-space-between mb-2">
                <p class="text-body-2 font-weight-bold mb-0">Recent Documents</p>
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  color="grey"
                  :disabled="docHistory.length === 0"
                  @click="clearDocHistory"
                >
                  <v-icon size="16">mdi-delete-outline</v-icon>
                </v-btn>
              </div>
              <p
                v-if="docHistory.length === 0"
                class="text-caption text-grey mb-0"
              >
                Your generated lesson notes and plans will appear here.
              </p>
              <v-list v-else density="compact" class="pa-0">
                <v-list-item
                  v-for="doc in docHistory"
                  :key="doc.id"
                  rounded="lg"
                  class="mb-1"
                  @click="openSavedDoc(doc)"
                >
                  <template #prepend>
                    <v-icon
                      size="18"
                      :color="
                        doc.mode === 'lesson-notes'
                          ? 'green-darken-2'
                          : 'green-darken-1'
                      "
                    >
                      {{
                        doc.mode === "lesson-notes"
                          ? "mdi-file-document-outline"
                          : "mdi-calendar-text-outline"
                      }}
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">{{
                    doc.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{
                    formatHistoryDate(doc.createdAt)
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Right panel: output -->
          <v-col cols="12" md="8">
            <div
              v-if="!docData && !docLoading"
              class="text-center py-16 text-grey"
            >
              <v-icon size="64" color="grey-lighten-2" class="mb-4">
                mdi-file-document-edit-outline
              </v-icon>
              <p class="text-body-1 font-weight-medium mb-1">
                No document generated yet
              </p>
              <p class="text-body-2">
                Choose a grade and strand, then click one of the generate
                buttons.
              </p>
            </div>

            <v-card v-else-if="docLoading" rounded="lg" elevation="1" class="pa-4">
              <div class="d-flex align-center gap-2 mb-4">
                <v-progress-circular
                  indeterminate
                  color="green-darken-2"
                  size="20"
                  width="2"
                />
                <span class="text-body-2 text-grey">Generating with Gemini…</span>
              </div>
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" />
            </v-card>

            <v-card v-else rounded="lg" elevation="1">
              <div
                class="d-flex align-center justify-space-between px-4 pt-3 pb-2 flex-wrap gap-2"
              >
                <p class="text-body-2 font-weight-bold text-green-darken-2 mb-0">
                  {{ docTitle }}
                </p>
                <div class="d-flex gap-1 align-center">
                  <v-btn-toggle
                    v-model="docViewMode"
                    density="compact"
                    variant="outlined"
                    color="green-darken-2"
                    class="mr-1"
                    mandatory
                  >
                    <v-btn value="rendered" size="small">
                      <v-icon size="16" class="mr-1">mdi-format-text</v-icon>
                      Preview
                    </v-btn>
                    <v-btn value="raw" size="small">
                      <v-icon size="16" class="mr-1">mdi-code-tags</v-icon>
                      Raw
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="green-darken-2"
                    prepend-icon="mdi-printer-outline"
                    @click="printDoc"
                  >
                    Print / Download PDF
                  </v-btn>
                </div>
              </div>
              <v-divider />

              <div class="pa-4" style="max-height: 640px; overflow: auto">
                <template v-if="docViewMode === 'rendered'">
                  <LessonPlanTemplate
                    v-if="docMode === 'lesson-plan'"
                    :data="docData"
                    :teacher="teacherName"
                    :school="schoolName"
                    :level="docLevel"
                    :date="preparedDate"
                  />
                  <LessonNoteTemplate
                    v-else
                    :data="docData"
                    :teacher="teacherName"
                    :school="schoolName"
                    :level="docLevel"
                    :date="preparedDate"
                  />
                </template>
                <pre
                  v-else
                  class="text-body-2"
                  style="white-space: pre-wrap; font-family: monospace; line-height: 1.6"
                  >{{ JSON.stringify(docData, null, 2) }}</pre
                >
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style scoped>
:deep(.ai-markdown) {
  line-height: 1.7;
  font-size: 0.875rem;
}
:deep(.ai-markdown h1),
:deep(.ai-markdown h2),
:deep(.ai-markdown h3),
:deep(.ai-markdown h4) {
  font-weight: 700;
  margin-top: 1.1em;
  margin-bottom: 0.4em;
  line-height: 1.3;
}
:deep(.ai-markdown h1) {
  font-size: 1.25rem;
}
:deep(.ai-markdown h2) {
  font-size: 1.1rem;
}
:deep(.ai-markdown h3) {
  font-size: 1rem;
}
:deep(.ai-markdown p) {
  margin-bottom: 0.6em;
}
:deep(.ai-markdown ul),
:deep(.ai-markdown ol) {
  padding-left: 1.4em;
  margin-bottom: 0.6em;
}
:deep(.ai-markdown li) {
  margin-bottom: 0.2em;
}
:deep(.ai-markdown code) {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 3px;
  padding: 0.1em 0.35em;
  font-family: monospace;
  font-size: 0.85em;
}
:deep(.ai-markdown table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 0.8em;
}
:deep(.ai-markdown th),
:deep(.ai-markdown td) {
  border: 1px solid #ccc;
  padding: 0.4em 0.7em;
  text-align: left;
}
:deep(.ai-markdown th) {
  background: #f5f5f5;
  font-weight: 700;
}
</style>
