<script setup>
definePageMeta({ layout: "resources" });

const client = useSupabaseClient();
const user = useSupabaseUser();

if (!user.value) {
  await navigateTo("/login");
}

// Check whether logged-in user is a facilitator/admin
const { data: role_assigned } = await client
  .from("onboarding")
  .select("role")
  .eq("id", user.value?.id)
  .single();

const isFacilitator = computed(() =>
  ["educator", "parent_guardian"].includes(role_assigned?.role ?? ""),
);

// ─── State ────────────────────────────────────────────────────────────────────
const sessions = ref([]);
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const activeTab = ref("upcoming");

const scheduleDialog = ref(false);
const cancelDialog = ref(false);
const sessionToCancel = ref(null);
const scheduling = ref(false);
const canceling = ref(false);
const formRef = ref(null);

const newSession = reactive({
  title: "",
  description: "",
  date: "",
  time: "",
  duration: 60,
});

const durationOptions = [
  { title: "30 minutes", value: 30 },
  { title: "45 minutes", value: 45 },
  { title: "1 hour", value: 60 },
  { title: "1.5 hours", value: 90 },
  { title: "2 hours", value: 120 },
];

const rules = {
  required: (v) => !!v || "This field is required",
};

// ─── Data fetching ────────────────────────────────────────────────────────────
const fetchSessions = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    sessions.value = await $fetch("/api/live-sessions");
  } catch {
    errorMsg.value = "Failed to load sessions. Please try again.";
  } finally {
    loading.value = false;
  }
};

await fetchSessions();

// ─── Computed ─────────────────────────────────────────────────────────────────
const upcomingSessions = computed(() => {
  const now = new Date();
  return sessions.value.filter((s) => new Date(s.start_time) >= now);
});

const pastSessions = computed(() => {
  const now = new Date();
  return sessions.value.filter((s) => new Date(s.start_time) < now);
});

const minDate = new Date().toISOString().split("T")[0];

// ─── Actions ──────────────────────────────────────────────────────────────────
const scheduleSession = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  scheduling.value = true;
  errorMsg.value = "";
  try {
    const [y, m, d] = newSession.date.split("-").map(Number);
    const [h, min] = newSession.time.split(":").map(Number);
    const start = new Date(y, m - 1, d, h, min);
    const end = new Date(start.getTime() + newSession.duration * 60 * 1000);

    await $fetch("/api/live-sessions", {
      method: "POST",
      body: {
        title: newSession.title,
        description: newSession.description,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        createdBy: user.value?.id,
      },
    });

    scheduleDialog.value = false;
    Object.assign(newSession, {
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
    });
    showSuccess("Session scheduled successfully! Google Meet link is ready.");
    await fetchSessions();
  } catch (err) {
    errorMsg.value =
      err?.data?.statusMessage ||
      "Failed to schedule session. Please try again.";
  } finally {
    scheduling.value = false;
  }
};

const openCancelDialog = (session) => {
  sessionToCancel.value = session;
  cancelDialog.value = true;
};

const cancelSession = async () => {
  canceling.value = true;
  errorMsg.value = "";
  try {
    await $fetch(`/api/live-sessions/${sessionToCancel.value.id}`, {
      method: "DELETE",
    });
    cancelDialog.value = false;
    sessionToCancel.value = null;
    showSuccess("Session cancelled.");
    await fetchSessions();
  } catch {
    errorMsg.value = "Failed to cancel session.";
  } finally {
    canceling.value = false;
  }
};

