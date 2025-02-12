<script setup>
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const router = useRouter();
const config = useRuntimeConfig();
const strand1Contents = strand1.records;
const conceptNote = strand1Contents[0].fields.concept_notes;
const bece = strand1Contents[0].fields.bece_questions;
console.log(strand1Contents);

function openNotes(){
    navigateTo(conceptNote, {
        open:{
            windowFeatures:{
                width: 500,
                height: 500,
            }
        }
    })
};

function openBece(){
    navigateTo(bece, {
        open:{
            windowFeatures:{
                width: 500,
                height: 500,
            }
        }
    })
};
// const { data: strandVids } = await supabase.from('sub_strands').select('');
// console.log(strandVids);

// const {data: relatedVis} = await supabase.from('')
</script>
<template>
    <div class="mt-15">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">Strand 1</h1>
            <v-row v-for="strand in strand1Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/strand1/' + strand.id">
                        <strong>{{ strand.fields.sub_strand }}</strong>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <v-row>
                        <v-col>
                            <v-btn @click="openNotes" color="primary">concept note</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>