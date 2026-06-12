<script setup>
definePageMeta({
  layout: "resources",
});

const client = useSupabaseClient();

const { data: resourcesRaw } = await client
  .from("facilitator-resources")
  .select("*");

// const { searchQuery } = useResourceSearch();

const resources = computed(() => {
  const base = resourcesRaw
    ? [...resourcesRaw].sort((a, b) => a.id - b.id)
    : [];
  // const q = (searchQuery.value || "").trim().toLowerCase();
  // if (!q) return base;
  // return base.filter(
  //   (r) =>
  //     r.title?.toLowerCase().includes(q) ||
  //     r.description?.toLowerCase().includes(q),
  // );
  return base;
});
</script>

<template>
  <div>
   
    <v-row v-for="resource in resources" :key="resource.title">
      <v-col>
        <NuxtLink
          :to="'/facilitator-resources/worksheets/' + resource.route + '/'"
          class="no-underline"
        >
          <card-resources
            :title="resource.title"
            :description="resource.description"
          />
        </NuxtLink>
      </v-col>
    </v-row>
    
  </div>
</template>
