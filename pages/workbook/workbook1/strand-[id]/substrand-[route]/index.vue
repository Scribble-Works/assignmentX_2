<script setup>
import strand1 from '~/strand1.json';
// definePageMeta({
//     layout: 'dash',
// });
const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
// const { data: strand_ref } = await client.from('book1_strand_substrands_lists').select('strand_ref');
// console.log(strand_ref)
const contentsSubStrand = strand1.sub_strands.filter((strand) => strand.id === id);

// const contents = contentsSubStrand[0].sub_strand_list;





</script>
<template>
    <div class="mt-15" style="height: 100dvh;">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">{{ contentsSubStrand.title }}</h1>
            <v-row v-for="content in contents" :key="content.id">
                <v-col>
                    <!-- <NuxtLink :to="'/workbook/workbook1/strand-' + strand_ref + '/substrand-' + id + '/' + content.id"> -->
                        <v-card>
                            <v-card-title>
                                <strong>{{ content.fields.Indicator }}</strong>
                            </v-card-title>
                            <v-card-actions>
                                <v-btn @click="openNotes" color="primary">concept note</v-btn>
                                <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                            </v-card-actions>
                        </v-card>
                    <!-- </NuxtLink> -->
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>