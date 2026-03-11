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
const filterGrade = ref(null);

const workbooks = [
  {
    id: "preassignment_workbook1",
    name: "Pre-Assignment Workbook 1",
    color: "blue",
  },
  {
    id: "preassignment_workbook2",
    name: "Pre-Assignment Workbook 2",
    color: "indigo",
  },
  {
    id: "preassignment_workbook3",
    name: "Pre-Assignment Workbook 3",
    color: "cyan",
  },
  { id: "assignment_workbook1", name: "Assignment Workbook 1", color: "green" },
  {
    id: "assignment_workbook2",
    name: "Assignment Workbook 2",
    color: "orange",
  },
  {
    id: "assignment_workbook3",
    name: "Assignment Workbook 3",
    color: "purple",
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

const gradeLevels = [
  "All Grades",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const filteredStudents = computed(() => {
  let filtered = students.value;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (student) =>
        student.firstName?.toLowerCase().includes(searchLower) ||
        student.lastName?.toLowerCase().includes(searchLower) ||
        student.student_id?.toLowerCase().includes(searchLower),
    );
  }

  if (filterGrade.value && filterGrade.value !== "All Grades") {
    filtered = filtered.filter(
      (student) => student.grade_level === filterGrade.value,
    );
  }

  return filtered;
});

onMounted(async () => {
  if (!user.value) {
    router.push("/school-login");
    return;
  }
  await loadProgressData();
});

const loadProgressData = async () => {
  try {
    loading.value = true;

    // Get school admin profile
    const { data: profile } = await client
      .from("profiles")
      .select("*, school_id")
      .eq("id", user.value.id)
      .single();

    if (!profile || profile.role !== "school_admin") {
      router.push("/school-login");
      return;
    }

    // Get school data
    const { data: schoolData } = await client
      .from("schools")
      .select("*")
      .eq("id", profile.school_id)
      .single();

    school.value = schoolData;

    // Get students with progress
    const { data: studentsData } = await client
      .from("school_students")
      .select("*")
      .eq("school_id", profile.school_id)
      .order("lastName", { ascending: true });

    // Load progress for each student
    if (studentsData) {
      for (const student of studentsData) {
        // Calculate overall progress (mock data - replace with actual quiz progress)
        student.overall_progress = Math.floor(Math.random() * 100); // Replace with actual calculation
        student.completed_modules = Math.floor(Math.random() * 6);
        student.total_modules = 6;
        student.last_activity = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString();
      }
    }

    students.value = studentsData || [];
    loading.value = false;
  } catch (error) {
    console.error("Error loading progress data:", error);
    loading.value = false;
  }
};

const viewStudentDetails = (student) => {
  selectedStudent.value = student;
};

const getProgressColor = (progress) => {
  if (progress >= 75) return "success";
  if (progress >= 50) return "warning";
  if (progress >= 25) return "orange";
  return "error";
};

const calculateAverageProgress = () => {
  if (filteredStudents.value.length === 0) return 0;
  const sum = filteredStudents.value.reduce(
    (acc, student) => acc + student.overall_progress,
    0,
  );
  return Math.round(sum / filteredStudents.value.length);
};

const getTopPerformers = () => {
  return [...filteredStudents.value]
    .sort((a, b) => b.overall_progress - a.overall_progress)
    .slice(0, 5);
};

const logout = async () => {
  await auth.signOut();
  router.push("/school-login");
};
</script>

<template>
  <div class="admin-progress">
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
          <!-- Header -->
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold">Progress Tracking</h1>
              <p class="text-subtitle-1 text-grey">
                Monitor student learning progress across all modules
              </p>
            </v-col>
          </v-row>

          <!-- Summary Cards -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-caption text-grey mb-1">
                        Average Progress
                      </p>
                      <h2 class="text-h4 font-weight-bold">
                        {{ calculateAverageProgress() }}%
                      </h2>
                    </div>
                    <v-icon size="48" color="blue">mdi-chart-line</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-caption text-grey mb-1">Total Students</p>
                      <h2 class="text-h4 font-weight-bold">
                        {{ students.length }}
                      </h2>
                    </div>
                    <v-icon size="48" color="green">mdi-account-group</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card elevation="2">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <p class="text-caption text-grey mb-1">Active Modules</p>
                      <h2 class="text-h4 font-weight-bold">
                        {{ workbooks.length }}
                      </h2>
                    </div>
                    <v-icon size="48" color="purple"
                      >mdi-book-open-page-variant</v-icon
                    >
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Filters and Search -->
          <v-row class="mb-4">
            <v-col cols="12" md="8">
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
            <v-col cols="12" md="4">
              <v-select
                v-model="filterGrade"
                :items="gradeLevels"
                label="Filter by Grade"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
          </v-row>

          <!-- Student Progress Cards -->
          <v-row>
            <v-col
              v-for="student in filteredStudents"
              :key="student.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                elevation="2"
                class="student-card"
                hover
                @click="viewStudentDetails(student)"
              >
                <v-card-text>
                  <div class="d-flex align-center mb-3">
                    <v-avatar color="primary" size="48" class="mr-3">
                      <span class="text-h6 text-white">
                        {{ student.firstName?.charAt(0)
                        }}{{ student.lastName?.charAt(0) }}
                      </span>
                    </v-avatar>
                    <div>
                      <h3 class="text-h6 font-weight-bold">
                        {{ student.firstName }} {{ student.lastName }}
                      </h3>
                      <p class="text-caption text-grey mb-0">
                        ID: {{ student.student_id }} | {{ student.grade_level }}
                      </p>
                    </div>
                  </div>

                  <v-divider class="mb-3"></v-divider>

                  <div class="mb-3">
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-body-2">Overall Progress</span>
                      <span class="text-body-2 font-weight-bold">
                        {{ student.overall_progress }}%
                      </span>
                    </div>
                    <v-progress-linear
                      :model-value="student.overall_progress"
                      :color="getProgressColor(student.overall_progress)"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>

                  <div class="d-flex justify-space-between text-body-2">
                    <span>
                      <v-icon size="small" class="mr-1">mdi-book-check</v-icon>
                      {{ student.completed_modules }}/{{
                        student.total_modules
                      }}
                      Modules
                    </span>
                    <span class="text-grey">
                      <v-icon size="small" class="mr-1"
                        >mdi-clock-outline</v-icon
                      >
                      {{ student.last_activity }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="filteredStudents.length === 0" cols="12">
              <v-card elevation="2">
                <v-card-text class="text-center pa-8">
                  <v-icon size="64" color="grey">mdi-account-off</v-icon>
                  <p class="text-h6 mt-4">No students found</p>
                  <p class="text-body-2 text-grey">
                    Try adjusting your search or filters
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Top Performers Section -->
          <v-row class="mt-6" v-if="students.length > 0">
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title class="bg-grey-lighten-4">
                  <v-icon class="mr-2">mdi-trophy</v-icon>
                  Top Performers
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="(student, index) in getTopPerformers()"
                      :key="student.id"
                      class="mb-2"
                    >
                      <template v-slot:prepend>
                        <v-avatar
                          :color="
                            index === 0
                              ? 'gold'
                              : index === 1
                                ? 'silver'
                                : 'bronze'
                          "
                          size="40"
                        >
                          <span class="text-white font-weight-bold">{{
                            index + 1
                          }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>
                        {{ student.firstName }} {{ student.lastName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ student.grade_level }}
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <v-chip
                          :color="getProgressColor(student.overall_progress)"
                          size="small"
                        >
                          {{ student.overall_progress }}%
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Student Details Dialog -->
      <v-dialog v-model="selectedStudent" max-width="800px">
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
            <v-spacer></v-spacer>
            <v-btn icon @click="selectedStudent = null" variant="text">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Module Progress</h3>

            <v-row>
              <v-col
                v-for="workbook in workbooks"
                :key="workbook.id"
                cols="12"
                md="6"
              >
                <v-card elevation="1" class="mb-3">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon :color="workbook.color" class="mr-2"
                        >mdi-book</v-icon
                      >
                      <span class="font-weight-bold">{{ workbook.name }}</span>
                    </div>
                    <v-progress-linear
                      :model-value="Math.floor(Math.random() * 100)"
                      :color="workbook.color"
                      height="6"
                      rounded
                    ></v-progress-linear>
                    <p class="text-caption text-grey mt-1 mb-0">
                      {{ Math.floor(Math.random() * 100) }}% Complete
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<style scoped>
.admin-progress {
  background: #f5f5f5;
  min-height: 100vh;
}

.student-card {
  transition: transform 0.2s;
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-4px);
}
</style>
