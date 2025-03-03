<script setup>
// import airtable from 'airtable';
import strand4 from '~/strand4.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();

const id = route.params.id;
const strand4Contents = strand4.sub_strands[0].sub_strand_list[0].fields;
const conceptNote = strand4Contents.concept_notes;
const bece = strand4Contents.bece_questions;
const Indicator = strand4Contents.Indicator;
const relatedVids = [strand4Contents['Link 1'], strand4Contents['Link 2'], strand4Contents['Link 3']];

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
    navigateTo(bece, {
        open: {
            windowFeatures: {
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
            <h1 class="text-center text-uppercase text-bold" style="font-size: 1.5em; font-weight: bold;">{{ Indicator }}</h1>
            <v-row>
                <v-col cols="auto" lg="8" sm="6" md="6">
                    <conceptNotes :conceptNote="conceptNote" />

                    <v-row>
                        <v-col cols="auto" lg="8" sm="6" md="6">
                            <v-btn @click="openNotes" color="primary">Download Concept Note</v-btn>
                        </v-col>
                        <v-col cols="auto" lg="4" sm="6" md="6">
                            <v-btn @click="openBece" color="success">Sample BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <div class="mt-0">
                        <v-row>
                            <v-col col="" v-for="relatedVid in relatedVids" :key="relatedVid">
                                <relatedVids :relatedVids="relatedVid" />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>