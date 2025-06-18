<script setup>
// import strand1 from '~/strand1.json';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const client = useSupabaseClient();
const id = route.params.id;

const { data: strand1 } = await client.from('book1Strands').select('Strands_book1, BECE_Questions, concept_notes, sub_strands').eq('id');
// const conceptNote = strand1.concept_notes;
// const strand1Contents = strand1.sub_strands;
console.log(strand1);


</script>
<template>
    <div class="mt-5" style="height: 100dvh;">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em; color: #3E4F5C;">STRAND 1 - NUMBERS
            </h1>
            <ConceptNotes :concept-note="conceptNote" />
            <!-- <h2 class="text-center text-orange text-uppercase text-bold" style="font-size: 2em;">number</h2> -->
            <v-row v-for="strand in strand1" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/workbook/workbook1/strand1/substrand-' + strand.id + '/'">
                        <v-card>
                            <v-card-title class="font-weight-light text-center text-orange mb-2">{{ strand.title
                                }}</v-card-title>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>