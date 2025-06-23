<script setup>

const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const strand_ref = route.params.route;
const { data: substrand_ls } = await client.from('book1_substrand_indicators').select().eq('substrand_ref', id);

const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('strand_ref', id);
const title = substrands[1].title;
const conceptNote = substrands[1].concept_note;




console.log(substrand_ls);
console.log(substrands);



</script>
<template>
    <div class="mt-15" style="height: auto;">
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
                    <!-- <NuxtLink :to="'/workbook/workbook1/strand-' + strand_ref + '/substrand-' + id + '/' + content.id"> -->
                    <v-card>
                        <v-card-title>
                            <strong>{{ content.indicators }}</strong>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn @click="openNotes" color="primary">concept note</v-btn>
                            <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!-- </NuxtLink> -->
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>