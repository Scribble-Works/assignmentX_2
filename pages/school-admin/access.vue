<script setup>
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const school = ref(null);
const students = ref([]);
const selectedStudent = ref(null);
const loading = ref(true);
const drawer = ref(true);
const search = ref("");
const saving = ref(false);

const modules = [
  {
    id: "preassignment_workbook1",
    name: "Pre-Assignment Workbook 1",
    description: "Foundation concepts and introductory materials",
    color: "blue",
    icon: "mdi-book-open-variant",
  },
  {
    id: "preassignment_workbook2",
    name: "Pre-Assignment Workbook 2",
    description: "Intermediate preparation materials",
    color: "indigo",
    icon: "mdi-book-open-page-variant",
  },
  {
    id: "preassignment_workbook3",
    name: "Pre-Assignment Workbook 3",
    description: "Advanced preparation content",
    color: "cyan",
    icon: "mdi-book-open",
  },
  {
    id: "assignment_workbook1",
    name: "Assignment Workbook 1",
    description: "Core assignment module level 1",
    color: "green",
    icon: "mdi-notebook",
  },
  {
    id: "assignment_workbook2",
    name: "Assignment Workbook 2",
    description: "Core assignment module level 2",
    color: "orange",
    icon: "mdi-notebook-outline",
  },
  {
    id: "assignment_workbook3",
    name: "Assignment Workbook 3",
    description: "Core assignment module level 3",
    color: "purple",
    icon: "mdi-notebook-multiple",
  },
];

const navItems = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/school-admin/dashboard",
  },
  {
    title: "Students",
    icon: "mdi-account-group",
    to: "/school-admin/students",
  },
  {
    title: "Progress Tracking",
    icon: "mdi-chart-line",
    to: "/school-admin/progress",
  },
  { title: "Manage Access", icon: "mdi-key", to: "/school-admin/access" },
  {
    title: "Reports",
    icon: "mdi-file-document-multiple",
    to: "/school-admin/reports",
  },
];

const filteredStudents = computed(() => {
  if (!search.value) return students.value;
  const searchLower = search.value.toLowerCase();
  return students.value.filter(
    (student) =>
      student.firstName?.toLowerCase().includes(searchLower) ||
      student.lastName?.toLowerCase().includes(searchLower) ||
      student.student_id?.toLowerCase().includes(searchLower),
  );
});

onMounted(async () => {
  if (!user.value) {
    router.push("/school-login");
    return;
  }
  await loadData();
});

const loadData = async () => {
  try {
    loading.value = true;

    const { data: profile } = await client
      .from("profiles")
      .select("*, school_id")
      .eq("id", user.value.id)
      .single();

    if (!profile || profile.role !== "school_admin") {
      router.push("/school-login");
      return;
    }

    const { data: schoolData } = await client
      .from("schools")
      .select("*")
      .eq("id", profile.school_id)
      .single();

    school.value = schoolData;

    const { data: studentsData } = await client
      .from("school_students")
      .select("*")
      .eq("school_id", profile.school_id)
      .eq("status", "active")
      .order("lastName", { ascending: true });

    if (studentsData) {
      for (const student of studentsData) {
        const { data: accessData } = await client
          .from("student_module_access")
          .select("module_id")
          .eq("student_id", student.id);

        student.accessibleModules = accessData?.map((a) => a.module_id) || [];
      }
    }

    students.value = studentsData || [];
    loading.value = false;
  } catch (error) {
    console.error("Error loading data:", error);
    loading.value = false;
  }
};

const openAccessDialog = (student) => {
  selectedStudent.value = { ...student };
};

const toggleModuleAccess = (moduleId) => {
  if (!selectedStudent.value) return;

  const index = selectedStudent.value.accessibleModules.indexOf(moduleId);
  if (index > -1) {
    selectedStudent.value.accessibleModules.splice(index, 1);
  } else {
    selectedStudent.value.accessibleModules.push(moduleId);
  }
};

const hasAccess = (moduleId) => {
  return selectedStudent.value?.accessibleModules?.includes(moduleId) || false;
};

const saveAccessChanges = async () => {
  if (!selectedStudent.value) return;

  try {
    saving.value = true;

    await client
      .from("student_module_access")
      .delete()
      .eq("student_id", selectedStudent.value.id);

    if (selectedStudent.value.accessibleModules.length > 0) {
      const accessRecords = selectedStudent.value.accessibleModules.map(
        (moduleId) => ({
          student_id: selectedStudent.value.id,
          module_id: moduleId,
          granted_by: user.value.id,
          granted_at: new Date().toISOString(),
        }),
      );

      await client.from("student_module_access").insert(accessRecords);
    }

    const studentIndex = students.value.findIndex(
      (s) => s.id === selectedStudent.value.id,
    );
    if (studentIndex > -1) {
      students.value[studentIndex].accessibleModules = [
        ...selectedStudent.value.accessibleModules,
      ];
    }

    selectedStudent.value = null;
    saving.value = false;
  } catch (error) {
    console.error("Error saving access changes:", error);
    alert("Failed to save changes. Please try again.");
    saving.value = false;
  }
};

