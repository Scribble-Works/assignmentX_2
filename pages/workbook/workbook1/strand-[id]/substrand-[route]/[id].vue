<script setup>
import strand1 from '~/strand1.json';
// definePageMeta({
//     layout: 'dash',
// });
const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const strand_ref = route.params.route;
const substrand = route.params.substrand;

const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('route', strand_ref);
const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;


const { data: indicators_content } = await client.from('book1_substrand_indicators').select().eq('id', id);

const heading = indicators_content[0].indicators;
const vid1 = indicators_content[0].vid1;
const vid2 = indicators_content[0].vid2;
const vid3 = indicators_content[0].vid3

console.log(substrands);
console.log(indicators_content);





function openNotes() {
    navigateTo(conceptNote, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    })
};

function openBece() {
    const link = document.createElement('a');
    link.href = bece;
    link.download = 'bece_questions.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};




</script>
<template>
    <div class="mt-15">
        <v-container>
            <h2 class="text-center text-uppercase text-bold mb-10" style="font-size: 1.5em; font-weight: bold;">{{
                heading
                }}</h2>
            <v-row>
                
                <v-col cols="" lg="8" md="6" sm="12">
                    <introvid :intro="vid1" />
                </v-col>
                <v-col cols="" lg="4" md="6" sm="12">
                    <introvid :intro="vid2" />
                    <introvid :intro="vid3" />
                </v-col>
            </v-row>
            

        </v-container>
    </div>
</template>