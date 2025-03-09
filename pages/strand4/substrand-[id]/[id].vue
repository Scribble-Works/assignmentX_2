<script setup>
// import airtable from 'airtable';
import strand4 from '~/strand4.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const id = route.params.id;

var substrands = [strand4.sub_strands[0].sub_strand_list, strand4.sub_strands[1].sub_strand_list];
const strand = substrands.filter((strand) => strand.id === id);

const contents = substrands.flatMap((substrand) =>
    substrand.filter((strand) => strand.id === id).map((strand) => {
        const conceptNote = strand.fields.concept_notes;
        const bece = strand.fields.bece_questions;
        const indicator = strand.fields.Indicator;
        const relatedVids = [strand.fields.Link1, strand.fields.Link2, strand.fields.Link3];

        return {
            conceptNote,
            bece,
            indicator,
            relatedVids
        };
    })
);

const { conceptNote, bece, indicator, relatedVids } = contents[0] || {};

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
            <h1 class="text-center text-uppercase text-bold" style="font-size: 1.5em; font-weight: bold;">{{ indicator
                }}</h1>
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
                        <div class="mt-5" style="overflow: hidden;">
                            <questionaire />
                        </div>
                    </v-row>
                </v-col>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <div class="mt-0">
                        <v-row>
                            <v-col col="12" v-for="relatedVid in relatedVids" :key="relatedVid">
                                <related :relatedVid="relatedVid" />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>