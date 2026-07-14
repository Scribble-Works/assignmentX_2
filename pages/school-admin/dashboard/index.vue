<script setup>
definePageMeta({ layout: "default" });

const user = useSupabaseUser();

const loading = ref(true);
const submitting = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const actorRole = ref("");
const school = ref(null);
const teachers = ref([]);
const classes = ref([]);
const memberships = ref([]);
const classStudents = ref([]);

const addTeacherEmail = ref("");
const newClassName = ref("");
const newClassGrade = ref("");
const selectedClassId = ref("");
const studentEmail = ref("");
const assignTeacherId = ref("");
const assignClassId = ref("");

const canManageTeachers = computed(() => actorRole.value === "school_admin");
const canCreateClass = computed(() => actorRole.value === "school_admin");
const canEnrollStudents = computed(() =>
  ["school_admin", "educator", "teacher", "facilitator"].includes(
    actorRole.value,
  ),
);

const teacherClassIds = computed(() => {
  if (!user.value?.id) return [];
  return memberships.value
    .filter((m) => m.teacher_id === user.value.id)
    .map((m) => m.class_id);
});

const classOptions = computed(() => {
  const source = ["educator", "teacher", "facilitator"].includes(
    actorRole.value,
  )
    ? classes.value.filter((c) => teacherClassIds.value.includes(c.id))
    : classes.value;
  return source.map((c) => ({
    title: c.grade_level ? `${c.name} (${c.grade_level})` : c.name,
    value: c.id,
  }));
});

const allClassOptions = computed(() =>
  classes.value.map((c) => ({
    title: c.grade_level ? `${c.name} (${c.grade_level})` : c.name,
    value: c.id,
  })),
);

const teacherOptions = computed(() =>
  teachers.value.map((t) => ({
    title: `${t.firstName || ""} ${t.lastName || ""}`.trim() || t.email,
    value: t.id,
  })),
);

const studentsByClass = computed(() => {
  const grouped = {};
  for (const row of classStudents.value) {
    if (!grouped[row.class_id]) grouped[row.class_id] = [];
    grouped[row.class_id].push(row.student);
  }
  return grouped;
});

const classNameById = computed(() => {
  const map = {};
  for (const c of classes.value) map[c.id] = c.name;
  return map;
});

const clearAlerts = () => {
  errorMsg.value = "";
  successMsg.value = "";
};

const loadDashboard = async () => {
  if (!user.value?.id) return;

  loading.value = true;
  clearAlerts();

  try {
    const data = await $fetch("/api/school-admin/context", {
      query: { userId: user.value.id },
    });

    actorRole.value = data.actorRole || "";
    school.value = data.school || null;
    teachers.value = data.teachers || [];
    classes.value = data.classes || [];
    memberships.value = data.memberships || [];
    classStudents.value = data.classStudents || [];
  } catch (err) {
    errorMsg.value =
      err?.data?.statusMessage || "Failed to load school dashboard.";
  } finally {
    loading.value = false;
  }
};

const addTeacher = async () => {
  if (!addTeacherEmail.value.trim()) return;

  submitting.value = true;
  clearAlerts();
  try {
    await $fetch("/api/school-admin/add-teacher", {
      method: "POST",
      body: {
        adminId: user.value.id,
        teacherEmail: addTeacherEmail.value.trim().toLowerCase(),
      },
    });

    addTeacherEmail.value = "";
    successMsg.value = "Teacher added successfully.";
    await loadDashboard();
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || "Failed to add teacher.";
  } finally {
    submitting.value = false;
  }
};

const createClass = async () => {
  if (!newClassName.value.trim()) return;

  submitting.value = true;
  clearAlerts();
  try {
    const res = await $fetch("/api/school-admin/create-class", {
      method: "POST",
      body: {
        adminId: user.value.id,
        name: newClassName.value.trim(),
        gradeLevel: newClassGrade.value.trim(),
      },
    });

    newClassName.value = "";
    newClassGrade.value = "";
    successMsg.value = "Class created successfully.";
    await loadDashboard();

    if (res?.class?.id && !selectedClassId.value) {
      selectedClassId.value = res.class.id;
    }
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || "Failed to create class.";
  } finally {
    submitting.value = false;
  }
};

const assignTeacherToClass = async () => {
  if (!assignTeacherId.value || !assignClassId.value) return;

  submitting.value = true;
  clearAlerts();
  try {
    await $fetch("/api/school-admin/assign-teacher-class", {
      method: "POST",
      body: {
        adminId: user.value.id,
        teacherId: assignTeacherId.value,
        classId: assignClassId.value,
      },
    });

    successMsg.value = "Teacher assigned to class successfully.";
    await loadDashboard();
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || "Failed to assign teacher.";
  } finally {
    submitting.value = false;
  }
};

