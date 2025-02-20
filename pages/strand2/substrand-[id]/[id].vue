<script setup>
// import airtable from 'airtable';
import strand2 from '~/strand2.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();

const id = route.params.id;
const strand2Contents = strand2.sub_strands[0].sub_strand_list[0].fields;
const conceptNote = strand2Contents.concept_notes;
const bece = strand2Contents.bece_questions;
const Indicator = strand2Contents.Indicator;
const relatedVids = [strand2Contents['Link 1'],strand2Contents['Link 2'], strand2Contents['Link 3']];

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