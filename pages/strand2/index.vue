<script setup>
import strand2 from '~/strand2.json';
definePageMeta({
    layout: 'dash',
});

const strand2Contents = strand2.sub_strands;



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
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">Strand 2</h1>
            <h2 class="text-center text-uppercase text-bold" style="font-size: 2em;">algebra</h2>
            <v-row v-for="strand in strand2Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/strand2/substrand-' + strand.id+'/'">
                        <strong>{{ strand.title }}</strong>
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