<script setup>
// import strand1 from '~/strand1.json';

const route = useRoute();
const config = useRuntimeConfig();
const client = useSupabaseClient();
const id = route.params.id;


const { data: strand1 } = await client.from('book1_strands').select().eq('id', id);
const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('strand_ref', id)
const conceptNote = strand1[0].concept_notes;

console.log(substrands);


</script>
<template>
    <div class="mt-5" style="height: auto;">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em; color: #3E4F5C;">STRAND 1 - NUMBERS
            </h1>
            <ConceptNotes :concept-note="conceptNote" />
            <v-row class="mt-10" v-for="substrand in substrands" :key="substrand.id">
                <v-col>
                    <NuxtLink
                        :to="'/workbook/workbook1/strand-' + substrand.strand_ref + '/substrand-' + substrand.route + '/'">
                        <v-card>
                            <v-card-title class="font-weight-light text-left mb-2">{{ substrand.title }}</v-card-title>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>