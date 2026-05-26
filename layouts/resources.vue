<script setup>
const route = useRoute();
const router = useRouter();

const navItems = [
  { label: "Worksheets", value: "/facilitator-resources/worksheets" },
  {
    label: "AI Teaching Assistant",
    value: "/facilitator-resources/ai-assistant",
  },
  { label: "Curriculum Materials", value: "/facilitator-resources/curriculum" },
  {
    label: "BECE Past Questions",
    value: "/facilitator-resources/bece-past-questions",
  },
  { label: "Live Sessions", value: "/facilitator-resources/live-sessions" },
];

const selectedPath = computed({
  get() {
    const match = navItems.find((item) => route.path.startsWith(item.value));
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
          prepend-inner-icon="mdi-magnify"
          label="Search chapters and topics..."
          variant="outlined"
        ></v-text-field>
        <br />
        <slot />
      </v-container>
      <theFooter />
    </div>
  </v-app>
</template>
