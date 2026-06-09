<script setup>
definePageMeta({ layout: "resources" });

// ─── State ────────────────────────────────────────────────────────────────────
const activeTab = ref("chat");

// Chat
const chatInput = ref("");
const chatHistory = ref([]); // { role: 'user'|'assistant', text: string }
const chatLoading = ref(false);
const chatError = ref("");
const chatContainer = ref(null);

// Document generator
const docTopic = ref("");
const docLevel = ref("JHS 1");
const docContent = ref("");
const docTitle = ref("");
const docLoading = ref(false);
const docError = ref("");

const levels = ["JHS 1", "JHS 2", "JHS 3"];

const suggestedTopics = [
  "Pythagoras Theorem",
  "Quadratic Equations",
  "Circle Theorems",
  "Simultaneous Equations",
  "Linear Inequalities",
  "Trigonometry (SOH-CAH-TOA)",
  "Percentages and Ratios",
  "Statistics and Probability",
  "Indices and Logarithms",
  "Vectors",
  "Transformation",
  "Number Bases",
];

// ─── Chat actions ──────────────────────────────────────────────────────────────
const sendMessage = async () => {
  const text = chatInput.value.trim();
  if (!text || chatLoading.value) return;

  chatHistory.value.push({ role: "user", text });
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
    await nextTick();
    scrollChat();
  } catch (err) {
    chatError.value =
      err?.data?.statusMessage || "Something went wrong. Please try again.";
    chatHistory.value.pop(); // remove the user message on error
  } finally {
    chatLoading.value = false;
  }
};

const clearChat = () => {
  chatHistory.value = [];
  chatError.value = "";
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
    docContent.value = content;
  } catch (err) {
    docError.value =
      err?.data?.statusMessage || "Failed to generate document. Please retry.";
  } finally {
    docLoading.value = false;
  }
};

const downloadDoc = () => {
  if (!docContent.value) return;
  const safeName = docTitle.value.replace(/[^a-z0-9\s\-]/gi, "").replace(/\s+/g, "_");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${docTitle.value}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 48px auto; padding: 0 24px; line-height: 1.7; color: #222; }
    h1 { color: #1b5e20; font-size: 1.4rem; border-bottom: 2px solid #1b5e20; padding-bottom: 8px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 0.95rem; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>${docTitle.value}</h1>
  <pre>${docContent.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const printDoc = () => {
  if (!docContent.value) return;
  const safeName = docTitle.value.replace(/[^a-z0-9\s\-]/gi, "").replace(/\s+/g, "_");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${docTitle.value}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 48px auto; padding: 0 24px; line-height: 1.7; color: #222; }
    h1 { color: #1b5e20; font-size: 1.4rem; border-bottom: 2px solid #1b5e20; padding-bottom: 8px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 0.95rem; }
  </style>
</head>
<body>
  <h1>${docTitle.value}</h1>
  <pre>${docContent.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <script>window.onload = () => { window.print(); }<\/script>
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
      <v-icon size="36" color="green-darken-2">mdi-robot-excited-outline</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">AI Teaching Assistant</h2>
        <p class="text-grey text-body-2">
          Powered by Google Gemini · Aligned with Ghana's NACA Mathematics Curriculum
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
        <v-card rounded="lg" elevation="1" class="d-flex flex-column" style="height: 560px">
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
              :class="msg.role === 'user' ? 'd-flex justify-end' : 'd-flex justify-start'"
            >
              <div
                v-if="msg.role === 'assistant'"
                class="mr-2 mt-1"
              >
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
                  class="text-body-2 mb-0"
                  style="white-space: pre-wrap; line-height: 1.6"
                >{{ msg.text }}</p>
              </v-card>
            </div>

            <!-- Thinking indicator -->
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

          <!-- Error -->
          <v-alert
            v-if="chatError"
            type="error"
            density="compact"
            closable
            class="mx-4 mt-3"
            @click:close="chatError = ''"
          >{{ chatError }}</v-alert>

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
              >{{ docError }}</v-alert>

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
            <v-card v-else-if="docLoading" rounded="lg" elevation="1" class="pa-4">
              <div class="d-flex align-center gap-2 mb-4">
                <v-progress-circular indeterminate color="green-darken-2" size="20" width="2" />
                <span class="text-body-2 text-grey">Generating with Gemini…</span>
              </div>
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" class="mb-2" />
              <v-skeleton-loader type="paragraph" />
            </v-card>

            <!-- Generated content -->
            <v-card v-else rounded="lg" elevation="1">
              <!-- Toolbar -->
              <div class="d-flex align-center justify-space-between px-4 pt-3 pb-2">
                <p class="text-body-2 font-weight-bold text-green-darken-2">
                  {{ docTitle }}
                </p>
                <div class="d-flex gap-1">
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="green-darken-2"
                    prepend-icon="mdi-printer-outline"
                    @click="printDoc"
                  >
                    Print / PDF
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="flat"
                    color="green-darken-2"
                    prepend-icon="mdi-download"
                    @click="downloadDoc"
                  >
                    Download
                  </v-btn>
                </div>
              </div>
              <v-divider />
              <!-- Content -->
              <div class="pa-4" style="max-height: 520px; overflow-y: auto">
                <pre
                  class="text-body-2"
                  style="white-space: pre-wrap; font-family: inherit; line-height: 1.7"
                >{{ docContent }}</pre>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>
