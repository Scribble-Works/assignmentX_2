<script setup>
import strand3 from '~/strand3.json';
definePageMeta({
    layout: 'dash',
});

const strand3Contents = strand3.sub_strands;



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
//         }
//     })
// };
// const { data: strandVids } = await supabase.from('sub_strands').select('');
// console.log(strandVids);

// const {data: relatedVis} = await supabase.from('')
</script>
<template>
    <div class="mt-15" style="height: 100dvh;">
        <v-container>
            <h1 class="text-center text-uppercase text-bold text-orange" style="font-size: 3em;">Strand 3</h1>
            <h2 class="text-center text-uppercase text-bold text-orange" style="font-size: 2em;">geometry & measurement</h2>
            <v-row v-for="strand in strand3Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/workbook/workbook1/strand3/substrand-' + strand.id+'/'">
                        <v-card>
                            <v-card-title class="font-weight-light text-center text-orange mb-2">
                                <strong>{{ strand.title }}</strong>
                            </v-card-title>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <v-divider inset style="color: black; font-weight: bolder;"></v-divider>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>