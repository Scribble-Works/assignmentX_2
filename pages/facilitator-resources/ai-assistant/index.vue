<script setup>
import { marked } from "marked";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

// ─── KaTeX auto-render directive ─────────────────────────────────────────────
const katexOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
};
const vMathRender = {
  mounted: (el) => renderMathInElement(el, katexOptions),
  updated: (el) => renderMathInElement(el, katexOptions),
};

definePageMeta({ layout: "resources" });
const user = useSupabaseUser();

// ─── Markdown ────────────────────────────────────────────────────────────────────
marked.use({ breaks: true, gfm: true });
const renderMarkdown = (text) => (text ? marked.parse(text) : "");

// ─── State ────────────────────────────────────────────────────────────────────
const activeTab = ref("chat");

// Chat
const chatInput = ref("");
const chatHistory = ref([]); // { role: 'user'|'assistant', text: string }
const chatLoading = ref(false);
const chatError = ref("");
const chatContainer = ref(null);

// View modes
const chatViewMode = ref("rendered"); // 'rendered' | 'raw'
const docViewMode = ref("rendered"); // 'rendered' | 'raw'

// Document generator
const docTopic = ref("");
const docLevel = ref("Primary 4");
const docContent = ref("");
const docTitle = ref("");
const docLoading = ref(false);
const docError = ref("");
const docHistory = ref([]);

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

const saveGeneratedDoc = (mode, content) => {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode,
    topic: docTopic.value,
    level: docLevel.value,
    title: docTitle.value,
    content,
    createdAt: new Date().toISOString(),
  };
  docHistory.value = [entry, ...docHistory.value].slice(0, MAX_DOC_HISTORY);
  persistDocHistory();
};

const openSavedDoc = (doc) => {
  activeTab.value = "docs";
  docTopic.value = doc.topic || "";
  docLevel.value = doc.level || docLevel.value;
  docTitle.value = doc.title || "";
  docContent.value = doc.content || "";
  docError.value = "";
};

const clearDocHistory = () => {
  docHistory.value = [];
  persistDocHistory();
};

const formatHistoryDate = (isoDate) =>
  new Date(isoDate).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

onMounted(async () => {
  loadPersistedData();
  await nextTick();
  scrollChat();
});

watch(
  () => user.value?.id,
  () => {
    loadPersistedData();
  },
);

const levels = [
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JHS 1",
  "JHS 2",
  "JHS 3",
];

