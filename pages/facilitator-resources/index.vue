<script setup>
definePageMeta({
  layout: "resources",
});
const client = useSupabaseClient();

const { data: resourcesRaw } = await client
  .from("facilitator-resources")
  .select("*");

const resources = computed(() => {
  if (resourcesRaw) {
    return [...resourcesRaw].sort((a, b) => a.id - b.id);
  }
  return [];
});

// const resources = data?.filter(item => item.metadata && item.name && item.id && item.type === 'folder') || [];

console.log(resources);

// const resources = [
//     {
//         title: 'Number and Numerals',
//         description: 'Understanding different number systems and their properties',
//         link: '/resources/number-and-numerals'
//     },
//     {
//         title: 'Fractions and Decimals',
//         description: 'Exploring the concepts of fractions and decimals, their operations, and applications',
//         link: '/resources/fractions-and-decimals'
//     },
//     {
//         title: 'Power of Numbers',
//         description: 'Understanding the concept of powers, exponents, and their applications in mathematics',
//         link: '/resources/power-of-numbers'
//     },
//     {
//         title: 'Algebraic Expressions',
//         description: 'Introduction to algebraic expressions, their simplification, and evaluation',
//         link: '/resources/algebraic-expressions'
//     },
//     {
//         title: 'Linear Equations',
//         description: 'Understanding linear equations, their solutions, and applications in real-life scenarios',
//         link: '/resources/linear-equations'
//     },
//     {
//         title: 'Geometry Basics',
//         description: 'Exploring basic geometric shapes, properties, and theorems',
//         link: '/resources/geometry-basics'
//     },
//     {
//         title: 'Mensuration',
//         description: 'Understanding the concepts of area, volume, and surface area of various geometric shapes',
//         link: '/resources/mensuration'
//     },
//     {
//         title: 'Statistics and Probability',
//         description: 'Introduction to statistics, data representation, and basic probability concepts',
//         link: '/resources/statistics-and-probability'
//     }
// ];
</script>

<template>
  <div>
    <v-container>
      <v-row v-for="resource in resources" :key="resource.title">
        <v-col>
          <NuxtLink
            :to="'/facilitator-resources/' + resource.route + '/'"
            class="no-underline"
          >
            <card-resources
              :title="resource.title"
              :description="resource.description"
            />
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
