<script setup>
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const school = ref(null);
const loading = ref(true);
const drawer = ref(true);
const selectedReportType = ref("overview");
const dateRange = ref("all");
const gradeFilter = ref("all");

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

const reportTypes = [
  {
    value: "overview",
    title: "School Overview",
    description: "Summary of all students and modules",
    icon: "mdi-chart-box",
    color: "blue",
  },
  {
    value: "progress",
    title: "Progress Report",
    description: "Detailed progress across all modules",
    icon: "mdi-chart-line",
    color: "green",
  },
  {
    value: "engagement",
    title: "Engagement Report",
    description: "Student activity and participation",
    icon: "mdi-account-clock",
    color: "orange",
  },
  {
    value: "completion",
    title: "Completion Report",
    description: "Module completion statistics",
    icon: "mdi-checkbox-marked-circle",
    color: "purple",
  },
];

const dateRanges = [
  { title: "All Time", value: "all" },
  { title: "Last 7 Days", value: "7days" },
  { title: "Last 30 Days", value: "30days" },
  { title: "Last 3 Months", value: "3months" },
  { title: "This Year", value: "year" },
];

const grades = [
  "all",
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

onMounted(async () => {
  if (!user.value) {
    router.push("/school-login");
    return;
  }
  await loadSchoolData();
});

const loadSchoolData = async () => {
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
    loading.value = false;
  } catch (error) {
    console.error("Error loading school data:", error);
    loading.value = false;
  }
};

const exportReport = (format) => {
  alert(`Exporting ${selectedReportType.value} report as ${format}...`);
  // Implement actual export logic here
};

const logout = async () => {
  await auth.signOut();
  router.push("/school-login");
};
</script>

<template>
  <div class="admin-reports">
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
              <h1 class="text-h4 font-weight-bold">Reports & Analytics</h1>
              <p class="text-subtitle-1 text-grey">
                View and export detailed reports about student progress
              </p>
            </v-col>
          </v-row>

          <!-- Report Type Selection -->
          <v-row class="mb-4">
            <v-col
              v-for="reportType in reportTypes"
              :key="reportType.value"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="report-card"
                :class="{ selected: selectedReportType === reportType.value }"
                hover
                @click="selectedReportType = reportType.value"
              >
                <v-card-text class="text-center pa-4">
                  <v-icon :color="reportType.color" size="48" class="mb-3">
                    {{ reportType.icon }}
                  </v-icon>
                  <h3 class="text-h6 font-weight-bold mb-2">
                    {{ reportType.title }}
                  </h3>
                  <p class="text-body-2 text-grey mb-0">
                    {{ reportType.description }}
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Filters -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-select
                v-model="dateRange"
                :items="dateRanges"
                label="Date Range"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="gradeFilter"
                :items="grades"
                label="Grade Level"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-school"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Report Display Area -->
          <v-row>
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title
                  class="bg-grey-lighten-4 d-flex justify-space-between align-center"
                >
                  <span>
                    <v-icon class="mr-2">mdi-file-chart</v-icon>
                    {{
                      reportTypes.find((r) => r.value === selectedReportType)
                        ?.title
                    }}
                  </span>
                  <div>
                    <v-btn
                      color="success"
                      size="small"
                      variant="tonal"
                      class="mr-2"
                      @click="exportReport('excel')"
                    >
                      <v-icon left>mdi-file-excel</v-icon>
                      Export Excel
                    </v-btn>
                    <v-btn
                      color="error"
                      size="small"
                      variant="tonal"
                      @click="exportReport('pdf')"
                    >
                      <v-icon left>mdi-file-pdf-box</v-icon>
                      Export PDF
                    </v-btn>
                  </div>
                </v-card-title>

                <v-card-text class="pa-6">
                  <!-- School Overview Report -->
                  <div v-if="selectedReportType === 'overview'">
                    <h3 class="text-h6 font-weight-bold mb-4">
                      School Overview
                    </h3>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card class="stat-card" elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-1">
                              Total Enrolled
                            </p>
                            <h2 class="text-h4 font-weight-bold text-blue">
                              45
                            </h2>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card class="stat-card" elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-1">
                              Active Students
                            </p>
                            <h2 class="text-h4 font-weight-bold text-green">
                              42
                            </h2>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card class="stat-card" elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-1">
                              Avg. Progress
                            </p>
                            <h2 class="text-h4 font-weight-bold text-purple">
                              68%
                            </h2>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Progress Report -->
                  <div v-else-if="selectedReportType === 'progress'">
                    <h3 class="text-h6 font-weight-bold mb-4">
                      Progress Report
                    </h3>
                    <p class="text-body-2 text-grey mb-4">
                      Detailed breakdown of student progress across all learning
                      modules
                    </p>
                    <v-list>
                      <v-list-item v-for="i in 5" :key="i">
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-book</v-icon>
                        </template>
                        <v-list-item-title>Module {{ i }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Average completion:
                          {{ Math.floor(Math.random() * 40 + 60) }}%
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-progress-circular
                            :model-value="Math.floor(Math.random() * 40 + 60)"
                            color="primary"
                            size="40"
                          >
                            {{ Math.floor(Math.random() * 40 + 60) }}
                          </v-progress-circular>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>

                  <!-- Engagement Report -->
                  <div v-else-if="selectedReportType === 'engagement'">
                    <h3 class="text-h6 font-weight-bold mb-4">
                      Engagement Report
                    </h3>
                    <p class="text-body-2 text-grey mb-4">
                      Student activity and participation metrics
                    </p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-2">
                              Daily Active Users
                            </p>
                            <h3 class="text-h5 font-weight-bold">28</h3>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-2">
                              Avg. Session Time
                            </p>
                            <h3 class="text-h5 font-weight-bold">45 min</h3>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Completion Report -->
                  <div v-else-if="selectedReportType === 'completion'">
                    <h3 class="text-h6 font-weight-bold mb-4">
                      Completion Report
                    </h3>
                    <p class="text-body-2 text-grey mb-4">
                      Module completion statistics and achievements
                    </p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-2">
                              Modules Completed
                            </p>
                            <h3 class="text-h5 font-weight-bold">156</h3>
                            <v-progress-linear
                              model-value="75"
                              color="success"
                              height="8"
                              class="mt-2"
                            ></v-progress-linear>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card elevation="1">
                          <v-card-text>
                            <p class="text-caption text-grey mb-2">
                              Completion Rate
                            </p>
                            <h3 class="text-h5 font-weight-bold">73%</h3>
                            <v-progress-linear
                              model-value="73"
                              color="primary"
                              height="8"
                              class="mt-2"
                            ></v-progress-linear>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
.admin-reports {
  background: #f5f5f5;
  min-height: 100vh;
}

.report-card {
  transition: all 0.2s;
  cursor: pointer;
  border: 2px solid transparent;
}

.report-card:hover {
  transform: translateY(-4px);
}

.report-card.selected {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.stat-card {
  border-left: 4px solid #1976d2;
}
</style>
