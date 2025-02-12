<script setup>
import strand2 from '~/strand2.json';
definePageMeta({
    layout: 'dash',
});
const router = useRouter();
const config = useRuntimeConfig();
const strand2Contents = strand2.records;
console.log(strand2Contents);
const conceptNote = strand2Contents[0].fields.concept_notes;
const bece = strand2Contents[0].fields.bece_questions;

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
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">Strand 2</h1>
            <v-row v-for="strand in strand2Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/strand2/' + strand.id">
                        <strong>{{ strand.fields.Sub_strand }}</strong>
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