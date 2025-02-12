<script setup>
// import airtable from 'airtable';
import strand2 from '~/strand2.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const config = useRuntimeConfig();

const id = route.params.id;
const strand2Contents = strand2.records.filter((strand) => strand.id === id);
const actualVid = strand2Contents[0].fields['Link 1'];
const sub_strand = strand2Contents[0].fields.Sub_strand;
const relatedVids = [strand2Contents[0].fields['Link 1'],strand2Contents[0].fields['Link 2'], strand2Contents[0].fields['Link 3']];
const conceptNote2 = strand2Contents[0].fields.concept_notes;
const bece2 = strand2Contents[0].fields.bece_questions;
console.log(actualVid);


function openNotes(){
    navigateTo(conceptNote2, {
        open:{
            windowFeatures:{
                width: 500,
                height: 500,
            }
        }
    })
};

function openBece(){
    navigateTo(bece2, {
        open:{
            windowFeatures:{
                width: 500,
                height: 500,
            }
        }
    })
};


</script>
<template>
    <div class="mt-15">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">{{ sub_strand }}</h1>
            <v-row>
                <v-col cols="auto" lg="8" sm="6" md="6">
                    <iframe height="500" width="700" :src="actualVid" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><br>
                    <v-row>
                        <v-col>
                            <v-btn @click="openNotes" color="primary">Concept Note</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <v-row>
                        <v-col col="" v-for="relatedVid in relatedVids" :key="relatedVid">
                            <iframe :src="relatedVid" frameborder="0"></iframe>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>