const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
    showSuccess("Meet link copied to clipboard!");
  } catch {
    errorMsg.value = "Could not copy link. Please copy it manually.";
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const showSuccess = (msg) => {
  successMsg.value = msg;
  setTimeout(() => {
    successMsg.value = "";
  }, 4000);
};

const formatDateTime = (dt) =>
  new Date(dt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const getDuration = (start, end) => {
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins < 60) return `${mins} min`;
  if (mins % 60 === 0) return `${mins / 60} hr`;
  return `${Math.floor(mins / 60)} hr ${mins % 60} min`;
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-h5 font-weight-bold">Live Sessions</h2>
        <p class="text-grey text-body-2 mt-1">
          Schedule and join Google Meet class sessions
        </p>
      </div>
      <v-btn
        v-if="isFacilitator"
        color="green-darken-2"
        prepend-icon="mdi-plus"
        @click="scheduleDialog = true"
      >
        Schedule Session
      </v-btn>
    </div>

    <!-- Alerts -->
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

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="green-darken-2" class="mb-4">
      <v-tab value="upcoming">
        Upcoming
        <v-chip
          v-if="upcomingSessions.length"
          class="ml-2"
          size="x-small"
          color="green-darken-2"
          label
        >
          {{ upcomingSessions.length }}
        </v-chip>
      </v-tab>
      <v-tab value="past">Past</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <!-- ── Upcoming ─────────────────────────────────────────────────────── -->
      <v-tabs-window-item value="upcoming">
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="green-darken-2" />
        </div>

        <div
          v-else-if="upcomingSessions.length === 0"
          class="text-center py-16"
        >
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-calendar-blank-outline
          </v-icon>
          <h3 class="text-h6 font-weight-medium mb-2">No upcoming sessions</h3>
          <p class="text-grey">
            {{
              isFacilitator
                ? 'Click "Schedule Session" to create your first class.'
                : "Check back later for upcoming sessions."
            }}
          </p>
        </div>

        <v-row v-else>
          <v-col
            v-for="session in upcomingSessions"
            :key="session.id"
            cols="12"
            md="6"
          >
            <v-card rounded="lg" elevation="2" height="100%">
              <v-card-title class="text-body-1 font-weight-bold pt-4 px-4">
                {{ session.title }}
              </v-card-title>

              <v-card-text>
                <div class="d-flex align-center mb-2 text-body-2">
                  <v-icon size="16" color="green-darken-2" class="mr-1">
                    mdi-clock-outline
                  </v-icon>
                  {{ formatDateTime(session.start_time) }}
                </div>
                <div class="d-flex align-center mb-2 text-body-2">
                  <v-icon size="16" color="green-darken-2" class="mr-1">
                    mdi-timer-outline
                  </v-icon>
                  {{ getDuration(session.start_time, session.end_time) }}
                </div>
                <p
                  v-if="session.description"
                  class="text-grey text-body-2 mt-2"
                >
                  {{ session.description }}
                </p>
              </v-card-text>

              <v-card-actions class="px-4 pb-4 flex-wrap gap-1">
                <v-btn
                  v-if="session.meet_link"
                  :href="session.meet_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="green-darken-2"
                  variant="flat"
                  prepend-icon="mdi-video"
                  size="small"
                >
                  Join Meet
                </v-btn>
                <v-btn
                  v-if="session.meet_link"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-content-copy"
                  @click="copyLink(session.meet_link)"
                >
                  Copy Link
                </v-btn>
                <v-spacer />
                <v-btn
                  v-if="isFacilitator"
                  color="red"
                  variant="text"
                  size="small"
                  prepend-icon="mdi-cancel"
                  @click="openCancelDialog(session)"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <!-- ── Past ──────────────────────────────────────────────────────────── -->
      <v-tabs-window-item value="past">
        <div v-if="pastSessions.length === 0" class="text-center py-16">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-history
          </v-icon>
          <h3 class="text-h6 font-weight-medium mb-2">No past sessions</h3>
          <p class="text-grey">Completed sessions will appear here.</p>
        </div>

        <v-row v-else>
          <v-col
            v-for="session in pastSessions"
            :key="session.id"
            cols="12"
            md="6"
          >
            <v-card rounded="lg" elevation="1" color="grey-lighten-4">
              <v-card-title
                class="text-body-1 font-weight-bold pt-4 px-4 text-grey-darken-1"
              >
                {{ session.title }}
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-1 text-body-2 text-grey">
                  <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                  {{ formatDateTime(session.start_time) }}
                </div>
                <div class="d-flex align-center text-body-2 text-grey">
                  <v-icon size="16" class="mr-1">mdi-timer-outline</v-icon>
                  {{ getDuration(session.start_time, session.end_time) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <!-- ── Schedule Dialog ─────────────────────────────────────────────────── -->
    <v-dialog v-model="scheduleDialog" max-width="540">
      <v-card rounded="lg">
        <v-card-title class="text-h6 pa-6 pb-2">
          <v-icon color="green-darken-2" class="mr-2">mdi-calendar-plus</v-icon>
          Schedule a Session
        </v-card-title>

        <v-card-text class="pa-6 pt-2">
          <v-form ref="formRef">
            <v-text-field
              v-model="newSession.title"
              label="Session Title"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              class="mb-3"
            />
            <v-textarea
              v-model="newSession.description"
              label="Description (optional)"
              variant="outlined"
              density="compact"
              rows="2"
              auto-grow
              class="mb-3"
            />
            <v-text-field
              v-model="newSession.date"
              label="Date"
              type="date"
              variant="outlined"
              density="compact"
              :min="minDate"
              :rules="[rules.required]"
              class="mb-3"
            />
            <v-text-field
              v-model="newSession.time"
              label="Start Time"
              type="time"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              class="mb-3"
            />
            <v-select
              v-model="newSession.duration"
              :items="durationOptions"
              label="Duration"
              variant="outlined"
              density="compact"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            @click="
              scheduleDialog = false;
              formRef?.reset();
            "
          >
            Cancel
          </v-btn>
          <v-btn
            color="green-darken-2"
            variant="flat"
            :loading="scheduling"
            @click="scheduleSession"
          >
            Schedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Cancel Confirmation Dialog ─────────────────────────────────────── -->
    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="text-h6 pa-6 pb-2">Cancel Session?</v-card-title>
        <v-card-text class="pa-6 pt-0 text-body-2 text-grey-darken-1">
          "<strong>{{ sessionToCancel?.title }}</strong
          >" will be removed and its Google Meet event will be cancelled.
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="cancelDialog = false">Keep</v-btn>
          <v-btn
            color="red"
            variant="flat"
            :loading="canceling"
            @click="cancelSession"
          >
            Cancel Session
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
