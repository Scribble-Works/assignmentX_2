<script setup>
// Thin wrapper delegating to the shared SubstrandQuiz component (same flow as
// assignment_workbook1). See components/SubstrandQuiz.vue for the logic.
const route = useRoute();

const moduleSlug = "assignment_workbook2";
const indicatorsTable = "book2_substrand_indicators";
const substrandsTable = "book1_strand_substrands_lists";
const strandId = route.params.id;
const substrandRoute = route.params.route;
const selectedContentId = route.params.contentId;
</script>

<template>
  <SubstrandQuiz
    :module-slug="moduleSlug"
    :indicators-table="indicatorsTable"
    :substrands-table="substrandsTable"
    :strand-id="strandId"
    :substrand-route="substrandRoute"
    :selected-content-id="selectedContentId"
  />
</template>
