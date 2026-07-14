<script setup>
const props = defineProps({
  schoolId: {
    type: String,
    default: "",
  },
  classId: {
    type: String,
    default: "",
  },
  actorId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["upload-complete"]);

const dialog = ref(false);
const file = ref(null);
const fileInput = ref(null);
const uploadedData = ref([]);
const loading = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const errors = ref([]);
const successCount = ref(0);
const errorCount = ref(0);

const headers = [
  { title: "Email", key: "email" },
  { title: "First Name", key: "firstName" },
  { title: "Last Name", key: "lastName" },
  { title: "Status", key: "status", value: (item) => item.status || "Valid" },
];

const downloadTemplate = () => {
  const template = `email,firstName,lastName
john.doe@school.com,John,Doe
jane.smith@school.com,Jane,Smith
michael.johnson@school.com,Michael,Johnson`;

  const blob = new Blob([template], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student_upload_template.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("CSV file must contain headers and at least one data row");
  }

  const parseLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"' && inQuotes && next === '"') {
        current += '"';
        i++;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
        continue;
      }
      current += char;
    }

    values.push(current.trim());
    return values;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const requiredHeaders = ["email"];

  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
  }

  const data = [];
  const seenEmails = new Set();
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Validate required fields
    const missing = [];
    requiredHeaders.forEach((field) => {
      if (!row[field]) missing.push(field);
    });

    if (missing.length > 0) {
      row.status = `Missing: ${missing.join(", ")}`;
      row.hasError = true;
    } else if (seenEmails.has(String(row.email).toLowerCase())) {
      row.status = "Duplicate email in CSV";
      row.hasError = true;
    } else if (!isValidEmail(row.email)) {
      row.status = "Invalid email format";
      row.hasError = true;
    } else {
      row.status = "Valid";
      row.hasError = false;
      seenEmails.add(String(row.email).toLowerCase());
    }

    data.push(row);
  }

  return data;
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  if (!selectedFile.name.endsWith(".csv")) {
    alert("Please upload a CSV file");
    return;
  }

  file.value = selectedFile;
  loading.value = true;
  errors.value = [];

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      uploadedData.value = parseCSV(text);
      loading.value = false;
    } catch (error) {
      alert(error.message);
      loading.value = false;
      file.value = null;
      uploadedData.value = [];
    }
  };
  reader.readAsText(selectedFile);
};

