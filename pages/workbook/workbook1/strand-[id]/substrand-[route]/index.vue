<script setup>

const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const strand_ref = route.params.route;

const { data: substrand } = await client.from('book1_strand_substrands_lists').select().eq('route', strand_ref);
const strand_ref_id = substrand[0].strand_ref;

const { data: substrand_ls } = await client.from('book1_substrand_indicators').select().eq('substrand_ref', strand_ref_id);

// const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('strand_ref', id);
const title = substrand[0].title;
// const conceptNote = strand.concept_note;




console.log(substrand);
console.log(strand_ref_id);
console.log(substrand_ls);



</script>
<template>
    <div class="mt-15" style="height: auto; background-color: #F6F6F6;">
        <v-container>
            <v-row>
                <v-col cols="8">
                    <h1 class="text-left text-uppercase text-bold" style="font-size: 2em;">{{ title }}</h1>
                </v-col>
                <v-col cols="4" align="right">
                    <v-btn color="primary">View Progress Report</v-btn>
                </v-col>
            </v-row>
            <ConceptNotes :concept-note="conceptNote" />

            <v-row v-for="content in substrand_ls" :key="content.id">
                <v-col>
                    <NuxtLink
                        :to="'/workbook/workbook1/strand-' + content.strand_ref + '/substrand-' + strand_ref + '/' + content.id">
                        <v-card>
                            <v-card-title>
                                <strong>{{ content.indicators }}</strong>
                            </v-card-title>
                            <v-card-actions>
                                <v-btn @click="openNotes" color="primary">concept note</v-btn>
                                <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                            </v-card-actions>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>

            <div class="mt-10">
                <div class="text-h3">Problem Set</div>
                <p>Time to apply and show the Wow!</p>
                <br>
                <v-row>
                    <v-col>
                        <v-img src="/img/problem.png"></v-img>
                    </v-col>
                    <v-col class="mt-15">
                        <p>
                            Now it’s your turn to apply what you’ve learned. These problems challenge you to think,
                            connect ideas, and solve real-world situations using math. There might be more than one way
                            — so be bold, be creative, and show the wow!
                        </p>
                        <v-btn class="mt-5" color="blue-grey-darken-4">Solve Problem Set</v-btn>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>