<script setup>
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const id = route.params.id;
const contentsSubStrand = strand1.sub_strands.filter((strand) => strand.id === id);
const contents = contentsSubStrand[0].sub_strand_list;




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
                    <NuxtLink :to="'/workbook/workbook1/strand1/substrand-' + id + '/' + content.id">
                        <strong>{{ content.fields.Indicator }}</strong>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>