<script setup>
import {
  LESSON_TEMPLATE_CSS,
  renderMarkdown,
  vMathRender,
} from "~/composables/useLessonTemplate";

const props = defineProps({
  data: { type: Object, required: true },
  teacher: { type: String, default: "" },
  school: { type: String, default: "" },
  level: { type: String, default: "" },
  date: { type: String, default: "" },
  logoSrc: { type: String, default: "/img/logo.png" },
  editable: { type: Boolean, default: false },
});

useHead({
  style: [{ innerHTML: LESSON_TEMPLATE_CSS, key: "lesson-template-css" }],
});

const ph = (val, fallback) =>
  val && String(val).trim() ? val : `[${fallback}]`;

const indicatorLabel = computed(
  () => `Learning Indicator ${props.data?.indicatorNumber ?? "1"}`,
);

const examples = computed(() =>
  Array.isArray(props.data?.examples) ? props.data.examples.filter(Boolean) : [],
);

// ─── Editing helpers ─────────────────────────────────────────────────────────
// The `data` object is shared by reference with the parent, so mutating it here
// updates the parent's docData and triggers its autosave watcher.
const addExample = () => {
  if (!Array.isArray(props.data.examples)) props.data.examples = [];
  props.data.examples.push({
    title: `Example ${props.data.examples.length + 1}`,
    body: "",
  });
};

const removeExample = (i) => {
  props.data.examples.splice(i, 1);
};
</script>

<template>
  <div
    id="lt-print-root"
    class="lt-doc lt--note"
    :class="{ 'lt-edit': editable }"
  >
    <div class="lt-brandbar">
      <img :src="logoSrc" alt="Scribble Works" />
      <span class="lt-brand-name">Scribble Works</span>
      <span class="lt-brand-sub">AI Teaching Assistant &middot; NaCCA-aligned</span>
    </div>

    <table class="lt-table">
      <colgroup>
        <col style="width: 18%" /><col style="width: 32%" />
        <col style="width: 18%" /><col style="width: 32%" />
      </colgroup>
      <tbody>
        <tr class="lt-band">
          <td colspan="4">
            {{ (level || "Grade 4").toUpperCase() }} MATHEMATICS &ndash; LESSON NOTE
            <div class="lt-band-sub">
              {{ (data.strand || "Number Operations").toUpperCase() }} &ndash;
              INDICATOR {{ data.indicatorNumber ?? "1" }}
            </div>
          </td>
        </tr>
        <tr>
          <td class="lt-label">School</td>
          <td>{{ ph(school, "Enter School Name") }}</td>
          <td class="lt-label">Teacher</td>
          <td>{{ ph(teacher, "Enter Teacher's Name") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Lesson Topic</td>
          <td>
            <input
              v-if="editable"
              v-model="data.lessonTopic"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{ ph(data.lessonTopic, "Enter Lesson Topic") }}</template>
          </td>
          <td class="lt-label">Date</td>
          <td>{{ ph(date, "DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Class</td>
          <td>{{ ph(level, "Enter Class") }}</td>
          <td class="lt-label">Duration</td>
          <td>
            <input
              v-if="editable"
              v-model="data.duration"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{ ph(data.duration, "Depends on content") }}</template>
          </td>
        </tr>
        <tr>
          <td class="lt-label">{{ indicatorLabel }}</td>
          <td colspan="3">
            <textarea
              v-if="editable"
              v-model="data.indicatorText"
              class="lt-edit-field"
              rows="2"
            />
            <template v-else>{{
              ph(data.indicatorText, "Enter learning indicator")
            }}</template>
          </td>
        </tr>
        <tr>
          <td class="lt-label">Key Concept</td>
          <td colspan="3">
            <textarea
              v-if="editable"
              v-model="data.keyConcept"
              class="lt-edit-field"
              rows="2"
            />
            <template v-else>{{
              ph(data.keyConcept, "Briefly state the main idea of the lesson")
            }}</template>
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Explanation / Content</td></tr>
        <tr>
          <td colspan="4" class="lt-rich">
            <textarea
              v-if="editable"
              v-model="data.explanation"
              class="lt-edit-field"
              rows="10"
            />
            <div
              v-else
              v-math-render
              v-html="renderMarkdown(data.explanation)"
            />
            <div v-if="editable" class="lt-edit-hint">
              Markdown supported. Use $…$ or $$…$$ for maths.
            </div>
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Examples</td></tr>
        <tr>
          <td colspan="4">
            <template v-if="editable">
              <div
                v-for="(ex, i) in data.examples || []"
                :key="i"
                class="lt-example"
              >
                <div class="lt-edit-row">
                  <input
                    v-model="ex.title"
                    class="lt-edit-field"
                    type="text"
                    placeholder="Example title"
                  />
                  <button
                    type="button"
                    class="lt-edit-btn lt-edit-btn--danger"
                    @click="removeExample(i)"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  v-model="ex.body"
                  class="lt-edit-field"
                  rows="6"
                  placeholder="Worked solution (Markdown, $…$ for maths)"
                />
              </div>
              <button
                type="button"
                class="lt-edit-btn lt-edit-add"
                @click="addExample"
              >
                + Add example
              </button>
            </template>
            <template v-else>
              <div v-for="(ex, i) in examples" :key="i" class="lt-example">
                <div class="lt-example-title">
                  {{ ex.title || `Example ${i + 1}` }}
                </div>
                <div class="lt-rich" v-math-render v-html="renderMarkdown(ex.body)" />
              </div>
              <div v-if="!examples.length" class="lt-muted">
                No worked examples provided.
              </div>
            </template>
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Diagrams / Illustrations</td></tr>
        <tr>
          <td colspan="4" class="lt-rich">
            <textarea
              v-if="editable"
              v-model="data.diagrams"
              class="lt-edit-field"
              rows="5"
            />
            <div v-else v-math-render v-html="renderMarkdown(data.diagrams)" />
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Summary / Key Takeaway</td></tr>
        <tr>
          <td colspan="4" class="lt-rich">
            <textarea
              v-if="editable"
              v-model="data.summary"
              class="lt-edit-field"
              rows="5"
            />
            <div v-else v-math-render v-html="renderMarkdown(data.summary)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
