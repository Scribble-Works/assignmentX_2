<script setup>
// Check if user is authenticated and is a school admin
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const school = ref(null);
const stats = ref({
  totalStudents: 0,
  activeStudents: 0,
  totalModules: 6,
  averageProgress: 0,
});
const loading = ref(true);

// Check authentication
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

    // Get students count
    const { data: students, count: totalCount } = await client
      .from("school_students")
      .select("*", { count: "exact" })
      .eq("school_id", profile.school_id);

    stats.value.totalStudents = totalCount || 0;
    stats.value.activeStudents =
      students?.filter((s) => s.status === "active").length || 0;

    // Calculate average progress
    if (students && students.length > 0) {
      const progressData = await Promise.all(
        students.map(async (student) => {
          const { data: progress } = await client
            .from("student_progress")
            .select("progress_percentage")
            .eq("student_id", student.id);

          return (
            progress?.reduce(
              (sum, p) => sum + (p.progress_percentage || 0),
              0,
            ) / (progress?.length || 1)
          );
        }),
      );

      stats.value.averageProgress = Math.round(
        progressData.reduce((sum, p) => sum + p, 0) / progressData.length,
      );
    }

    loading.value = false;
  } catch (error) {
    console.error("Error loading school data:", error);
    loading.value = false;
  }
};

const logout = async () => {
  await auth.signOut();
  router.push("/school-login");
};

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
  {
    title: "Manage Access",
    icon: "mdi-key",
    to: "/school-admin/access",
  },
  {
    title: "Reports",
    icon: "mdi-file-document-multiple",
    to: "/school-admin/reports",
  },
];
</script>

<template>
  <div class="admin-dashboard">
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
          <v-row
            v-if="loading"
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-col cols="auto">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
            </v-col>
          </v-row>

          <template v-else>
            <!-- Welcome Section -->
            <v-row class="mb-4">
              <v-col cols="12">
                <h1 class="text-h4 font-weight-bold mb-2">Welcome Back!</h1>
                <p class="text-subtitle-1 text-grey">
                  Here's an overview of your school's learning progress
                </p>
              </v-col>
            </v-row>

            <!-- Stats Cards -->
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="2">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <p class="text-caption text-grey mb-1">
                          Total Students
                        </p>
                        <h2 class="text-h4 font-weight-bold">
                          {{ stats.totalStudents }}
                        </h2>
                      </div>
                      <v-icon size="48" color="blue">mdi-account-group</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="2">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <p class="text-caption text-grey mb-1">
                          Active Students
                        </p>
                        <h2 class="text-h4 font-weight-bold">
                          {{ stats.activeStudents }}
                        </h2>
                      </div>
                      <v-icon size="48" color="green">mdi-account-check</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="2">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <p class="text-caption text-grey mb-1">
                          Learning Modules
                        </p>
                        <h2 class="text-h4 font-weight-bold">
                          {{ stats.totalModules }}
                        </h2>
                      </div>
                      <v-icon size="48" color="orange"
                        >mdi-book-open-page-variant</v-icon
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="2">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <p class="text-caption text-grey mb-1">
                          Average Progress
                        </p>
                        <h2 class="text-h4 font-weight-bold">
                          {{ stats.averageProgress }}%
                        </h2>
                      </div>
                      <v-icon size="48" color="purple">mdi-chart-line</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Quick Actions -->
            <v-row class="mt-6">
              <v-col cols="12">
                <h2 class="text-h5 font-weight-bold mb-4">Quick Actions</h2>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="action-card"
                  hover
                  @click="$router.push('/school-admin/students')"
                >
                  <v-card-text class="text-center pa-6">
                    <v-icon size="64" color="primary" class="mb-4"
                      >mdi-account-plus</v-icon
                    >
                    <h3 class="text-h6 font-weight-bold mb-2">Add Students</h3>
                    <p class="text-body-2 text-grey">
                      Enroll new students in learning modules
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="action-card"
                  hover
                  @click="$router.push('/school-admin/progress')"
                >
                  <v-card-text class="text-center pa-6">
                    <v-icon size="64" color="success" class="mb-4"
                      >mdi-chart-timeline-variant</v-icon
                    >
                    <h3 class="text-h6 font-weight-bold mb-2">View Progress</h3>
                    <p class="text-body-2 text-grey">
                      Monitor student learning progress
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="action-card"
                  hover
                  @click="$router.push('/school-admin/access')"
                >
                  <v-card-text class="text-center pa-6">
                    <v-icon size="64" color="warning" class="mb-4"
                      >mdi-key-variant</v-icon
                    >
                    <h3 class="text-h6 font-weight-bold mb-2">Manage Access</h3>
                    <p class="text-body-2 text-grey">
                      Control student module access
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Recent Activity -->
            <v-row class="mt-6">
              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="bg-grey-lighten-4">
                    <v-icon class="mr-2">mdi-history</v-icon>
                    Recent Activity
                  </v-card-title>
                  <v-card-text>
                    <p class="text-center text-grey py-8">
                      No recent activity to display
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
    };
  },
};
</script>

<style scoped>
.admin-dashboard {
  background: #f5f5f5;
  min-height: 100vh;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.action-card {
  transition: all 0.2s;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}
</style>
