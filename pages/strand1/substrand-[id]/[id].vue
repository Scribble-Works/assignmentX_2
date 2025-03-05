<script setup>
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const id = route.params.id;
const mapId = strand1.sub_strands[0].sub_strand_list.map((strand) => strand.id);
const idIndex = mapId.indexOf(id);
console.log(idIndex);
const substrand = strand1.sub_strands.map((items, index) => ({ index, items }));
const mapIndex = substrand.map((items, index) => ({ index, items }));
const substrandContents = [substrand[0], substrand[1], substrand[2], substrand[3]];
const contents = substrandContents[idIndex].items.sub_strand_list;

const conceptNote = contents[mapIndex[idIndex].index].fields.concept_notes;
const indicator = contents[mapIndex[idIndex].index].fields.Indicator;
const bece = contents[mapIndex[idIndex].index].fields.bece_questions;
const relatedVids = [contents[mapIndex[idIndex].index].fields.Link1, contents[mapIndex[idIndex].index].fields.Link2, contents[mapIndex[idIndex].index].fields.Link3];

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
                indicator
                }}</h2>
            <v-row>
                <v-col cols="auto" lg="8" sm="8" md="6">

                    <conceptNotes :conceptNote="conceptNote" />
                    
                    <v-row>
                        <v-col cols="auto" lg="8" sm="6" md="6">
                            <v-btn @click="openNotes" color="primary">Download Concept Note</v-btn>
                        </v-col>
                        <v-col cols="auto" lg="4" sm="6" md="6">
                            <v-btn @click="openBece" color="success">Download BECE Questions</v-btn>
                        </v-col>
                        <div class="mt-5" style="overflow: hidden;">
                            <questionaire/>
                        </div>
                        
                    </v-row>
                </v-col><br>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <!-- <div class="mt-11"> -->
                    <v-row>
                        <v-col col="12" v-for="relatedVid in relatedVids" :key="relatedVid">
                            <related :relatedVid="relatedVid" />
                        </v-col>
                    </v-row>
                    <!-- </div> -->
                </v-col>
                
            </v-row>
            <br>
            
        </v-container>
    </div>
</template>