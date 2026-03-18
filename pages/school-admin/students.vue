<script setup>
definePageMeta({
  layout: false,
});

const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const school = ref(null);
const students = ref([]);
const loading = ref(true);
const dialog = ref(false);
const dialogDelete = ref(false);
const search = ref("");
const drawer = ref(true);

// Form fields for add/edit student
const editedIndex = ref(-1);
const editedItem = ref({
  firstName: "",
  lastName: "",
  email: "",
  student_id: "",
  grade_level: "",
  status: "active",
});

const defaultItem = {
  firstName: "",
  lastName: "",
  email: "",
  student_id: "",
  grade_level: "",
  status: "active",
};

const gradeLevels = [
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

const statusOptions = [
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
  { title: "Suspended", value: "suspended" },
];

const headers = [
  { title: "Student ID", key: "student_id", sortable: true },
  { title: "First Name", key: "firstName", sortable: true },
  { title: "Last Name", key: "lastName", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Grade", key: "grade_level", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
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

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Add New Student" : "Edit Student";
});

const filteredStudents = computed(() => {
  if (!search.value) return students.value;
  return students.value.filter((student) => {
    const searchLower = search.value.toLowerCase();
    return (
      student.firstName?.toLowerCase().includes(searchLower) ||
      student.lastName?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.student_id?.toLowerCase().includes(searchLower)
    );
  });
});

onMounted(async () => {
  if (!user.value) {
    router.push("/school-login");
    return;
  }
  await loadStudents();
});

const loadStudents = async () => {
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

    // Get students
    const { data: studentsData } = await client
      .from("school_students")
      .select("*")
      .eq("school_id", profile.school_id)
      .order("created_at", { ascending: false });

    students.value = studentsData || [];
    loading.value = false;
  } catch (error) {
    console.error("Error loading students:", error);
    loading.value = false;
  }
};

const editItem = (item) => {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
};

const deleteItem = (item) => {
  editedIndex.value = students.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    const itemToDelete = students.value[editedIndex.value];

    const { error } = await client
      .from("school_students")
      .delete()
      .eq("id", itemToDelete.id);

    if (error) throw error;

    students.value.splice(editedIndex.value, 1);
    closeDelete();
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("Failed to delete student. Please try again.");
  }
};

const close = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
  }, 300);
};

const closeDelete = () => {
  dialogDelete.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
  }, 300);
};

const save = async () => {
  try {
    if (editedIndex.value > -1) {
      // Update existing student
      const itemToUpdate = students.value[editedIndex.value];
      const { data, error } = await client
        .from("school_students")
        .update({
          firstName: editedItem.value.firstName,
          lastName: editedItem.value.lastName,
          email: editedItem.value.email,
          student_id: editedItem.value.student_id,
          grade_level: editedItem.value.grade_level,
          status: editedItem.value.status,
        })
        .eq("id", itemToUpdate.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(students.value[editedIndex.value], data);
    } else {
      // Add new student
      const { data: profile } = await client
        .from("profiles")
        .select("school_id")
        .eq("id", user.value.id)
        .single();

      // Create user account with default password
      const { data: authData, error: authError } = await auth.signUp({
        email: editedItem.value.email,
        password: "helloworld",
        options: {
          data: {
            firstName: editedItem.value.firstName,
            lastName: editedItem.value.lastName,
            role: "student",
          },
        },
      });

      if (authError) {
        console.error("Error creating user account:", authError);
        throw new Error(
          "Failed to create student account: " + authError.message,
        );
      }

      // Create profile for the student
      const { error: profileError } = await client.from("profiles").insert({
        id: authData.user.id,
        email: editedItem.value.email,
        firstName: editedItem.value.firstName,
        lastName: editedItem.value.lastName,
        role: "student",
        school_id: profile.school_id,
      });

      if (profileError) {
        console.error("Error creating student profile:", profileError);
      }

      // Create student record
      const { data, error } = await client
        .from("school_students")
        .insert({
          school_id: profile.school_id,
          user_id: authData.user.id,
          firstName: editedItem.value.firstName,
          lastName: editedItem.value.lastName,
          email: editedItem.value.email,
          student_id: editedItem.value.student_id,
          grade_level: editedItem.value.grade_level,
          status: editedItem.value.status,
        })
        .select()
        .single();

      if (error) throw error;
      students.value.unshift(data);
    }
    close();
  } catch (error) {
    console.error("Error saving student:", error);
    alert("Failed to save student. Please try again.");
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "grey";
    case "suspended":
      return "error";
    default:
      return "grey";
  }
};

const logout = async () => {
  await auth.signOut();
  router.push("/school-login");
};
</script>

<template>
  <div class="admin-students">
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
              <h1 class="text-h4 font-weight-bold">Student Management</h1>
              <p class="text-subtitle-1 text-grey">
                Add, edit, and manage your school's students
              </p>
            </v-col>
          </v-row>

          <!-- Data Table -->
          <v-row>
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title>
                  <v-row align="center">
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
                    <v-col cols="12" md="6" class="text-right">
                      <BulkStudentUpload
                        v-if="school"
                        :school-id="school.id"
                        @upload-complete="loadStudents"
                        class="mr-2"
                      />
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        @click="dialog = true"
                      >
                        Add Student
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-data-table
                  :headers="headers"
                  :items="filteredStudents"
                  :loading="loading"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon size="small" class="mr-2" @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon size="small" @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>

                  <template v-slot:no-data>
                    <div class="text-center pa-8">
                      <v-icon size="64" color="grey">mdi-account-off</v-icon>
                      <p class="text-h6 mt-4">No students found</p>
                      <p class="text-body-2 text-grey">
                        Click "Add Student" to get started
                      </p>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.firstName"
                    label="First Name"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.lastName"
                    label="Last Name"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.student_id"
                    label="Student ID"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.grade_level"
                    :items="gradeLevels"
                    label="Grade Level"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="close"> Cancel </v-btn>
            <v-btn color="primary" variant="flat" @click="save"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"> Confirm Delete </v-card-title>
          <v-card-text>
            Are you sure you want to delete this student? This action cannot be
            undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeDelete">
              Cancel
            </v-btn>
            <v-btn color="error" variant="flat" @click="deleteItemConfirm">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<style scoped>
.admin-students {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
