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
});

useHead({
  style: [{ innerHTML: LESSON_TEMPLATE_CSS, key: "lesson-template-css" }],
});

const ph = (val, fallback) =>
  val && String(val).trim() ? val : `[${fallback}]`;

const indicatorLabel = computed(
  () => `Learning Indicator ${props.data?.indicatorNumber ?? 1}`,
);

const examples = computed(() =>
  Array.isArray(props.data?.examples) ? props.data.examples.filter(Boolean) : [],
);
</script>

<template>
  <div id="lt-print-root" class="lt-doc lt--note">
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
              INDICATOR {{ data.indicatorNumber ?? 1 }}
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
          <td>{{ ph(data.lessonTopic, "Enter Lesson Topic") }}</td>
          <td class="lt-label">Date</td>
          <td>{{ ph(date, "DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Class</td>
          <td>{{ ph(level, "Enter Class") }}</td>
          <td class="lt-label">Duration</td>
          <td>{{ ph(data.duration, "Depends on content") }}</td>
        </tr>
        <tr>
          <td class="lt-label">{{ indicatorLabel }}</td>
          <td colspan="3">
            {{ ph(data.indicatorText, "Enter learning indicator") }}
          </td>
        </tr>
        <tr>
          <td class="lt-label">Key Concept</td>
          <td colspan="3">
            {{ ph(data.keyConcept, "Briefly state the main idea of the lesson") }}
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Explanation / Content</td></tr>
        <tr>
          <td colspan="4" class="lt-rich" v-math-render v-html="renderMarkdown(data.explanation)" />
        </tr>

        <tr class="lt-note-section"><td colspan="4">Examples</td></tr>
        <tr>
          <td colspan="4">
            <div v-for="(ex, i) in examples" :key="i" class="lt-example">
              <div class="lt-example-title">{{ ex.title || `Example ${i + 1}` }}</div>
              <div class="lt-rich" v-math-render v-html="renderMarkdown(ex.body)" />
            </div>
            <div v-if="!examples.length" class="lt-muted">
              No worked examples provided.
            </div>
          </td>
        </tr>

        <tr class="lt-note-section"><td colspan="4">Diagrams / Illustrations</td></tr>
        <tr>
          <td colspan="4" class="lt-rich" v-math-render v-html="renderMarkdown(data.diagrams)" />
        </tr>

        <tr class="lt-note-section"><td colspan="4">Summary / Key Takeaway</td></tr>
        <tr>
          <td colspan="4" class="lt-rich" v-math-render v-html="renderMarkdown(data.summary)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