const suggestedTopics = [
  "Number and Numeration Systems",
  "Number Operations",
  "Fractions, Decimals and Percentages",
  "Ratios and Proportion",
  "Pattern and Relationships",
  "Algebraic Expressions",
  "Variables and Equations",
  "Shapes and Space",
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
        history: chatHistory.value.slice(0, -1), // exclude the message just added
      },
    });
    chatHistory.value.push({ role: "assistant", text: content });
    persistChatHistory();
    await nextTick();
    scrollChat();
  } catch (err) {
    chatError.value =
      err?.data?.statusMessage || "Something went wrong. Please try again.";
    chatHistory.value.pop(); // remove the user message on error
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

// ─── Document generator actions ───────────────────────────────────────────────
const generateDoc = async (mode) => {
  if (!docTopic.value.trim()) {
    docError.value = "Please enter a topic.";
    return;
  }
  docContent.value = "";
  docError.value = "";
  docLoading.value = true;
  docTitle.value =
    mode === "lesson-notes"
      ? `Lesson Notes – ${docTopic.value} (${docLevel.value})`
      : `Lesson Plan – ${docTopic.value} (${docLevel.value})`;

  try {
    const { content } = await $fetch("/api/ai-assistant/chat", {
      method: "POST",
      body: { mode, topic: docTopic.value, level: docLevel.value },
    });
    if (mode === "lesson-notes" || mode === "lesson-plan") {
      const logoUrl = `${window.location.origin}/img/logo.png`;
      const logoBlock = `<p align="center"><img src="${logoUrl}" alt="AssignmentX logo" width="120" /></p>\n\n`;
      docContent.value = `${logoBlock}${content}`;
    } else {
      docContent.value = content;
    }
    saveGeneratedDoc(mode, docContent.value);
  } catch (err) {
    docError.value =
      err?.data?.statusMessage || "Failed to generate document. Please retry.";
  } finally {
    docLoading.value = false;
  }
};

const docStyles = `
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 48px auto; padding: 0 24px; line-height: 1.7; color: #222; }
  h1, h2, h3, h4 { color: #1b5e20; margin-top: 1.2em; margin-bottom: 0.4em; }
  h1 { font-size: 1.5rem; border-bottom: 2px solid #1b5e20; padding-bottom: 8px; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.1rem; }
  p { margin-bottom: 0.6em; }
  ul, ol { padding-left: 1.5em; margin-bottom: 0.6em; }
  li { margin-bottom: 0.2em; }
  code { background: #f0f0f0; border-radius: 3px; padding: 0.1em 0.35em; font-family: monospace; font-size: 0.9em; }
  pre { background: #f5f5f5; border-radius: 6px; padding: 0.75em 1em; overflow-x: auto; margin-bottom: 0.8em; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #388e3c; padding-left: 0.8em; color: #555; margin: 0.6em 0; }
  hr { border: none; border-top: 1px solid #ccc; margin: 1em 0; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 0.8em; }
  th, td { border: 1px solid #ccc; padding: 0.4em 0.7em; text-align: left; }
  th { background: #f0f0f0; font-weight: 700; }
  @media print { body { margin: 20px; } }
`;

const docDownloading = ref(false);

// const downloadDoc = async () => {
//   if (!docContent.value || docDownloading.value) return;
//   docDownloading.value = true;

//   try {
//     // Dynamic import keeps this browser-only (safe for Nuxt SSR)
//     const html2pdf = (await import("html2pdf.js")).default;

//     const safeName = docTitle.value
//       .replace(/[^a-z0-9\s\-]/gi, "")
//       .replace(/\s+/g, "_");

//     // Build a temporary off-screen container with styled markdown HTML
//     const container = document.createElement("div");
//     container.innerHTML = `<style>
//       body,div{font-family:Arial,sans-serif;color:#222;line-height:1.7}
//       h1,h2,h3,h4{color:#1b5e20;margin-top:1.2em;margin-bottom:0.4em}
//       h1{font-size:22px;border-bottom:2px solid #1b5e20;padding-bottom:8px}
//       h2{font-size:18px}h3{font-size:16px}
//       p{margin-bottom:8px}
//       ul,ol{padding-left:20px;margin-bottom:8px}li{margin-bottom:3px}
//       code{background:#f0f0f0;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:0.9em}
//       pre{background:#f5f5f5;border-radius:6px;padding:12px 16px;margin-bottom:12px}
//       pre code{background:none;padding:0}
//       blockquote{border-left:3px solid #388e3c;padding-left:12px;color:#555;margin:8px 0}
//       hr{border:none;border-top:1px solid #ccc;margin:16px 0}
//       table{border-collapse:collapse;width:100%;margin-bottom:12px}
//       th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}
//       th{background:#f0f0f0;font-weight:700}
//     </style>${renderMarkdown(docContent.value)}`;
//     container.style.cssText =
//       "position:absolute;left:-9999px;top:0;width:780px;padding:32px;background:#fff";
//     document.body.appendChild(container);
//     renderMathInElement(container, katexOptions);

//     await html2pdf()
//       .set({
//         margin: [15, 15, 15, 15],
//         filename: `${safeName}.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true, logging: false },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       })
//       .from(container)
//       .save();

//     document.body.removeChild(container);
//   } finally {
//     docDownloading.value = false;
//   }
// };

const printDoc = () => {
  if (!docContent.value) return;
  const katexCssUrl =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
  const katexJsUrl =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
  const autoRenderUrl =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${docTitle.value}</title>
  <link rel="stylesheet" href="${katexCssUrl}" />
  <style>${docStyles}</style>
</head>
<body>
  ${renderMarkdown(docContent.value)}
  <script src="${katexJsUrl}"><\/script>
  <script src="${autoRenderUrl}"><\/script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\\\(", right: "\\\\)", display: false },
          { left: "\\\\[", right: "\\\\]", display: true },
        ],
        throwOnError: false,
      });
      window.print();
    });
  <\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center gap-3 mb-6">
      <v-icon size="36" color="green-darken-2"
        >mdi-robot-excited-outline</v-icon
      >
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
          <!-- Messages -->
          <div
            ref="chatContainer"
            class="flex-grow-1 overflow-y-auto pa-4"
            style="scroll-behavior: smooth"
          >
            <!-- Welcome state -->
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

            <!-- Message bubbles -->
            <div
              v-for="(msg, i) in chatHistory"
              :key="i"
              class="mb-4"
              :class="
                msg.role === 'user'
                  ? 'd-flex justify-end'
                  : 'd-flex justify-start'
              "
            >
              <div v-if="msg.role === 'assistant'" class="mr-2 mt-1">
                <v-avatar size="28" color="green-darken-2">
                  <v-icon size="16" color="white">mdi-robot-outline</v-icon>
                </v-avatar>
              </div>

              <v-card
                :color="
                  msg.role === 'user' ? 'green-darken-2' : 'grey-lighten-4'
                "
                :class="msg.role === 'user' ? 'text-white' : ''"
                rounded="lg"
                elevation="0"
                style="max-width: 78%"
                class="pa-3"
              >
                <!-- User message: always plain text -->
                <p
                  v-if="msg.role === 'user'"
                  class="text-body-2 mb-0"
                  style="white-space: pre-wrap; line-height: 1.6"
                >
                  {{ msg.text }}
                </p>
                <!-- Assistant message: rendered markdown or raw -->
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

            <!-- Thinking indicator -->
            <div v-if="chatLoading" class="d-flex align-center gap-2 mb-4">
              <v-avatar size="28" color="green-darken-2">
                <v-icon size="16" color="white">mdi-robot-outline</v-icon>
              </v-avatar>
              <v-card
                color="grey-lighten-4"
                rounded="lg"
                elevation="0"
                class="pa-3"
              >
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

          <!-- Error -->
          <v-alert
            v-if="chatError"
            type="error"
            density="compact"
            closable
            class="mx-4 mt-3"
            @click:close="chatError = ''"
            >{{ chatError }}</v-alert
          >

          <!-- Input area -->
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
                chatViewMode === "rendered"
                  ? "mdi-format-text"
                  : "mdi-code-tags"
              }}</v-icon>
              <v-tooltip activator="parent">{{
                chatViewMode === "rendered"
                  ? "Showing rendered markdown"
                  : "Showing raw text"
              }}</v-tooltip>
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
              <p class="text-body-2 font-weight-bold mb-3">Topic</p>
              <v-text-field
                v-model="docTopic"
                label="Enter a mathematics topic"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-3"
              />

              <!-- Suggested topics -->
              <p class="text-caption text-grey mb-2">Quick select:</p>
              <div class="d-flex flex-wrap gap-1 mb-4">
                <v-chip
                  v-for="t in suggestedTopics"
                  :key="t"
                  size="x-small"
                  variant="tonal"
                  color="green-darken-2"
                  class="cursor-pointer"
                  @click="docTopic = t"
                >
                  {{ t }}
                </v-chip>
              </div>

              <v-select
                v-model="docLevel"
                :items="levels"
                label="Class Level"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-4"
              />

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
                      :color="doc.mode === 'lesson-notes' ? 'green-darken-2' : 'green-darken-1'"
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
            <!-- Placeholder -->
            <div
              v-if="!docContent && !docLoading"
              class="text-center py-16 text-grey"
            >
              <v-icon size="64" color="grey-lighten-2" class="mb-4">
                mdi-file-document-edit-outline
              </v-icon>
              <p class="text-body-1 font-weight-medium mb-1">
                No document generated yet
              </p>
              <p class="text-body-2">
                Enter a topic and click one of the generate buttons.
              </p>
            </div>

            <!-- Loading skeleton -->
            <v-card
              v-else-if="docLoading"
              rounded="lg"
              elevation="1"
              class="pa-4"
            >
              <div class="d-flex align-center gap-2 mb-4">
                <v-progress-circular
                  indeterminate
                  color="green-darken-2"
                  size="20"
                  width="2"
                />
                <span class="text-body-2 text-grey"
                  >Generating with Gemini…</span
                >
              </div>
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" />
            </v-card>

            <!-- Generated content -->
            <v-card v-else rounded="lg" elevation="1">
              <!-- Toolbar -->
              <div
                class="d-flex align-center justify-space-between px-4 pt-3 pb-2"
              >
                <p class="text-body-2 font-weight-bold text-green-darken-2">
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
                  <!-- <v-btn
                    size="small"
                    variant="flat"
                    color="green-darken-2"
                    prepend-icon="mdi-download"
                    :loading="docDownloading"
                    @click="downloadDoc"
                  >
                    Download PDF
                  </v-btn> -->
                </div>
              </div>
              <v-divider />
              <!-- Content -->
              <div class="pa-4" style="max-height: 520px; overflow-y: auto">
                <!-- Rendered markdown -->
                <div
                  v-if="docViewMode === 'rendered'"
                  class="ai-markdown"
                  v-math-render
                  v-html="renderMarkdown(docContent)"
                />
                <!-- Raw text -->
                <pre
                  v-else
                  class="text-body-2"
                  style="
                    white-space: pre-wrap;
                    font-family: monospace;
                    line-height: 1.7;
                  "
                  >{{ docContent }}</pre
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
/* Markdown rendered output styles */
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
:deep(.ai-markdown strong) {
  font-weight: 700;
}
:deep(.ai-markdown em) {
  font-style: italic;
}
:deep(.ai-markdown code) {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 3px;
  padding: 0.1em 0.35em;
  font-family: monospace;
  font-size: 0.85em;
}
:deep(.ai-markdown pre) {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  padding: 0.75em 1em;
  overflow-x: auto;
  margin-bottom: 0.8em;
}
:deep(.ai-markdown pre code) {
  background: none;
  padding: 0;
}
:deep(.ai-markdown blockquote) {
  border-left: 3px solid #388e3c;
  padding-left: 0.8em;
  color: #555;
  margin: 0.6em 0;
}
:deep(.ai-markdown hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0.8em 0;
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
