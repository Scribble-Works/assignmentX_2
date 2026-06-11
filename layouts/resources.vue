<script setup>
const route = useRoute();
const router = useRouter();
const { searchQuery } = useResourceSearch();
const user = useSupabaseUser();
const client = useSupabaseClient();

// ─── Fetch role from onboarding table ─────────────────────────────────────────
const { data: onboarding } = await useAsyncData(
  () => `user-role-${user.value?.id}`,
  async () => {
    if (!user.value?.id) return null;
    const { data } = await client
      .from("onboarding")
      .select("role")
      .eq("id", user.value.id)
      .single();
    return data;
  },
);

const isStudent = computed(() => onboarding.value?.role === "student");

// ─── Nav items ─────────────────────────────────────────────────────────────────
const allNavItems = [
  { label: "Worksheets", value: "/facilitator-resources/worksheets/" },
  {
    label: "AI Teaching Assistant",
    value: "/facilitator-resources/ai-assistant",
  },
  {
    label: "Curriculum Materials",
    value: "/facilitator-resources/curriculum/",
  },
  {
    label: "BECE Past Questions",
    value: "/facilitator-resources/bece-past-questions/",
  },
  { label: "Live Sessions", value: "/facilitator-resources/live-sessions" },
];

const studentNavItems = [
  {
    label: "BECE Past Questions",
    value: "/facilitator-resources/bece-past-questions/",
  },
  { label: "Live Sessions", value: "/facilitator-resources/live-sessions" },
];

const navItems = computed(() =>
  isStudent.value ? studentNavItems : allNavItems,
);

const pageTitle = computed(() =>
  isStudent.value ? "Student Resources" : "Facilitator Resources",
);

// ─── Redirect students away from non-allowed pages ─────────────────────────────
const studentAllowedPaths = [
  "/facilitator-resources/bece-past-questions",
  "/facilitator-resources/live-sessions",
];

watchEffect(() => {
  if (
    isStudent.value &&
    !studentAllowedPaths.some((p) => route.path.startsWith(p))
  ) {
    navigateTo("/facilitator-resources/bece-past-questions/", {
      replace: true,
    });
  }
});

const selectedPath = computed({
  get() {
    const match = navItems.value.find((item) =>
      route.path.startsWith(item.value),
    );
    return match ? match.value : null;
  },
  set(val) {
    if (val) router.push(val);
  },
});
</script>

<template>
  <v-app>
    <div class="body">
      <theHeader />
      <v-container>
        <!-- Page title -->
        <h1 class="text-h5 font-weight-bold mb-4">{{ pageTitle }}</h1>

        <!-- Desktop sub-navigation -->
        <v-tabs
          class="d-none d-md-flex mb-4"
          color="green-darken-2"
          bg-color="transparent"
          show-arrows
        >
          <v-tab v-for="item in navItems" :key="item.value" :to="item.value">
            {{ item.label }}
          </v-tab>
        </v-tabs>

        <!-- Mobile dropdown navigation -->
        <v-select
          class="d-md-none mb-4"
          v-model="selectedPath"
          :items="navItems"
          item-title="label"
          item-value="value"
          label="Navigate to section"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-menu"
          hide-details
        />

        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search chapters and topics..."
          variant="outlined"
          clearable
        ></v-text-field>
        <br />
        <slot />
      </v-container>
      <theFooter />
    </div>
  </v-app>
</template>
