<script setup>
// import airtable from 'airtable';
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const route = useRoute();
const config = useRuntimeConfig();  
// const { data: strandVids } = await supabase.from('sub_strands').select('');
// console.log(strandVids);
console.log(strand1);

// const {data: relatedVis} = await supabase.from('')
</script>
<template>
    <div class="mt-15">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">Subject</h1>
            <v-row>
                <v-col cols="auto" lg="8" sm="6" md="6">
                    <!-- <iframe :src="strandVids.actual_video_link" height="500" width="800" frameborder="0"></iframe><br> -->
                    <v-row>
                        <v-col>
                            <v-btn color="primary">Concept Note</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="success">BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto" lg="4" sm="6" md="6">
                    <v-sheet>
                        <v-infinite-scroll mode="manual" :items="relatedVids" @load="load" :height="500">

                        </v-infinite-scroll>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>