<script setup>
// import airtable from 'airtable';
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const config = useRuntimeConfig();
const router = useRouter();

const id = route.params.id;
const strand1Contents = strand1.records.filter((strand) => strand.id === id);
const actualVid = strand1Contents[0].fields.Link1.replace("watch?v=", "embed/");
const Indicator = strand1Contents[0].fields.Indicator;
const relatedVids = [strand1Contents[0].fields.Link1,strand1Contents[0].fields.Link2, strand1Contents[0].fields.Link3];
const conceptNote = strand1Contents[0].fields.concept_notes;
const bece = strand1Contents[0].fields.bece_questions;
console.log(actualVid);
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



</script>
<template>
    <div class="mt-15">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">{{ Indicator }}</h1>
            <v-row>
                <v-col cols="auto" lg="8" sm="6" md="6">
                    <iframe :src="conceptNote"  frameborder="0" height="80%" width="100%"
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
                    <div class="mt-11">
                        <v-row>
                        <v-col col="" v-for="relatedVid in relatedVids" :key="relatedVid">
                            <iframe :src="relatedVid" frameborder="0"></iframe>
                        </v-col>
                    </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>