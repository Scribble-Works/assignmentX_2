<script setup>
import strand4 from '~/strand4.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const id = route.params.id;
const contentsSubStrand = strand4.sub_strands.filter((strand) => strand.id === id);
const contents = contentsSubStrand.length > 0 ? contentsSubStrand[0].sub_strand_list : [];




// function openNotes(){
//     navigateTo(conceptNote, {
//         open:{
//             windowFeatures:{
//                 width: 500,
//                 height: 500,
//             }
//         }
//     })
// };

// function openBece(){
//     navigateTo(bece, {
//         open:{
//             windowFeatures:{
//                 width: 500,
//                 height: 500,
//             }
//         
//     })
// };
// const { data: strandVids } = await supabase.from('sub_strands').select('');
// console.log(strandVids);

// const {data: relatedVis} = await supabase.from('')
</script>
<template>
    <div class="mt-15" style="height: 100dvh;">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">{{ contentsSubStrand.title }}</h1>
            <v-row v-for="content in contents" :key="content.id">
                <v-col>
                    <NuxtLink :to="'/workbook/workbook1/strand4/substrand-' + id + '/' + content.id">
                        <v-card>
                            <v-card-title class="font-weight-light text-center mb-2">
                                <strong>{{ content.fields.Indicator }}</strong>
                            </v-card-title>
                            <v-card-actions>
                                <v-btn @click="openNotes" color="primary">concept note</v-btn>
                                <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                            </v-card-actions>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <!-- <v-row>
                        <v-col>
                            <v-btn @click="openNotes" color="primary">concept note</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn @click="openBece" color="success">BECE Questions</v-btn>
                        </v-col>
                    </v-row> -->
                    <v-divider inset style="color: black; font-weight: bolder;"></v-divider>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>