const grantAllAccess = () => {
  if (!selectedStudent.value) return;
  selectedStudent.value.accessibleModules = modules.map((m) => m.id);
};

const revokeAllAccess = () => {
  if (!selectedStudent.value) return;
  selectedStudent.value.accessibleModules = [];
};

const getAccessCount = (student) => {
  return student.accessibleModules?.length || 0;
};

const logout = async () => {
  await auth.signOut();
  router.push("/school-login");
};
</script>

<template>
  <div class="admin-access">
    <v-app>
      <!-- App Bar -->
      <v-app-bar color="primary" elevation="2">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="font-weight-bold">
          <v-icon class="mr-2">mdi-school</v-icon>
          {{ school?.name || "School Admin Portal" }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" app>
        <v-list>
          <v-list-item
            v-for="item in navItems"
            :key="item.title"
            :to="item.to"
            link
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold">Manage Module Access</h1>
              <p class="text-subtitle-1 text-grey">
                Control which learning modules students can access
              </p>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search students"
                single-line
                hide-details
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              v-for="student in filteredStudents"
              :key="student.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card elevation="2" class="access-card" hover>
                <v-card-text>
                  <div class="d-flex align-center mb-3">
                    <v-avatar color="primary" size="48" class="mr-3">
                      <span class="text-h6 text-white">
                        {{ student.firstName?.charAt(0)
                        }}{{ student.lastName?.charAt(0) }}
                      </span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold">
                        {{ student.firstName }} {{ student.lastName }}
                      </h3>
                      <p class="text-caption text-grey mb-0">
                        ID: {{ student.student_id }}
                      </p>
                    </div>
                  </div>

                  <v-divider class="mb-3"></v-divider>

                  <div class="mb-3">
                    <v-chip
                      :color="
                        getAccessCount(student) === modules.length
                          ? 'success'
                          : 'warning'
                      "
                      size="small"
                      variant="tonal"
                    >
                      <v-icon left size="small">mdi-key</v-icon>
                      {{ getAccessCount(student) }}/{{ modules.length }} Modules
                    </v-chip>
                  </div>

                  <v-btn
                    color="primary"
                    block
                    variant="flat"
                    @click="openAccessDialog(student)"
                  >
                    <v-icon left>mdi-pencil</v-icon>
                    Edit Access
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="filteredStudents.length === 0" cols="12">
              <v-card elevation="2">
                <v-card-text class="text-center pa-8">
                  <v-icon size="64" color="grey">mdi-account-off</v-icon>
                  <p class="text-h6 mt-4">No students found</p>
                  <p class="text-body-2 text-grey">Try adjusting your search</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Access Management Dialog -->
      <v-dialog v-model="selectedStudent" max-width="800px" scrollable>
        <v-card v-if="selectedStudent">
          <v-card-title class="bg-primary text-white">
            <div class="d-flex align-center">
              <v-avatar color="white" size="48" class="mr-3">
                <span class="text-h6 text-primary">
                  {{ selectedStudent.firstName?.charAt(0)
                  }}{{ selectedStudent.lastName?.charAt(0) }}
                </span>
              </v-avatar>
              <div>
                <h3 class="text-h6">
                  {{ selectedStudent.firstName }} {{ selectedStudent.lastName }}
                </h3>
                <p class="text-caption mb-0">
                  {{ selectedStudent.student_id }} |
                  {{ selectedStudent.grade_level }}
                </p>
              </div>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between mb-4">
              <v-btn
                color="success"
                size="small"
                variant="tonal"
                @click="grantAllAccess"
              >
                <v-icon left size="small">mdi-check-all</v-icon>
                Grant All Access
              </v-btn>
              <v-btn
                color="error"
                size="small"
                variant="tonal"
                @click="revokeAllAccess"
              >
                <v-icon left size="small">mdi-close-circle</v-icon>
                Revoke All Access
              </v-btn>
            </div>

            <v-divider class="mb-4"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Learning Modules</h3>

            <v-list>
              <v-list-item
                v-for="module in modules"
                :key="module.id"
                class="mb-2 rounded"
                :class="{ 'bg-grey-lighten-4': hasAccess(module.id) }"
              >
                <template v-slot:prepend>
                  <v-icon :color="module.color" size="32">{{
                    module.icon
                  }}</v-icon>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ module.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ module.description }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-switch
                    :model-value="hasAccess(module.id)"
                    @update:model-value="toggleModuleAccess(module.id)"
                    color="success"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="selectedStudent = null">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="saving"
              @click="saveAccessChanges"
            >
              <v-icon left>mdi-content-save</v-icon>
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<style scoped>
.admin-access {
  background: #f5f5f5;
  min-height: 100vh;
}

.access-card {
  transition: transform 0.2s;
}

.access-card:hover {
  transform: translateY(-4px);
}
</style>
