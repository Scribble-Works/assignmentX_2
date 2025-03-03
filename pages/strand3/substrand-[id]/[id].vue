<script setup>
// import airtable from 'airtable';
import strand3 from '~/strand3.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();

const id = route.params.id;
const strand3Contents = strand3.sub_strands[0].sub_strand_list[0].fields;
const conceptNote = strand3Contents.concept_notes;
const bece = strand3Contents.bece_questions;
const Indicator = strand3Contents.Indicator;
const relatedVids = [strand3Contents['Link 1'], strand3Contents['Link 2'], strand3Contents['Link 3']];

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
                   <ConceptNotes :conceptNote="conceptNote" />

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
                                <relatedVids :relatedVid="relatedVid" />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>