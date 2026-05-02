<script setup>
// import strand1 from '~/strand1.json';

const route = useRoute();
// const config = useRuntimeConfig();
const client = useSupabaseClient();
const id = route.params.id;

const { data: workbook } = await client
  .from("pre-assignment_Workbook1")
  .select()
  .eq("id", id);
const { data: strand1 } = await client
  .from("preassignment_workbook1_substrands_contents")
  .select()
  .eq("id", id);
const substrand_ref = strand1[0].substrand_ref;
const { data: unsorted_substrand } = await client
  .from("preassignment_workbook1_strand_substrands_lists")
  .select()
  .eq("strand_ref", id);
const { data: substrands } = computed(() => {
  if (unsorted_substrand) {
    return [...unsorted_substrand].sort((a, b) => a.id - b.id);
  }
  return [];
});
const conceptNote = workbook[0].concept_notes;
const strandNumber = substrands[0].strand_ref;
const { data: strandtitle } = await client
  .from("pre-assignment_Workbook1")
  .select()
  .eq("id", strandNumber);
const title = strandtitle[0].strand_name;
const vid = strandtitle[0].vid;
console.log(strand1);
console.log(substrands);
console.log(workbook);
console.log(strandtitle);
</script>
<template>
  <div class="mt-5" style="height: auto">
    <v-container>
      <h1
        class="text-left font-weight-bold text-uppercase text-bold"
        style="font-size: 1.5em; color: #3e4f5c"
      >
        STRAND
        {{ strandNumber }} - {{ title }}
      </h1>
      <introvid :intro="vid" />
      <div class="mt-10">
        <v-row
          class="mt-n5"
          v-for="substrand in substrands"
          :key="substrand.id"
        >
          <v-col>
            <NuxtLink
              :to="
                '/learning-modules/preassignment_workbook1/strand-' +
                substrand.strand_ref +
                '/substrand-' +
                substrand.route +
                '/'
              "
            >
              <v-card>
                <v-card-title class="font-weight-light text-left">{{
                  substrand.title
                }}</v-card-title>
              </v-card>
            </NuxtLink>
            <v-spacer></v-spacer>
            <br />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<style>
body {
  background-color: #f6f6f6;
}
</style>
