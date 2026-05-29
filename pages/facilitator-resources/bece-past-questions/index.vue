<script setup>
definePageMeta({
  layout: "resources",
});

const client = useSupabaseClient();

const { data: resourcesRaw } = await client
  .from("bece_past_questions")
  .select("*");

const { searchQuery } = useResourceSearch();

const resources = computed(() => {
  const base = resourcesRaw
    ? [...resourcesRaw].sort((a, b) => a.id - b.id)
    : [];
  const q = (searchQuery.value || "").trim().toLowerCase();
  if (!q) return base;
  return base.filter(
    (r) =>
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q),
  );
});

console.log(resources);
</script>

<template>
  <div>
    <v-row v-for="resource in resources" :key="resource.id">
      <v-col>
        <NuxtLink
          :to="
            '/facilitator-resources/bece-past-questions/' + resource.route
          "
          class="no-underline"
        >
          <card-resources
            :title="resource.year"
            :description="resource.description"
          />
        </NuxtLink>
      </v-col>
    </v-row>
    <v-row v-if="resources.length === 0">
      <v-col class="text-center text-grey py-12">
        <v-icon size="48" class="mb-3">mdi-help-circle-outline</v-icon>
        <p>No BECE past questions available yet.</p>
      </v-col>
    </v-row>
  </div>
</template>
