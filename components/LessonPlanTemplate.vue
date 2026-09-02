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

// Inject the shared stylesheet once (dedupes on the `key`)
useHead({
  style: [{ innerHTML: LESSON_TEMPLATE_CSS, key: "lesson-template-css" }],
});

const ph = (val, fallback) =>
  val && String(val).trim() ? val : `[${fallback}]`;

const indicatorLabel = computed(
  () => `Indicator ${props.data?.indicatorNumber ?? 1}`,
);

const asList = (val) => (Array.isArray(val) ? val.filter(Boolean) : []);
</script>

<template>
  <div id="lt-print-root" class="lt-doc lt--plan">
    <div class="lt-brandbar">
      <img :src="logoSrc" alt="Scribble Works" />
      <span class="lt-brand-name">Scribble Works</span>
      <span class="lt-brand-sub">AI Teaching Assistant &middot; NaCCA-aligned</span>
    </div>

    <!-- Header + lesson information -->
    <table class="lt-table">
      <colgroup>
        <col style="width: 16%" /><col style="width: 34%" />
        <col style="width: 16%" /><col style="width: 34%" />
      </colgroup>
      <tbody>
        <tr class="lt-band">
          <td colspan="4">
            {{ (level || "Grade 4").toUpperCase() }} MATHEMATICS &ndash; LESSON PLAN
            <div class="lt-band-sub">
              {{ (data.strand || "Number Operations").toUpperCase() }} &ndash;
              {{ indicatorLabel.toUpperCase() }}
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
          <td class="lt-label">Class</td>
          <td>{{ ph(level, "Enter Class") }}</td>
          <td class="lt-label">Date</td>
          <td>{{ ph(date, "DD/MM/YYYY") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Subject</td>
          <td>Mathematics</td>
          <td class="lt-label">Duration</td>
          <td>{{ ph(data.duration, "Enter Duration") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Strand</td>
          <td>{{ ph(data.strand, "Enter Strand") }}</td>
          <td class="lt-label">{{ indicatorLabel }}</td>
          <td>{{ ph(data.indicatorText, "Enter learning indicator") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Lesson Title</td>
          <td colspan="3">{{ ph(data.lessonTitle, "Enter Lesson Title") }}</td>
        </tr>
        <tr>
          <td class="lt-label">Learning Objectives</td>
          <td colspan="3">
            <div>By the end of the lesson, pupils will be able to:</div>
            <ol class="lt-ol">
              <li v-for="(o, i) in asList(data.learningObjectives)" :key="i">
                {{ o }}
              </li>
            </ol>
          </td>
        </tr>
        <tr>
          <td class="lt-label">Teaching / Learning Resources</td>
          <td colspan="3">
            <ul>
              <li v-for="(r, i) in asList(data.resources)" :key="i">{{ r }}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Lesson delivery grid -->
    <table class="lt-table lt-delivery">
      <colgroup>
        <col style="width: 14%" /><col style="width: 29%" />
        <col style="width: 29%" /><col style="width: 14%" />
        <col style="width: 14%" />
      </colgroup>
      <tbody>
        <tr class="lt-section">
          <td colspan="5">Lesson Delivery</td>
        </tr>
        <tr>
          <th>Phase</th>
          <th>Teacher Activities</th>
          <th>Pupil Activities</th>
          <th>Resources</th>
          <th>Duration</th>
        </tr>
        <tr v-for="(p, i) in asList(data.delivery)" :key="i">
          <td class="lt-phase">{{ p.phase }}</td>
          <td
            class="lt-rich"
            v-math-render
            v-html="renderMarkdown(p.teacherActivities)"
          />
          <td
            class="lt-rich"
            v-math-render
            v-html="renderMarkdown(p.pupilActivities)"
          />
          <td>{{ p.resources }}</td>
          <td>{{ p.duration }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Assessment / differentiation / reflection -->
    <table class="lt-table">
      <colgroup>
        <col style="width: 16%" /><col style="width: 84%" />
      </colgroup>
      <tbody>
        <tr>
          <td class="lt-label">Assessment</td>
          <td
            class="lt-rich"
            v-math-render
            v-html="renderMarkdown(data.assessment)"
          />
        </tr>
        <tr>
          <td class="lt-label">Differentiation</td>
          <td
            class="lt-rich"
            v-math-render
            v-html="renderMarkdown(data.differentiation)"
          />
        </tr>
        <tr>
          <td class="lt-label">Reflection</td>
          <td class="lt-muted">
            {{ data.reflection || "What worked well? What will I improve?" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
