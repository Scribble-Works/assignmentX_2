<script setup>
// import airtable from 'airtable';
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();

const id = route.params.id;
const strand1Contents = strand1.sub_strands[0].sub_strand_list[0].fields;
const conceptNote = strand1Contents.concept_notes;
const bece = strand1Contents.bece_questions;
const Indicator = strand1Contents.Indicator;
const relatedVids = [strand1Contents.Link1, strand1Contents.Link2, strand1Contents.Link3];

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
            <h2 class="text-center text-uppercase text-bold mb-10" style="font-size: 1.5em; font-weight: bold;">{{ Indicator
                }}</h2>
            <v-row>
                <v-col cols="auto" lg="8" sm="8" md="6">
                    <iframe :src="conceptNote" frameborder="0" height="80%" width="100%"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                        style="border-style: solid; border-width: .5px;"></iframe><br>

                    <v-row>
                        <v-col cols="auto" lg="8" sm="6" md="6">
                            <v-btn @click="openNotes" color="primary">Download Concept Note</v-btn>
                        </v-col>
                        <v-col cols="auto" lg="4" sm="6" md="6">
                            <v-btn @click="openBece" color="success">Sample BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                </v-col><br>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <!-- <div class="mt-11"> -->
                        <v-row>
                            <v-col col="" v-for="relatedVid in relatedVids" :key="relatedVid">
                                <iframe :src="relatedVid" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border-style: solid; border-width: .5px;"></iframe>
                            </v-col>
                        </v-row>
                    <!-- </div> -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>