const enrollStudent = async () => {
  if (!selectedClassId.value || !studentEmail.value.trim()) return;

  submitting.value = true;
  clearAlerts();
  try {
    await $fetch("/api/school-admin/enroll-student", {
      method: "POST",
      body: {
        actorId: user.value.id,
        classId: selectedClassId.value,
        studentEmail: studentEmail.value.trim().toLowerCase(),
      },
    });

    studentEmail.value = "";
    successMsg.value = "Student enrolled successfully.";
    await loadDashboard();
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || "Failed to enroll student.";
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  if (!user.value) {
    await navigateTo("/login");
    return;
  }

  await loadDashboard();
});
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">School Dashboard</h1>
        <p class="text-body-2 text-grey-darken-1">
          {{ school?.name || "School" }}
        </p>
      </div>
      <v-btn variant="tonal" color="blue-darken-1" @click="loadDashboard">
        Refresh
      </v-btn>
    </div>

    <v-alert
      v-if="errorMsg"
      type="error"
      closable
      class="mb-4"
      @click:close="errorMsg = ''"
    >
      {{ errorMsg }}
    </v-alert>

    <v-alert
      v-if="successMsg"
      type="success"
      closable
      class="mb-4"
      @click:close="successMsg = ''"
    >
      {{ successMsg }}
    </v-alert>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="green-darken-2" />
    </div>

    <v-row v-else>
      <v-col cols="12" md="5">
        <v-card class="mb-4" v-if="canManageTeachers">
          <v-card-title>Add Teacher</v-card-title>
          <v-card-text>
            <p class="text-caption text-grey-darken-1 mb-2">
              Teacher must already have an AssignmentX account and be onboarded
              as educator.
            </p>
            <v-text-field
              v-model="addTeacherEmail"
              label="Teacher Email"
              type="email"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green-darken-2"
              :loading="submitting"
              @click="addTeacher"
            >
              Add Teacher
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mb-4" v-if="canCreateClass">
          <v-card-title>Create Class</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newClassName"
              label="Class Name"
              variant="outlined"
              density="compact"
              class="mb-2"
            />
            <v-text-field
              v-model="newClassGrade"
              label="Grade Level (optional)"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green-darken-2"
              :loading="submitting"
              @click="createClass"
            >
              Create Class
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mb-4" v-if="canManageTeachers">
          <v-card-title>Assign Teacher To Class</v-card-title>
          <v-card-text>
            <v-select
              v-model="assignTeacherId"
              :items="teacherOptions"
              label="Teacher"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              class="mb-2"
            />
            <v-select
              v-model="assignClassId"
              :items="allClassOptions"
              label="Class"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green-darken-2"
              :loading="submitting"
              @click="assignTeacherToClass"
            >
              Assign
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-if="canEnrollStudents">
          <v-card-title>Add Student To Class</v-card-title>
          <v-card-text>
            <p class="text-caption text-grey-darken-1 mb-2">
              Student must already have an AssignmentX account and be onboarded
              as student.
            </p>
            <v-select
              v-model="selectedClassId"
              :items="classOptions"
              label="Select Class"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              class="mb-2"
            />
            <v-text-field
              v-model="studentEmail"
              label="Student Email"
              type="email"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green-darken-2"
              :loading="submitting"
              @click="enrollStudent"
            >
              Enroll Student
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mt-4" v-if="canEnrollStudents">
          <v-card-title>Bulk Upload Students</v-card-title>
          <v-card-text>
            <p class="text-caption text-grey-darken-1 mb-4">
              Import a CSV file to add multiple existing students to the
              selected class at once.
            </p>
            <BulkStudentUpload
              :actor-id="user.id"
              :school-id="school?.id || ''"
              :class-id="selectedClassId"
              @upload-complete="loadDashboard"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card class="mb-4">
          <v-card-title>Teachers</v-card-title>
          <v-list density="compact">
            <v-list-item v-for="teacher in teachers" :key="teacher.id">
              <v-list-item-title>
                {{ teacher.firstName }} {{ teacher.lastName }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ teacher.email }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="teachers.length === 0">
              <v-list-item-title class="text-grey-darken-1">
                No teachers linked yet.
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Classes</v-card-title>
          <v-list density="compact">
            <v-list-item v-for="c in classes" :key="c.id">
              <v-list-item-title>{{ c.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ c.grade_level || "No grade set" }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="classes.length === 0">
              <v-list-item-title class="text-grey-darken-1">
                No classes created yet.
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card>
          <v-card-title>Class Students</v-card-title>
          <v-card-text v-if="classes.length === 0" class="text-grey-darken-1">
            Create classes and enroll students to see class rosters.
          </v-card-text>
          <v-expansion-panels v-else>
            <v-expansion-panel
              v-for="c in classes"
              :key="c.id"
              :title="classNameById[c.id] || c.name"
            >
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item
                    v-for="(student, idx) in studentsByClass[c.id] || []"
                    :key="student?.id || `${c.id}-${idx}`"
                  >
                    <v-list-item-title>
                      {{ student?.firstName }} {{ student?.lastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      student?.email
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="!(studentsByClass[c.id] || []).length">
                    <v-list-item-title class="text-grey-darken-1">
                      No students enrolled.
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
