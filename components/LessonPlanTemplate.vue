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

// Inject the shared stylesheet once (dedupes on the `key`)
useHead({
  style: [{ innerHTML: LESSON_TEMPLATE_CSS, key: "lesson-template-css" }],
});

const ph = (val, fallback) =>
  val && String(val).trim() ? val : `[${fallback}]`;

const indicatorLabel = computed(
  () => `Indicator ${props.data?.indicatorNumber ?? "1"}`,
);

const asList = (val) => (Array.isArray(val) ? val.filter(Boolean) : []);

// ─── Editing helpers ─────────────────────────────────────────────────────────
// `data` is shared by reference with the parent, so mutating it triggers the
// parent's autosave watcher.
const ensureArray = (key) => {
  if (!Array.isArray(props.data[key])) props.data[key] = [];
  return props.data[key];
};
const addItem = (key, value = "") => ensureArray(key).push(value);
const removeItem = (key, i) => props.data[key].splice(i, 1);

const addPhase = () =>
  ensureArray("delivery").push({
    phase: `${props.data.delivery.length + 1}. NEW PHASE`,
    teacherActivities: "",
    pupilActivities: "",
    resources: "",
    duration: "",
  });
</script>

<template>
  <div
    id="lt-print-root"
    class="lt-doc lt--plan"
    :class="{ 'lt-edit': editable }"
  >
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
          <td>
            <input
              v-if="editable"
              v-model="data.duration"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{ ph(data.duration, "Enter Duration") }}</template>
          </td>
        </tr>
        <tr>
          <td class="lt-label">Strand</td>
          <td>
            <input
              v-if="editable"
              v-model="data.strand"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{ ph(data.strand, "Enter Strand") }}</template>
          </td>
          <td class="lt-label">{{ indicatorLabel }}</td>
          <td>
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
          <td class="lt-label">Lesson Title</td>
          <td colspan="3">
            <input
              v-if="editable"
              v-model="data.lessonTitle"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{
              ph(data.lessonTitle, "Enter Lesson Title")
            }}</template>
          </td>
        </tr>
        <tr>
          <td class="lt-label">Learning Objectives</td>
          <td colspan="3">
            <div>By the end of the lesson, pupils will be able to:</div>
            <template v-if="editable">
              <div
                v-for="(o, i) in data.learningObjectives || []"
                :key="i"
                class="lt-edit-row"
              >
                <input
                  v-model="data.learningObjectives[i]"
                  class="lt-edit-field"
                  type="text"
                />
                <button
                  type="button"
                  class="lt-edit-btn lt-edit-btn--danger"
                  @click="removeItem('learningObjectives', i)"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                class="lt-edit-btn lt-edit-add"
                @click="addItem('learningObjectives')"
              >
                + Add objective
              </button>
            </template>
            <ol v-else class="lt-ol">
              <li v-for="(o, i) in asList(data.learningObjectives)" :key="i">
                {{ o }}
              </li>
            </ol>
          </td>
        </tr>
        <tr>
          <td class="lt-label">Teaching / Learning Resources</td>
          <td colspan="3">
            <template v-if="editable">
              <div
                v-for="(r, i) in data.resources || []"
                :key="i"
                class="lt-edit-row"
              >
                <input
                  v-model="data.resources[i]"
                  class="lt-edit-field"
                  type="text"
                />
                <button
                  type="button"
                  class="lt-edit-btn lt-edit-btn--danger"
                  @click="removeItem('resources', i)"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                class="lt-edit-btn lt-edit-add"
                @click="addItem('resources')"
              >
                + Add resource
              </button>
            </template>
            <ul v-else>
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
          <td class="lt-phase">
            <textarea
              v-if="editable"
              v-model="p.phase"
              class="lt-edit-field"
              rows="3"
            />
            <template v-else>{{ p.phase }}</template>
            <button
              v-if="editable"
              type="button"
              class="lt-edit-btn lt-edit-btn--danger lt-edit-add"
              @click="removeItem('delivery', i)"
            >
              Remove phase
            </button>
          </td>
          <td class="lt-rich">
            <textarea
              v-if="editable"
              v-model="p.teacherActivities"
              class="lt-edit-field"
              rows="5"
            />
            <div
              v-else
              v-math-render
              v-html="renderMarkdown(p.teacherActivities)"
            />
          </td>
          <td class="lt-rich">
            <textarea
              v-if="editable"
              v-model="p.pupilActivities"
              class="lt-edit-field"
              rows="5"
            />
            <div
              v-else
              v-math-render
              v-html="renderMarkdown(p.pupilActivities)"
            />
          </td>
          <td>
            <textarea
              v-if="editable"
              v-model="p.resources"
              class="lt-edit-field"
              rows="3"
            />
            <template v-else>{{ p.resources }}</template>
          </td>
          <td>
            <input
              v-if="editable"
              v-model="p.duration"
              class="lt-edit-field"
              type="text"
            />
            <template v-else>{{ p.duration }}</template>
          </td>
        </tr>
        <tr v-if="editable">
          <td colspan="5">
            <button
              type="button"
              class="lt-edit-btn lt-edit-add"
              @click="addPhase"
            >
              + Add phase
            </button>
          </td>
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
          <td class="lt-rich">
            <textarea
              v-if="editable"
              v-model="data.assessment"
              class="lt-edit-field"
              rows="6"
            />
            <div
              v-else
              v-math-render
              v-html="renderMarkdown(data.assessment)"
            />
          </td>
        </tr>
        <tr>
          <td class="lt-label">Differentiation</td>
          <td class="lt-rich">
            <textarea
              v-if="editable"
              v-model="data.differentiation"
              class="lt-edit-field"
              rows="5"
            />
            <div
              v-else
              v-math-render
              v-html="renderMarkdown(data.differentiation)"
            />
          </td>
        </tr>
        <tr>
          <td class="lt-label">Reflection</td>
          <td>
            <textarea
              v-if="editable"
              v-model="data.reflection"
              class="lt-edit-field"
              rows="3"
            />
            <span v-else class="lt-muted">{{
              data.reflection || "What worked well? What will I improve?"
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
