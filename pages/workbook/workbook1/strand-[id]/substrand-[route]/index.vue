<script setup>
const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const substrand_ref = route.params.route;
// const strand_ref = route.params

const { data: substrand } = await client
  .from("book1_strand_substrands_lists")
  .select()
  .eq("route", substrand_ref);
const strand_ref_id = substrand[0].strand_ref;
const substrand_ref_id = substrand[0].id;

const { data: strands } = await client
  .from("book1_strands")
  .select()
  .eq("substrand_ref", substrand_ref_id);

const { data: substrand_ls } = await client
  .from("book1_substrand_indicators")
  .select()
  .eq("substrand_ref", substrand_ref_id);

// const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('strand_ref', id);
const title = substrand[0].title;
const conceptNote = strands[0].concept_notes;


const bece = strands[0].BECE_Qquestions
;
function openNotes() {
    navigateTo(conceptNote, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    });
};

function openBece() {
    const link = document.createElement('a');
    link.href = bece;
    link.download = 'BECE_Questions.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



</script>
<template>
  <div class="mt-15" style="height: auto; background-color: #f6f6f6">
    <v-container>
      <v-row>
        <v-col cols="8">
          <h1 class="text-left text-uppercase text-bold" style="font-size: 2em">
            {{ title }}
          </h1>
        </v-col>
        <v-col cols="4" align="right">
          <v-btn to="/progress" color="primary">View Progress Report</v-btn>
        </v-col>
      </v-row>
      <ConceptNotes :concept-note="conceptNote" />

      <v-row v-for="content in substrand_ls" :key="content.id">
        <v-col>
          <v-card>
            <v-card-title>
              <NuxtLink
                :to="
                  '/workbook/workbook1/strand-' +
                  strand_ref_id +
                  '/substrand-' +
                  substrand_ref +
                  '/' +
                  content.id
                "
              >
                <strong>{{ content.indicators }}</strong>
              </NuxtLink>
            </v-card-title>
            <v-card-actions>
              <v-btn @click="openNotes" color="primary">concept note</v-btn>
              <v-btn @click="openBece" color="success">BECE Questions</v-btn>
            </v-card-actions>
          </v-card>

          <v-spacer></v-spacer>
          <br />
        </v-col>
      </v-row>

      <div class="mt-10">
        <div class="text-h3">Problem Set</div>
        <p>Time to apply and show the Wow!</p>
        <br />
        <v-row>
          <v-col>
            <v-img src="/img/problem.png"></v-img>
          </v-col>
          <v-col class="mt-15">
            <p>
              Now it’s your turn to apply what you’ve learned. These problems
              challenge you to think, connect ideas, and solve real-world
              situations using math. There might be more than one way — so be
              bold, be creative, and show the wow!
            </p>
            <v-btn class="mt-5" color="blue-grey-darken-4"
              >Solve Problem Set</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