const clearFile = () => {
  file.value = null;
  uploadedData.value = [];
  errors.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const uploadStudents = async () => {
  const validStudents = uploadedData.value.filter((s) => !s.hasError);

  if (validStudents.length === 0) {
    alert("No valid students to upload");
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;
  errors.value = [];
  successCount.value = 0;
  errorCount.value = 0;

  try {
    const response = await $fetch("/api/school-admin/bulk-enroll-students", {
      method: "POST",
      body: {
        actorId: props.actorId,
        schoolId: props.schoolId,
        classId: props.classId,
        students: validStudents.map((student) => ({
          email: student.email,
          firstName: student.firstName || "",
          lastName: student.lastName || "",
        })),
      },
    });

    successCount.value = response?.successCount || 0;
    errorCount.value = response?.errorCount || 0;
    errors.value = response?.errors || [];

    validStudents.forEach((student) => {
      student.uploadStatus = "success";
    });

    if (Array.isArray(response?.errors) && response.errors.length > 0) {
      for (const err of response.errors) {
        const match = uploadedData.value.find(
          (student) =>
            String(student.email).toLowerCase() ===
            String(err.email).toLowerCase(),
        );
        if (match) match.uploadStatus = "error";
      }
    }

    uploadProgress.value = 100;

    if (successCount.value > 0) {
      emit("upload-complete");
    }
  } catch (error) {
    errorCount.value = validStudents.length;
    errors.value = [
      {
        student: "Bulk upload",
        error:
          error?.data?.statusMessage || error.message || "Bulk upload failed.",
      },
    ];
  }

  uploading.value = false;
};

const close = () => {
  dialog.value = false;
  clearFile();
  uploadProgress.value = 0;
  errors.value = [];
  successCount.value = 0;
  errorCount.value = 0;
};

const getRowColor = (item) => {
  if (item.uploadStatus === "success") return "success-lighten-5";
  if (item.uploadStatus === "error") return "error-lighten-5";
  if (item.hasError) return "warning-lighten-5";
  return "";
};
</script>

<template>
  <div>
    <v-btn
      color="primary"
      prepend-icon="mdi-file-upload"
      variant="tonal"
      @click="dialog = true"
    >
      Bulk Upload
    </v-btn>

    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon class="mr-2">mdi-file-upload</v-icon>
          <span>Bulk Student Enrolment</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Instructions -->
          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="text-subtitle-2 mb-2">Instructions:</div>
            <ol class="pl-4">
              <li>Select the class you want to add students to</li>
              <li>Download the CSV template below</li>
              <li>
                Fill in student email addresses (firstName/lastName optional)
              </li>
              <li>Upload the completed CSV file and import</li>
            </ol>
            <div class="mt-2">
              <strong>Note:</strong> Students must already have AssignmentX
              accounts and be onboarded as students.
            </div>
          </v-alert>

          <v-alert
            v-if="!props.classId"
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Please select a class before importing students.
          </v-alert>

          <!-- Download Template Button -->
          <div class="mb-4">
            <v-btn
              color="secondary"
              prepend-icon="mdi-download"
              variant="outlined"
              @click="downloadTemplate"
            >
              Download CSV Template
            </v-btn>
          </div>

          <!-- File Upload -->
          <v-file-input
            ref="fileInput"
            v-model="file"
            accept=".csv"
            label="Upload CSV File"
            prepend-icon="mdi-file-delimited"
            :loading="loading"
            @change="handleFileUpload"
            clearable
            @click:clear="clearFile"
          ></v-file-input>

          <!-- Data Preview -->
          <div v-if="uploadedData.length > 0" class="mt-4">
            <div class="d-flex align-center mb-3">
              <h3 class="text-h6">Preview Data</h3>
              <v-spacer></v-spacer>
              <v-chip color="success" variant="outlined">
                {{ uploadedData.filter((s) => !s.hasError).length }} Ready
              </v-chip>
              <v-chip color="error" variant="outlined" class="ml-2">
                {{ uploadedData.filter((s) => s.hasError).length }} Errors
              </v-chip>
            </div>

            <v-data-table
              :headers="headers"
              :items="uploadedData"
              :items-per-page="10"
              density="compact"
              class="elevation-1"
            >
              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  :color="
                    item.hasError
                      ? 'error'
                      : item.uploadStatus === 'success'
                        ? 'success'
                        : item.uploadStatus === 'error'
                          ? 'error'
                          : 'success'
                  "
                  size="small"
                  variant="flat"
                >
                  {{
                    item.uploadStatus === "success"
                      ? "✓ Uploaded"
                      : item.uploadStatus === "error"
                        ? "✗ Failed"
                        : item.status
                  }}
                </v-chip>
              </template>
            </v-data-table>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="mt-4">
            <div class="text-subtitle-1 mb-2">
              Uploading... {{ uploadProgress }}%
            </div>
            <v-progress-linear
              :model-value="uploadProgress"
              color="primary"
              height="25"
              striped
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </div>

          <!-- Results -->
          <div
            v-if="!uploading && (successCount > 0 || errorCount > 0)"
            class="mt-4"
          >
            <v-alert
              :type="errorCount === 0 ? 'success' : 'warning'"
              variant="tonal"
            >
              <div class="text-subtitle-2">Upload Complete:</div>
              <div>✓ Successfully imported: {{ successCount }} students</div>
              <div v-if="errorCount > 0">
                ✗ Failed: {{ errorCount }} students
              </div>
            </v-alert>

            <!-- Error Details -->
            <div v-if="errors.length > 0" class="mt-3">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
                    View Error Details ({{ errors.length }})
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list dense>
                      <v-list-item
                        v-for="(err, index) in errors"
                        :key="index"
                        class="pl-0"
                      >
                        <v-list-item-title>
                          <strong>{{ err.student }}:</strong> {{ err.error }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="close" :disabled="uploading">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="uploadStudents"
            :disabled="
              !props.classId ||
              !uploadedData.length ||
              uploadedData.every((s) => s.hasError) ||
              uploading
            "
            :loading="uploading"
          >
            Import {{ uploadedData.filter((s) => !s.hasError).length }} Students
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
